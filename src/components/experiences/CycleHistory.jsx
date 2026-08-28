import React from 'react';
import { ListChecks } from 'lucide-react';

export default function CycleHistory({ history }) {
  return (
    <section className="cycle-history panel" aria-labelledby="history-title">
      <header className="panel-head">
        <ListChecks size={15} aria-hidden="true" />
        <h3 id="history-title">What the system did, and why</h3>
        <span className="panel-note">Scenario time only — no live clock</span>
      </header>
      <ol className="history-list">
        {history.map((h, i) => (
          <li key={i} className={`tone-${h.tone}`}>
            <span className="history-day">C{h.cycle} · day {h.day}</span>
            <span className="history-label">{h.label}</span>
            <span className="history-text">{h.text}</span>
          </li>
        ))}
      </ol>
    </section>
  );
}
