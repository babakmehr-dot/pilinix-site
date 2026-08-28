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
        <motion.h1 {...rise(0)}>Real decisions rarely live inside a prompt.</motion.h1>
        <motion.p className="about-lead" {...rise(0.08)}>
          They depend on circumstances, evidence, timing, and the consequences of being wrong.
        </motion.p>
        <ul className="about-pillars">
          {pillars.map((p, i) => (
            <motion.li key={p} {...rise(0.14 + i * 0.05)}>
              {p}
            </motion.li>
          ))}
        </ul>
      </section>

      <section className="section-shell about-body">
        <motion.p {...rise(0)}>
          Pilinix is an AI product company exploring how those pieces can work together. Our interests
          span family life, business decisions, and cross-border opportunities.
        </motion.p>
        <motion.p {...rise(0.06)}>
          We start with a situation people need to handle. Then we ask what a system should notice,
          what it should verify, and what should remain under human control.
        </motion.p>
        <motion.p className="about-closing" {...rise(0.12)}>
          Pilinix builds for that gap.
        </motion.p>
      </section>

      <section className="section-shell name-origin-quiet">
        <div className="eyebrow">THE NAME</div>
        <p>
          <strong>PILINIX</strong> — Platform Intelligence Layer for Integrated Network Infrastructure
          and eXecution. It is first and foremost the name of the company.
        </p>
      </section>
    </>
  );
}
