import React from 'react';
import { FileText, TriangleAlert } from 'lucide-react';
import { strengthLabels } from '../../data/supplierScenario.js';
import { SourceCard, StrengthTag } from '../ui/Primitives.jsx';

/**
 * compact — a summary strip that stays visible next to the recommendation.
 * full    — the source-by-source view inside the inspector.
 */
export default function EvidencePanel({ evidence, missing, variant = 'compact' }) {
  if (variant === 'full') {
    return (
      <>
        <div className="inspect-block">
          <h4 className="micro-label">Evidence</h4>
          <div className="source-grid">
            {evidence.map((s) => (
              <SourceCard key={`${s.id}-${s.title}`} source={s} />
            ))}
          </div>
        </div>
        <div className="inspect-block">
          <h4 className="micro-label">Missing information</h4>
          <ul className="missing-list">
            {missing.map((m) => (
              <li key={m}>
                <TriangleAlert size={13} aria-hidden="true" />
                <span>{m}</span>
              </li>
            ))}
          </ul>
        </div>
      </>
    );
  }

  const counts = evidence.reduce((acc, s) => {
    acc[s.strength] = (acc[s.strength] || 0) + 1;
    return acc;
  }, {});

  return (
    <section className="evidence-compact panel" aria-labelledby="evidence-title">
      <header className="panel-head">
        <FileText size={15} aria-hidden="true" />
        <h3 id="evidence-title">Evidence and gaps</h3>
      </header>
      <div className="evidence-tally">
        {Object.entries(counts).map(([strength, n]) => (
          <span key={strength} className="tally-item">
            <StrengthTag strength={strength} />
            <b aria-label={`${n} ${strengthLabels[strength].toLowerCase()} item${n === 1 ? '' : 's'}`}>{n}</b>
          </span>
        ))}
      </div>
      <h4 className="micro-label">Missing information</h4>
      <ul className="missing-list">
        {missing.map((m) => (
          <li key={m}>
            <TriangleAlert size={13} aria-hidden="true" />
            <span>{m}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
