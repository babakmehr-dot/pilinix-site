import React from 'react';
import { Layers, SlidersHorizontal } from 'lucide-react';
import { FactCard } from '../ui/Primitives.jsx';
import { formatAssumption } from '../../lib/cycleMachine.js';

/** Persistent context on the left, and the assumptions every number depends on.
 *  Facts carried in from a completed cycle are marked as such. */
export default function ContextPanel({ state, derived, dispatch, assumptionsRef }) {
  const { scenario, context } = derived;
  const carriedCount = state.carried.length;

  return (
    <aside className="context-panel panel" aria-labelledby="context-title">
      <header className="panel-head">
        <Layers size={15} aria-hidden="true" />
        <h3 id="context-title">{scenario.contextTitle}</h3>
      </header>

      <div className="fact-grid">
        {context.map((f, i) => (
          <FactCard key={`${f.label}-${i}`} {...f} carried={i >= context.length - carriedCount} />
        ))}
      </div>
      {carriedCount > 0 && (
        <p className="carried-note">
          {carriedCount} fact{carriedCount === 1 ? '' : 's'} carried in from a completed cycle.
        </p>
      )}

      <div className="assumptions" ref={assumptionsRef} tabIndex={-1}>
        <header className="panel-head">
          <SlidersHorizontal size={15} aria-hidden="true" />
          <h3>Assumptions</h3>
        </header>
        <p className="assumption-intro">
          Every figure below the impact stage is derived from these. Change one and the
          estimate, the decision and any approval are all rebuilt.
        </p>
        {scenario.assumptions.map((a) => (
          <div className="assumption" key={a.id}>
            <label htmlFor={`asm-${a.id}`}>
              {a.label}
              <output htmlFor={`asm-${a.id}`}>{formatAssumption(a, state.assumptions[a.id])}</output>
            </label>
            <input
              id={`asm-${a.id}`}
              type="range"
              min={a.min}
              max={a.max}
              step={a.step}
              value={state.assumptions[a.id]}
              onChange={(e) => dispatch({ type: 'SET_ASSUMPTION', id: a.id, value: Number(e.target.value) })}
              aria-describedby={a.note ? `asm-note-${a.id}` : undefined}
            />
            {a.note && <p className="assumption-note" id={`asm-note-${a.id}`}>{a.note}</p>}
          </div>
        ))}
      </div>
    </aside>
  );
}
