// ---------------------------------------------------------------------------
// Supplier scenario state machine.
//
// Pure reducer + pure derivation. All copy lives in src/data/supplierScenario.js
// so wording can change without touching these rules.
// ---------------------------------------------------------------------------
import {
  contextChoices,
  decisions,
  optionsConsidered,
  scenario,
  sources,
  timeline,
} from '../data/supplierScenario.js';

const { currentUnitCost, proposedUnitCost, defaultVolume } = scenario.facts;

// Integer cents so the arithmetic stays exact.
const DELTA_CENTS = Math.round(proposedUnitCost * 100) - Math.round(currentUnitCost * 100);
const MOQ_UNITS = 1500;

export const money = (n) =>
  '$' +
  n.toLocaleString('en-US', {
    minimumFractionDigits: Number.isInteger(n) ? 0 : 2,
    maximumFractionDigits: 2,
  });
export const units = (n) => n.toLocaleString('en-US');

/** Deterministic arithmetic. Not a model output. */
export function monthlyImpact(volume) {
  return (volume * DELTA_CENTS) / 100;
}

const needsApproval = (contextKey) => decisions[contextKey].action.approvalRequired;
const baseStatus = (contextKey) => (needsApproval(contextKey) ? 'prepared' : 'hold');

export const initialState = {
  contextKey: 'unknown',
  volume: defaultVolume,
  moq: false,
  paused: false,
  cursor: 0,
  day: 0,
  status: 'hold',
  approvedVersion: null,
  deliveryChecks: 0,
  factRequested: false,
  notice: null,
  showSuppressed: false,
  inspect: false,
  events: [],
  history: [
    {
      day: 0,
      label: 'Signal',
      text: scenario.signal,
      tone: 'info',
    },
    {
      day: 0,
      label: 'On hold',
      text: 'Price-lock status is unknown, so no supplier action is drafted yet.',
      tone: 'amber',
    },
  ],
};

/** Identity of the exact action a human would be approving. */
export function actionVersion(state) {
  return [state.contextKey, state.volume, state.moq ? 'moq' : 'no-moq'].join('|');
}

export function approvalIsValid(state) {
  return state.approvedVersion !== null && state.approvedVersion === actionVersion(state);
}

const log = (state, entry) => [...state.history, { day: state.day, ...entry }];

// Applied whenever a material input changes. Rule 2 / Rule 6: an approval only
// ever covers the exact action version it was given for.
function afterMaterialChange(next, prevStatus, changeLabel) {
  const base = baseStatus(next.contextKey);
  let status = base;
  let notice = null;
  let entry = null;

  if (prevStatus === 'approved') {
    notice = 'Previous approval invalidated because the action changed.';
    entry = { label: 'Approval invalidated', text: `${changeLabel} The approved draft no longer matches the proposed action.`, tone: 'red' };
  } else if (prevStatus === 'sent' || prevStatus === 'unconfirmed' || prevStatus === 'confirmed') {
    status = 'superseded';
    notice = 'The context changed after this action was sent. The earlier action is superseded.';
    entry = { label: 'Superseded', text: `${changeLabel} The action already sent is now superseded.`, tone: 'red' };
  } else if (prevStatus === 'pending') {
    notice = 'The draft was rebuilt because an input changed. It needs review again.';
    entry = { label: 'Review reset', text: `${changeLabel} The draft awaiting approval was rebuilt.`, tone: 'amber' };
  } else if (prevStatus === 'rejected') {
    entry = { label: 'New draft', text: `${changeLabel} A new draft was prepared after the rejected one.`, tone: 'info' };
  }

  next.status = status;
  next.approvedVersion = null;
  next.deliveryChecks = 0;
  next.notice = notice;
  if (entry) next.history = log(next, entry);
  return next;
}

