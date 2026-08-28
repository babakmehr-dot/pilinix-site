// ---------------------------------------------------------------------------
// Impact models.
//
// Every number shown in the demo comes from one of these functions. Each model
// declares its inputs, its formula in plain language, and what it does NOT
// model. No probabilities, no forecasts, no scores — if a value cannot be
// derived from a visible input it is not shown.
// ---------------------------------------------------------------------------

export const round = (n, dp = 2) => {
  const f = 10 ** dp;
  return Math.round(n * f) / f;
};

export const money = (n, dp = 0) =>
  '$' + Number(n).toLocaleString('en-US', { minimumFractionDigits: dp, maximumFractionDigits: dp });

export const num = (n) => Number(n).toLocaleString('en-US');
export const pct = (n, dp = 2) => `${round(n * 100, dp)}%`;

/** Standard amortising payment. i = monthly rate, n = number of payments. */
function amortisedPayment(balance, annualRate, years) {
  const i = annualRate / 12;
  const n = Math.round(years * 12);
  if (i === 0) return balance / n;
  return (balance * i) / (1 - (1 + i) ** -n);
}

export const impactModels = {
  // 1 — Economy: a variable-rate mortgage payment moves with the lender rate.
  'mortgage-payment': {
    formula:
      'Monthly payment = B × i ÷ (1 − (1 + i)^−n), where B is the balance, i the monthly rate and n the remaining payments. Applied at the old rate and the new rate; the difference is the impact.',
    excludes: [
      'Property tax, insurance and any fees',
      'Whether the lender adjusts the payment or the amortisation',
      'Any future rate decision',
    ],
    compute(a, signal) {
      const before = amortisedPayment(a.balance, signal.oldRate, a.years);
      const after = amortisedPayment(a.balance, signal.newRate, a.years);
      const delta = after - before;
      return {
        before: round(before),
        after: round(after),
        delta: round(delta),
        material: delta >= a.reviewThreshold,
        headline: `${money(Math.abs(delta))} per month`,
        headlineLabel: delta >= 0 ? 'Estimated increase' : 'Estimated decrease',
        summary: `${money(before)} → ${money(after)} per month at ${num(a.balance / 1000)}k over ${a.years} years.`,
        test: `Your review threshold is ${money(a.reviewThreshold)} per month.`,
        verdict: delta >= a.reviewThreshold ? 'Above the review threshold' : 'Below the review threshold',
        chart: {
          type: 'compare',
          unit: '$/month',
          bars: [
            { label: `Current (${pct(signal.oldRate)})`, value: round(before) },
            { label: `New (${pct(signal.newRate)})`, value: round(after), tone: 'amber' },
          ],
          caption: `Payment on ${money(a.balance)} over ${a.years} years.`,
        },
        chart2: {
          type: 'trend',
          unit: '$/month',
          xLabel: 'Annual rate',
          points: Array.from({ length: 11 }, (_, k) => {
            const rate = 0.05 + k * 0.0025;
            return { x: round(rate * 100, 2), y: round(amortisedPayment(a.balance, rate, a.years)) };
          }),
          markers: [
            { x: round(signal.oldRate * 100, 2), label: 'Old rate' },
            { x: round(signal.newRate * 100, 2), label: 'New rate', tone: 'amber' },
          ],
          caption: 'Payment across the rate range, at the same balance and amortisation.',
        },
      };
    },
  },

  // 2 — Policy: household income against a changed eligibility threshold.
  'benefit-threshold': {
    formula:
      'Compare household net income with the income threshold before and after the change. The gap is income − threshold. Eligibility for the full amount holds while income is at or below the threshold.',
    excludes: [
      'The benefit amount itself, which depends on rules not modelled here',
      'Partial or phased-out entitlement',
      'Any provincial or municipal top-up',
    ],
    compute(a, signal) {
      const gapOld = a.income - signal.oldThreshold;
      const gapNew = a.income - signal.newThreshold;
      const wasEligible = gapOld <= 0;
      const nowEligible = gapNew <= 0;
      return {
        before: signal.oldThreshold,
        after: signal.newThreshold,
        delta: gapNew,
        material: wasEligible !== nowEligible,
        headline: nowEligible ? 'Still at or below the new threshold' : `${money(Math.abs(gapNew))} above the new threshold`,
        headlineLabel: 'Position against the threshold',
        summary: `Household net income ${money(a.income)}. Threshold moved ${money(signal.oldThreshold)} → ${money(signal.newThreshold)}.`,
        test: wasEligible ? 'Previously at or below the threshold.' : 'Previously already above the threshold.',
        verdict: wasEligible && !nowEligible ? 'Eligibility for the full amount may change' : nowEligible ? 'No change to threshold position' : 'Already above both thresholds',
        chart: {
          type: 'compare',
          unit: '$/year',
          bars: [
            { label: 'Household net income', value: a.income, tone: nowEligible ? 'green' : 'amber' },
            { label: 'Previous threshold', value: signal.oldThreshold },
            { label: 'New threshold', value: signal.newThreshold, tone: 'blue' },
          ],
          caption: 'Income against the threshold before and after the change.',
        },
      };
    },
  },

  // 3 — Cross-border: requirement checklist against a profile.
  'program-fit': {
    formula:
      'Each stated program requirement is marked met, not met, or unknown by comparing it with the profile on file. Counts are reported; no overall score or probability is produced.',
    excludes: [
      'Any assessment of whether an application would succeed',
      'Processing times and intake limits',
      'Legal advice of any kind',
    ],
    compute(a, signal) {
      const reqs = signal.requirements.map((r) => {
        if (r.dependsOn === 'managementYears') {
          return { ...r, status: a.managementYears >= r.min ? 'met' : 'unmet',
            detail: `Profile shows ${a.managementYears} years; the requirement is ${r.min}.` };
        }
        if (r.dependsOn === 'netWorth') {
          return { ...r, status: a.netWorth >= r.min ? 'met' : 'unmet',
            detail: `Profile shows ${money(a.netWorth)}; the requirement is ${money(r.min)}.` };
        }
        return r;
      });
      const met = reqs.filter((r) => r.status === 'met').length;
      const unmet = reqs.filter((r) => r.status === 'unmet').length;
      const unknown = reqs.filter((r) => r.status === 'unknown').length;
      return {
        requirements: reqs,
        material: unmet === 0,
        headline: `${met} met · ${unknown} unknown · ${unmet} not met`,
        headlineLabel: `Of ${reqs.length} stated requirements`,
        summary: 'Each requirement is checked against the profile on file. Nothing here estimates the outcome of an application.',
        test: 'A pathway is only treated as relevant while no requirement is known to be unmet.',
        verdict: unmet > 0 ? 'One requirement is not met on current facts' : unknown > 0 ? 'Conditionally relevant — evidence missing' : 'All stated requirements met on current facts',
        chart: {
          type: 'status',
          segments: [
            { label: 'Met', value: met, tone: 'green' },
            { label: 'Unknown', value: unknown, tone: 'amber' },
            { label: 'Not met', value: unmet, tone: 'red' },
          ],
          caption: 'Requirement status against the profile on file.',
        },
      };
    },
  },

  // 4 — Local event: a demand window for a nearby business.
  'event-window': {
    formula:
      'Extra customers = attendance × capture rate. Staff-hours needed = extra customers ÷ service rate. Extra staff = staff-hours ÷ window length, rounded up. Capture rate and service rate are assumptions you set.',
    excludes: [
      'Weather, competing venues and walk-past traffic',
      'Whether attendance forecasts are accurate',
      'Revenue, margin or any financial outcome',
    ],
    compute(a) {
      const extra = a.attendance * (a.captureRate / 100);
      const staffHours = extra / a.serviceRate;
      const extraStaff = Math.ceil(staffHours / a.windowHours);
      return {
        before: a.baselineCustomers,
        after: round(a.baselineCustomers + extra),
        delta: round(extra),
        material: extraStaff >= 1,
        headline: `${extraStaff} extra staff`,
        headlineLabel: `For the ${a.windowHours}-hour window`,
        summary: `${num(a.attendance)} attending × ${a.captureRate}% capture = ${num(round(extra))} extra customers; ÷ ${a.serviceRate} per staff-hour = ${round(staffHours, 1)} staff-hours.`,
        test: 'Rounded up to whole staff, because half a person cannot be rostered.',
        verdict: extraStaff >= 1 ? 'A staffing change is worth preparing' : 'Within normal staffing',
        chart: {
          type: 'compare',
          unit: 'customers',
          bars: [
            { label: 'Typical window', value: a.baselineCustomers },
            { label: 'With the event', value: round(a.baselineCustomers + extra), tone: 'amber' },
          ],
          caption: `Customers in the ${a.windowHours}-hour window before the event start.`,
        },
      };
    },
  },

  // 5 — Consumer attention: is a rise persistent enough to act on?
  'attention-persistence': {
    formula:
      'Baseline = mean of the first 8 weeks. Threshold = baseline × the multiplier you set. A rise counts as persistent only after the required number of consecutive weeks above the threshold.',
    excludes: [
      'Any forecast of whether the rise continues',
      'Why attention moved',
      'Whether attention converts to sales',
    ],
    compute(a, signal) {
      const series = signal.series;
      const baseWeeks = series.slice(0, 8);
      const baseline = round(baseWeeks.reduce((s, p) => s + p.y, 0) / baseWeeks.length, 1);
      const threshold = round(baseline * a.multiplier, 1);
      let run = 0;
      for (const p of series) run = p.y > threshold ? run + 1 : 0;
      const persistent = run >= a.weeksRequired;
      return {
        before: baseline,
        after: series[series.length - 1].y,
        delta: round(series[series.length - 1].y - baseline, 1),
        material: persistent,
        headline: `${run} of ${a.weeksRequired} weeks`,
        headlineLabel: 'Consecutive weeks above the threshold',
        summary: `Baseline ${baseline} (mean of weeks 1–8). Threshold ${threshold} (baseline × ${a.multiplier}). Latest week ${series[series.length - 1].y}.`,
        test: `Treated as persistent only at ${a.weeksRequired} consecutive weeks or more.`,
        verdict: persistent ? 'Persistent enough to test' : 'Not yet persistent — keep monitoring',
        chart: {
          type: 'trend',
          unit: 'index',
          xLabel: 'Week',
          points: series,
          lines: [
            { y: baseline, label: 'Baseline' },
            { y: threshold, label: 'Threshold', tone: 'amber' },
          ],
          caption: 'Illustrative local attention index. Above-threshold weeks are marked.',
        },
      };
    },
  },

  // 6 — Business: a supplier unit-cost change.
  'unit-cost': {
    formula:
      'Monthly impact = volume × (new unit price − current unit price). Applied only if the increase is contractually applicable.',
    excludes: [
      'Switching cost and implementation time',
      'Whether the contract permits the increase',
      'Any change in order volume the supplier may require',
    ],
    compute(a, signal) {
      const deltaCents = Math.round(signal.newPrice * 100) - Math.round(signal.oldPrice * 100);
      const monthly = (a.volume * deltaCents) / 100;
      return {
        before: round((a.volume * Math.round(signal.oldPrice * 100)) / 100),
        after: round((a.volume * Math.round(signal.newPrice * 100)) / 100),
        delta: round(monthly),
        material: monthly >= a.reviewThreshold,
        headline: `${money(monthly)} per month`,
        headlineLabel: 'Estimated additional cost',
        summary: `${num(a.volume)} units × (${money(signal.newPrice, 2)} − ${money(signal.oldPrice, 2)}) = ${money(monthly)}.`,
        test: `Your review threshold is ${money(a.reviewThreshold)} per month.`,
        verdict: monthly >= a.reviewThreshold ? 'Above the review threshold' : 'Below the review threshold',
        chart: {
          type: 'compare',
          unit: '$/month',
          bars: [
            { label: 'Current monthly spend', value: round((a.volume * Math.round(signal.oldPrice * 100)) / 100) },
            { label: 'At the notified price', value: round((a.volume * Math.round(signal.newPrice * 100)) / 100), tone: 'amber' },
          ],
          caption: `At ${num(a.volume)} units per month.`,
        },
      };
    },
  },
};

export function computeImpact(modelId, assumptions, signal) {
  const model = impactModels[modelId];
  if (!model) return null;
  return { ...model.compute(assumptions, signal), formula: model.formula, excludes: model.excludes };
}
