import React from 'react';
import {
  Ban, CircleCheck, CircleSlash, FileText, Info, Pause, Send, ShieldAlert,
  ShieldCheck, Timer, TriangleAlert,
} from 'lucide-react';
import { strengthLabels, strengthTone } from '../../data/supplierScenario.js';

export function LogoMark() {
  return (
    <svg className="logo-mark" viewBox="0 0 42 42" aria-hidden="true">
      <path d="M7 12.5 20.8 4l13.8 8.2v17.6L20.8 38 7 29.5Z" fill="none" stroke="currentColor" strokeWidth="2" />
      <path d="M13 16.2 21 11l8 4.8v10.4L21 31l-8-4.9Z" fill="currentColor" opacity=".16" />
      <path d="M13 26 29 16M13 16l16 10" stroke="currentColor" strokeWidth="1.5" opacity=".85" />
    </svg>
  );
}

export function SectionHeading({ num, eyebrow, title, copy, id }) {
  return (
    <div className="section-heading">
      <span className="section-number">{num}</span>
      <div>
        <div className="eyebrow">{eyebrow}</div>
        <h2 id={id}>{title}</h2>
        {copy && <p>{copy}</p>}
      </div>
    </div>
  );
}

export function PageHero({ eyebrow, title, copy }) {
  return (
    <section className="page-hero section-shell">
      <div className="eyebrow">{eyebrow}</div>
      <h1>{title}</h1>
      {copy && <p>{copy}</p>}
    </section>
  );
}

/** Honest disclosure strip. Never decorative. */
export function Disclosure({ children, icon = true }) {
  return (
    <p className="disclosure">
      {icon && <Info size={13} aria-hidden="true" />}
      <span>{children}</span>
    </p>
  );
}

const statusIcons = {
  prepared: FileText,
  pending: ShieldAlert,
  approved: ShieldCheck,
  rejected: Ban,
  sent: Send,
  unconfirmed: Timer,
  confirmed: CircleCheck,
  superseded: CircleSlash,
  hold: Pause,
};

/**
 * State is always text + icon. Colour never carries the meaning on its own.
 */
export function StateBadge({ status, label, tone, size = 'md' }) {
  const Icon = statusIcons[status] || Info;
  return (
    <span className={`state-badge tone-${tone} size-${size}`}>
      <Icon size={size === 'sm' ? 12 : 14} aria-hidden="true" />
      <span>{label}</span>
    </span>
  );
}

export function StrengthTag({ strength }) {
  const tone = strengthTone[strength] || 'neutral';
  const Icon = strength === 'strong' ? CircleCheck : strength === 'partial' ? Info : TriangleAlert;
  return (
    <span className={`strength-tag tone-${tone}`}>
      <Icon size={12} aria-hidden="true" />
      <span>{strengthLabels[strength]}</span>
    </span>
  );
}

/** Small fact card: value + status, per the shared visual language. */
export function FactCard({ label, value, note, tone }) {
  return (
    <div className={`fact-card${tone ? ` tone-${tone}` : ''}`}>
      <span className="fact-label">{label}</span>
      <span className="fact-value">{value}</span>
      {note && <span className="fact-note">{note}</span>}
    </div>
  );
}

export function SourceCard({ source }) {
  return (
    <article className="source-card">
      <header>
        <span className="source-id">{source.id}</span>
        <StrengthTag strength={source.strength} />
      </header>
      <h4>{source.title}</h4>
      <p className="source-excerpt">{source.excerpt}</p>
      <dl className="source-meta">
        <div><dt>Effective</dt><dd>{source.effective}</dd></div>
        <div><dt>Checked</dt><dd>{source.checked}</dd></div>
      </dl>
    </article>
  );
}
