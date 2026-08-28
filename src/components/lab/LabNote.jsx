import React from 'react';
import { NavLink } from 'react-router-dom';
import { ArrowLeft, ArrowUpRight, Calendar, Link2, TriangleAlert } from 'lucide-react';
import { categories } from '../../data/labNotes.js';

export default function LabNote({ note }) {
  const category = categories.find((c) => c.id === note.category);

  return (
    <article className="note-article section-shell">
      <NavLink to="/lab" className="back-link">
        <ArrowLeft size={15} aria-hidden="true" /> All notes
      </NavLink>

      <header className="note-hero">
        <div className="eyebrow">{category ? category.name.toUpperCase() : 'PILINIX LAB'}</div>
        <h1>{note.title}</h1>
        <p className="note-question-lead">{note.question}</p>
        <dl className="note-meta">
          <div>
            <dt>Status</dt>
            <dd>{note.status}</dd>
          </div>
          <div>
            <dt>Published</dt>
            <dd>
              <Calendar size={12} aria-hidden="true" /> {note.published}
            </dd>
          </div>
          <div>
            <dt>Next review</dt>
            <dd>
              <Calendar size={12} aria-hidden="true" /> {note.review}
            </dd>
          </div>
        </dl>
      </header>

      <div className="note-body">
        <section>
          <h2 className="micro-label">Design choice</h2>
          <p>{note.designChoice}</p>
        </section>

        <section>
          <h2 className="micro-label">Example</h2>
          <p>{note.body}</p>
        </section>

        <section>
          <h2 className="micro-label">Sources</h2>
          <p className="note-source-intro">
            The evidence for this note is the interactive example on this site. Nothing here is drawn
            from a production deployment.
          </p>
          <ul className="note-sources">
            {note.sources.map((s) => (
              <li key={s.to}>
                <NavLink to={s.to}>
                  <Link2 size={14} aria-hidden="true" />
                  {s.label}
                  <ArrowUpRight size={14} aria-hidden="true" />
                </NavLink>
              </li>
            ))}
          </ul>
        </section>

        <section className="note-limitation">
          <h2 className="micro-label">Limitation</h2>
          <p>
            <TriangleAlert size={14} aria-hidden="true" /> {note.limitation}
          </p>
        </section>
      </div>
    </article>
  );
}
