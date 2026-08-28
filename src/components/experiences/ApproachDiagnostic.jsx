import React, { useEffect, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, Info, ListChecks, RotateCcw } from 'lucide-react';
import { evaluate, example, questions } from '../../data/diagnosticRules.js';
import { Disclosure } from '../ui/Primitives.jsx';
import { useReducedMotionPref } from '../../lib/motion.js';

const DISCLOSURE =
  'This is a rule-based guide, not a technical assessment of your business. No sign-up required.';

export default function ApproachDiagnostic() {
  const reduced = useReducedMotionPref();
  const [phase, setPhase] = useState('intro'); // intro | asking | applying | result
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const headingRef = useRef(null);
  const resultRef = useRef(null);

  const question = questions[step];
  const current = answers[question?.id];
  const result = phase === 'result' ? evaluate(answers) : null;

  useEffect(() => {
    if (phase === 'asking' && headingRef.current) headingRef.current.focus();
  }, [phase, step]);

  useEffect(() => {
    if (phase === 'result' && resultRef.current) resultRef.current.focus();
  }, [phase]);

  useEffect(() => {
    if (phase !== 'applying') return undefined;
    const ms = reduced ? 0 : 420;
    const t = window.setTimeout(() => setPhase('result'), ms);
    return () => window.clearTimeout(t);
  }, [phase, reduced]);

  const start = () => {
    setAnswers({});
    setStep(0);
    setPhase('asking');
  };

  const runExample = () => {
    setAnswers(example.answers);
    setStep(questions.length - 1);
    setPhase('applying');
  };

  const next = () => {
    if (step < questions.length - 1) setStep(step + 1);
    else setPhase('applying');
  };

  return (
    <div className="diagnostic panel">
      <div key={phase === 'asking' ? `q-${step}` : phase} className="reveal">
        {phase === 'intro' && (
          <div className="diag-intro">
            <p className="diag-lead">
              Five questions about how the work behaves. The answer is produced by fixed rules you
              can read, and the rule that matched is shown with the result.
            </p>
            <div className="diag-actions">
              <button type="button" className="primary" onClick={start}>
                Start the check <ArrowRight size={16} aria-hidden="true" />
              </button>
              <button type="button" className="ghost" onClick={runExample}>
                Try an example
              </button>
            </div>
            <p className="diag-example-note">
              The example uses one case from this site: {example.label.toLowerCase()}.
            </p>
            <Disclosure>{DISCLOSURE}</Disclosure>
          </div>
        )}

        {phase === 'asking' && (
          <div>
            <div className="diag-progress">
              <span className="micro-label">
                Question {step + 1} of {questions.length}
              </span>
              <div className="diag-bar" aria-hidden="true">
                {questions.map((q, i) => (
                  <span key={q.id} className={i <= step ? 'is-done' : ''} />
                ))}
              </div>
            </div>
            <fieldset className="diag-fieldset">
              <legend ref={headingRef} tabIndex={-1}>
                {question.text}
              </legend>
              <div className="diag-options">
                {question.options.map((o) => (
                  <label key={o.value} className={`diag-option${current === o.value ? ' is-active' : ''}`}>
                    <input
                      type="radio"
                      name={question.id}
                      value={o.value}
                      checked={current === o.value}
                      onChange={() => setAnswers((a) => ({ ...a, [question.id]: o.value }))}
                    />
                    <span>{o.label}</span>
                  </label>
                ))}
              </div>
            </fieldset>
            <div className="diag-actions">
              <button
                type="button"
                className="ghost sm"
                onClick={() => (step === 0 ? setPhase('intro') : setStep(step - 1))}
              >
                <ArrowLeft size={15} aria-hidden="true" /> Back
              </button>
              <button type="button" className="primary sm" onClick={next} disabled={!current}>
                {step === questions.length - 1 ? 'See the result' : 'Next'}
                <ArrowRight size={15} aria-hidden="true" />
              </button>
            </div>
          </div>
        )}

        {phase === 'applying' && (
          <p className="diag-applying" role="status">
            <ListChecks size={15} aria-hidden="true" /> Applying the rules to your answers…
          </p>
        )}

        {phase === 'result' && result && (
          <div className="diag-result" style={{ '--accent': result.accent }}>
            <div className="diag-result-head">
              <span className="micro-label">Result</span>
              <h3 ref={resultRef} tabIndex={-1}>
                {result.baseTitle}
              </h3>
              {result.mixed && <p className="diag-mixed">…{result.mixed}.</p>}
            </div>

            <dl className="diag-detail">
              <div>
                <dt>Why</dt>
                <dd>{result.why}</dd>
              </div>
              <div>
                <dt>What would change this result?</dt>
                <dd>{result.change}</dd>
              </div>
              <div>
                <dt>What to do next</dt>
                <dd>{result.next}</dd>
              </div>
              <div>
                <dt>Limitation</dt>
                <dd>{result.limitation}</dd>
              </div>
            </dl>

            <p className="diag-rule">
              <Info size={13} aria-hidden="true" /> Rule applied: {result.ruleLabel}. No scoring, no
              percentages — the same answers always produce the same result.
            </p>

            <div className="diag-actions">
              <button
                type="button"
                className="ghost sm"
                onClick={() => {
                  setPhase('asking');
                  setStep(questions.length - 1);
                }}
              >
                <ArrowLeft size={15} aria-hidden="true" /> Change an answer
              </button>
              <button type="button" className="ghost sm" onClick={() => setPhase('intro')}>
                <RotateCcw size={15} aria-hidden="true" /> Start over
              </button>
            </div>
            <Disclosure>{DISCLOSURE}</Disclosure>
          </div>
        )}
      </div>
    </div>
  );
}
