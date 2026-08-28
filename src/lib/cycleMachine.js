// ---------------------------------------------------------------------------
// Closed-loop cycle machine.
//
// One pass runs: monitor → discover → filter → context → evidence → impact →
// decide → act → verify → update, and the update stage feeds the next pass.
//
// Pure reducer + pure derivation. All copy lives in src/data/signalScenarios.js
// and every number comes from src/lib/impactModels.js.
// ---------------------------------------------------------------------------
import { findScenario, scenarios } from '../data/signalScenarios.js';
import { computeImpact, money, num } from './impactModels.js';

export const STAGES = [
  { id: 'monitor', label: 'Monitor', question: 'What are we watching?' },
  { id: 'discover', label: 'Discover', question: 'What changed?' },
  { id: 'filter', label: 'Filter', question: 'Does it deserve attention?' },
  { id: 'context', label: 'Context', question: 'Whose situation does it touch?' },
  { id: 'evidence', label: 'Evidence', question: 'What supports it, what is missing?' },
  { id: 'impact', label: 'Impact', question: 'How much does it move?' },
  { id: 'decide', label: 'Decide', question: 'What is the next useful step?' },
  { id: 'act', label: 'Act', question: 'What may happen, and who approves it?' },
  { id: 'verify', label: 'Verify', question: 'What actually happened?' },
  { id: 'update', label: 'Update', question: 'What does the next cycle know now?' },
];

export const stageIndex = (id) => STAGES.findIndex((s) => s.id === id);

/** Action states. "Sent" is never treated as "done". */
export const actionStates = {
  idle: { label: 'Not yet prepared', tone: 'neutral' },
  hold: { label: 'On hold', tone: 'amber' },
  prepared: { label: 'Prepared', tone: 'neutral' },
  pending: { label: 'Pending approval', tone: 'amber' },
  approved: { label: 'Approved for this exact action', tone: 'green' },
  rejected: { label: 'Rejected — nothing sent', tone: 'red' },
  sent: { label: 'Simulated sent', tone: 'blue' },
  unconfirmed: { label: 'Delivery unconfirmed', tone: 'amber' },
  confirmed: { label: 'Confirmed delivery', tone: 'green' },
  completed: { label: 'Outcome verified', tone: 'green' },
  superseded: { label: 'Superseded', tone: 'red' },
  none: { label: 'No action — recorded', tone: 'blue' },
};

const defaultAssumptions = (scenario) =>
  Object.fromEntries(scenario.assumptions.map((a) => [a.id, a.value]));

export function initialState(scenarioId = scenarios[0].id) {
  const scenario = findScenario(scenarioId);
  return {
    scenarioId: scenario.id,
    cycleIndex: 0,
    reached: 0, // furthest stage reached this cycle
    active: 0, // stage the visitor is looking at
    assumptions: defaultAssumptions(scenario),
    action: 'idle',
    approvedFor: null,
    deliveryChecks: 0,
    factRequested: false,
    notice: null,
    showFiltered: false,
    carried: [], // context facts carried in from completed cycles
    completed: [], // indexes of finished cycles
    history: [
      { cycle: 1, day: scenario.cycles[0].day, label: 'Monitoring', text: `Watching: ${scenario.environment}`, tone: 'muted' },
    ],
  };
}

const cycleOf = (state) => findScenario(state.scenarioId).cycles[state.cycleIndex];

/** Identity of the exact action a person would be approving. */
export function actionVersion(state) {
  const c = cycleOf(state);
  const a = findScenario(state.scenarioId).assumptions
    .map((x) => `${x.id}=${state.assumptions[x.id]}`)
    .join(',');
  return `${state.scenarioId}#${state.cycleIndex + 1}|${c.signal.label}|${a}`;
}

export const approvalIsValid = (state) =>
  state.approvedFor !== null && state.approvedFor === actionVersion(state);

const log = (state, entry) => [
  ...state.history,
  { cycle: state.cycleIndex + 1, day: cycleOf(state).day, ...entry },
];

/**
 * Any change to a material input rebuilds the action. An approval only ever
 * covers the exact action version it was given for.
 */
