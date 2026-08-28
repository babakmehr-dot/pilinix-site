import React, { useState } from 'react';
import { Bell, BellOff, Eye, EyeOff, Pause, Play, Radar } from 'lucide-react';
import { scenario } from '../../data/supplierScenario.js';

export default function MonitoringPanel({ state, derived, dispatch }) {
  const [explained, setExplained] = useState({});
  const done = !derived.nextEvent;

  return (
    <section className="monitoring panel" id="monitoring" aria-labelledby="monitoring-title">
      <header className="panel-head">
        <Radar size={15} aria-hidden="true" />
        <h3 id="monitoring-title">Not every change needs your attention.</h3>
      </header>

      <dl className="scope-row">
        <div>
          <dt>Watching in this example</dt>
          <dd>{scenario.scope}</dd>
        </div>
        <div>
          <dt>Scenario time</dt>
          <dd>Day {state.day}</dd>
        </div>
      </dl>

      <div className="monitor-buttons">
        <button
          type="button"
          className="primary sm"
          onClick={() => dispatch({ type: 'ADVANCE' })}
          disabled={state.paused || done}
        >
          <Bell size={15} aria-hidden="true" /> Advance the scenario
        </button>
        <button
          type="button"
          className="ghost sm"
          onClick={() => dispatch({ type: 'TOGGLE_PAUSE' })}
          aria-pressed={state.paused}
        >
          {state.paused ? <Play size={15} aria-hidden="true" /> : <Pause size={15} aria-hidden="true" />}
          {state.paused ? 'Resume this example' : 'Pause this example'}
        </button>
        {derived.suppressed.length > 0 && (
          <button
            type="button"
            className="ghost sm"
            onClick={() => dispatch({ type: 'TOGGLE_SUPPRESSED' })}
            aria-expanded={state.showSuppressed}
            aria-controls="suppressed-list"
          >
            {state.showSuppressed ? <EyeOff size={15} aria-hidden="true" /> : <Eye size={15} aria-hidden="true" />}
            {state.showSuppressed ? 'Hide suppressed updates' : `Show suppressed updates (${derived.suppressed.length})`}
          </button>
        )}
      </div>

      <p className="monitor-status" aria-live="polite">
        {state.paused
          ? 'Paused in this example. No new scenario events will be surfaced until you resume.'
          : done
            ? 'No further events in this example.'
            : `${derived.surfaced.length} surfaced · ${derived.suppressed.length} suppressed so far.`}
      </p>

      {derived.surfaced.length > 0 && (
        <ul className="event-list">
          {derived.surfaced.map((e) => (
            <li key={e.id} className="event-item is-shown">
              <div className="event-head">
                <span className="event-day">Day {e.day}</span>
                <span className="event-flag tone-amber">
                  <Bell size={12} aria-hidden="true" /> Surfaced
                </span>
              </div>
              <h4>{e.title}</h4>
              <p>{e.detail}</p>
              <button
                type="button"
                className="link-btn"
                onClick={() => setExplained((s) => ({ ...s, [e.id]: !s[e.id] }))}
                aria-expanded={!!explained[e.id]}
              >
                Why was this shown?
              </button>
              {explained[e.id] && <p className="event-reason reveal">{e.reason}</p>}
            </li>
          ))}
        </ul>
      )}

      {state.showSuppressed && derived.suppressed.length > 0 && (
        <ul className="event-list suppressed reveal" id="suppressed-list">
            {derived.suppressed.map((e) => (
              <li key={e.id} className="event-item is-suppressed">
                <div className="event-head">
                  <span className="event-day">Day {e.day}</span>
                  <span className="event-flag tone-muted">
                    <BellOff size={12} aria-hidden="true" />
                    {e.kind === 'duplicate' ? 'Duplicate suppressed' : 'Suppressed'}
                  </span>
                </div>
                <h4>{e.title}</h4>
                <p>{e.detail}</p>
                <p className="event-reason is-static">{e.reason}</p>
              </li>
            ))}
        </ul>
      )}
    </section>
  );
}
