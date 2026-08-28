import React from 'react';
import { NavLink, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowRight, Crosshair, Funnel, Radar, RefreshCw, Satellite, ScanLine, ShieldCheck,
} from 'lucide-react';
import CycleExplorer from '../components/experiences/CycleExplorer.jsx';
import { SectionHeading } from '../components/ui/Primitives.jsx';
import { products } from '../data/products.js';
import { findScenario } from '../data/signalScenarios.js';
import { computeImpact } from '../lib/impactModels.js';
import { linkStates } from '../lib/cycleMachine.js';
import { scrollToId, useReducedMotionPref } from '../lib/motion.js';

const method = [
  ['Monitor', 'Observe the environments that matter to one situation — not the whole world.'],
  ['Discover', 'Find the change, rather than waiting to be told about it.'],
  ['Filter', 'Separate what deserves attention from what only deserves a record.'],
  ['Understand', 'Match the change to a specific context, and to evidence that can be checked.'],
  ['Evaluate', 'Estimate how much it moves, with the assumptions on show.'],
  ['Decide', 'Choose the next useful step — including no step at all.'],
  ['Act', 'Prepare what may happen, and require permission where it is due.'],
  ['Verify', 'Check what actually happened. Sent is not done.'],
  ['Update', 'Write the outcome back into context, and keep monitoring.'],
];

/**
 * Hero panel. Shows the beginning of the process — a monitored environment and
 * a signal the system found — using the same data and the same model as the
 * demo below, so the figure can never drift from it.
 */
function HeroCycle() {
  const scenario = findScenario('household-rate');
  const cycle = scenario.cycles[0];
  const assumptions = Object.fromEntries(scenario.assumptions.map((a) => [a.id, a.value]));
  const impact = computeImpact(scenario.impactModel, assumptions, cycle.signal);

  const rows = [
    { icon: Satellite, label: 'Monitoring', value: 'Rate conditions affecting one household' },
    { icon: Radar, label: 'New signal detected', value: cycle.signal.label, tone: 'amber' },
    { icon: Crosshair, label: 'Relevance', value: cycle.relevance.verdict },
    { icon: ScanLine, label: 'Impact', value: `${impact.headline} · ${impact.verdict.toLowerCase()}` },
    { icon: ArrowRight, label: 'Next step', value: 'Ask the lender for fixed-rate options' },
    { icon: ShieldCheck, label: 'Status', value: 'Human approval required', tone: 'amber' },
  ];

  return (
    <div className="hero-cycle" aria-hidden="true">
      <div className="graph-grid" />
      <div className="hero-cycle-top">
        <span className="scenario-tag">Sample environment</span>
        <span className="hero-cycle-day">Scenario day 1</span>
      </div>
      <ul className="hero-cycle-rows">
        {rows.map((r) => {
          const Icon = r.icon;
          return (
            <li key={r.label} className={r.tone ? `tone-${r.tone}` : ''}>
              <Icon size={13} />
              <span className="hcr-label">{r.label}</span>
              <span className="hcr-value">{r.value}</span>
            </li>
          );
        })}
      </ul>
      <p className="hero-cycle-loop">
        <RefreshCw size={12} /> The outcome updates the context, and monitoring continues
      </p>
      <p className="hero-cycle-foot">
        Illustrative data · figure derived from the assumptions shown in the demo · no live monitoring
      </p>
    </div>
  );
}

function ProductCard({ p, i, lead }) {
  const Icon = p.icon;
  return (
    <motion.article
      initial={{ opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ delay: i * 0.07 }}
      whileHover={{ y: -8 }}
      className="product-card"
      style={{ '--accent': p.accent }}
    >
      <div className="product-top">
        <div className="icon-box"><Icon size={21} /></div>
        <span className="status">{p.status}</span>
      </div>
      <div className="product-category">{p.category}</div>
      <h3>{p.name}</h3>
      <blockquote>“{p.question}”</blockquote>
      <p>{lead}</p>
      <NavLink className="text-link" to={`/products/${p.slug}`}>
        Explore {p.name} <ArrowRight size={15} />
      </NavLink>
      <div className="card-glow" />
    </motion.article>
  );
}

const productLead = {
  FAMPAL: 'The Pilinix cycle applied to family life: watching benefits, deadlines, services and local activity, then working out which change affects this household and what it should do next.',
  ARIMENT: 'The Pilinix cycle applied to cross-border decisions: watching programs, criteria, evidence requirements and timing, then comparing each change against one profile.',
};

