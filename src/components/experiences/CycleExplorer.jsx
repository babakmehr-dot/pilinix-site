import React, { useEffect, useReducer, useRef } from 'react';
import { ArrowRight, RotateCcw } from 'lucide-react';
import CycleLoop from './CycleLoop.jsx';
import ContextPanel from './ContextPanel.jsx';
import StagePanel from './StagePanel.jsx';
import CycleHistory from './CycleHistory.jsx';
import { Disclosure } from '../ui/Primitives.jsx';
import { scenarios } from '../../data/signalScenarios.js';
import { STAGES, derive, initialState, linkStates, reducer, stateFromLink } from '../../lib/cycleMachine.js';
import { SIMULATION_DISCLOSURE } from '../../data/site.js';
import { scrollToId, useReducedMotionPref } from '../../lib/motion.js';

export default function CycleExplorer({ linkState }) {
  const reduced = useReducedMotionPref();
  const [state, dispatch] = useReducer(
    reducer,
    linkState,
    (key) => (key && linkStates[key] ? stateFromLink(key) : initialState()),
  );
  const derived = derive(state);
  const assumptionsRef = useRef(null);
  const appliedLink = useRef(linkState || null);

  useEffect(() => {
    if (!linkState) return undefined;
    // Rebuild when the link changes on an already-mounted page.
    if (appliedLink.current !== linkState) {
      appliedLink.current = linkState;
      dispatch({ type: 'LOAD_LINK', key: linkState });
    }
    const id = window.requestAnimationFrame(() => scrollToId('cycle', reduced));
    return () => window.cancelAnimationFrame(id);
  }, [linkState, reduced]);

  const atEnd = state.reached >= STAGES.length - 1;

  return (
    <div className="cycle" id="cycle">
      <div className="scenario-picker" role="group" aria-label="Choose an environment">
        {scenarios.map((s) => {
          const Icon = s.icon;
          const on = s.id === state.scenarioId;
          return (
            <button
              key={s.id}
              type="button"
              className={`env-chip${on ? ' is-active' : ''}`}
              style={{ '--accent': s.accent }}
              onClick={() => dispatch({ type: 'SELECT_SCENARIO', id: s.id })}
              aria-pressed={on}
            >
              <Icon size={15} aria-hidden="true" />
              <span className="env-domain">{s.domain}</span>
              <span className="env-sub">{s.domainLabel}</span>
            </button>
          );
        })}
      </div>

      <header className="cycle-head" style={{ '--accent': derived.scenario.accent }}>
        <div>
          <span className="cycle-tag">
            Cycle {derived.cycleNumber} of {derived.cycleCount} · scenario day {derived.cycle.day}
          </span>
          <h3>{derived.scenario.title}</h3>
          <p className="cycle-env">{derived.scenario.environment}</p>
          {derived.scenario.productLine && <p className="cycle-product">{derived.scenario.productLine}</p>}
        </div>
        <div className="cycle-controls">
          <button
            type="button"
            className="primary sm"
            onClick={() => dispatch({ type: 'ADVANCE' })}
            disabled={atEnd}
          >
            {state.reached === 0 ? 'Start the cycle' : `Next: ${STAGES[Math.min(state.reached + 1, STAGES.length - 1)].label}`}
            <ArrowRight size={15} aria-hidden="true" />
          </button>
          <button type="button" className="ghost sm" onClick={() => dispatch({ type: 'RESET' })}>
            <RotateCcw size={15} aria-hidden="true" /> Reset
          </button>
        </div>
      </header>

      <Disclosure>{SIMULATION_DISCLOSURE}</Disclosure>

      <p className="sr-only" aria-live="polite">
        {`Cycle ${derived.cycleNumber} of ${derived.cycleCount}, stage ${state.active + 1} of ${STAGES.length}: ${STAGES[state.active].label}. ${STAGES[state.active].question}`}
      </p>

      <CycleLoop
        reached={state.reached}
        active={state.active}
        cycleNumber={derived.cycleNumber}
        onSelect={(i) => dispatch({ type: 'SET_ACTIVE', index: i })}
      />

      <div className="cycle-grid">
        <ContextPanel state={state} derived={derived} dispatch={dispatch} assumptionsRef={assumptionsRef} />
        <StagePanel state={state} derived={derived} dispatch={dispatch} />
      </div>

      <details className="limits">
        <summary>What this example does not do</summary>
        <ul>
          {derived.scenario.limitations.map((l) => <li key={l}>{l}</li>)}
          <li>Nothing here is monitored live, and no action leaves your browser.</li>
        </ul>
      </details>

      <CycleHistory history={state.history} />
    </div>
  );
}
