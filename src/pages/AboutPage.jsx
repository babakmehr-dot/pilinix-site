import React from 'react';
import { motion } from 'framer-motion';
import { useReducedMotionPref } from '../lib/motion.js';

const pillars = ['Circumstances', 'Evidence', 'Timing', 'Consequences'];

export default function AboutPage() {
  const reduced = useReducedMotionPref();
  const rise = (delay) => ({
    initial: reduced ? false : { opacity: 0, y: 14 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.4 },
    transition: { duration: reduced ? 0 : 0.4, delay: reduced ? 0 : delay },
  });

  return (
    <>
      <section className="about-hero section-shell">
        <div className="eyebrow">ABOUT PILINIX</div>
        <motion.h1 {...rise(0)}>The world changes continuously.</motion.h1>
        <motion.p className="about-lead" {...rise(0.08)}>
          But the same change does not mean the same thing to everyone.
        </motion.p>
        <ul className="about-pillars">
          {pillars.map((p, i) => (
            <motion.li key={p} {...rise(0.14 + i * 0.05)}>{p}</motion.li>
          ))}
        </ul>
      </section>

      <section className="section-shell about-body">
        <motion.p {...rise(0)}>
          Real decisions rarely live inside a prompt. They depend on circumstances,
          evidence, timing, and the consequences of being wrong.
        </motion.p>
        <motion.p {...rise(0.05)}>
          Pilinix builds intelligent systems that connect external change to real context,
          evidence, decisions and action. Our interests span family life, business
          decisions, and cross-border opportunities.
        </motion.p>
        <motion.p {...rise(0.1)}>
          We are interested in the full cycle: what changed, who it matters to, what it
          means, what should happen next, and what happened after the action. We start
          with a situation people need to handle, then ask what a system should notice,
          what it should verify, and what should remain under human control.
        </motion.p>
        <motion.p className="about-closing" {...rise(0.15)}>
          Pilinix builds for that loop.
        </motion.p>
      </section>

      <section className="section-shell name-origin-quiet">
        <div className="eyebrow">THE NAME</div>
        <p>
          <strong>PILINIX</strong> — Platform Intelligence Layer for Integrated Network
          Infrastructure and eXecution. It is first and foremost the name of the company.
        </p>
      </section>
    </>
  );
}
