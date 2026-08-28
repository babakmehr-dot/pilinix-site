import React, { useId } from 'react';
import { money, num, round } from '../../lib/impactModels.js';

// ---------------------------------------------------------------------------
// Three small chart types. Each one answers a question the surrounding text
// asks. Every value is passed in from an impact model — nothing is generated
// here. Each chart carries a text alternative for screen readers.
// ---------------------------------------------------------------------------

const fmt = (v, unit) => (unit && unit.startsWith('$') ? money(v) : num(round(v, 1)));

function Figure({ caption, summary, children }) {
  return (
    <figure className="chart">
      {children}
      <figcaption>{caption}</figcaption>
      <p className="sr-only">{summary}</p>
    </figure>
  );
}

/** Horizontal bars. Long labels and narrow screens both survive this. */
export function CompareBars({ bars, unit, caption }) {
  const max = Math.max(...bars.map((b) => b.value)) || 1;
  const summary = bars.map((b) => `${b.label}: ${fmt(b.value, unit)}`).join('. ');
  return (
    <Figure caption={caption} summary={summary}>
      <div className="bars" role="img" aria-label={summary}>
        {bars.map((b) => (
          <div className="bar-row" key={b.label}>
            <span className="bar-label">{b.label}</span>
            <span className="bar-track">
              <span
                className={`bar-fill${b.tone ? ` tone-${b.tone}` : ''}`}
                style={{ width: `${Math.max(2, (b.value / max) * 100)}%` }}
              />
            </span>
            <span className="bar-value">{fmt(b.value, unit)}</span>
          </div>
        ))}
      </div>
      {unit && <p className="chart-unit">{unit}</p>}
    </Figure>
  );
}

/** One segmented bar for counts of a fixed total. */
export function StatusBar({ segments, caption }) {
  const total = segments.reduce((s, x) => s + x.value, 0) || 1;
  const summary = segments.map((s) => `${s.value} ${s.label.toLowerCase()}`).join(', ');
  return (
    <Figure caption={caption} summary={summary}>
      <div className="status-bar" role="img" aria-label={summary}>
        {segments
          .filter((s) => s.value > 0)
          .map((s) => (
            <span
              key={s.label}
              className={`status-seg tone-${s.tone}`}
              style={{ width: `${(s.value / total) * 100}%` }}
            />
          ))}
      </div>
      <ul className="status-legend">
        {segments.map((s) => (
          <li key={s.label} className={`tone-${s.tone}`}>
            <span className="legend-dot" aria-hidden="true" />
            {s.label}: <b>{s.value}</b>
          </li>
        ))}
      </ul>
    </Figure>
  );
}

/** Line with optional horizontal reference lines and x-axis markers. */
export function TrendChart({ points, lines = [], markers = [], unit, xLabel, caption }) {
  const uid = useId().replace(/:/g, '');
  const W = 320;
  const H = 150;
  const PL = 40;
  const PR = 10;
  const PT = 12;
  const PB = 26;

  const xs = points.map((p) => p.x);
  const ys = points.map((p) => p.y).concat(lines.map((l) => l.y));
  const xMin = Math.min(...xs);
  const xMax = Math.max(...xs);
  const yMin = Math.min(...ys);
  const yMax = Math.max(...ys);
  const pad = (yMax - yMin) * 0.15 || 1;
  const y0 = yMin - pad;
  const y1 = yMax + pad;

  const sx = (x) => PL + ((x - xMin) / (xMax - xMin || 1)) * (W - PL - PR);
  const sy = (y) => PT + (1 - (y - y0) / (y1 - y0 || 1)) * (H - PT - PB);

  const path = points.map((p, i) => `${i ? 'L' : 'M'} ${round(sx(p.x), 1)} ${round(sy(p.y), 1)}`).join(' ');
  const topLine = lines.length ? Math.max(...lines.map((l) => l.y)) : null;

  const summary = `${caption} Values from ${fmt(points[0].y, unit)} to ${fmt(points[points.length - 1].y, unit)}${
    lines.length ? `, against ${lines.map((l) => `${l.label} ${fmt(l.y, unit)}`).join(' and ')}` : ''
  }.`;

  return (
    <Figure caption={caption} summary={summary}>
      <svg viewBox={`0 0 ${W} ${H}`} className="trend" role="img" aria-label={summary} preserveAspectRatio="xMidYMid meet">
        <defs>
          <linearGradient id={`g-${uid}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--ok)" stopOpacity="0.22" />
            <stop offset="100%" stopColor="var(--ok)" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* y axis bounds */}
        <text className="axis" x="4" y={sy(y1) + 10}>{fmt(y1, unit)}</text>
        <text className="axis" x="4" y={sy(y0)}>{fmt(y0, unit)}</text>

        {lines.map((l) => (
          <g key={l.label}>
            <line
              className={`ref-line${l.tone ? ` tone-${l.tone}` : ''}`}
              x1={PL} x2={W - PR} y1={sy(l.y)} y2={sy(l.y)}
            />
            <text className={`ref-label${l.tone ? ` tone-${l.tone}` : ''}`} x={W - PR} y={sy(l.y) - 4} textAnchor="end">
              {l.label}
            </text>
          </g>
        ))}

        <path className="trend-area" d={`${path} L ${round(sx(xMax), 1)} ${H - PB} L ${round(sx(xMin), 1)} ${H - PB} Z`} fill={`url(#g-${uid})`} />
        <path className="trend-line" d={path} />

        {points.map((p) => (
          <circle
            key={p.x}
            className={`trend-dot${topLine !== null && p.y > topLine ? ' is-above' : ''}`}
            cx={sx(p.x)} cy={sy(p.y)} r={topLine !== null && p.y > topLine ? 3.4 : 2.2}
          />
        ))}

        {markers.map((mk) => (
          <g key={mk.label}>
            <line className={`marker-line${mk.tone ? ` tone-${mk.tone}` : ''}`} x1={sx(mk.x)} x2={sx(mk.x)} y1={PT} y2={H - PB} />
            <text className={`marker-label${mk.tone ? ` tone-${mk.tone}` : ''}`} x={sx(mk.x)} y={H - PB + 12} textAnchor="middle">
              {mk.label}
            </text>
          </g>
        ))}

        {!markers.length && (
          <>
            <text className="axis" x={PL} y={H - 6}>{xs[0]}</text>
            <text className="axis" x={W - PR} y={H - 6} textAnchor="end">{xs[xs.length - 1]}</text>
          </>
        )}
        {xLabel && <text className="axis-label" x={(PL + W - PR) / 2} y={H - 6} textAnchor="middle">{xLabel}</text>}
      </svg>
    </Figure>
  );
}

export function Chart({ spec }) {
  if (!spec) return null;
  if (spec.type === 'compare') return <CompareBars {...spec} />;
  if (spec.type === 'status') return <StatusBar {...spec} />;
  if (spec.type === 'trend') return <TrendChart {...spec} />;
  return null;
}