export function reducer(state, action) {
  switch (action.type) {
    case 'SET_CONTEXT': {
      if (action.key === state.contextKey) return state;
      const choice = contextChoices.find((c) => c.key === action.key);
      let next = {
        ...state,
        contextKey: action.key,
        factRequested: false,
        inspect: state.inspect,
        history: log(state, {
          label: 'Context changed',
          text: `${choice.factLabel}: ${choice.factValue}`,
          tone: 'info',
        }),
      };
      return afterMaterialChange(next, state.status, 'Context changed.');
    }

    case 'SET_VOLUME': {
      if (action.volume === state.volume) return state;
      const impact = monthlyImpact(action.volume);
      let next = {
        ...state,
        volume: action.volume,
        history: log(state, {
          label: 'Volume changed',
          text: `Expected volume set to ${units(action.volume)} units. Potential impact recalculated to ${money(impact)} per month.`,
          tone: 'info',
        }),
      };
      return afterMaterialChange(next, state.status, 'Expected volume changed.');
    }

    case 'REQUEST_FACT':
      return {
        ...state,
        factRequested: true,
        status: 'hold',
        notice: null,
        history: log(state, {
          label: 'Fact requested',
          text: 'Requested the price clause from the sample supplier agreement. Nothing sent to the supplier.',
          tone: 'amber',
        }),
      };

    case 'RECHECK': {
      let next = {
        ...state,
        contextKey: 'next-month',
        factRequested: false,
        history: log(state, {
          label: 'Evidence re-checked',
          text: 'Read notice SN-2481-B: the increase applies next month.',
          tone: 'info',
        }),
      };
      return afterMaterialChange(next, 'prepared', 'Evidence re-checked.');
    }

    case 'PREPARE_FOR_APPROVAL':
      if (state.status !== 'prepared') return state;
      return {
        ...state,
        status: 'pending',
        notice: null,
        history: log(state, {
          label: 'Pending approval',
          text: 'Draft prepared and waiting for a human decision. Nothing sent.',
          tone: 'amber',
        }),
      };

    case 'APPROVE':
      if (state.status !== 'pending') return state;
      return {
        ...state,
        status: 'approved',
        approvedVersion: actionVersion(state),
        notice: null,
        history: log(state, {
          label: 'Approved',
          text: 'Approved for this exact draft only. Still not sent.',
          tone: 'green',
        }),
      };

    case 'REJECT':
      if (state.status !== 'pending') return state;
      return {
        ...state,
        status: 'rejected',
        approvedVersion: null,
        notice: null,
        history: log(state, { label: 'Rejected', text: 'Nothing was sent.', tone: 'red' }),
      };

    // Rule 5: a rejected action can never become a sent action. The only way
    // forward is a new draft.
    case 'NEW_DRAFT':
      if (state.status !== 'rejected' && state.status !== 'superseded') return state;
      return {
        ...state,
        status: baseStatus(state.contextKey),
        approvedVersion: null,
        deliveryChecks: 0,
        notice: null,
        history: log(state, { label: 'Prepared', text: 'A new draft was prepared.', tone: 'info' }),
      };

    case 'SIMULATE_SEND':
      if (state.status !== 'approved' || !approvalIsValid(state)) return state;
      return {
        ...state,
        status: 'sent',
        deliveryChecks: 0,
        history: log(state, {
          label: 'Simulated sent',
          text: 'Simulated send only. Business outcome still unknown.',
          tone: 'blue',
        }),
      };

    case 'CHECK_DELIVERY': {
      if (state.status !== 'sent' && state.status !== 'unconfirmed') return state;
      const checks = state.deliveryChecks + 1;
      if (checks === 1) {
        return {
          ...state,
          status: 'unconfirmed',
          deliveryChecks: checks,
          history: log(state, {
            label: 'Delivery unconfirmed',
            text: 'The status check timed out. Outcome unconfirmed — this is not a failure and not a success.',
            tone: 'amber',
          }),
        };
      }
      return {
        ...state,
        status: 'confirmed',
        deliveryChecks: checks,
        history: log(state, {
          label: 'Confirmed delivery',
          text: 'Delivery confirmed in this example. Whether the supplier agrees is still unknown.',
          tone: 'green',
        }),
      };
    }

    case 'ADVANCE': {
      if (state.paused || state.cursor >= timeline.length) return state;
      const event = timeline[state.cursor];
      let next = {
        ...state,
        cursor: state.cursor + 1,
        day: event.day,
        events: [...state.events, event.id],
      };

      if (event.disposition === 'suppressed') {
        next.history = log(next, {
          label: event.kind === 'duplicate' ? 'Duplicate suppressed' : 'Suppressed',
          text: `${event.title} — ${event.reason}`,
          tone: 'muted',
        });
        return next;
      }

      if (event.kind === 'material') {
        next.moq = true;
        next.history = log(next, {
          label: 'Recommendation updated',
          text: `${event.title}. New review required.`,
          tone: 'amber',
        });
        return afterMaterialChange(next, state.status, 'A material supplier notice arrived.');
      }

      // supersede
      next.contextKey = 'superseded';
      next.factRequested = false;
      next.history = log(next, {
        label: 'Superseded',
        text: `${event.title}. The previous recommendation is marked superseded.`,
        tone: 'red',
      });
      return afterMaterialChange(next, state.status, 'The supplier notice was replaced.');
    }

    case 'TOGGLE_PAUSE':
      return {
        ...state,
        paused: !state.paused,
        history: log(state, {
          label: state.paused ? 'Monitoring resumed' : 'Monitoring paused',
          text: state.paused
            ? 'This example will surface scenario events again.'
            : 'Paused in this example. No new scenario events will be surfaced.',
          tone: 'muted',
        }),
      };

    case 'TOGGLE_SUPPRESSED':
      return { ...state, showSuppressed: !state.showSuppressed };

    case 'SET_INSPECT':
      return { ...state, inspect: action.open };

    case 'DISMISS_NOTICE':
      return { ...state, notice: null };

    // Rule 10: reset clears all scenario state and history.
    case 'RESET':
      return { ...initialState, history: [...initialState.history] };

    default:
      return state;
  }
}