function afterMaterialChange(next, prevAction, changeLabel) {
  let action = prevAction;
  let notice = null;
  let entry = null;

  if (prevAction === 'approved') {
    action = 'prepared';
    notice = 'Previous approval invalidated because the action changed.';
    entry = { label: 'Approval invalidated', text: `${changeLabel} The approved action no longer matches what is proposed.`, tone: 'red' };
  } else if (['sent', 'unconfirmed', 'confirmed', 'completed'].includes(prevAction)) {
    action = 'superseded';
    notice = 'The inputs changed after this action was sent. The earlier action is superseded.';
    entry = { label: 'Superseded', text: `${changeLabel} The action already sent is superseded.`, tone: 'red' };
  } else if (prevAction === 'pending') {
    action = 'prepared';
    notice = 'The action was rebuilt because an input changed. It needs review again.';
    entry = { label: 'Review reset', text: `${changeLabel} The action awaiting approval was rebuilt.`, tone: 'amber' };
  } else if (prevAction === 'rejected') {
    action = 'prepared';
    entry = { label: 'New draft', text: `${changeLabel} A new action was prepared after the rejected one.`, tone: 'info' };
  }

  next.action = action;
  next.approvedFor = null;
  next.deliveryChecks = 0;
  next.notice = notice;
  if (entry) next.history = log(next, entry);
  return next;
}

