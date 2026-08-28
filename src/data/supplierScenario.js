// ---------------------------------------------------------------------------
// Supplier scenario — CONTENT ONLY.
//
// Everything in this file is illustrative sample data for one fictional
// purchasing decision. There is no live monitoring, no supplier integration and
// no message is ever sent. State-transition logic lives in
// src/lib/scenarioMachine.js so copy can change without touching the rules.
// ---------------------------------------------------------------------------

export const scenario = {
  id: 'supplier-cost-increase',
  version: '1.0',
  title: 'Supplier cost increased by 8%',
  signal: 'Supplier price notice SN-2481 raises the unit price by 8%.',
  scope: 'Supplier notices for this purchasing decision.',
  facts: {
    currentUnitCost: 10,
    proposedUnitCost: 10.8,
    defaultVolume: 2000,
    volumeMin: 400,
    volumeMax: 2400,
    volumeStep: 100,
    effectiveDate: 'Next month',
  },
};

// Evidence strength labels. No numeric confidence — a percentage here would be
// more precise than the underlying information.
export const strengthLabels = {
  strong: 'Strong evidence',
  partial: 'Partial evidence',
  missing: 'Missing evidence',
  conflicting: 'Conflicting evidence',
  superseded: 'Superseded evidence',
};

export const strengthTone = {
  strong: 'green',
  partial: 'amber',
  missing: 'amber',
  conflicting: 'red',
  superseded: 'red',
};

// Illustrative sources. Excerpts are written for this example, not quoted from
// any real document.
export const sources = {
  notice: {
    id: 'SN-2481',
    title: 'Supplier price notice SN-2481',
    excerpt: 'Unit price moves from $10.00 to $10.80, effective from the next billing month.',
    effective: 'Scenario day 0',
    checked: 'Scenario day 0',
  },
  noticeB: {
    id: 'SN-2481-B',
    title: 'Supplier price notice SN-2481-B',
    excerpt: 'This notice replaces SN-2481. Effective date and terms are restated.',
    effective: 'Scenario day 12',
    checked: 'Not read in this example',
  },
  agreementLocked: {
    id: 'AGR-118 · 7.2',
    title: 'Sample supplier agreement, clause 7.2',
    excerpt: 'Agreed unit pricing is held for 90 days from the last renewal date.',
    effective: 'Scenario day −214',
    checked: 'Scenario day 0',
  },
  agreementOpen: {
    id: 'AGR-118 · 7.2',
    title: 'Sample supplier agreement, clause 7.2',
    excerpt: 'No price protection is in force for the current period.',
    effective: 'Scenario day −214',
    checked: 'Scenario day 0',
  },
  agreementUnread: {
    id: 'AGR-118',
    title: 'Sample supplier agreement — price clause',
    excerpt: 'Not retrieved in this example. The price-lock status is unknown.',
    effective: '—',
    checked: 'Not checked',
  },
  comparable: {
    id: 'MKT-03',
    title: 'Illustrative comparable pricing',
    excerpt: 'Two comparable suppliers sit between $10.10 and $10.60 per unit.',
    effective: 'Scenario day 0',
    checked: 'Scenario day 0',
  },
  moq: {
    id: 'SN-2503',
    title: 'Supplier notice SN-2503',
    excerpt: 'Minimum order quantity increases to 1,500 units per month.',
    effective: 'Scenario day 9',
    checked: 'Scenario day 9',
  },
};

// The four context choices the visitor can select. These are the "price-lock /
// notice status" facts — the part of the context that changes the next step.
export const contextChoices = [
  {
    key: 'unknown',
    label: 'Price-lock status unknown',
    hint: 'Starting state — the agreement has not been checked.',
    fact: 'Price-lock status: unknown',
    factLabel: 'Price-lock status',
    factValue: 'Unknown',
  },
  {
    key: 'price-lock',
    label: 'Existing price protected for 90 days',
    hint: 'Clause 7.2 holds the agreed price.',
    fact: 'Price-lock status: protected for 90 days',
    factLabel: 'Price-lock status',
    factValue: 'Protected for 90 days',
  },
  {
    key: 'next-month',
    label: 'Increase applies next month',
    hint: 'No protection is in force.',
    fact: 'Price-lock status: no protection — increase applies next month',
    factLabel: 'Price-lock status',
    factValue: 'No protection — applies next month',
  },
  {
    key: 'superseded',
    label: 'Notice superseded',
    hint: 'A later notice replaced SN-2481.',
    fact: 'Notice status: SN-2481 superseded by SN-2481-B',
    factLabel: 'Notice status',
    factValue: 'SN-2481 superseded by SN-2481-B',
  },
];

