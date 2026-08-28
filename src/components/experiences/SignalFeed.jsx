import React from 'react';
import { Bell, BellOff, Eye, EyeOff } from 'lucide-react';
import { dispositionMeta } from '../../data/signalScenarios.js';

/** Everything the monitor saw, and what was done with each item — including
 *  the items deliberately not surfaced. */
export default function SignalFeed({ derived, showFiltered, onToggle }) {
  const { kept, dropped, cycle } = derived;

  const Item = ({ e }) => {
    const meta = dispositionMeta[e.disposition];
    return (
      <li className={`feed-item is-${e.disposition}${e.id === cycle.signalId ? ' is-signal' : ''}`}>
        <div className="feed-head">
          <span className="feed-day">Day {e.day} · {e.source}</span>
          <span className={`event-flag tone-${meta.tone}`}>
            {['suppressed', 'ignored'].includes(e.disposition) ? <BellOff size={12} aria-hidden="true" /> : <Bell size={12} aria-hidden="true" />}
            {meta.label}
          </span>
        </div>
        <h4>{e.title}</h4>
        <p>{e.detail}</p>
        <p className="feed-reason">{e.reason}</p>
      </li>
    );
  };

  return (
    <>
      <ul className="feed-list">
        {kept.map((e) => <Item key={e.id} e={e} />)}
      </ul>

      {dropped.length > 0 && (
        <>
          <button type="button" className="ghost sm" onClick={onToggle} aria-expanded={showFiltered} aria-controls="filtered-list">
            {showFiltered ? <EyeOff size={15} aria-hidden="true" /> : <Eye size={15} aria-hidden="true" />}
            {showFiltered ? 'Hide what was filtered out' : `Show what was filtered out (${dropped.length})`}
          </button>
          {showFiltered && (
            <ul className="feed-list filtered reveal" id="filtered-list">
              {dropped.map((e) => <Item key={e.id} e={e} />)}
            </ul>
          )}
        </>
      )}
    </>
  );
}