/** Deep-link targets used by How We Think and the Lab notes. */
export const linkStates = {
  'missing-evidence': [],
  'changed-context': [{ type: 'SET_CONTEXT', key: 'superseded' }, { type: 'SET_INSPECT', open: true }],
  permission: [{ type: 'SET_CONTEXT', key: 'next-month' }, { type: 'PREPARE_FOR_APPROVAL' }],
  unconfirmed: [
    { type: 'SET_CONTEXT', key: 'next-month' },
    { type: 'PREPARE_FOR_APPROVAL' },
    { type: 'APPROVE' },
    { type: 'SIMULATE_SEND' },
    { type: 'CHECK_DELIVERY' },
  ],
  suppressed: [
    { type: 'ADVANCE' },
    { type: 'ADVANCE' },
    { type: 'TOGGLE_SUPPRESSED' },
  ],
};

export function stateFromLink(key) {
  const script = linkStates[key];
  const start = { ...initialState, history: [...initialState.history] };
  if (!script) return start;
  return script.reduce(reducer, start);
}

const strengthFor = {
  notice: 'strong',
  noticeB: 'missing',
  agreementLocked: 'strong',
  agreementOpen: 'strong',
  agreementUnread: 'missing',
  comparable: 'partial',
  moq: 'strong',
};

function buildEvidence(state) {
  const spec = decisions[state.contextKey].evidence;
  const belowMoq = state.moq && state.volume < MOQ_UNITS;

  const list = spec.map((key) => {
    if (key === 'volume') {
      return {
        id: 'INT-VOL',
        title: 'Internal volume assumption',
        excerpt: belowMoq
          ? `Expected order volume of ${units(state.volume)} units per month, below the supplier’s new ${units(MOQ_UNITS)}-unit minimum.`
          : `Expected order volume of ${units(state.volume)} units per month.`,
        effective: 'Scenario day 0',
        checked: 'Set by you in this example',
        strength: belowMoq ? 'conflicting' : 'partial',
      };
    }
    if (key === 'conflict') {
      return {
        id: 'SN-2481 / AGR-118',
        title: 'Notice SN-2481 against clause 7.2',
        excerpt: 'The notice sets a new price from next month; the clause holds the agreed price for 90 days.',
        effective: 'Scenario day 0',
        checked: 'Scenario day 0',
        strength: 'conflicting',
      };
    }
    if (key === 'noticeSuperseded') {
      return { ...sources.notice, excerpt: 'Replaced by notice SN-2481-B.', strength: 'superseded' };
    }
    return { ...sources[key], strength: strengthFor[key] };
  });

  if (state.moq) list.push({ ...sources.moq, strength: strengthFor.moq });
  return list;
}

