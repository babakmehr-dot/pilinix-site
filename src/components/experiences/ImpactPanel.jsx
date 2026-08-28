import React, { useState } from 'react';
import { ChevronDown, Info, TriangleAlert } from 'lucide-react';
import { Chart } from '../charts/Charts.jsx';

/** The impact stage. The number is always shown with the formula that produced
 *  it and a list of what the model deliberately leaves out. */
export default function ImpactPanel({ derived }) {
  const [open, setOpen] = useState(false);
  const { impact, impactApplies, cycle } = derived;

  if (impactApplies === false) {
    return (
      <div className="impact-none">
        <p className="impact-none-head">
          <TriangleAlert size={15} aria-hidden="true" /> No impact figure for this change.
        </p>
        <p>{cycle.impact.note}</p>
      </div>
    );
  }

  return (
    <>
      <div className="impact-headline">
        <span className="micro-label">{impact.headlineLabel}</span>
        <strong key={impact.headline} className="reveal">{impact.headline}</strong>
        <span className={`impact-verdict${impact.material ? ' is-material' : ''}`}>{impact.verdict}</span>
      </div>

      <p className="impact-summary">{impact.summary}</p>
      <p className="impact-test">{impact.test}</p>
      {impactApplies === 'unchanged' && cycle.impact.note && (
        <p className="impact-note-block"><Info size={13} aria-hidden="true" /> {cycle.impact.note}</p>
      )}

      <div className="chart-row">
        <Chart spec={impact.chart} />
        {impact.chart2 && <Chart spec={impact.chart2} />}
      </div>

      <button type="button" className="link-btn" onClick={() => setOpen((v) => !v)} aria-expanded={open} aria-controls="impact-method">
        How this number is produced <ChevronDown size={14} aria-hidden="true" className={open ? 'flip' : ''} />
      </button>
      {open && (
        <div className="impact-method reveal" id="impact-method">
          <h4 className="micro-label">Formula</h4>
          <p>{impact.formula}</p>
          <h4 className="micro-label">Not modelled</h4>
          <ul className="excludes-list">
            {impact.excludes.map((x) => <li key={x}>{x}</li>)}
          </ul>
        </div>
      )}
    </>
  );
}