export function reducer(state, action) {
  switch (action.type) {
    case 'SELECT_SCENARIO':
      if (action.id === state.scenarioId) return state;
      return initialState(action.id);

    case 'SET_ACTIVE':
      if (action.index > state.reached) return state;
      return { ...state, active: action.index };

    case 'ADVANCE': {
      if (state.reached >= STAGES.length - 1) return state;
      const reached = state.reached + 1;
      const stage = STAGES[reached];
      const c = cycleOf(state);
      let next = { ...state, reached, active: reached };

      const notes = {
        discover: () => {
          const sig = c.feed.find((f) => f.id === c.signalId);
          return { label: 'Signal discovered', text: `${sig.title} — found by monitoring, not reported by a person.`, tone: 'amber' };
        },
        filter: () => {
          const kept = c.feed.filter((f) => f.disposition === 'detected' || f.disposition === 'escalate' || f.disposition === 'monitor').length;
          const dropped = c.feed.length - kept;
          return { label: 'Filtered', text: `${c.feed.length} observed · ${kept} kept · ${dropped} suppressed or ignored, each with a reason.`, tone: 'muted' };
        },
        context: () => ({ label: 'Context matched', text: c.relevance.verdict, tone: 'info' }),
        evidence: () => ({ label: 'Evidence checked', text: `${c.evidence.length} sources · ${c.missing.length} gaps named.`, tone: 'info' }),
        impact: () => {
          if (c.impact.applies === false) return { label: 'Impact not modelled', text: 'The change does not move the modelled quantity.', tone: 'muted' };
          const r = computeImpact(findScenario(state.scenarioId).impactModel, state.assumptions, c.signal);
          return { label: 'Impact estimated', text: `${r.headline} — ${r.verdict}.`, tone: 'amber' };
        },
        decide: () => ({ label: 'Decision', text: decisionText(state), tone: 'info' }),
      };

      if (notes[stage.id]) next.history = log(next, notes[stage.id]());

      // Entering "act" sets the starting action state for this cycle.
      if (stage.id === 'act') {
        const act = c.action;
        if (act.kind === 'none') next.action = 'idle';
        else if (act.kind === 'request-fact') next.action = 'hold';
        else next.action = 'prepared';
      }
      return next;
    }

    case 'SET_ASSUMPTION': {
      if (state.assumptions[action.id] === action.value) return state;
      const scenario = findScenario(state.scenarioId);
      const meta = scenario.assumptions.find((a) => a.id === action.id);
      let next = {
        ...state,
        assumptions: { ...state.assumptions, [action.id]: action.value },
      };
      next.history = log(next, {
        label: 'Assumption changed',
        text: `${meta.label} set to ${formatAssumption(meta, action.value)}. Impact recalculated.`,
        tone: 'info',
      });
      return afterMaterialChange(next, state.action, `${meta.label} changed.`);
    }

    case 'REQUEST_FACT':
      return {
        ...state,
        factRequested: true,
        action: 'hold',
        notice: null,
        history: log(state, { label: 'Fact requested', text: cycleOf(state).action.preview, tone: 'amber' }),
      };

    case 'PREPARE':
      if (state.action !== 'prepared') return state;
      return {
        ...state,
        action: 'pending',
        notice: null,
        history: log(state, { label: 'Pending approval', text: 'Prepared and waiting for a human decision. Nothing sent.', tone: 'amber' }),
      };

    case 'APPROVE':
      if (state.action !== 'pending') return state;
      return {
        ...state,
        action: 'approved',
        approvedFor: actionVersion(state),
        notice: null,
        history: log(state, { label: 'Approved', text: 'Approved for this exact action only. Still not sent.', tone: 'green' }),
      };

    case 'REJECT':
      if (state.action !== 'pending') return state;
      return {
        ...state,
        action: 'rejected',
        approvedFor: null,
        notice: null,
        history: log(state, { label: 'Rejected', text: 'Nothing was sent.', tone: 'red' }),
      };

    case 'NEW_DRAFT':
      if (!['rejected', 'superseded'].includes(state.action)) return state;
      return {
        ...state,
        action: 'prepared',
        approvedFor: null,
        deliveryChecks: 0,
        notice: null,
        history: log(state, { label: 'Prepared', text: 'A new action was prepared.', tone: 'info' }),
      };

    // Rule: an action that was rejected can never become a sent action.
    case 'EXECUTE': {
      const c = cycleOf(state);
      if (c.action.kind === 'none' || c.action.kind === 'internal') {
        if (!['idle', 'prepared', 'hold'].includes(state.action)) return state;
        return {
          ...state,
          action: 'none',
          history: log(state, { label: c.action.kind === 'none' ? 'No action' : 'Recorded', text: c.outcome.completed, tone: 'blue' }),
        };
      }
      if (state.action !== 'approved' || !approvalIsValid(state)) return state;
      return {
        ...state,
        action: 'sent',
        deliveryChecks: 0,
        history: log(state, { label: 'Simulated sent', text: c.outcome.sent, tone: 'blue' }),
      };
    }

    case 'CHECK_OUTCOME': {
      const c = cycleOf(state);
      const checks = state.deliveryChecks + 1;
      if (state.action === 'sent') {
        return { ...state, action: 'unconfirmed', deliveryChecks: checks,
          history: log(state, { label: 'Delivery unconfirmed', text: c.outcome.unconfirmed, tone: 'amber' }) };
      }
      if (state.action === 'unconfirmed') {
        return { ...state, action: 'confirmed', deliveryChecks: checks,
          history: log(state, { label: 'Confirmed delivery', text: c.outcome.confirmed, tone: 'green' }) };
      }
      if (state.action === 'confirmed') {
        return { ...state, action: 'completed', deliveryChecks: checks,
          history: log(state, { label: 'Outcome verified', text: c.outcome.completed, tone: 'green' }) };
      }
      return state;
    }

    // The loop closes here: the verified outcome becomes context, and the next
    // cycle starts from monitoring with that context in place.
    case 'CLOSE_CYCLE': {
      const scenario = findScenario(state.scenarioId);
      const c = cycleOf(state);
      const hasNext = state.cycleIndex + 1 < scenario.cycles.length;
      const carried = [...state.carried, ...c.contextUpdate];
      let next = {
        ...state,
        carried,
        completed: [...state.completed, state.cycleIndex],
        history: log(state, {
          label: 'Context updated',
          text: `${c.contextUpdate.map((u) => `${u.label}: ${u.value}`).join(' · ')}. Monitoring continues.`,
          tone: 'green',
        }),
      };
      if (!hasNext) return { ...next, reached: STAGES.length - 1 };
      next = {
        ...next,
        cycleIndex: state.cycleIndex + 1,
        reached: 0,
        active: 0,
        action: 'idle',
        approvedFor: null,
        deliveryChecks: 0,
        factRequested: false,
        notice: null,
      };
      next.history = log(next, {
        label: 'Monitoring',
        text: `Cycle ${next.cycleIndex + 1} begins with the updated context.`,
        tone: 'muted',
      });
      return next;
    }

    case 'TOGGLE_FILTERED':
      return { ...state, showFiltered: !state.showFiltered };

    case 'DISMISS_NOTICE':
      return { ...state, notice: null };

    case 'RESET':
      return initialState(state.scenarioId);

    // A deep link can change while the page is already mounted, so the state
    // is rebuilt from the key rather than relying on the reducer initialiser.
    case 'LOAD_LINK':
      return stateFromLink(action.key);

    default:
      return state;
  }
}