export function derive(state) {
  const d = decisions[state.contextKey];
  const impact = monthlyImpact(state.volume);
  const belowMoq = state.moq && state.volume < MOQ_UNITS;
  const fill = (s) => s.replace('{volume}', units(state.volume)).replace('{impact}', money(impact));

  const missing = [...d.missing];
  if (belowMoq) missing.unshift(`Whether an order of ${units(state.volume)} units can be placed under the new ${units(MOQ_UNITS)}-unit minimum`);

  const rawAction = d.action;
  const resolvedAction = {
    ...rawAction,
    preview: rawAction.preview ? fill(rawAction.preview) : undefined,
    body: rawAction.body ? rawAction.body.map(fill) : undefined,
  };

  const choice = contextChoices.find((c) => c.key === state.contextKey);
  const contextFacts = [
    { label: 'Current unit cost', value: money(currentUnitCost) },
    { label: 'Proposed unit cost', value: money(proposedUnitCost), tone: 'amber' },
    { label: 'Expected volume', value: `${units(state.volume)} / month`, tone: belowMoq ? 'red' : undefined, note: belowMoq ? `Below the ${units(MOQ_UNITS)}-unit minimum` : undefined },
    { label: 'Proposed effective date', value: scenario.facts.effectiveDate },
    {
      label: choice.factLabel,
      value: choice.factValue,
      tone: state.contextKey === 'unknown' ? 'amber' : state.contextKey === 'superseded' ? 'red' : undefined,
    },
  ];
  if (state.moq) {
    contextFacts.push({ label: 'Minimum order quantity', value: `${units(MOQ_UNITS)} / month`, note: 'From notice SN-2503' });
  }

  return {
    impact,
    impactLabel: money(impact),
    impactNote: fill(d.impactNote),
    conditionalImpact: d.conditionalImpact,
    recommendation: belowMoq
      ? `${d.recommendation} The selected volume also sits below the new minimum order quantity, so the volume assumption needs review.`
      : d.recommendation,
    why: d.why,
    evidence: buildEvidence(state),
    missing,
    options: optionsConsidered.map((o) => ({ ...o, chosen: o.name === d.chosenOption })),
    action: resolvedAction,
    approvalRequired: rawAction.approvalRequired,
    actionVersion: actionVersion(state),
    approvalValid: approvalIsValid(state),
    contextFacts,
    suppressed: timeline.filter((e, i) => i < state.cursor && e.disposition === 'suppressed'),
    surfaced: timeline.filter((e, i) => i < state.cursor && e.disposition === 'shown'),
    nextEvent: state.cursor < timeline.length ? timeline[state.cursor] : null,
  };
}

export const statusMeta = {
  prepared: { label: 'Prepared', tone: 'neutral' },
  pending: { label: 'Pending approval', tone: 'amber' },
  approved: { label: 'Approved for this exact draft', tone: 'green' },
  rejected: { label: 'Rejected — nothing sent', tone: 'red' },
  sent: { label: 'Simulated sent', tone: 'blue' },
  unconfirmed: { label: 'Delivery unconfirmed', tone: 'amber' },
  confirmed: { label: 'Confirmed delivery', tone: 'green' },
  superseded: { label: 'Superseded', tone: 'red' },
  hold: { label: 'On hold', tone: 'amber' },
};
