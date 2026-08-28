import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  ArrowRight, ChevronDown, CircleDot, Crosshair, FileText, Funnel, Layers, RefreshCw,
  Satellite, ScanLine, Send, ShieldCheck, Radar,
} from 'lucide-react';
import ApproachDiagnostic from '../components/experiences/ApproachDiagnostic.jsx';
import { PageHero, SectionHeading } from '../components/ui/Primitives.jsx';

const loopSections = [
  {
    id: 'environments',
    name: 'Relevant environments',
    prompt: 'What is worth watching at all?',
    icon: Satellite,
    body: 'Nobody can monitor everything, and a system that claims to is not describing a real capability. What can be defined is the environment around one goal, case, family or business — the sources where a change would actually alter what that situation should do next. Scope is the first design decision, and it is written down rather than implied.',
    to: '/?state=monitoring',
    linkLabel: 'See a monitored scope',
  },
  {
    id: 'discovery',
    name: 'Signal discovery',
    prompt: 'Who notices first?',
    icon: Radar,
    body: 'A useful system does not wait to be told that something changed. It reads the environment it was given and finds the change itself. That is the difference between a tool you have to remember to ask and one that reaches you when a rule, a rate, a deadline or a program moves.',
    to: '/?state=signal-discovery',
    linkLabel: 'Watch a signal get found',
  },
  {
    id: 'noise',
    name: 'Signal against noise',
    prompt: 'Which changes deserve attention?',
    icon: Funnel,
    body: 'Most of what a monitor sees is a duplicate, a restatement, or something outside the scope of this case. Each item gets a disposition — detected, escalated, monitored, suppressed, ignored — and a reason a person can disagree with. Deciding not to surface something is part of the work, not an omission.',
    to: '/?state=filtering',
    linkLabel: 'Inspect what was filtered out',
  },
  {
    id: 'context',
    name: 'Context',
    prompt: 'Whose situation does this touch?',
    icon: Layers,
    body: 'The same rate change means one thing to a household with a variable mortgage and nothing at all to a household without one. Context is what makes a change relevant, and it persists: it is not re-explained every session, and it grows as cycles complete.',
    to: '/?state=context',
    linkLabel: 'See context matching',
  },
  {
    id: 'evidence',
    name: 'Evidence',
    prompt: 'What supports this, and what is missing?',
    icon: FileText,
    body: 'Every source is shown with its excerpt, its effective date and when it was last checked, and labelled by strength rather than scored. Missing and stale evidence are named explicitly, because a gap that decides the answer is more useful to see than a confident number built on top of it.',
    to: '/?state=missing-evidence',
    linkLabel: 'See a gap that decides the answer',
  },
  {
    id: 'impact',
    name: 'Impact',
    prompt: 'How much does it actually move?',
    icon: ScanLine,
    body: 'A figure is only worth showing with the formula that produced it, the assumptions it rests on, and a list of what it does not model. Change an assumption and the estimate changes in front of you. There are no probabilities and no forecasts here, because neither would be supported by the inputs.',
    to: '/?state=assumptions',
    linkLabel: 'Change an assumption',
  },
  {
    id: 'decision',
    name: 'Decision',
    prompt: 'What is the next useful step?',
    icon: CircleDot,
    body: 'A decision is a choice between named options, including doing nothing. Recording why an option was not taken is what lets the reasoning be revisited later, when the facts have moved. Holding is a legitimate outcome and is written down like any other.',
    to: '/?state=decision',
    linkLabel: 'See a decision not to act',
  },
  {
    id: 'permission',
    name: 'Permission',
    prompt: 'Who approves what, exactly?',
    icon: ShieldCheck,
    body: 'Where an action reaches outside the system, the exact action is shown before anyone approves it — destination, content, and what it does and does not commit to. An approval covers that version and nothing else. Change a material input afterwards and the approval is invalidated rather than carried forward.',
    to: '/?state=permission',
    linkLabel: 'Approve or reject an action',
  },
  {
    id: 'action',
    name: 'Action',
    prompt: 'What does the system actually do?',
    icon: Send,
    body: 'The architecture is meant to continue into action: preparing, sending, scheduling, submitting, updating, following up. On this site every action is simulated and nothing leaves your browser. Where a real product performs any of these, that is described on the product, not implied here.',
    to: '/?state=permission',
    linkLabel: 'See an exact action preview',
  },
  {
    id: 'verify',
    name: 'Outcome verification',
    prompt: 'What actually happened?',
    icon: Crosshair,
    body: 'Prepared, approved, sent, delivery unconfirmed, confirmed and completed are separate states, and a timeout collapses into none of them. Sent is not done, delivered is not accepted, and a system that reports otherwise is reporting its own activity rather than a result.',
    to: '/?state=unconfirmed',
    linkLabel: 'See an unconfirmed outcome',
  },
  {
    id: 'continuous',
    name: 'Continuous monitoring',
    prompt: 'What does the next cycle know?',
    icon: RefreshCw,
    body: 'The verified outcome is written back into context, and monitoring resumes with it in place. That is what makes this a loop rather than a funnel: the next signal is evaluated against a situation that now includes what the last one produced.',
    to: '/?state=closed-loop',
    linkLabel: 'Watch the loop close',
  },
];

