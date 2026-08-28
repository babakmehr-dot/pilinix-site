import React from 'react';
import { NavLink, useParams } from 'react-router-dom';
import { ArrowRight, Radar } from 'lucide-react';
import LabIndex from '../components/lab/LabIndex.jsx';
import LabNote from '../components/lab/LabNote.jsx';
import { PageHero } from '../components/ui/Primitives.jsx';
import { findNote } from '../data/labNotes.js';
import { scrollToId, useReducedMotionPref } from '../lib/motion.js';

export function LabPage() {
  const reduced = useReducedMotionPref();
  return (
    <>
      <PageHero
        eyebrow="PILINIX LAB"
        title="Practical questions behind useful AI."
        copy="Short notes on context, evidence, decisions and control. Each note separates the design idea from what has been tested."
      />
      <section className="section-shell lab-cta">
        <button type="button" className="primary" onClick={() => scrollToId('notes', reduced)}>
          Browse notes <ArrowRight size={17} />
        </button>
      </section>

      <section className="section-shell lab-notes-section">
        <LabIndex />
      </section>

      <section className="section-shell lab-method">
        <div>
          <div className="eyebrow">R&amp;D FILTER</div>
          <h2>Not every AI idea deserves to become a product.</h2>
          <p>
            We look for problems where a persistent system can do materially more than a
            general-purpose model in a single conversation.
          </p>
        </div>
        <div className="lab-criteria">
          {[
            'A real recurring or trigger-based need',
            'Context that must persist over time',
            'External or specialized information',
            'A decision or workflow to own',
            'A measurable benefit: time, money, access or risk',
            'A reason the product remains useful after the first answer',
          ].map((x, i) => (
            <div key={x}>
              <span>{String(i + 1).padStart(2, '0')}</span>
              <p>{x}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="section-shell lab-note-band">
        <Radar />
        <div>
          <div className="eyebrow">CURRENT EXPLORATION</div>
          <h2>Research stays broad. Products stay focused.</h2>
          <p>
            The Lab can investigate many domains, but a product only moves forward when the problem,
            user, workflow and reason to exist are clear.
          </p>
        </div>
      </section>
    </>
  );
}

export function LabNotePage() {
  const { slug } = useParams();
  const note = findNote(slug);
  if (!note) {
    return (
      <>
        <PageHero eyebrow="PILINIX LAB" title="Note not found." copy="Return to the note index." />
        <section className="section-shell lab-cta">
          <NavLink className="ghost" to="/lab">All notes</NavLink>
        </section>
      </>
    );
  }
  return (
    <section className="note-page">
      <LabNote note={note} />
    </section>
  );
}
