// ---------------------------------------------------------------------------
// Pilinix Lab notes.
//
// Every note describes a design choice and the example on this site that
// demonstrates it. No test results, no measured reliability, no invented
// reviewers. "Sources" point at the interactive example, which is the only
// evidence these notes actually have.
// ---------------------------------------------------------------------------

export const categories = [
  { id: 'signals', name: 'Signals & timing' },
  { id: 'decisions', name: 'Decisions & evidence' },
  { id: 'action', name: 'Action & control' },
];

export const labNotes = [
  {
    slug: 'when-a-recommendation-should-expire',
    title: 'When a recommendation should expire',
    category: 'decisions',
    question: 'When should a recommendation stop being treated as valid?',
    designChoice:
      'Tie a recommendation to the facts it was built from. When those facts are replaced, mark it superseded and ask for a new review instead of quietly carrying the old approval forward.',
    body: 'A recommendation depends on the facts available when it was made. If a supplier replaces a notice or the expected order volume changes, the old recommendation may no longer fit. Our example marks the earlier decision as superseded and asks for a new review. It does not silently reuse an approval for a changed draft.',
    sources: [
      { label: 'Supplier example — superseded notice', to: '/?state=changed-context' },
      { label: 'Supplier example — approval invalidated after a volume change', to: '/?state=permission' },
    ],
    limitation:
      'This demonstrates a proposed behavior. It does not establish production monitoring reliability.',
    status: 'Design example.',
    published: '28 August 2026',
    review: '28 November 2026',
  },
  {
    slug: 'when-not-to-interrupt',
    title: 'When not to interrupt',
    category: 'signals',
    question: 'Which changes deserve a person’s attention, and which only deserve a record?',
    designChoice:
      'Record every event, surface only the ones that change the decision, and keep the suppressed ones inspectable so the filter can be argued with.',
    body: 'A duplicate update is still an event, but it may not deserve another notification. In this example, the system shows the first relevant notice and records later duplicates without a new alert. The visitor can inspect the suppressed updates. The open question is how to balance missed changes against unnecessary interruptions in a real setting.',
    sources: [{ label: 'Supplier example — suppressed updates', to: '/?state=suppressed' }],
    limitation: 'Timing and filtering use scripted data, not a live model.',
    status: 'Design example.',
    published: '28 August 2026',
    review: '28 November 2026',
  },
  {
    slug: 'what-counts-as-done',
    title: 'What counts as done?',
    category: 'action',
    question: 'At what point can a system claim the work is finished?',
    designChoice:
      'Keep prepared, approved, sent, unconfirmed and confirmed as separate states, and never let a timeout collapse into either success or failure.',
    body: 'Preparing a message, approving it, submitting it and confirming delivery are different states. A timeout does not prove failure or success. In this example, an unconfirmed submission remains unconfirmed until its status is checked. Even a confirmed send does not mean the supplier has accepted the request.',
    sources: [{ label: 'Supplier example — unconfirmed outcome', to: '/?state=unconfirmed' }],
    limitation: 'No messages are sent from this site.',
    status: 'Design example.',
    published: '28 August 2026',
    review: '28 November 2026',
  },
];

export const findNote = (slug) => labNotes.find((n) => n.slug === slug);
