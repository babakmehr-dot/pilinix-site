import React from 'react';
import { Ban, CircleAlert, Lock, Send, ShieldCheck } from 'lucide-react';
import { StateBadge } from '../ui/Primitives.jsx';
import { statusMeta } from '../../lib/scenarioMachine.js';

/** Text shown under the state badge. Never claims more than the state supports. */
const statusCopy = {
  prepared: 'A draft exists. It has not been reviewed and nothing has been sent.',
  pending: 'Waiting for a human decision on the exact draft above.',
  approved: 'Approved for this exact draft only. Still not sent.',
  rejected: 'Nothing was sent.',
  sent: 'Simulated sent. Business outcome still unknown.',
  unconfirmed: 'Outcome unconfirmed. The status check timed out — that is neither success nor failure.',
  confirmed: 'Confirmed delivery in this example. Whether the supplier accepts the request is still unknown.',
  superseded: 'The facts behind this action changed. It is superseded and cannot be reused.',
  hold: 'On hold. No supplier action is drafted while a fact that changes the answer is missing.',
};

export default function ActionReview({ state, derived, dispatch }) {
  const meta = statusMeta[state.status];
  const { action } = derived;
  const isMessage = action.kind === 'message';

  return (
    <section className="action-review panel" aria-labelledby="action-title">
      <header className="panel-head">
        <Send size={15} aria-hidden="true" />
        <h3 id="action-title">Action and permission</h3>
        <StateBadge status={state.status} label={meta.label} tone={meta.tone} size="sm" />
      </header>

      {state.notice && (
        <div className="action-notice reveal" role="status">
          <CircleAlert size={14} aria-hidden="true" />
          <span>{state.notice}</span>
          <button type="button" className="link-btn" onClick={() => dispatch({ type: 'DISMISS_NOTICE' })}>
            Dismiss
          </button>
        </div>
      )}

      <div className="action-preview">
        <div className="action-preview-head">
          <span className="micro-label">{action.title}</span>
          <span className="action-target">{action.target}</span>
        </div>
        {isMessage ? (
          <div className="draft">
            <p className="draft-subject">Subject: {action.subject}</p>
            {action.body.map((line, i) => (
              <p key={i}>{line}</p>
            ))}
          </div>
        ) : (
          <div className="draft">
            <p>{action.preview}</p>
          </div>
        )}
        <p className="action-consequence">
          <Lock size={12} aria-hidden="true" /> {action.consequence}
        </p>
      </div>

      <p className="action-permission">
        {derived.approvalRequired ? (
          <>
            <ShieldCheck size={13} aria-hidden="true" /> Human approval required before any simulated send.
          </>
        ) : (
          <>
            <ShieldCheck size={13} aria-hidden="true" /> No approval required — this step is internal and sends nothing.
          </>
        )}
      </p>

      <p className="action-status-copy" aria-live="polite">
        {statusCopy[state.status]}
        {state.status === 'hold' && state.factRequested && ` ${action.followUp}`}
      </p>

      <div className="action-buttons">
        {state.status === 'hold' && action.kind === 'request-fact' && !state.factRequested && (
          <button type="button" className="primary sm" onClick={() => dispatch({ type: 'REQUEST_FACT' })}>
            {action.buttonLabel}
          </button>
        )}
        {state.status === 'hold' && action.kind === 'recheck' && (
          <button type="button" className="primary sm" onClick={() => dispatch({ type: 'RECHECK' })}>
            {action.buttonLabel}
          </button>
        )}
        {state.status === 'prepared' && (
          <button type="button" className="primary sm" onClick={() => dispatch({ type: 'PREPARE_FOR_APPROVAL' })}>
            {action.buttonLabel}
          </button>
        )}
        {state.status === 'pending' && (
          <>
            <button type="button" className="primary sm" onClick={() => dispatch({ type: 'APPROVE' })}>
              <ShieldCheck size={15} aria-hidden="true" /> Approve this draft
            </button>
            <button type="button" className="ghost sm" onClick={() => dispatch({ type: 'REJECT' })}>
              <Ban size={15} aria-hidden="true" /> Reject
            </button>
          </>
        )}
        {state.status === 'approved' && derived.approvalValid && (
          <button type="button" className="primary sm" onClick={() => dispatch({ type: 'SIMULATE_SEND' })}>
            <Send size={15} aria-hidden="true" /> Simulate sending
          </button>
        )}
        {(state.status === 'sent' || state.status === 'unconfirmed') && (
          <button type="button" className="ghost sm" onClick={() => dispatch({ type: 'CHECK_DELIVERY' })}>
            {state.status === 'sent' ? 'Check delivery status' : 'Check status again'}
          </button>
        )}
        {(state.status === 'rejected' || state.status === 'superseded') && (
          <button type="button" className="ghost sm" onClick={() => dispatch({ type: 'NEW_DRAFT' })}>
            Prepare a new draft
          </button>
        )}
      </div>
    </section>
  );
}