const stopRows = [
  { title: 'Missing evidence', copy: 'Say what is missing before recommending a consequential step.', to: '/?state=missing-evidence' },
  { title: 'Nothing worth interrupting for', copy: 'A duplicate is still an event. It is recorded, not announced.', to: '/?state=filtering' },
  { title: 'Changed context', copy: 'Revisit the recommendation instead of defending it.', to: '/?state=superseded' },
  { title: 'Permission required', copy: 'Show the exact action for review before it happens.', to: '/?state=permission' },
  { title: 'Unconfirmed outcome', copy: 'Do not call it done.', to: '/?state=unconfirmed' },
];

function LoopRow({ section, open, onToggle }) {
  const Icon = section.icon;
  return (
    <li className={`stage-row${open ? ' is-open' : ''}`}>
      <button type="button" onClick={onToggle} aria-expanded={open} aria-controls={`sec-${section.id}`}>
        <span className="stage-icon"><Icon size={16} aria-hidden="true" /></span>
        <span className="stage-name">{section.name}</span>
        <span className="stage-prompt">{section.prompt}</span>
        <ChevronDown size={16} aria-hidden="true" className={open ? 'flip' : ''} />
      </button>
      {open && (
        <div id={`sec-${section.id}`} className="stage-body reveal">
          <p>{section.body}</p>
          <NavLink to={section.to} className="text-link">
            {section.linkLabel} <ArrowRight size={14} />
          </NavLink>
        </div>
      )}
    </li>
  );
}

export default function ThinkingPage() {
  const [open, setOpen] = useState('environments');

  return (
    <>
      <PageHero
        eyebrow="HOW PILINIX WORKS"
        title="A decision needs more than an answer."
        copy="A useful system needs an environment worth watching, a change worth noticing, a context to judge it against, evidence it can check, and clear limits on what it may do next."
      />

      <section className="section-shell stages-section">
        <ul className="stage-list">
          {loopSections.map((s) => (
            <LoopRow key={s.id} section={s} open={open === s.id} onToggle={() => setOpen(open === s.id ? null : s.id)} />
          ))}
        </ul>
        <div className="stage-check">
          <h3>And then it starts again.</h3>
          <p>
            A proposed action is not a completed one, and a completed one is not the end.
            New information changes the decision, and the loop is what makes that
            survivable rather than embarrassing.
          </p>
          <NavLink to="/?state=closed-loop" className="text-link">
            Watch a cycle close and reopen <ArrowRight size={14} />
          </NavLink>
        </div>
      </section>

      <section className="section-shell diagnostic-section">
        <SectionHeading
          num="02"
          eyebrow="A RULE-BASED GUIDE"
          title="Should AI be here?"
          copy="Describe how the work behaves. Explore whether it needs an agent, assistance, fixed rules, better software, a clearer process, a mixed system, or human judgment."
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
          These are design principles. Product availability and controls are described with
          each product.
        </p>
      </section>
    </>
  );
}
