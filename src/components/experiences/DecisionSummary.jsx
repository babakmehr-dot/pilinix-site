import React from 'react';
import { CircleDot } from 'lucide-react';
import { StateBadge } from '../ui/Primitives.jsx';
import { statusMeta } from '../../lib/scenarioMachine.js';

export default function DecisionSummary({ state, derived }) {
  const meta = statusMeta[state.status];
  return (
    <section className="decision-summary panel" aria-labelledby="decision-title">
      <header className="panel-head">
        <CircleDot size={15} aria-hidden="true" />
        <h3 id="decision-title">Recommended next step</h3>
        <StateBadge status={state.status} label={meta.label} tone={meta.tone} size="sm" />
      </header>

      <div key={derived.recommendation} className="reveal">
        <p className="decision-text">{derived.recommendation}</p>
        <div className="decision-why">
          <h4 className="micro-label">Why this next step</h4>
          <p>{derived.why}</p>
        </div>
      </div>

      {derived.action.stateNotes && (
        <ul className="decision-notes">
          {derived.action.stateNotes.map((n) => (
            <li key={n}>{n}</li>
          ))}
        </ul>
      )}
    </section>
  );
}
