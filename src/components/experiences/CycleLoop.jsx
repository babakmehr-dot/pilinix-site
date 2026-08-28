import React from 'react';
import { CornerDownLeft } from 'lucide-react';
import { STAGES } from '../../lib/cycleMachine.js';

/**
 * The cycle rail. Ten stages, with a return path drawn back to the start so the
 * shape reads as a loop rather than a funnel. Stages already reached are
 * buttons the visitor can go back to; stages ahead are not yet available.
 */
export default function CycleLoop({ reached, active, onSelect, cycleNumber }) {
  return (
    <nav className="cycle-rail" aria-label={`Cycle ${cycleNumber} stages`}>
      <ol>
        {STAGES.map((stage, i) => {
          const state = i < reached ? 'done' : i === reached ? 'current' : 'ahead';
          const available = i <= reached;
          return (
            <li key={stage.id} className={`rail-item is-${state}${i === active ? ' is-active' : ''}`}>
              <button
                type="button"
                onClick={() => onSelect(i)}
                disabled={!available}
                aria-current={i === active ? 'step' : undefined}
                aria-label={`${stage.label}: ${stage.question}${available ? '' : ' — not reached yet'}`}
              >
                <span className="rail-dot" aria-hidden="true" />
                <span className="rail-label">{stage.label}</span>
              </button>
            </li>
          );
        })}
      </ol>
      <p className="rail-return">
        <CornerDownLeft size={13} aria-hidden="true" />
        The verified outcome becomes context, and monitoring continues
      </p>
    </nav>
  );
}
