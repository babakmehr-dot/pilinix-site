import React, { useEffect, useRef } from 'react';
import { Check, GitCompare, X } from 'lucide-react';
import EvidencePanel from './EvidencePanel.jsx';
import { FactCard, StateBadge } from '../ui/Primitives.jsx';
import { scenario } from '../../data/supplierScenario.js';
import { statusMeta } from '../../lib/scenarioMachine.js';

export default function DecisionInspector({ state, derived, dispatch, returnFocusRef }) {
  const headingRef = useRef(null);
  const meta = statusMeta[state.status];

  useEffect(() => {
    if (state.inspect && headingRef.current) headingRef.current.focus();
  }, [state.inspect]);

  const close = () => {
    dispatch({ type: 'SET_INSPECT', open: false });
    if (returnFocusRef?.current) returnFocusRef.current.focus();
  };

  if (!state.inspect) return null;

  return (
    <section className="inspector panel reveal" id="decision-inspector" aria-labelledby="inspector-title">
      <header className="inspector-head">
        <h3 id="inspector-title" ref={headingRef} tabIndex={-1}>
          Inspect the decision
        </h3>
        <button type="button" className="icon-btn" onClick={close} aria-label="Close the decision inspector">
          <X size={16} />
        </button>
      </header>

      <div className="inspect-block">
        <h4 className="micro-label">What changed?</h4>
        <p className="inspect-lead">{scenario.signal}</p>
      </div>

      <div className="inspect-block">
        <h4 className="micro-label">Current context</h4>
        <div className="fact-grid">
          {derived.contextFacts.map((f) => (
            <FactCard key={f.label} {...f} />
          ))}
        </div>
      </div>

      <EvidencePanel evidence={derived.evidence} missing={derived.missing} variant="full" />

      <div className="inspect-block">
        <h4 className="micro-label">Options considered</h4>
        <ul className="options-list">
          {derived.options.map((o) => (
            <li key={o.name} className={o.chosen ? 'is-chosen' : ''}>
              <span className="option-mark" aria-hidden="true">
                {o.chosen ? <Check size={13} /> : <GitCompare size={13} />}
              </span>
              <span className="option-body">
                <span className="option-name">
                  {o.name}
                  {o.chosen && <em> — selected</em>}
                </span>
                <span className="option-note">{o.note}</span>
              </span>
            </li>
          ))}
        </ul>
      </div>

      <div className="inspect-block">
        <h4 className="micro-label">Why this next step?</h4>
        <p>{derived.why}</p>
      </div>

      <div className="inspect-block inspect-permission">
        <h4 className="micro-label">Action and permission</h4>
        <p className="inspect-action-line">{derived.action.target}</p>
        <p>
          {derived.approvalRequired
            ? 'Human approval is required before any simulated send.'
            : 'No approval required — this step is internal and sends nothing.'}
        </p>
        <div className="inspect-state-row">
          <StateBadge status={state.status} label={meta.label} tone={meta.tone} size="sm" />
          <span className="version-tag">Action version: {derived.actionVersion}</span>
        </div>
        {state.approvedVersion && !derived.approvalValid && (
          <p className="inspect-stale">
            An earlier approval exists for a different action version and is no longer valid.
          </p>
        )}
      </div>
    </section>
  );
}
