import React from 'react';
import { NavLink, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Pause, TriangleAlert } from 'lucide-react';
import ScenarioExplorer from '../components/experiences/ScenarioExplorer.jsx';
import { SectionHeading } from '../components/ui/Primitives.jsx';
import { products } from '../data/products.js';
import { derive, initialState, money } from '../lib/scenarioMachine.js';
import { scenario } from '../data/supplierScenario.js';
import { scrollToId, useReducedMotionPref } from '../lib/motion.js';
import { linkStates } from '../lib/scenarioMachine.js';

const RAIL = ['Signal', 'Context', 'Evidence', 'Decision', 'Action'];

/**
 * Hero panel. Shows the real opening state of the scenario below rather than an
 * ornamental network: the same numbers, the same status.
 */
function HeroState() {
  const snapshot = derive(initialState);
  return (
    <div className="hero-state" aria-hidden="true">
      <div className="graph-grid" />
      <div className="hero-state-top">
        <span className="scenario-tag">Sample scenario</span>
        <span className="state-badge tone-amber size-sm">
          <Pause size={12} /> <span>On hold</span>
        </span>
      </div>
      <p className="hero-state-signal">{scenario.signal}</p>
      <div className="hero-state-impact">
        <span className="micro-label">Potential impact</span>
        <strong>{snapshot.impactLabel}</strong>
        <span className="impact-unit">per month</span>
      </div>
      <dl className="hero-state-facts">
        <div>
          <dt>Unit cost</dt>
          <dd>$10 → $10.80</dd>
        </div>
        <div>
          <dt>Volume</dt>
          <dd>2,000 / month</dd>
        </div>
        <div>
          <dt>Effective</dt>
          <dd>Next month</dd>
        </div>
      </dl>
      <ul className="hero-state-rail">
        {RAIL.map((r, i) => (
          <li key={r} className={i < 3 ? 'is-filled' : i === 3 ? 'is-current' : 'is-blocked'}>
            <span className="rail-dot" />
            {r}
          </li>
        ))}
      </ul>
      <p className="hero-state-line">
        <TriangleAlert size={12} /> Price-lock status unknown — no supplier action is drafted yet.
      </p>
      <p className="hero-state-foot">
        Illustrative data · {money(snapshot.impact)} assumes 2,000 units · no live monitoring
      </p>
    </div>
  );
}

function ProductCard({ p, i }) {
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
      <p>{p.description}</p>
      <NavLink className="text-link" to={`/products/${p.slug}`}>
        Explore {p.name} <ArrowRight size={15} />
      </NavLink>
      <div className="card-glow" />
    </motion.article>
  );
}

export default function HomePage() {
  const reduced = useReducedMotionPref();
  const [params] = useSearchParams();
  const requested = params.get('state');
  const linkState = requested && linkStates[requested] ? requested : null;

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
            Pilinix is an AI product company focused on the decisions that follow a change — what
            matters, what can be verified, and what should happen next.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.24 }}
            className="actions"
          >
            <button type="button" className="primary" onClick={() => scrollToId('scenario', reduced)}>
              Explore a decision <ArrowRight size={18} />
            </button>
            <NavLink className="ghost" to="/thinking">How we think</NavLink>
          </motion.div>
        </div>
        <HeroState />
        <div className="scroll-cue">SCROLL <span /></div>
      </section>

      <section className="statement section-shell">
        <div className="section-number">01</div>
        <div>
          <div className="eyebrow">WHY PILINIX</div>
          <h2>
            AI is useful when it<br />
            <span>changes what happens next.</span>
          </h2>
          <p>
            We build systems that observe context, check evidence, keep state, recommend a next step
            and hold still when the evidence is not there yet.
          </p>
        </div>
      </section>

      <section className="section-shell scenario-section">
        <SectionHeading
          num="02"
          eyebrow="INTERACTIVE EXAMPLE"
          title="Same signal. Different next step."
          copy="A supplier raises prices by 8%. Change the context and see what follows."
        />
        <ScenarioExplorer linkState={linkState} />
      </section>

      <section className="section-shell trust-section">
        <SectionHeading num="03" eyebrow="LIMITS" title="What this example shows — and what it doesn’t." />
        <div className="trust-body">
          <p>
            You changed a fact, inspected a recommendation, and saw where approval matters. This is a
            scripted example of our design approach, not a live agent or a performance claim.
          </p>
          <div className="trust-links">
            <NavLink className="ghost" to="/lab">Read the design notes <ArrowRight size={16} /></NavLink>
            <NavLink className="ghost" to="/products">Explore our products <ArrowRight size={16} /></NavLink>
          </div>
        </div>
      </section>

      <section className="section-shell products-home">
        <SectionHeading
          num="04"
          eyebrow="PRODUCT PORTFOLIO"
          title="Different domains. One operating idea."
          copy="Each product owns a real decision problem — not just a conversation."
        />
        <div className="product-grid">
          {products.map((p, i) => (
            <ProductCard key={p.name} p={p} i={i} />
          ))}
        </div>
      </section>

      <section className="section-shell principles">
        <SectionHeading num="05" eyebrow="PRINCIPLES" title="Built around what matters." />
        <div className="principle-grid">
          {[
            'Advisor, not directory.',
            'AI when useful — not AI for its own sake.',
            'Evidence before confidence.',
            'Context and state matter.',
            'Action is the goal.',
            'Humans stay in control where judgment or trust requires it.',
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
