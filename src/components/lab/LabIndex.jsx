import React from 'react';
import { NavLink } from 'react-router-dom';
import { ArrowRight, Calendar } from 'lucide-react';
import { categories, labNotes } from '../../data/labNotes.js';

export default function LabIndex() {
  const populated = categories.filter((c) => labNotes.some((n) => n.category === c.id));

  return (
    <div className="lab-index" id="notes">
      {populated.map((cat) => (
        <section key={cat.id} className="lab-cat" aria-labelledby={`cat-${cat.id}`}>
          <h3 className="micro-label" id={`cat-${cat.id}`}>
            {cat.name}
          </h3>
          <ul className="note-list">
            {labNotes
              .filter((n) => n.category === cat.id)
              .map((note) => (
                <li key={note.slug}>
                  <NavLink to={`/lab/${note.slug}`} className="note-card">
                    <h4>{note.title}</h4>
                    <p className="note-question">{note.question}</p>
                    <footer>
                      <span className="note-status">{note.status.replace('.', '')}</span>
                      <span className="note-date">
                        <Calendar size={12} aria-hidden="true" /> {note.published}
                      </span>
                      <span className="note-go">
                        Read <ArrowRight size={14} aria-hidden="true" />
                      </span>
                    </footer>
                  </NavLink>
                </li>
              ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
