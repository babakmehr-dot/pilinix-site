import { Globe, House, Landmark, Radar, ShoppingBag, Ticket } from 'lucide-react';

// ---------------------------------------------------------------------------
// Signal scenarios — CONTENT ONLY.
//
// Six curated examples of one closed loop: a monitored environment, a signal
// the system finds itself, filtering, context matching, evidence, a modelled
// impact, a decision, a permitted action, outcome verification, and the context
// update that starts the next cycle.
//
// All data is illustrative. Nothing here is monitored live, and no action
// leaves the browser. Numbers are produced by the models in
// src/lib/impactModels.js from the assumptions shown on screen.
// ---------------------------------------------------------------------------

export const strengthLabels = {
  strong: 'Strong evidence',
  partial: 'Partial evidence',
  missing: 'Missing evidence',
  conflicting: 'Conflicting evidence',
  stale: 'Stale evidence',
  superseded: 'Superseded evidence',
};

export const strengthTone = {
  strong: 'green',
  partial: 'amber',
  missing: 'amber',
  conflicting: 'red',
  stale: 'amber',
  superseded: 'red',
};

export const dispositionMeta = {
  detected: { label: 'Detected', tone: 'amber', hint: 'Potentially relevant — taken into the cycle.' },
  escalate: { label: 'Escalated', tone: 'red', hint: 'Material change requiring attention.' },
  monitor: { label: 'Monitor', tone: 'blue', hint: 'Interesting, not yet actionable.' },
  suppressed: { label: 'Suppressed', tone: 'muted', hint: 'Duplicate of something already reviewed.' },
  ignored: { label: 'Ignored', tone: 'muted', hint: 'Outside the monitored scope for this case.' },
};