export function formatAssumption(meta, value) {
  switch (meta.format) {
    case 'money': return money(value);
    case 'percent': return `${value}%`;
    case 'years': return `${value} years`;
    case 'weeks': return `${value} weeks`;
    case 'hours': return `${value} hours`;
    case 'multiplier': return `× ${value}`;
    default: return num(value);
  }
}

function decisionText(state) {
  const c = cycleOf(state);
  const scenario = findScenario(state.scenarioId);
  if (c.impact.applies === false) return c.decision.recommendationMaterial;
  const r = computeImpact(scenario.impactModel, state.assumptions, c.signal);
  return r.material ? c.decision.recommendationMaterial : c.decision.recommendationImmaterial;
}

export function derive(state) {
  const scenario = findScenario(state.scenarioId);
  const c = scenario.cycles[state.cycleIndex];
  const impact = c.impact.applies === false ? null : computeImpact(scenario.impactModel, state.assumptions, c.signal);
  const material = c.impact.applies === false ? true : impact.material;
  const signalEvent = c.feed.find((f) => f.id === c.signalId);

  const kept = c.feed.filter((f) => ['detected', 'escalate', 'monitor'].includes(f.disposition));
  const dropped = c.feed.filter((f) => ['suppressed', 'ignored'].includes(f.disposition));

  const context = [...scenario.context, ...state.carried];

  return {
    scenario,
    cycle: c,
    cycleNumber: state.cycleIndex + 1,
    cycleCount: scenario.cycles.length,
    isLastCycle: state.cycleIndex + 1 >= scenario.cycles.length,
    signalEvent,
    impact,
    impactApplies: c.impact.applies,
    material,
    kept,
    dropped,
    context,
    recommendation: material ? c.decision.recommendationMaterial : c.decision.recommendationImmaterial,
    actionVersion: actionVersion(state),
    approvalValid: approvalIsValid(state),
    canClose: ['none', 'completed', 'rejected'].includes(state.action) || (state.action === 'hold' && state.factRequested),
  };
}

/** Deep-link targets used from How We Think and the Lab notes. */
export const linkStates = {
  monitoring: { scenario: 'household-rate', advance: 0 },
  'signal-discovery': { scenario: 'household-rate', advance: 1 },
  context: { scenario: 'household-rate', advance: 3 },
  decision: { scenario: 'attention-trend', advance: 6 },
  filtering: { scenario: 'attention-trend', advance: 2, script: [{ type: 'TOGGLE_FILTERED' }] },
  'missing-evidence': { scenario: 'benefit-rule', advance: 7, script: [{ type: 'REQUEST_FACT' }], active: 4 },
  assumptions: { scenario: 'local-event', advance: 5 },
  permission: { scenario: 'household-rate', advance: 7, script: [{ type: 'PREPARE' }] },
  unconfirmed: {
    scenario: 'household-rate',
    advance: 8,
    script: [{ type: 'PREPARE' }, { type: 'APPROVE' }, { type: 'EXECUTE' }, { type: 'CHECK_OUTCOME' }],
  },
  superseded: {
    scenario: 'supplier-cost',
    advance: 9,
    script: [
      { type: 'PREPARE' }, { type: 'APPROVE' }, { type: 'EXECUTE' },
      { type: 'CHECK_OUTCOME' }, { type: 'CHECK_OUTCOME' }, { type: 'CHECK_OUTCOME' },
      { type: 'CLOSE_CYCLE' },
    ],
    then: 6,
  },
  'closed-loop': {
    scenario: 'household-rate',
    advance: 9,
    script: [
      { type: 'PREPARE' }, { type: 'APPROVE' }, { type: 'EXECUTE' },
      { type: 'CHECK_OUTCOME' }, { type: 'CHECK_OUTCOME' }, { type: 'CHECK_OUTCOME' },
    ],
  },
};

export function stateFromLink(key) {
  const spec = linkStates[key];
  if (!spec) return initialState();
  let s = initialState(spec.scenario);
  for (let i = 0; i < (spec.advance || 0); i += 1) s = reducer(s, { type: 'ADVANCE' });
  for (const a of spec.script || []) s = reducer(s, a);
  for (let i = 0; i < (spec.then || 0); i += 1) s = reducer(s, { type: 'ADVANCE' });
  if (spec.active !== undefined) s = reducer(s, { type: 'SET_ACTIVE', index: spec.active });
  return s;
}