export default function HomePage() {
  const reduced = useReducedMotionPref();
  const [params] = useSearchParams();
  const requested = params.get('state');
  const linkState = requested && linkStates[requested] ? requested : null;

  const lead = products.filter((p) => ['FAMPAL', 'ARIMENT'].includes(p.name));
  const rest = products.filter((p) => !['FAMPAL', 'ARIMENT'].includes(p.name));

  return (
    <>
      <section className="hero section-shell">
        <div className="hero-copy">
          <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="eyebrow">
            <span className="dot" /> INTELLIGENCE THAT ACTS
          </motion.div>
          <motion.h1
            className="hero-question"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08 }}
          >
            When something changes,<br />
            <span>what happens next?</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.16 }}
            className="lead"
          >
            Pilinix builds intelligent systems that monitor relevant environments, discover
            meaningful change, understand its impact in context, and help move the next
            action forward.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.24 }}
            className="actions"
          >
            <button type="button" className="primary" onClick={() => scrollToId('cycle', reduced)}>
              Explore the intelligence cycle <ArrowRight size={18} />
            </button>
            <NavLink className="ghost" to="/thinking">How Pilinix works</NavLink>
          </motion.div>
        </div>
        <HeroCycle />
        <div className="scroll-cue">SCROLL <span /></div>
      </section>

      <section className="statement section-shell">
        <div className="section-number">01</div>
        <div>
          <div className="eyebrow">WHY PILINIX</div>
          <h2>
            The world changes continuously.<br />
            <span>The same change does not mean the same thing to everyone.</span>
          </h2>
          <p>
            A system is only useful here if it can do the whole job: watch the right
            environment, notice what changed, work out whether it matters to this
            situation, decide what should happen, and then check what actually happened.
          </p>
        </div>
      </section>

      <section className="section-shell cycle-section">
        <SectionHeading
          num="02"
          eyebrow="INTERACTIVE DEMONSTRATION"
          title="From environment to action — and back."
          copy="Pick an environment. The system finds the change, filters it, checks it against a context, and carries the outcome into the next cycle."
        />
        <CycleExplorer linkState={linkState} />
      </section>

      <section className="section-shell method-section">
        <SectionHeading num="03" eyebrow="THE METHOD" title="Nine steps, and the ninth returns to the first." />
        <ol className="method-list">
          {method.map(([name, copy], i) => (
            <li key={name}>
              <span className="method-index">{String(i + 1).padStart(2, '0')}</span>
              <span className="method-name">{name}</span>
              <span className="method-copy">{copy}</span>
            </li>
          ))}
        </ol>
        <p className="method-return">
          <RefreshCw size={14} aria-hidden="true" />
          Update feeds Monitor. Nothing about the loop ends at a recommendation.
        </p>
      </section>

      <section className="section-shell products-home">
        <SectionHeading
          num="04"
          eyebrow="PRODUCTS"
          title="The same cycle, inside a domain."
          copy="Each product runs the loop in its own environment — it does not simply consume signals from somewhere else."
        />
        <div className="product-grid">
          {lead.map((p, i) => <ProductCard key={p.name} p={p} i={i} lead={productLead[p.name]} />)}
        </div>
        <div className="product-more">
          <h3 className="micro-label">Also in the portfolio</h3>
          <ul>
            {rest.map((p) => (
              <li key={p.name}>
                <NavLink to={`/products/${p.slug}`}>
                  <span className="pm-name">{p.name}</span>
                  <span className="pm-cat">{p.category}</span>
                  <span className="pm-status">{p.status}</span>
                  <ArrowRight size={15} aria-hidden="true" />
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="section-shell trust-section">
        <SectionHeading num="05" eyebrow="LIMITS" title="What this example shows — and what it doesn’t." />
        <div className="trust-body">
          <p>
            You watched a system find a change, filter it, weigh it against a context and
            a set of assumptions you could edit, decide, ask for permission, and then
            check what happened. It is a scripted demonstration of how we think the loop
            should behave — not live monitoring, not a live agent, and not a claim about
            performance. Nothing on this page contacts anything.
          </p>
          <div className="trust-links">
            <NavLink className="ghost" to="/lab">Read the design notes <ArrowRight size={16} /></NavLink>
            <NavLink className="ghost" to="/thinking">How Pilinix works <ArrowRight size={16} /></NavLink>
          </div>
        </div>
      </section>

      <section className="section-shell principles">
        <SectionHeading num="06" eyebrow="PRINCIPLES" title="Built around what matters." />
        <div className="principle-grid">
          {[
            'Find the change, don’t wait to be told.',
            'Relevance is decided by context, not by volume.',
            'Evidence before confidence. Name what is missing.',
            'Assumptions are shown, so a number can be argued with.',
            'Not surfacing something is also a decision.',
            'Humans keep control where judgment or trust requires it.',
          ].map((x, i) => (
            <motion.div whileHover={{ y: -5 }} key={x}>
              <span>0{i + 1}</span>
              {x}
            </motion.div>
          ))}
        </div>
      </section>
    </>
  );
}