// Outcome content per context key. `impactNote` and drafts receive the derived
// volume/impact values at render time.
export const decisions = {
  unknown: {
    recommendation: 'Confirm whether the new price is contractually applicable before responding.',
    why: 'The arithmetic is clear, but the price clause in the agreement has not been checked. Responding now would treat an unverified price as the baseline.',
    conditionalImpact: true,
    impactNote: 'Assumes {volume} units and that the increase applies. Contract terms are not yet confirmed.',
    evidence: ['notice', 'agreementUnread', 'volume', 'comparable'],
    missing: [
      'Whether the new price is contractually applicable',
      'Final switching cost',
      'Alternative supplier implementation time',
    ],
    chosenOption: 'Hold pending evidence',
    action: {
      kind: 'request-fact',
      title: 'Request one fact',
      target: 'Internal — contracts folder',
      preview:
        'Retrieve the price clause from the sample supplier agreement (AGR-118) and record whether a price lock applies to orders placed next month.',
      consequence: 'Internal only. Nothing is sent to the supplier and no cost is accepted.',
      approvalRequired: false,
      buttonLabel: 'Request the missing fact',
      followUp:
        'Fact requested. In this example you supply the answer: set the price-lock status under “Change the context”.',
    },
  },
  'price-lock': {
    recommendation: 'Ask the supplier to reconcile the price increase notice with the sample price-lock clause.',
    why: 'The notice and the agreement disagree. Asking for reconciliation costs little, keeps supply continuous, and neither accepts the increase nor starts a switch.',
    conditionalImpact: true,
    impactNote: 'Assumes {volume} units. Under clause 7.2 the increase may not apply during the protected period.',
    evidence: ['notice', 'agreementLocked', 'conflict', 'volume'],
    missing: [
      'Whether the supplier accepts that clause 7.2 applies',
      'Final switching cost',
      'Alternative supplier implementation time',
    ],
    chosenOption: 'Ask for clarification',
    action: {
      kind: 'message',
      title: 'Draft to supplier',
      target: 'Supplier — account 4471 (sample)',
      subject: 'Price notice SN-2481 and agreed price protection',
      body: [
        'Notice SN-2481 sets a unit price of $10.80 from next month.',
        'Clause 7.2 of the current agreement holds unit pricing for 90 days.',
        'Please confirm which applies to orders placed inside that period.',
        'No change to current orders is requested in this message.',
      ],
      consequence:
        'Sends a question. Does not accept the increase and does not start a supplier change.',
      approvalRequired: true,
      buttonLabel: 'Prepare for approval',
      stateNotes: ['Review draft', 'No cost acceptance', 'No supplier switch'],
    },
  },
  'next-month': {
    recommendation: 'Review projected exposure and request pricing options before renewal.',
    why: 'With no price protection, the increase lands next month. Requesting options before renewal keeps the relationship intact while the exposure is still open to discussion.',
    conditionalImpact: false,
    impactNote: 'Assumes {volume} units per month at the notified price, from next month.',
    evidence: ['notice', 'agreementOpen', 'volume', 'comparable'],
    missing: ['Final switching cost', 'Alternative supplier implementation time'],
    chosenOption: 'Renegotiate',
    action: {
      kind: 'message',
      title: 'Draft to supplier',
      target: 'Supplier — account 4471 (sample)',
      subject: 'Pricing options ahead of renewal',
      body: [
        'Notice SN-2481 raises the unit price to $10.80 from next month.',
        'At {volume} units per month that is {impact} of additional cost.',
        'Before renewal, please send volume-based pricing, a fixed-term option,',
        'and the earliest date a revised quote can be confirmed.',
      ],
      consequence:
        'Sends a request for options. Does not accept the increase and does not commit to a volume.',
      approvalRequired: true,
      buttonLabel: 'Prepare for approval',
      stateNotes: ['Prepare supplier response', 'Human approval required before simulated send'],
    },
  },
  superseded: {
    recommendation: 'Re-check current evidence before relying on the old recommendation.',
    why: 'The notice this recommendation was built on has been replaced. Until the replacement is read, the earlier reasoning describes facts that no longer hold.',
    conditionalImpact: true,
    impactNote: 'Assumes {volume} units and the superseded notice. The replacement notice has not been read.',
    evidence: ['noticeSuperseded', 'noticeB', 'volume'],
    missing: [
      'What changed between SN-2481 and SN-2481-B',
      'Whether the effective date moved',
      'Final switching cost',
    ],
    chosenOption: 'Hold pending evidence',
    action: {
      kind: 'recheck',
      title: 'Internal step',
      target: 'Internal — read the replacement notice',
      preview: 'Read notice SN-2481-B and record what changed against SN-2481.',
      consequence: 'Internal only. Nothing is sent to the supplier.',
      approvalRequired: false,
      buttonLabel: 'Re-check the current notice',
      followUp: 'Evidence re-checked against SN-2481-B: the increase applies next month.',
    },
  },
};

export const optionsConsidered = [
  { name: 'Accept increase', note: 'Lowest effort. Sets the new price as the baseline at renewal.' },
  { name: 'Ask for clarification', note: 'Cheap, keeps supply continuous, commits to nothing.' },
  { name: 'Renegotiate', note: 'Uses the renewal date as leverage while the relationship stays intact.' },
  { name: 'Compare alternatives', note: 'Useful, but switching cost and implementation time are unknown.' },
  { name: 'Hold pending evidence', note: 'Correct while a fact that changes the answer is missing.' },
];

// Scenario timeline. Explicit scenario days — no live clock, no fake timestamps.
export const timeline = [
  {
    id: 'evt-dup',
    day: 3,
    title: 'Supplier notice SN-2481 re-sent',
    detail: 'The same price notice arrived a second time with no change to its terms.',
    disposition: 'suppressed',
    reason: 'No material change from the previously reviewed notice.',
    kind: 'duplicate',
  },
  {
    id: 'evt-irrelevant',
    day: 5,
    title: 'Supplier newsletter: new distribution centre',
    detail: 'General supplier announcement about a facility opening.',
    disposition: 'suppressed',
    reason: 'Outside the monitoring scope for this decision.',
    kind: 'irrelevant',
  },
  {
    id: 'evt-material',
    day: 9,
    title: 'Supplier notice SN-2503: minimum order quantity raised',
    detail: 'Minimum order quantity increases to 1,500 units per month.',
    disposition: 'shown',
    reason: 'Inside the monitoring scope, and it changes an input this decision depends on: order volume.',
    kind: 'material',
  },
  {
    id: 'evt-supersede',
    day: 12,
    title: 'Supplier notice SN-2481-B supersedes SN-2481',
    detail: 'The original price notice has been replaced by a restated notice.',
    disposition: 'shown',
    reason: 'Inside the monitoring scope, and it replaces the evidence the current recommendation was built on.',
    kind: 'supersede',
  },
];
