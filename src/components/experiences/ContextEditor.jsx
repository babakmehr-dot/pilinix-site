import React from 'react';
import { SlidersHorizontal } from 'lucide-react';
import { contextChoices, scenario } from '../../data/supplierScenario.js';
import { money, monthlyImpact, units } from '../../lib/scenarioMachine.js';
import { FactCard } from '../ui/Primitives.jsx';

const { volumeMin, volumeMax, volumeStep, defaultVolume } = scenario.facts;
const volumePresets = [defaultVolume, 1500, 1200, 800];

export default function ContextEditor({ state, derived, dispatch, fieldsetRef }) {
  return (
    <section className="ctx-editor panel" aria-labelledby="ctx-editor-title">
      <header className="panel-head">
        <SlidersHorizontal size={15} aria-hidden="true" />
        <h3 id="ctx-editor-title">Change the context</h3>
      </header>

      <fieldset className="ctx-fieldset" ref={fieldsetRef} tabIndex={-1}>
        <legend>Price-lock and notice status</legend>
        <div className="ctx-options">
          {contextChoices.map((choice) => (
            <label key={choice.key} className={`ctx-option${state.contextKey === choice.key ? ' is-active' : ''}`}>
              <input
                type="radio"
                name="context-choice"
                value={choice.key}
                checked={state.contextKey === choice.key}
                onChange={() => dispatch({ type: 'SET_CONTEXT', key: choice.key })}
              />
              <span className="ctx-option-body">
                <span className="ctx-option-label">{choice.label}</span>
                <span className="ctx-option-hint">{choice.hint}</span>
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      <div className="ctx-volume">
        <label htmlFor="volume-range">
          Expected volume
          <output htmlFor="volume-range">{units(state.volume)} units / month</output>
        </label>
        <input
          id="volume-range"
          type="range"
          min={volumeMin}
          max={volumeMax}
          step={volumeStep}
          value={state.volume}
          onChange={(e) => dispatch({ type: 'SET_VOLUME', volume: Number(e.target.value) })}
          aria-describedby="volume-help"
        />
        <div className="ctx-presets">
          {volumePresets.map((v) => (
            <button
              key={v}
              type="button"
              className={`chip${state.volume === v ? ' is-active' : ''}`}
              onClick={() => dispatch({ type: 'SET_VOLUME', volume: v })}
              aria-pressed={state.volume === v}
            >
              {units(v)}
            </button>
          ))}
        </div>
        <p id="volume-help" className="ctx-help">
          {money(monthlyImpact(state.volume))} per month at {units(state.volume)} units. Arithmetic, not a model output.
        </p>
      </div>

      <div className="ctx-facts">
        <h4 className="micro-label">Current context</h4>
        <div className="fact-grid">
          {derived.contextFacts.map((f) => (
            <FactCard key={f.label} {...f} />
          ))}
        </div>
      </div>
    </section>
  );
}