export const scenarios = [
  // =======================================================================
  // 1 — ECONOMY (household)
  // =======================================================================
  {
    id: 'household-rate',
    domain: 'Economy',
    domainLabel: 'Household finances',
    productLine: 'The kind of environment FAMPAL is built to watch.',
    accent: '#79f0c7',
    icon: House,
    title: 'A lender rate moves on a variable mortgage',
    environment: 'Interest-rate conditions affecting one household’s existing borrowing.',
    monitoringScope: [
      'Central bank policy rate announcements',
      'This lender’s variable-rate notices',
      'The household’s own renewal and payment dates',
    ],
    outOfScope: 'Equity markets, unrelated lenders, general economic commentary.',
    contextTitle: 'Household context',
    context: [
      { label: 'Household', value: 'Two adults, two children' },
      { label: 'Mortgage type', value: 'Variable rate' },
      { label: 'Renewal', value: 'In 19 months' },
      { label: 'Stated priority', value: 'Predictable monthly cost' },
    ],
    assumptions: [
      { id: 'balance', label: 'Mortgage balance', value: 420000, min: 150000, max: 800000, step: 10000, format: 'money' },
      { id: 'years', label: 'Amortisation remaining', value: 22, min: 5, max: 30, step: 1, format: 'years' },
      { id: 'reviewThreshold', label: 'Review threshold', value: 50, min: 10, max: 200, step: 10, format: 'money', note: 'The household asked to be told about changes above this.' },
    ],
    impactModel: 'mortgage-payment',
    cycles: [
      {
        day: 0,
        feed: [
          { id: 'e1', day: 0, source: 'Central bank release', title: 'Policy rate raised by 0.25 points', detail: 'The overnight rate moves from 4.75% to 5.00%.', disposition: 'detected', reason: 'Inside the monitored scope, and this household holds a variable-rate mortgage that tracks it.' },
          { id: 'e2', day: 0, source: 'Financial commentary', title: 'Ten opinion pieces on the rate decision', detail: 'General analysis of the same announcement.', disposition: 'ignored', reason: 'Commentary on an event already captured. Nothing here changes a fact about this household.' },
          { id: 'e3', day: 1, source: 'Lender notice', title: 'Variable rate moves 5.95% → 6.20%', detail: 'The lender passes the policy change through from the next payment.', disposition: 'escalate', reason: 'This is the change that actually reaches the household’s payment.' },
        ],
        signalId: 'e3',
        impact: { applies: true },
        signal: { oldRate: 0.0595, newRate: 0.062, label: 'Variable rate 5.95% → 6.20%', source: 'Lender notice VR-8841', at: 'Scenario day 1' },
        relevance: {
          verdict: 'Relevant',
          why: 'The household holds a variable-rate mortgage with this lender, so the rate change reaches its monthly payment directly.',
        },
        evidence: [
          { id: 'VR-8841', title: 'Lender variable-rate notice', excerpt: 'Your variable rate moves from 5.95% to 6.20% effective from your next payment date.', effective: 'Scenario day 1', checked: 'Scenario day 1', strength: 'strong' },
          { id: 'MTG-STMT', title: 'Latest mortgage statement', excerpt: 'Balance and remaining amortisation as at the last statement.', effective: 'Scenario day −12', checked: 'Scenario day 1', strength: 'strong' },
          { id: 'PREF-01', title: 'Household stated preference', excerpt: 'Told us to flag payment changes above the review threshold.', effective: 'Scenario day −140', checked: 'Scenario day 1', strength: 'partial' },
        ],
        missing: [
          'Whether the lender adjusts the payment or extends the amortisation',
          'Current fixed-rate offers from this lender',
        ],
        decision: {
          recommendationMaterial: 'Ask the lender for current fixed-rate options and any rate-hold offer.',
          recommendationImmaterial: 'No action. The change is below the household’s review threshold — keep monitoring.',
          why: 'The payment change is above the threshold the household set, and the useful next step is information the lender holds. Asking costs nothing and commits to nothing.',
          options: [
            { name: 'Do nothing', note: 'Reasonable while the change stays below the review threshold.' },
            { name: 'Ask the lender for options', note: 'Cheap, reversible, and produces the fact the decision is missing.', chosen: true },
            { name: 'Switch to a fixed rate now', note: 'Cannot be judged without the fixed-rate offer.' },
            { name: 'Refinance elsewhere', note: 'Out of proportion to a single 0.25-point move.' },
          ],
        },
        action: {
          kind: 'message',
          title: 'Draft to lender',
          target: 'Lender — mortgage servicing (sample)',
          subject: 'Fixed-rate options and rate hold',
          body: [
            'Notice VR-8841 moves our variable rate to 6.20% from the next payment.',
            'Please send current fixed-rate options for the remaining term,',
            'any rate-hold offer available to us, and whether the payment amount',
            'or the amortisation changes at 6.20%.',
          ],
          consequence: 'Sends a request for information. Does not switch products, accept an offer or authorise any change.',
          approvalRequired: true,
          buttonLabel: 'Prepare for approval',
        },
        monitoringPlan: [
          'The next scheduled policy rate decision',
          'Any further notice from this lender',
          'The reply to this request',
        ],
        outcome: {
          sent: 'Simulated sent. Whether the lender replies, and what it offers, is unknown.',
          unconfirmed: 'Outcome unconfirmed. The delivery check timed out — that is neither success nor failure.',
          confirmed: 'Delivery confirmed in this example. The lender has not replied yet.',
          completed: 'Reply received: fixed-rate options quoted at 5.79% for the remaining term, rate hold valid 30 days.',
        },
        contextUpdate: [
          { label: 'Variable rate', value: '6.20%', note: 'Was 5.95%' },
          { label: 'Fixed offer on file', value: '5.79%, hold expires day 31', note: 'From the lender reply' },
        ],
      },
      {
        day: 34,
        feed: [
          { id: 'e4', day: 30, source: 'Lender notice', title: 'Reminder: your rate-hold offer expires', detail: 'A restatement of the same 5.79% offer already on file.', disposition: 'suppressed', reason: 'No material change from the offer already recorded on day 12.' },
          { id: 'e5', day: 33, source: 'Central bank release', title: 'Policy rate held unchanged', detail: 'The overnight rate stays at 5.00%.', disposition: 'detected', reason: 'Inside scope. It resolves an open question rather than creating a new one.' },
        ],
        signalId: 'e5',
        impact: { applies: true, note: 'The rate this household pays did not move, so the modelled payment is unchanged. A zero impact is still a result.' },
        signal: { oldRate: 0.062, newRate: 0.062, label: 'Policy rate held at 5.00%', source: 'Central bank release', at: 'Scenario day 33' },
        relevance: {
          verdict: 'Relevant, but no payment effect',
          why: 'The rate this household pays is unchanged, so the payment does not move. What changed is the expiry pressure on the fixed offer already on file.',
        },
        evidence: [
          { id: 'CB-REL', title: 'Central bank release', excerpt: 'The policy rate is held at 5.00%.', effective: 'Scenario day 33', checked: 'Scenario day 33', strength: 'strong' },
          { id: 'OFFER-579', title: 'Fixed-rate offer on file', excerpt: 'Fixed 5.79% for the remaining term. Hold expires day 31.', effective: 'Scenario day 12', checked: 'Scenario day 33', strength: 'stale' },
        ],
        missing: ['Whether the lender will re-issue the expired hold'],
        decision: {
          recommendationMaterial: 'No new action. Flag that the fixed-rate offer on file has expired.',
          recommendationImmaterial: 'No new action. Flag that the fixed-rate offer on file has expired.',
          why: 'A held rate changes no payment. The only thing that moved is the age of the offer, which is now past its stated hold date and can no longer be relied on.',
          options: [
            { name: 'No action, keep monitoring', note: 'Correct when nothing the household pays has changed.', chosen: true },
            { name: 'Re-request the fixed offer', note: 'Worth doing only if the household is actively considering a switch.' },
          ],
        },
        action: {
          kind: 'none',
          title: 'No action prepared',
          target: '—',
          preview: 'Nothing is drafted. The expired offer is marked stale in the household context, and monitoring continues.',
          consequence: 'Deciding not to act is a decision. It is recorded with its reason.',
          approvalRequired: false,
          buttonLabel: 'Record the decision',
        },
        monitoringPlan: ['The next policy rate decision', 'Any new offer from this lender'],
        outcome: {
          completed: 'Recorded. No message was drafted and nothing was sent.',
        },
        contextUpdate: [{ label: 'Fixed offer on file', value: 'Expired', note: 'Hold date passed on day 31' }],
      },
    ],
    limitations: [
      'The payment model excludes tax, insurance and fees.',
      'Whether a lender changes the payment or the amortisation varies by contract.',
      'Nothing here forecasts the next rate decision.',
    ],
  },

  // =======================================================================
  // 2 — POLICY / BENEFITS (family)
  // =======================================================================
  {
    id: 'benefit-rule',
    domain: 'Policy',
    domainLabel: 'Family benefits',
    productLine: 'The kind of environment FAMPAL is built to watch.',
    accent: '#72a7ff',
    icon: Landmark,
    title: 'An eligibility threshold changes mid-year',
    environment: 'Public programs a specific family already relies on.',
    monitoringScope: [
      'Rule and threshold changes for the programs on this family’s file',
      'Renewal and document deadlines',
      'Effective dates and transition provisions',
    ],
    outOfScope: 'Programs the family is not enrolled in and does not qualify for.',
    contextTitle: 'Family context',
    context: [
      { label: 'Household', value: 'Two adults, two children under 6' },
      { label: 'Programs on file', value: 'One income-tested benefit' },
      { label: 'Income on file', value: 'From the prior tax year', tone: 'amber', note: 'Not yet updated' },
      { label: 'Next renewal', value: 'In 4 months' },
    ],
    assumptions: [
      { id: 'income', label: 'Household net income', value: 58400, min: 30000, max: 90000, step: 500, format: 'money', note: 'The figure currently on file. Change it to see the threshold position move.' },
    ],
    impactModel: 'benefit-threshold',
    cycles: [
      {
        day: 0,
        feed: [
          { id: 'b1', day: 0, source: 'Program bulletin', title: 'Income threshold for the full amount lowered', detail: 'The threshold moves from $60,000 to $55,000 for the coming benefit year.', disposition: 'escalate', reason: 'Inside scope, and this family is enrolled in the program the threshold governs.' },
          { id: 'b2', day: 0, source: 'Program bulletin', title: 'Office closure over a public holiday', detail: 'Service counters closed for one day.', disposition: 'ignored', reason: 'Outside the monitored scope: it changes no rule, amount or deadline on this file.' },
          { id: 'b3', day: 2, source: 'News summary', title: 'Coverage of the same threshold change', detail: 'Secondary reporting of the bulletin already captured.', disposition: 'suppressed', reason: 'Duplicate of the primary source already reviewed on day 0.' },
        ],
        signalId: 'b1',
        impact: { applies: true },
        signal: { oldThreshold: 60000, newThreshold: 55000, label: 'Threshold $60,000 → $55,000', source: 'Program bulletin 2026-14', at: 'Scenario day 0' },
        relevance: {
          verdict: 'Relevant',
          why: 'The family is enrolled in this program, and the income on file sits between the old and the new threshold.',
        },
        evidence: [
          { id: 'BUL-2026-14', title: 'Program bulletin 2026-14', excerpt: 'The income threshold for the full amount is set at $55,000 for the coming benefit year.', effective: 'Next benefit year', checked: 'Scenario day 0', strength: 'strong' },
          { id: 'PREV-RULE', title: 'Previous published threshold', excerpt: 'The full amount applied at or below $60,000.', effective: 'Current benefit year', checked: 'Scenario day 0', strength: 'strong' },
          { id: 'INC-FILE', title: 'Household income on file', excerpt: 'Net income from the prior tax year. The current year figure has not been supplied.', effective: 'Prior tax year', checked: 'Scenario day 0', strength: 'stale' },
        ],
        missing: [
          'The household’s net income for the current tax year',
          'Whether a transition provision applies to families already enrolled',
        ],
        decision: {
          recommendationMaterial: 'Hold. Confirm the current-year income before changing anything on this file.',
          recommendationImmaterial: 'Hold. Confirm the current-year income before changing anything on this file.',
          why: 'The threshold position depends entirely on a figure that is a year out of date. Acting on a stale income figure could remove a benefit the family still qualifies for, or leave a real gap unaddressed.',
          options: [
            { name: 'Do nothing', note: 'Leaves a possible eligibility change unexamined before renewal.' },
            { name: 'Confirm one fact first', note: 'The current-year income decides the answer and is the family’s to supply.', chosen: true },
            { name: 'Start a new application', note: 'Premature while the deciding figure is unknown.' },
            { name: 'Tell the family they are ineligible', note: 'Not supportable. The figure on file is stale.' },
          ],
        },
        action: {
          kind: 'request-fact',
          title: 'Request one fact',
          target: 'Internal — the family, via the agreed channel',
          preview: 'Ask the family to confirm net household income for the current tax year, and record which year the figure covers.',
          consequence: 'Internal only. No application is changed and nothing is filed.',
          approvalRequired: false,
          buttonLabel: 'Request the missing fact',
          followUp: 'Fact requested. In this example you supply it — change the income assumption to continue.',
        },
        monitoringPlan: [
          'Transition provisions for families already enrolled',
          'The renewal deadline in 4 months',
          'Any further threshold change before the benefit year starts',
        ],
        outcome: {
          completed: 'The family confirmed the current-year figure. It is now recorded with its year.',
        },
        contextUpdate: [
          { label: 'Income on file', value: 'Current tax year', note: 'Confirmed by the family' },
        ],
      },
      {
        day: 9,
        feed: [
          { id: 'b4', day: 9, source: 'Program bulletin', title: 'Transition provision published', detail: 'Families already enrolled keep the previous threshold for one benefit year.', disposition: 'escalate', reason: 'Inside scope, and it directly changes the conclusion reached in the previous cycle.' },
        ],
        signalId: 'b4',
        impact: { applies: true, note: 'Recalculated against the threshold that now governs this file under the transition provision.' },
        signal: { oldThreshold: 60000, newThreshold: 60000, label: 'Transition: previous threshold held for one year', source: 'Program bulletin 2026-19', at: 'Scenario day 9' },
        relevance: {
          verdict: 'Relevant — supersedes the earlier reading',
          why: 'The family is already enrolled, so the transition provision applies and the previous threshold continues to govern this file for one more year.',
        },
        evidence: [
          { id: 'BUL-2026-19', title: 'Program bulletin 2026-19', excerpt: 'Households enrolled before the change keep the previous threshold for one benefit year.', effective: 'Next benefit year', checked: 'Scenario day 9', strength: 'strong' },
          { id: 'ENROL', title: 'Enrolment record', excerpt: 'This household was enrolled before the change date.', effective: 'Scenario day −400', checked: 'Scenario day 9', strength: 'strong' },
        ],
        missing: ['What applies in the benefit year after the transition ends'],
        decision: {
          recommendationMaterial: 'Mark the earlier recommendation superseded. Set a reminder for the year the transition ends.',
          recommendationImmaterial: 'Mark the earlier recommendation superseded. Set a reminder for the year the transition ends.',
          why: 'The earlier decision was correct on the facts available then. The transition provision replaces those facts, so the recommendation is retired rather than defended.',
          options: [
            { name: 'Keep the earlier recommendation', note: 'It was built on a rule that no longer applies to this file.' },
            { name: 'Supersede it and set a reminder', note: 'Retires the old reasoning and marks when it becomes live again.', chosen: true },
          ],
        },
        action: {
          kind: 'internal',
          title: 'Internal step',
          target: 'Internal — this family’s file',
          preview: 'Mark the day-0 recommendation superseded, record the transition provision, and set a reminder before the benefit year in which the lower threshold begins to apply.',
          consequence: 'Internal only. Nothing is filed and no benefit is changed.',
          approvalRequired: false,
          buttonLabel: 'Record and set the reminder',
        },
        monitoringPlan: ['The end of the transition year', 'Any further change to the threshold'],
        outcome: { completed: 'Recorded. The earlier recommendation is marked superseded.' },
        contextUpdate: [
          { label: 'Threshold governing this file', value: '$60,000 for one more year', note: 'Transition provision' },
        ],
      },
    ],
    limitations: [
      'Benefit amounts are not modelled — only the position against the published threshold.',
      'Program names, thresholds and bulletin numbers are illustrative.',
      'This is not benefits advice.',
    ],
  },

  // =======================================================================
  // 3 — CROSS-BORDER
  // =======================================================================
  {
    id: 'cross-border-program',
    domain: 'Cross-border',
    domainLabel: 'Programs and eligibility',
    productLine: 'The kind of environment ARIMENT is built to watch.',
    accent: '#c79cff',
    icon: Globe,
    title: 'A business immigration stream reopens with new criteria',
    environment: 'Programs, criteria and timing relevant to one cross-border business case.',
    monitoringScope: [
      'Streams matching this profile’s sector and region',
      'Criteria, evidence requirements and intake windows',
      'Effective dates and closures',
    ],
    outOfScope: 'Streams for sectors, regions or applicant types this profile does not match.',
    contextTitle: 'Profile context',
    context: [
      { label: 'Applicant', value: 'Operating business owner' },
      { label: 'Sector', value: 'Food manufacturing' },
      { label: 'Target region', value: 'Matches the stream' },
      { label: 'Language test', value: 'Not yet taken', tone: 'amber' },
    ],
    assumptions: [
      { id: 'managementYears', label: 'Years of management experience', value: 4, min: 0, max: 12, step: 1, format: 'years' },
      { id: 'netWorth', label: 'Verifiable net worth', value: 520000, min: 100000, max: 1500000, step: 20000, format: 'money' },
    ],
    impactModel: 'program-fit',
    cycles: [
      {
        day: 0,
        feed: [
          { id: 'x1', day: 0, source: 'Program page', title: 'Business stream reopens with revised criteria', detail: 'Intake reopens; the experience requirement and evidence list are revised.', disposition: 'escalate', reason: 'Inside scope: the sector and region match this profile, and the criteria decide relevance.' },
          { id: 'x2', day: 0, source: 'Program page', title: 'A separate stream for a different sector reopens', detail: 'Intake for an unrelated sector stream.', disposition: 'ignored', reason: 'Outside scope: the sector does not match this profile.' },
          { id: 'x3', day: 4, source: 'Consultant newsletter', title: 'Summary of the same reopening', detail: 'Third-party restatement of the published criteria.', disposition: 'suppressed', reason: 'Duplicate of the primary source. The published page is already recorded as the authority.' },
        ],
        signalId: 'x1',
        impact: { applies: true },
        signal: {
          label: 'Stream reopened with revised criteria',
          source: 'Published program page',
          at: 'Scenario day 0',
          requirements: [
            { name: 'Sector match', status: 'met', detail: 'The published sector list includes food manufacturing.' },
            { name: 'Region match', status: 'met', detail: 'The profile’s target region is inside the stream.' },
            { name: 'Management experience', dependsOn: 'managementYears', min: 3 },
            { name: 'Verifiable net worth', dependsOn: 'netWorth', min: 500000 },
            { name: 'Language test result', status: 'unknown', detail: 'No test result on file. The stream requires one at application.' },
          ],
        },
        relevance: {
          verdict: 'Potentially relevant',
          why: 'Sector and region match, so the stream is worth assessing. Whether it is actually open to this profile depends on requirements that can be checked and one that cannot yet.',
        },
        evidence: [
          { id: 'PROG-PAGE', title: 'Published program criteria', excerpt: 'Revised experience requirement, evidence list and intake window as published.', effective: 'Scenario day 0', checked: 'Scenario day 0', strength: 'strong' },
          { id: 'PROFILE', title: 'Business and personal profile', excerpt: 'Sector, region, ownership, management history and net worth as recorded.', effective: 'Scenario day −60', checked: 'Scenario day 0', strength: 'partial' },
          { id: 'LANG', title: 'Language test result', excerpt: 'No result on file.', effective: '—', checked: 'Not available', strength: 'missing' },
        ],
        missing: [
          'A language test result',
          'Whether net worth can be verified in the form the stream requires',
          'The intake limit, which is not published',
        ],
        decision: {
          recommendationMaterial: 'Assess fit and gather the two missing documents. Do not treat the pathway as open yet.',
          recommendationImmaterial: 'Assess fit and gather the two missing documents. Do not treat the pathway as open yet.',
          why: 'The requirements that can be checked against the profile are met. The two that cannot are both document work rather than eligibility barriers, so gathering them is the step that resolves the question.',
          options: [
            { name: 'Treat the pathway as open', note: 'Not supportable while a required result is missing.' },
            { name: 'Assess fit and gather evidence', note: 'Resolves the unknowns without committing to anything.', chosen: true },
            { name: 'File now', note: 'Premature: an application needs the missing result.' },
            { name: 'Drop the stream', note: 'No requirement is known to be unmet.' },
          ],
        },
        action: {
          kind: 'internal',
          title: 'Internal step',
          target: 'Internal — case file',
          preview: 'Prepare a requirement-by-requirement fit note and a document checklist covering the language test and net-worth verification, each with the published requirement it answers.',
          consequence: 'Internal only. Nothing is filed and no representation is made to any authority.',
          approvalRequired: false,
          buttonLabel: 'Prepare the checklist',
        },
        monitoringPlan: [
          'Changes to the published criteria',
          'The intake window closing',
          'The two documents arriving on file',
        ],
        outcome: { completed: 'Checklist prepared. Two documents are outstanding.' },
        contextUpdate: [
          { label: 'Open checklist', value: '2 documents outstanding', note: 'Language test, net-worth verification' },
        ],
      },
      {
        day: 21,
        feed: [
          { id: 'x4', day: 21, source: 'Program page', title: 'Evidence list amended: net-worth verification narrowed', detail: 'Only audited statements are accepted; the previously listed alternative is removed.', disposition: 'escalate', reason: 'Inside scope, and it changes a requirement this case was actively preparing for.' },
        ],
        signalId: 'x4',
        impact: { applies: 'unchanged', note: 'The requirement counts do not move: the amount required is the same. What changed is the form of proof the stream accepts, which the counts cannot show.' },
        signal: {
          label: 'Net-worth evidence narrowed to audited statements',
          source: 'Published program page, amended',
          at: 'Scenario day 21',
          requirements: [
            { name: 'Sector match', status: 'met', detail: 'Unchanged.' },
            { name: 'Region match', status: 'met', detail: 'Unchanged.' },
            { name: 'Management experience', dependsOn: 'managementYears', min: 3 },
            { name: 'Verifiable net worth', dependsOn: 'netWorth', min: 500000 },
            { name: 'Language test result', status: 'unknown', detail: 'Still not on file.' },
          ],
        },
        relevance: {
          verdict: 'Relevant — changes the checklist',
          why: 'The amount required is unchanged, but the form of proof is narrower. The checklist prepared in the previous cycle now points at an accepted document type that is no longer accepted.',
        },
        evidence: [
          { id: 'PROG-AMEND', title: 'Amended evidence list', excerpt: 'Net worth must be evidenced by audited statements. The previously listed alternative is withdrawn.', effective: 'Scenario day 21', checked: 'Scenario day 21', strength: 'strong' },
          { id: 'CHECKLIST', title: 'Checklist prepared on day 0', excerpt: 'Lists the withdrawn document type as acceptable.', effective: 'Scenario day 0', checked: 'Scenario day 21', strength: 'superseded' },
        ],
        missing: ['Whether audited statements can be produced inside the intake window'],
        decision: {
          recommendationMaterial: 'Supersede the day-0 checklist and re-issue it against the amended evidence list.',
          recommendationImmaterial: 'Supersede the day-0 checklist and re-issue it against the amended evidence list.',
          why: 'A checklist is only as current as the criteria it was built from. Leaving the old one in place would send the case to gather a document that is no longer accepted.',
          options: [
            { name: 'Keep the existing checklist', note: 'It points at a withdrawn document type.' },
            { name: 'Supersede and re-issue', note: 'Rebuilds the checklist against the amended list.', chosen: true },
          ],
        },
        action: {
          kind: 'internal',
          title: 'Internal step',
          target: 'Internal — case file',
          preview: 'Mark the day-0 checklist superseded and issue a replacement citing the amended evidence list, with the audited-statement requirement flagged against the intake window.',
          consequence: 'Internal only. Nothing is filed.',
          approvalRequired: false,
          buttonLabel: 'Re-issue the checklist',
        },
        monitoringPlan: ['Further amendments to the evidence list', 'The intake window closing'],
        outcome: { completed: 'Replacement checklist issued. The day-0 version is marked superseded.' },
        contextUpdate: [
          { label: 'Open checklist', value: 'Re-issued at day 21', note: 'Audited statements required' },
        ],
      },
    ],
    limitations: [
      'Program names, criteria and amendments are illustrative.',
      'Nothing here estimates whether an application would succeed.',
      'This is not legal or immigration advice.',
    ],
  },

  // =======================================================================
  // 4 — LOCAL EVENT
  // =======================================================================
  {
    id: 'local-event',
    domain: 'Local events',
    domainLabel: 'A nearby business',
    accent: '#ffba7a',
    icon: Ticket,
    title: 'An arena event moves to a weekday afternoon',
    environment: 'Scheduled events near one café, and the trading windows they touch.',
    monitoringScope: [
      'Event schedules at venues within walking distance',
      'Published start-time changes',
      'The café’s own opening hours and roster',
    ],
    outOfScope: 'Results, transfers, team news and anything that does not move a start time or an attendance figure.',
    contextTitle: 'Business context',
    context: [
      { label: 'Business', value: 'Café, 350 m from the arena' },
      { label: 'Opening hours', value: '07:00 – 17:00' },
      { label: 'Weekday afternoon roster', value: '3 staff' },
      { label: 'Typical 15:00–17:00', value: '40 customers', note: 'Illustrative baseline' },
    ],
    assumptions: [
      { id: 'attendance', label: 'Expected attendance', value: 16000, min: 4000, max: 25000, step: 1000, format: 'number' },
      { id: 'captureRate', label: 'Capture rate', value: 0.4, min: 0.1, max: 1.5, step: 0.1, format: 'percent', note: 'Share of attendees who buy here. An assumption, not a measurement.' },
      { id: 'serviceRate', label: 'Customers per staff-hour', value: 22, min: 10, max: 40, step: 1, format: 'number' },
      { id: 'windowHours', label: 'Pre-event window', value: 2, min: 1, max: 4, step: 1, format: 'hours' },
      { id: 'baselineCustomers', label: 'Typical customers in the window', value: 40, min: 10, max: 120, step: 5, format: 'number' },
    ],
    impactModel: 'event-window',
    cycles: [
      {
        day: 0,
        feed: [
          { id: 'v1', day: 0, source: 'Venue schedule', title: 'Fixture moved from 19:30 to 16:00 on a Thursday', detail: 'The published start time changes; the date is unchanged.', disposition: 'escalate', reason: 'Inside scope: the new start time lands inside this café’s trading hours, the old one did not.' },
          { id: 'v2', day: 0, source: 'Sports coverage', title: 'Squad news and match preview', detail: 'Team-selection reporting for the same fixture.', disposition: 'ignored', reason: 'Outside scope: it moves no start time and no attendance figure.' },
          { id: 'v3', day: 2, source: 'Venue schedule', title: 'Start time restated at 16:00', detail: 'The same change, re-published.', disposition: 'suppressed', reason: 'Duplicate of the change already reviewed on day 0.' },
        ],
        signalId: 'v1',
        impact: { applies: true },
        signal: { label: 'Start time 19:30 → 16:00', source: 'Venue schedule', at: 'Scenario day 0' },
        relevance: {
          verdict: 'Relevant',
          why: 'At 19:30 the event fell entirely outside opening hours. At 16:00 the arrival window overlaps the last two trading hours.',
        },
        evidence: [
          { id: 'VENUE-SCH', title: 'Published venue schedule', excerpt: 'Start time for the fixture is listed as 16:00.', effective: 'Scenario day 0', checked: 'Scenario day 0', strength: 'strong' },
          { id: 'ROSTER', title: 'Current roster', excerpt: 'Three staff on weekday afternoons.', effective: 'Scenario day −7', checked: 'Scenario day 0', strength: 'strong' },
          { id: 'BASE', title: 'Typical afternoon volume', excerpt: 'Around 40 customers between 15:00 and 17:00 on a weekday.', effective: 'Illustrative', checked: 'Scenario day 0', strength: 'partial' },
        ],
        missing: [
          'Actual attendance on the day',
          'How many attendees walk past this café rather than the other approach',
        ],
        decision: {
          recommendationMaterial: 'Roster the extra staff for the 15:00–17:00 window and re-check once the schedule is confirmed.',
          recommendationImmaterial: 'No change. The modelled demand sits inside normal staffing — keep monitoring the schedule.',
          why: 'The change is a schedule fact, not a forecast. The staffing response is small, reversible, and cheaper to make than to miss.',
          options: [
            { name: 'Do nothing', note: 'Risks understaffing a window that is now inside trading hours.' },
            { name: 'Adjust the roster for one window', note: 'Small, reversible, and matched to the modelled demand.', chosen: true },
            { name: 'Extend opening hours', note: 'Out of proportion to a single fixture.' },
            { name: 'Order extra stock', note: 'Not supported: the model estimates staffing, not consumption.' },
          ],
        },
        action: {
          kind: 'internal',
          title: 'Internal step',
          target: 'Internal — roster note',
          preview: 'Prepare a roster note for the 15:00–17:00 window on the fixture date, with the attendance and capture-rate assumptions attached so the estimate can be challenged.',
          consequence: 'Internal only. No shift is booked and no staff member is contacted.',
          approvalRequired: false,
          buttonLabel: 'Prepare the roster note',
        },
        monitoringPlan: ['Further start-time changes', 'Published attendance once the fixture is confirmed'],
        outcome: { completed: 'Roster note prepared with its assumptions attached.' },
        contextUpdate: [{ label: 'Open roster note', value: 'Fixture day, 15:00–17:00' }],
      },
      {
        day: 6,
        feed: [
          { id: 'v4', day: 6, source: 'Venue schedule', title: 'Fixture postponed', detail: 'The fixture is removed from the schedule; no new date published.', disposition: 'escalate', reason: 'Inside scope, and it removes the basis for the roster note prepared on day 0.' },
        ],
        signalId: 'v4',
        impact: { applies: false, note: 'Not recalculated. The fixture that created the demand window has been removed from the schedule, so there is no window to model.' },
        signal: { label: 'Fixture postponed, no new date', source: 'Venue schedule', at: 'Scenario day 6' },
        relevance: {
          verdict: 'Relevant — retires the earlier decision',
          why: 'The demand window the roster note was built for no longer exists on that date.',
        },
        evidence: [
          { id: 'VENUE-UPD', title: 'Updated venue schedule', excerpt: 'The fixture is removed. No replacement date is published.', effective: 'Scenario day 6', checked: 'Scenario day 6', strength: 'strong' },
          { id: 'ROSTER-NOTE', title: 'Roster note from day 0', excerpt: 'Prepared for a window on a date that no longer has a fixture.', effective: 'Scenario day 0', checked: 'Scenario day 6', strength: 'superseded' },
        ],
        missing: ['The replacement date'],
        decision: {
          recommendationMaterial: 'Withdraw the roster note and keep watching for the replacement date.',
          recommendationImmaterial: 'Withdraw the roster note and keep watching for the replacement date.',
          why: 'The estimate was sound for a fixture that is no longer scheduled. Leaving the note in place would put staff on a shift with no event behind it.',
          options: [
            { name: 'Leave the roster note in place', note: 'Would staff a window with no event.' },
            { name: 'Withdraw and keep monitoring', note: 'Removes the commitment and waits for the replacement date.', chosen: true },
          ],
        },
        action: {
          kind: 'internal',
          title: 'Internal step',
          target: 'Internal — roster note',
          preview: 'Withdraw the day-0 roster note, record why, and keep the venue schedule under watch for a replacement date.',
          consequence: 'Internal only. No shift was ever booked.',
          approvalRequired: false,
          buttonLabel: 'Withdraw the note',
        },
        monitoringPlan: ['A replacement date being published'],
        outcome: { completed: 'Roster note withdrawn. The venue schedule stays under watch.' },
        contextUpdate: [{ label: 'Open roster note', value: 'Withdrawn', note: 'Fixture postponed' }],
      },
    ],
    limitations: [
      'The capture rate is an assumption you set, not a measurement.',
      'Attendance figures are illustrative.',
      'The model estimates staffing only — not revenue, margin or stock.',
    ],
  },

  // =======================================================================
  // 5 — CONSUMER ATTENTION
  // =======================================================================
  {
    id: 'attention-trend',
    domain: 'Consumer attention',
    domainLabel: 'A small food business',
    accent: '#79f0c7',
    icon: ShoppingBag,
    title: 'Local interest in a category rises above its baseline',
    environment: 'Local consumer attention in categories adjacent to what this bakery already sells.',
    monitoringScope: [
      'Attention in adjacent categories, weekly',
      'Its own baseline, recalculated as weeks accumulate',
      'Whether a rise persists long enough to be worth testing',
    ],
    outOfScope: 'National trends with no local reading, and categories the business cannot serve.',
    contextTitle: 'Business context',
    context: [
      { label: 'Business', value: 'Neighbourhood bakery' },
      { label: 'Current range', value: 'Bread, pastry, coffee' },
      { label: 'Capacity', value: 'One oven, no spare shift' },
      { label: 'Stated rule', value: 'Test before adding a line' },
    ],
    assumptions: [
      { id: 'multiplier', label: 'Threshold multiplier', value: 1.25, min: 1.05, max: 2, step: 0.05, format: 'multiplier', note: 'How far above baseline counts as a rise.' },
      { id: 'weeksRequired', label: 'Weeks required to call it persistent', value: 6, min: 2, max: 10, step: 1, format: 'weeks', note: 'Lower this and the same data produces a different decision.' },
    ],
    impactModel: 'attention-persistence',
    cycles: [
      {
        day: 0,
        feed: [
          { id: 't1', day: 0, source: 'Attention index', title: 'Adjacent category above baseline for a fourth week', detail: 'The weekly index stays above the threshold.', disposition: 'monitor', reason: 'Inside scope and rising, but short of the persistence rule this business set. Recorded without interrupting anyone.' },
          { id: 't2', day: 0, source: 'National coverage', title: 'National feature on the same category', detail: 'Coverage with no local reading attached.', disposition: 'ignored', reason: 'Outside scope: no local signal, and national attention does not describe this neighbourhood.' },
        ],
        signalId: 't1',
        impact: { applies: true },
        signal: {
          label: 'Fourth consecutive week above threshold',
          source: 'Illustrative local attention index',
          at: 'Scenario day 0',
          series: [
            { x: 1, y: 100 }, { x: 2, y: 96 }, { x: 3, y: 104 }, { x: 4, y: 99 },
            { x: 5, y: 101 }, { x: 6, y: 103 }, { x: 7, y: 98 }, { x: 8, y: 99 },
            { x: 9, y: 127 }, { x: 10, y: 131 }, { x: 11, y: 129 }, { x: 12, y: 134 },
          ],
        },
        relevance: {
          verdict: 'Relevant, not yet actionable',
          why: 'The category is one this bakery could serve, and the rise is local. It has not yet lasted long enough to meet the rule the business itself set.',
        },
        evidence: [
          { id: 'IDX-12', title: 'Twelve weeks of the local index', excerpt: 'Weekly readings, with the first eight forming the baseline.', effective: 'Weeks 1–12', checked: 'Scenario day 0', strength: 'partial' },
          { id: 'CAP', title: 'Production capacity', excerpt: 'One oven and no spare shift. A new line displaces existing output.', effective: 'Scenario day −30', checked: 'Scenario day 0', strength: 'strong' },
        ],
        missing: [
          'Whether attention converts to purchases here',
          'What is driving the rise, and whether it is seasonal',
        ],
        decision: {
          recommendationMaterial: 'The rise has met the persistence rule. Prepare a two-week, low-risk test rather than a permanent line.',
          recommendationImmaterial: 'Do not change the range. Keep monitoring until the persistence rule is met.',
          why: 'Attention is not demand, and this bakery cannot add a line without displacing something it already sells. The rule the business set exists precisely so a four-week rise does not become a permanent commitment.',
          options: [
            { name: 'Add the line now', note: 'Displaces existing output on evidence that has not persisted.' },
            { name: 'Keep monitoring', note: 'Costs nothing and lets the rule do its job.', chosen: true },
            { name: 'Run a two-week test', note: 'Becomes the right step once the persistence rule is met.' },
            { name: 'Ignore the category', note: 'Discards a local signal that is still running.' },
          ],
        },
        action: {
          kind: 'none',
          title: 'No action prepared',
          target: '—',
          preview: 'Nothing is prepared. The rise is recorded, the count of consecutive weeks continues, and no one is interrupted until the rule is met.',
          consequence: 'Choosing not to act is recorded with its reason, so it can be revisited.',
          approvalRequired: false,
          buttonLabel: 'Record the decision',
        },
        monitoringPlan: [
          'The weekly index, against the same threshold',
          'The consecutive-week count',
          'Whether the baseline itself shifts',
        ],
        outcome: { completed: 'Recorded. Nothing was prepared and nobody was interrupted.' },
        contextUpdate: [{ label: 'Category under watch', value: 'Week 4 of the required run' }],
      },
      {
        day: 21,
        feed: [
          { id: 't3', day: 14, source: 'Attention index', title: 'Fifth and sixth weeks above threshold', detail: 'The index stays above the threshold for two further weeks.', disposition: 'detected', reason: 'Inside scope, and it advances the consecutive-week count toward the rule.' },
          { id: 't4', day: 21, source: 'Attention index', title: 'A different category rises', detail: 'An unrelated category moves above its own baseline.', disposition: 'ignored', reason: 'Outside scope: this business cannot serve that category.' },
        ],
        signalId: 't3',
        impact: { applies: true },
        signal: {
          label: 'Sixth consecutive week above threshold',
          source: 'Illustrative local attention index',
          at: 'Scenario day 21',
          series: [
            { x: 1, y: 100 }, { x: 2, y: 96 }, { x: 3, y: 104 }, { x: 4, y: 99 },
            { x: 5, y: 101 }, { x: 6, y: 103 }, { x: 7, y: 98 }, { x: 8, y: 99 },
            { x: 9, y: 127 }, { x: 10, y: 131 }, { x: 11, y: 129 }, { x: 12, y: 134 },
            { x: 13, y: 130 }, { x: 14, y: 136 },
          ],
        },
        relevance: {
          verdict: 'Relevant and now actionable',
          why: 'The run has reached the length the business required before treating a rise as worth spending on.',
        },
        evidence: [
          { id: 'IDX-14', title: 'Fourteen weeks of the local index', excerpt: 'Six consecutive weeks above the threshold.', effective: 'Weeks 1–14', checked: 'Scenario day 21', strength: 'partial' },
          { id: 'CAP', title: 'Production capacity', excerpt: 'One oven and no spare shift. A test must fit inside existing output.', effective: 'Scenario day −30', checked: 'Scenario day 21', strength: 'strong' },
        ],
        missing: ['Whether attention converts to purchases here'],
        decision: {
          recommendationMaterial: 'Prepare a two-week test at small volume, with a stated stop rule.',
          recommendationImmaterial: 'Keep monitoring. The run is still short of the required length.',
          why: 'The rule the business set has been met, and the cheapest way to answer the remaining unknown — whether attention converts here — is a small test with a stop rule, not a permanent line.',
          options: [
            { name: 'Add the line permanently', note: 'Still unsupported: conversion here is untested.' },
            { name: 'Run a two-week test', note: 'Answers the open question at a cost the business can absorb.', chosen: true },
            { name: 'Keep monitoring only', note: 'The rule has been met; more waiting adds nothing.' },
          ],
        },
        action: {
          kind: 'internal',
          title: 'Internal step',
          target: 'Internal — production plan',
          preview: 'Prepare a two-week test: a small daily batch, a fixed stop rule if it does not sell through, and the index reading that triggered it recorded alongside.',
          consequence: 'Internal only. No supplier is contacted and no order is placed.',
          approvalRequired: false,
          buttonLabel: 'Prepare the test',
        },
        monitoringPlan: ['Sell-through against the stop rule', 'Whether the index run continues during the test'],
        outcome: { completed: 'Test prepared, with its stop rule and the reading that triggered it.' },
        contextUpdate: [{ label: 'Category under watch', value: 'Two-week test prepared' }],
      },
    ],
    limitations: [
      'The index is illustrative and does not represent any real measurement.',
      'Attention is not demand; nothing here forecasts sales.',
      'The persistence rule is a choice, not a statistical result.',
    ],
  },

  // =======================================================================
  // 6 — BUSINESS / SUPPLIER
  // =======================================================================
  {
    id: 'supplier-cost',
    domain: 'Business',
    domainLabel: 'Costs and suppliers',
    accent: '#c79cff',
    icon: Radar,
    title: 'A supplier raises a recurring unit price',
    environment: 'Notices and terms from suppliers behind one recurring purchasing decision.',
    monitoringScope: [
      'Price and terms notices from suppliers on this decision',
      'The contract renewal date',
      'Minimum order quantities and delivery terms',
    ],
    outOfScope: 'Supplier marketing, facility announcements and unrelated product lines.',
    contextTitle: 'Business context',
    context: [
      { label: 'Contract expires', value: 'In 47 days' },
      { label: 'Alternatives known', value: 'Two comparable suppliers' },
      { label: 'Relationship', value: 'Active and operationally important' },
      { label: 'Price protection', value: 'None in force' },
    ],
    assumptions: [
      { id: 'volume', label: 'Monthly volume', value: 2000, min: 400, max: 2400, step: 100, format: 'number' },
      { id: 'reviewThreshold', label: 'Review threshold', value: 500, min: 100, max: 3000, step: 100, format: 'money', note: 'Cost changes above this are brought to a person.' },
    ],
    impactModel: 'unit-cost',
    cycles: [
      {
        day: 0,
        feed: [
          { id: 's1', day: 0, source: 'Supplier notice', title: 'Unit price rises 8%', detail: 'Notice SN-2481: unit price moves from $10.00 to $10.80 from the next billing month.', disposition: 'escalate', reason: 'Inside scope, and it changes a recurring cost on an active purchasing decision.' },
          { id: 's2', day: 3, source: 'Supplier notice', title: 'Notice SN-2481 re-sent', detail: 'The same notice, unchanged.', disposition: 'suppressed', reason: 'No material change from the notice already reviewed on day 0.' },
          { id: 's3', day: 5, source: 'Supplier newsletter', title: 'New distribution centre opening', detail: 'General supplier announcement.', disposition: 'ignored', reason: 'Outside the monitored scope for this decision.' },
        ],
        signalId: 's1',
        impact: { applies: true },
        signal: { oldPrice: 10, newPrice: 10.8, label: 'Unit price $10.00 → $10.80', source: 'Supplier notice SN-2481', at: 'Scenario day 0' },
        relevance: {
          verdict: 'Relevant',
          why: 'This supplier sits behind a recurring purchase, and the contract renewal falls inside the window in which the increase would take effect.',
        },
        evidence: [
          { id: 'SN-2481', title: 'Supplier price notice SN-2481', excerpt: 'Unit price moves from $10.00 to $10.80, effective from the next billing month.', effective: 'Scenario day 0', checked: 'Scenario day 0', strength: 'strong' },
          { id: 'AGR-118', title: 'Sample supplier agreement', excerpt: 'No price protection is in force for the current period.', effective: 'Scenario day −214', checked: 'Scenario day 0', strength: 'strong' },
          { id: 'MKT-03', title: 'Illustrative comparable pricing', excerpt: 'Two comparable suppliers sit between $10.10 and $10.60 per unit.', effective: 'Scenario day 0', checked: 'Scenario day 0', strength: 'partial' },
        ],
        missing: ['Final switching cost', 'Alternative supplier implementation time'],
        decision: {
          recommendationMaterial: 'Request pricing options before renewal.',
          recommendationImmaterial: 'No action. The change is below the review threshold — keep monitoring to renewal.',
          why: 'The increase is above the threshold at which this business wants a person involved, and the renewal date gives a reason to ask now. Asking preserves supply while the increase is still open to discussion.',
          options: [
            { name: 'Accept the increase', note: 'Sets the new price as the baseline at renewal.' },
            { name: 'Request options before renewal', note: 'Uses the renewal date as leverage while supply continues.', chosen: true },
            { name: 'Switch supplier', note: 'Switching cost and implementation time are unknown.' },
            { name: 'Delay the decision', note: 'The renewal date removes this option within 47 days.' },
          ],
        },
        action: {
          kind: 'message',
          title: 'Draft to supplier',
          target: 'Supplier — account 4471 (sample)',
          subject: 'Pricing options ahead of renewal',
          body: [
            'Notice SN-2481 raises the unit price to $10.80 from next month.',
            'Before renewal, please send volume-based pricing, a fixed-term option,',
            'and the earliest date a revised quote can be confirmed.',
          ],
          consequence: 'Sends a request for options. Does not accept the increase and does not commit to a volume.',
          approvalRequired: true,
          buttonLabel: 'Prepare for approval',
        },
        monitoringPlan: ['Further notices from this supplier', 'The renewal date', 'The reply to this request'],
        outcome: {
          sent: 'Simulated sent. Whether the supplier replies, and what it offers, is unknown.',
          unconfirmed: 'Outcome unconfirmed. The delivery check timed out — that is neither success nor failure.',
          confirmed: 'Delivery confirmed in this example. The supplier has not replied yet.',
          completed: 'Reply received: volume pricing offered at $10.55 above 2,200 units per month.',
        },
        contextUpdate: [
          { label: 'Unit price', value: '$10.80', note: 'Was $10.00' },
          { label: 'Offer on file', value: '$10.55 above 2,200 units', note: 'From the supplier reply' },
        ],
      },
      {
        day: 16,
        feed: [
          { id: 's4', day: 16, source: 'Supplier notice', title: 'Notice SN-2481-B supersedes SN-2481', detail: 'A restated notice replaces the original; the effective date moves.', disposition: 'escalate', reason: 'Inside scope, and it replaces the evidence the current recommendation was built on.' },
        ],
        signalId: 's4',
        impact: { applies: false, note: 'Not recalculated. The notice the figure came from has been replaced and the replacement has not been read, so any number here would be more confident than the evidence.' },
        signal: { oldPrice: 10, newPrice: 10.8, label: 'SN-2481-B supersedes SN-2481', source: 'Supplier notice SN-2481-B', at: 'Scenario day 16' },
        relevance: {
          verdict: 'Relevant — supersedes the earlier evidence',
          why: 'The notice the day-0 decision rested on has been replaced. Until the replacement is read, the earlier reasoning describes terms that may no longer hold.',
        },
        evidence: [
          { id: 'SN-2481-B', title: 'Supplier price notice SN-2481-B', excerpt: 'This notice replaces SN-2481. Terms and effective date are restated.', effective: 'Scenario day 16', checked: 'Not yet read in this example', strength: 'missing' },
          { id: 'SN-2481', title: 'Supplier price notice SN-2481', excerpt: 'Replaced by SN-2481-B.', effective: 'Scenario day 0', checked: 'Scenario day 16', strength: 'superseded' },
        ],
        missing: ['What changed between SN-2481 and SN-2481-B', 'Whether the effective date moved'],
        decision: {
          recommendationMaterial: 'Mark the earlier recommendation superseded and re-read the replacement notice before relying on it.',
          recommendationImmaterial: 'Mark the earlier recommendation superseded and re-read the replacement notice before relying on it.',
          why: 'A recommendation is only as current as the evidence behind it. The replacement notice has not been read, so the honest state is superseded rather than confirmed or withdrawn.',
          options: [
            { name: 'Keep the earlier recommendation', note: 'It rests on a notice that has been replaced.' },
            { name: 'Supersede and re-read', note: 'Retires the old reasoning and names what has to be checked.', chosen: true },
          ],
        },
        action: {
          kind: 'internal',
          title: 'Internal step',
          target: 'Internal — read the replacement notice',
          preview: 'Mark the day-0 recommendation superseded and record what has to be compared between SN-2481 and SN-2481-B before any new position is taken.',
          consequence: 'Internal only. Nothing further is sent to the supplier.',
          approvalRequired: false,
          buttonLabel: 'Record and re-read',
        },
        monitoringPlan: ['The contents of SN-2481-B', 'The renewal date'],
        outcome: { completed: 'Recorded. The day-0 recommendation is marked superseded.' },
        contextUpdate: [{ label: 'Governing notice', value: 'SN-2481-B', note: 'Not yet read' }],
      },
    ],
    limitations: [
      'Supplier, account and notice numbers are illustrative.',
      'Switching cost and implementation time are not modelled.',
      'No message is sent from this site.',
    ],
  },
];

export const findScenario = (id) => scenarios.find((s) => s.id === id) || scenarios[0];
