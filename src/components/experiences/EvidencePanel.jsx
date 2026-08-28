import React from 'react';
import { TriangleAlert } from 'lucide-react';
import { SourceCard } from '../ui/Primitives.jsx';

export default function EvidencePanel({ evidence, missing }) {
  return (
    <>
      <div className="source-grid">
        {evidence.map((s) => <SourceCard key={`${s.id}-${s.title}`} source={s} />)}
      </div>
      <div className="missing-block">
        <h4 className="micro-label">What is missing</h4>
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
