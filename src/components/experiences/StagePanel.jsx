import React from 'react';
import { NavLink } from 'react-router-dom';
import { ArrowRight, Check, CircleDot, Crosshair, Funnel, GitCompare, Radar, RefreshCw, Satellite, TriangleAlert } from 'lucide-react';
import SignalFeed from './SignalFeed.jsx';
import EvidencePanel from './EvidencePanel.jsx';
import ImpactPanel from './ImpactPanel.jsx';
import ActionReview from './ActionReview.jsx';
import { STAGES, actionStates } from '../../lib/cycleMachine.js';
import { StateBadge } from '../ui/Primitives.jsx';

/** Content for whichever stage the visitor is looking at. */
export default function StagePanel({ state, derived, dispatch }) {
  const stage = STAGES[state.active];
  const { scenario, cycle, signalEvent, impact } = derived;

  const body = {
    monitor: () => (
      <>
        <p className="stage-lead">{scenario.environment}</p>
        <h4 className="micro-label">What is watched</h4>
        <ul className="scope-list">
          {scenario.monitoringScope.map((x) => (
            <li key={x}><Satellite size={13} aria-hidden="true" /><span>{x}</span></li>
          ))}
        </ul>
        <p className="scope-out">
          <Crosshair size={13} aria-hidden="true" />
          Outside this scope: {scenario.outOfScope}
        </p>
        <p className="stage-note">
          Nothing has been reported by a person. The next stage is the system finding
          something.
        </p>
      </>
    ),

    discover: () => (
      <>
        <p className="stage-lead">
          The system found this. Nobody asked it to look at this item, and nobody typed
          it in.
        </p>
        <article className="signal-card">
          <div className="feed-head">
            <span className="feed-day">Day {signalEvent.day} · {signalEvent.source}</span>
            <span className="event-flag tone-amber"><Radar size={12} aria-hidden="true" /> Discovered</span>
          </div>
          <h4>{signalEvent.title}</h4>
          <p>{signalEvent.detail}</p>
        </article>
        <p className="stage-note">Recorded as: {cycle.signal.label} · {cycle.signal.source} · {cycle.signal.at}</p>
      </>
    ),

    filter: () => (
      <>
        <p className="stage-lead">
          Detecting a change is not the same as surfacing it. Each observed item gets a
          disposition and a reason that can be argued with.
        </p>
        <SignalFeed
          derived={derived}
          showFiltered={state.showFiltered}
          onToggle={() => dispatch({ type: 'TOGGLE_FILTERED' })}
        />
      </>
    ),

    context: () => (
      <>
        <div className="relevance">
          <span className="micro-label">Relevance</span>
          <strong>{cycle.relevance.verdict}</strong>
          <p>{cycle.relevance.why}</p>
        </div>
        <p className="stage-note">
          The same change would produce a different answer against a different context.
          The context panel is on the left, and it carries forward between cycles.
        </p>
      </>
    ),

    evidence: () => (
      <>
        <p className="stage-lead">
          Evidence is labelled by strength, not by a score. What is missing is named
          rather than assumed.
        </p>
        <EvidencePanel evidence={cycle.evidence} missing={cycle.missing} />
      </>
    ),

    impact: () => <ImpactPanel derived={derived} />,

    decide: () => (
      <>
        <div className="decision-block">
          <span className="micro-label">Recommended next step</span>
          <p className="decision-text" key={derived.recommendation}>{derived.recommendation}</p>
          <h4 className="micro-label">Why this step</h4>
          <p className="decision-why">{cycle.decision.why}</p>
        </div>
        <h4 className="micro-label">Options considered</h4>
        <ul className="options-list">
          {cycle.decision.options.map((o) => (
            <li key={o.name} className={o.chosen ? 'is-chosen' : ''}>
              <span className="option-mark" aria-hidden="true">
                {o.chosen ? <Check size={13} /> : <GitCompare size={13} />}
              </span>
              <span className="option-body">
                <span className="option-name">{o.name}{o.chosen && <em> — selected</em>}</span>
                <span className="option-note">{o.note}</span>
              </span>
            </li>
          ))}
        </ul>
      </>
    ),

    act: () => <ActionReview state={state} derived={derived} dispatch={dispatch} />,

    verify: () => (
      <>
        <p className="stage-lead">
          An action that has been sent is not an outcome. These are different states and
          the system keeps them apart.
        </p>
        <div className="verify-track">
          {['prepared', 'approved', 'sent', 'unconfirmed', 'confirmed', 'completed'].map((k) => {
            const reachedIt = state.action === k
              || (['sent', 'unconfirmed', 'confirmed', 'completed'].includes(state.action)
                  && ['prepared', 'approved'].includes(k))
              || (['unconfirmed', 'confirmed', 'completed'].includes(state.action) && k === 'sent')
              || (['confirmed', 'completed'].includes(state.action) && k === 'unconfirmed')
              || (state.action === 'completed' && k === 'confirmed');
            return (
              <span key={k} className={`verify-step${state.action === k ? ' is-current' : ''}${reachedIt ? ' is-reached' : ''}`}>
                {actionStates[k].label}
              </span>
            );
          })}
        </div>

        <div className="verify-state">
          <StateBadge status={state.action} label={actionStates[state.action].label} tone={actionStates[state.action].tone} />
        </div>

        {['sent', 'unconfirmed', 'confirmed'].includes(state.action) && (
          <>
            <p className="stage-note">{cycle.outcome[state.action]}</p>
            <button type="button" className="ghost sm" onClick={() => dispatch({ type: 'CHECK_OUTCOME' })}>
              <RefreshCw size={15} aria-hidden="true" />
              {state.action === 'sent' ? 'Check delivery' : state.action === 'unconfirmed' ? 'Check again' : 'Check for a response'}
            </button>
          </>
        )}
        {['completed', 'none'].includes(state.action) && (
          <p className="stage-note verified">{cycle.outcome.completed}</p>
        )}
        {['idle', 'prepared', 'pending', 'hold', 'rejected', 'approved', 'superseded'].includes(state.action) && (
          <p className="stage-note">
            {state.action === 'rejected'
              ? 'Nothing was sent, so there is no outcome to verify.'
              : 'There is nothing to verify yet — go back to the action stage.'}
          </p>
        )}
      </>
    ),

    update: () => (
      <>
        <p className="stage-lead">
          What the cycle learned is written back into the context. The next cycle starts
          from there, not from zero.
        </p>
        <h4 className="micro-label">Added to context</h4>
        <ul className="update-list">
          {cycle.contextUpdate.map((u) => (
            <li key={u.label}>
              <CircleDot size={13} aria-hidden="true" />
              <span><b>{u.label}:</b> {u.value}{u.note && <em> — {u.note}</em>}</span>
            </li>
          ))}
        </ul>
        <h4 className="micro-label">Still being watched</h4>
        <ul className="scope-list">
          {cycle.monitoringPlan.map((x) => (
            <li key={x}><Satellite size={13} aria-hidden="true" /><span>{x}</span></li>
          ))}
        </ul>

        {!derived.canClose && (
          <p className="stage-note">
            <TriangleAlert size={13} aria-hidden="true" /> The action stage is not finished,
            so the outcome cannot be written back yet.
          </p>
        )}

        <div className="close-row">
          <button
            type="button"
            className="primary sm"
            onClick={() => dispatch({ type: 'CLOSE_CYCLE' })}
            disabled={!derived.canClose || (derived.isLastCycle && state.completed.includes(state.cycleIndex))}
          >
            <RefreshCw size={15} aria-hidden="true" />
            {derived.isLastCycle ? 'Write back and continue monitoring' : 'Continue monitoring — next cycle'}
          </button>
          {derived.isLastCycle && state.completed.includes(state.cycleIndex) && (
            <p className="stage-note">
              Context updated and monitoring continues. This example has no further
              scripted change — try another environment above, or{' '}
              <NavLink to="/thinking" className="text-link inline">read how the loop is designed <ArrowRight size={13} /></NavLink>
            </p>
          )}
        </div>
      </>
    ),
  };

  return (
    <section className="stage-panel panel" aria-labelledby="stage-title" key={`${state.cycleIndex}-${stage.id}`}>
      <header className="panel-head">
        <span className="stage-index">{String(state.active + 1).padStart(2, '0')}</span>
        <h3 id="stage-title">{stage.label}</h3>
        <span className="stage-question">{stage.question}</span>
      </header>
      <div className="stage-content reveal">{body[stage.id]()}</div>
    </section>
  );
}
