import React from 'react';
import { Ban, CircleAlert, Lock, Send, ShieldCheck } from 'lucide-react';
import { StateBadge } from '../ui/Primitives.jsx';
import { actionStates } from '../../lib/cycleMachine.js';

const stateCopy = {
  idle: 'Nothing is prepared yet.',
  hold: 'On hold. No consequential action is prepared while a fact that decides the answer is missing.',
  prepared: 'Prepared. It has not been reviewed and nothing has been sent.',
  pending: 'Waiting for a human decision on the exact action shown above.',
  approved: 'Approved for this exact action only. Still not sent.',
  rejected: 'Nothing was sent.',
  sent: 'Simulated sent. What happens next is not yet known.',
  unconfirmed: 'Outcome unconfirmed — neither success nor failure.',
  confirmed: 'Delivery confirmed. Whether it achieves anything is still unknown.',
  completed: 'Outcome verified.',
  superseded: 'The inputs behind this action changed. It is superseded and cannot be reused.',
  none: 'Recorded. Nothing was drafted and nothing was sent.',
};

export default function ActionReview({ state, derived, dispatch }) {
  const act = derived.cycle.action;
  const meta = actionStates[state.action];
  const isMessage = act.kind === 'message';

  return (
    <div className="action-review">
      {state.notice && (
        <div className="action-notice reveal" role="status">
          <CircleAlert size={14} aria-hidden="true" />
          <span>{state.notice}</span>
          <button type="button" className="link-btn" onClick={() => dispatch({ type: 'DISMISS_NOTICE' })}>Dismiss</button>
        </div>
      )}

      <div className="action-preview">
        <div className="action-preview-head">
          <span className="micro-label">{act.title}</span>
          <span className="action-target">{act.target}</span>
        </div>
        <div className="draft">
          {isMessage ? (
            <>
              <p className="draft-subject">Subject: {act.subject}</p>
              {act.body.map((line, i) => <p key={i}>{line}</p>)}
            </>
          ) : (
            <p>{act.preview}</p>
          )}
        </div>
        <p className="action-consequence">
          <Lock size={12} aria-hidden="true" /> {act.consequence}
        </p>
      </div>

      <p className="action-permission">
        <ShieldCheck size={13} aria-hidden="true" />
        {act.approvalRequired
          ? 'Human approval is required before anything is sent.'
          : 'No approval required — this step is internal and sends nothing.'}
      </p>

      <div className="action-state-row">
        <StateBadge status={state.action} label={meta.label} tone={meta.tone} size="sm" />
        <span className="version-tag">Action version: {derived.actionVersion.split('|').slice(1).join(' · ')}</span>
      </div>

      <p className="action-status-copy" aria-live="polite">
        {stateCopy[state.action]}
        {state.action === 'hold' && state.factRequested && act.followUp ? ` ${act.followUp}` : ''}
      </p>

      <div className="action-buttons">
        {state.action === 'hold' && !state.factRequested && (
          <button type="button" className="primary sm" onClick={() => dispatch({ type: 'REQUEST_FACT' })}>
            {act.buttonLabel}
          </button>
        )}
        {state.action === 'idle' && act.kind !== 'message' && (
          <button type="button" className="primary sm" onClick={() => dispatch({ type: 'EXECUTE' })}>
            {act.buttonLabel}
          </button>
        )}
        {state.action === 'prepared' && act.kind === 'message' && (
          <button type="button" className="primary sm" onClick={() => dispatch({ type: 'PREPARE' })}>
            {act.buttonLabel}
          </button>
        )}
        {state.action === 'prepared' && act.kind !== 'message' && (
          <button type="button" className="primary sm" onClick={() => dispatch({ type: 'EXECUTE' })}>
            {act.buttonLabel}
          </button>
        )}
        {state.action === 'pending' && (
          <>
            <button type="button" className="primary sm" onClick={() => dispatch({ type: 'APPROVE' })}>
              <ShieldCheck size={15} aria-hidden="true" /> Approve this action
            </button>
            <button type="button" className="ghost sm" onClick={() => dispatch({ type: 'REJECT' })}>
              <Ban size={15} aria-hidden="true" /> Reject
            </button>
          </>
        )}
        {state.action === 'approved' && derived.approvalValid && (
          <button type="button" className="primary sm" onClick={() => dispatch({ type: 'EXECUTE' })}>
            <Send size={15} aria-hidden="true" /> Simulate sending
          </button>
        )}
        {['rejected', 'superseded'].includes(state.action) && (
          <button type="button" className="ghost sm" onClick={() => dispatch({ type: 'NEW_DRAFT' })}>
            Prepare a new action
          </button>
        )}
      </div>
    </div>
  );
}
