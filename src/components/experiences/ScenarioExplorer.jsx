import React, { useEffect, useReducer, useRef } from 'react';
import { ChevronDown, RotateCcw, Search, SlidersHorizontal, TriangleAlert, Zap } from 'lucide-react';
import ContextEditor from './ContextEditor.jsx';
import DecisionSummary from './DecisionSummary.jsx';
import EvidencePanel from './EvidencePanel.jsx';
import ActionReview from './ActionReview.jsx';
import DecisionInspector from './DecisionInspector.jsx';
import MonitoringPanel from './MonitoringPanel.jsx';
import ScenarioHistory from './ScenarioHistory.jsx';
import { Disclosure } from '../ui/Primitives.jsx';
import { scenario } from '../../data/supplierScenario.js';
import { derive, initialState, reducer, stateFromLink } from '../../lib/scenarioMachine.js';
import { SIMULATION_DISCLOSURE } from '../../data/site.js';
import { scrollToId, useReducedMotionPref } from '../../lib/motion.js';

export default function ScenarioExplorer({ linkState }) {
  const reduced = useReducedMotionPref();
  const [state, dispatch] = useReducer(
    reducer,
    linkState,
    (key) => (key ? stateFromLink(key) : { ...initialState, history: [...initialState.history] }),
  );
  const derived = derive(state);

  const fieldsetRef = useRef(null);
  const inspectBtnRef = useRef(null);
  const didLinkScroll = useRef(false);

  useEffect(() => {
    if (linkState && !didLinkScroll.current) {
      didLinkScroll.current = true;
      // Let the section paint before moving to it.
      const id = window.requestAnimationFrame(() => scrollToId('scenario', reduced));
      return () => window.cancelAnimationFrame(id);
    }
  }, [linkState, reduced]);

  const advance = () => {
    dispatch({ type: 'ADVANCE' });
    scrollToId('monitoring', reduced);
  };

  return (
    <div className="scenario" id="scenario">
      <header className="scenario-head">
        <div className="scenario-head-main">
          <span className="scenario-tag">Sample scenario · v{scenario.version}</span>
          <h3>{scenario.title}</h3>
          <p className="scenario-signal">{scenario.signal}</p>
        </div>
        <div className="scenario-impact">
          <span className="micro-label">Potential impact</span>
          <strong key={derived.impactLabel} className="reveal">
            {derived.impactLabel}
          </strong>
          <span className="impact-unit">per month</span>
          {derived.conditionalImpact && (
            <span className="impact-flag">
              <TriangleAlert size={12} aria-hidden="true" /> Conditional
            </span>
          )}
          <p className="impact-note">{derived.impactNote}</p>
        </div>
      </header>

      <Disclosure>{SIMULATION_DISCLOSURE}</Disclosure>

      <div className="scenario-controls" role="group" aria-label="Scenario controls">
        <button type="button" className="chip-btn" onClick={() => fieldsetRef.current?.focus()}>
          <SlidersHorizontal size={14} aria-hidden="true" /> Change the context
        </button>
        <button
          type="button"
          className="chip-btn"
          ref={inspectBtnRef}
          onClick={() => dispatch({ type: 'SET_INSPECT', open: !state.inspect })}
          aria-expanded={state.inspect}
          aria-controls="decision-inspector"
        >
          <Search size={14} aria-hidden="true" /> Inspect the decision
          <ChevronDown size={14} aria-hidden="true" className={state.inspect ? 'flip' : ''} />
        </button>
        <button
          type="button"
          className="chip-btn"
          onClick={advance}
          disabled={state.paused || !derived.nextEvent}
        >
          <Zap size={14} aria-hidden="true" /> Advance the scenario
        </button>
        <button type="button" className="chip-btn" onClick={() => dispatch({ type: 'RESET' })}>
          <RotateCcw size={14} aria-hidden="true" /> Reset example
        </button>
      </div>

      <div className="scenario-grid">
        <ContextEditor state={state} derived={derived} dispatch={dispatch} fieldsetRef={fieldsetRef} />
        <div className="scenario-result">
          <DecisionSummary state={state} derived={derived} />
          <EvidencePanel evidence={derived.evidence} missing={derived.missing} />
          <ActionReview state={state} derived={derived} dispatch={dispatch} />
        </div>
      </div>

      <DecisionInspector
        state={state}
        derived={derived}
        dispatch={dispatch}
        returnFocusRef={inspectBtnRef}
      />

      <MonitoringPanel state={state} derived={derived} dispatch={dispatch} />
      <ScenarioHistory history={state.history} />
    </div>
  );
}
