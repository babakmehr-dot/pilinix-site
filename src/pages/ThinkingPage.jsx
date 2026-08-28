import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { ArrowRight, ChevronDown, CircleDot, Eye, FileText, Network, Send } from 'lucide-react';
import ApproachDiagnostic from '../components/experiences/ApproachDiagnostic.jsx';
import { PageHero, SectionHeading } from '../components/ui/Primitives.jsx';

const stages = [
  {
    id: 'signal',
    name: 'Signal',
    prompt: 'What changed?',
    icon: Eye,
    example:
      'Supplier price notice SN-2481 raises the unit price from $10.00 to $10.80 from next month.',
    to: '/?state=missing-evidence',
    linkLabel: 'Open this state',
  },
  {
    id: 'context',
    name: 'Context',
    prompt: 'Why might it matter here?',
    icon: Network,
    example:
      'Two thousand units a month, a renewal date inside the quarter, and a price-lock clause that has not been checked yet.',
    to: '/?state=missing-evidence',
    linkLabel: 'Open this state',
  },
  {
    id: 'evidence',
    name: 'Evidence',
    prompt: 'What supports it, and what is missing?',
    icon: FileText,
    example:
      'The notice is strong evidence. The price clause in the agreement is missing — and that single gap decides the answer.',
    to: '/?state=missing-evidence',
    linkLabel: 'Open this state',
  },
  {
    id: 'decision',
    name: 'Decision',
    prompt: 'What is the next useful step?',
    icon: CircleDot,
    example:
      'While the clause is unchecked, the step is to confirm whether the new price applies — not to respond to it. Holding is a decision.',
    to: '/?state=missing-evidence',
    linkLabel: 'Open this state',
  },
  {
    id: 'action',
    name: 'Action',
    prompt: 'What may happen, and who must approve it?',
    icon: Send,
    example:
      'A drafted message to the supplier. A person approves that exact draft before anything is simulated as sent, and the approval covers nothing else.',
    to: '/?state=permission',
    linkLabel: 'Open the approval state',
  },
];

const stopRows = [
  {
    title: 'Missing evidence',
    copy: 'Say what is missing before recommending a consequential step.',
    to: '/?state=missing-evidence',
  },
  {
    title: 'Changed context',
    copy: 'Revisit the recommendation instead of defending it.',
    to: '/?state=changed-context',
  },
  {
    title: 'Permission required',
    copy: 'Show the exact action for review.',
    to: '/?state=permission',
  },
  {
    title: 'Unconfirmed outcome',
    copy: 'Do not call it done.',
    to: '/?state=unconfirmed',
  },
];

function StageRow({ stage, open, onToggle }) {
  const Icon = stage.icon;
  return (
    <li className={`stage-row${open ? ' is-open' : ''}`}>
      <button type="button" onClick={onToggle} aria-expanded={open} aria-controls={`stage-${stage.id}`}>
        <span className="stage-icon"><Icon size={16} aria-hidden="true" /></span>
        <span className="stage-name">{stage.name}</span>
        <span className="stage-prompt">{stage.prompt}</span>
        <ChevronDown size={16} aria-hidden="true" className={open ? 'flip' : ''} />
      </button>
      {open && (
        <div id={`stage-${stage.id}`} className="stage-body reveal">
          <p>{stage.example}</p>
          <NavLink to={stage.to} className="text-link">
            {stage.linkLabel} <ArrowRight size={14} />
          </NavLink>
        </div>
      )}
    </li>
  );
}

export default function ThinkingPage() {
  const [open, setOpen] = useState('signal');

  return (
    <>
      <PageHero
        eyebrow="HOW WE THINK"
        title="A decision needs more than an answer."
        copy="A useful system needs a goal, relevant context, evidence it can check, and clear limits on what it may do."
      />

      <section className="section-shell stages-section">
        <ul className="stage-list">
          {stages.map((s) => (
            <StageRow
              key={s.id}
              stage={s}
              open={open === s.id}
              onToggle={() => setOpen(open === s.id ? null : s.id)}
            />
          ))}
        </ul>
        <div className="stage-check">
          <h3>Check the result.</h3>
          <p>A proposed action is not a completed one. New information may change the decision.</p>
          <NavLink to="/?state=unconfirmed" className="text-link">
            See an unconfirmed outcome <ArrowRight size={14} />
          </NavLink>
        </div>
      </section>

      <section className="section-shell diagnostic-section">
        <SectionHeading
          num="02"
          eyebrow="A RULE-BASED GUIDE"
          title="Should AI be here?"
          copy="Describe how the work behaves. Explore whether it needs an agent, fixed rules, better software, a clearer process, or human judgment."
        />
        <ApproachDiagnostic />
      </section>

      <section className="section-shell stop-section">
        <SectionHeading num="03" eyebrow="LIMITS BY DESIGN" title="Knowing when to stop is part of the work." />
        <ul className="stop-list">
          {stopRows.map((r) => (
            <li key={r.title}>
              <NavLink to={r.to}>
                <span className="stop-title">{r.title}</span>
                <span className="stop-copy">{r.copy}</span>
                <ArrowRight size={16} aria-hidden="true" />
              </NavLink>
            </li>
          ))}
        </ul>
        <p className="stop-note">
          These are design principles. Product availability and controls are described with each
          product.
        </p>
      </section>
    </>
  );
}
