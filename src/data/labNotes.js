// ---------------------------------------------------------------------------
// Pilinix Lab notes.
//
// Each note describes a design choice and the example on this site that
// demonstrates it. No test results, no measured reliability, no invented
// reviewers. "Sources" point at the interactive demonstration, which is the
// only evidence these notes actually have.
// ---------------------------------------------------------------------------

export const categories = [
  { id: 'context', name: 'Context & memory' },
  { id: 'signals', name: 'Signals & timing' },
  { id: 'decisions', name: 'Decisions & evidence' },
  { id: 'action', name: 'Action & control' },
];

const PUBLISHED = '28 August 2026';
const REVIEW = '28 November 2026';

export const labNotes = [
  {
    slug: 'when-a-signal-becomes-relevant',
    title: 'When a signal becomes relevant',
    category: 'context',
    question: 'What turns a change in the world into a change for someone in particular?',
    designChoice:
      'Judge relevance against a specific, persistent context rather than against the signal itself. The same event is escalated for one case and ignored for another, and the reason is recorded either way.',
    body: 'A central bank raising a rate is not, on its own, relevant to anybody. It becomes relevant when it reaches a household that holds a variable-rate mortgage with a lender that passes the change through. In our example the policy announcement is detected, the commentary about it is ignored, and the lender notice — the thing that actually reaches the payment — is what escalates. The context doing that filtering is the same context the previous cycle wrote to.',
    sources: [
      { label: 'Demonstration — context matching', to: '/?state=context' },
      { label: 'Demonstration — the monitored scope', to: '/?state=monitoring' },
    ],
    limitation:
      'Relevance here is decided by hand-written rules over illustrative data. It does not establish that the same judgements would hold over real sources at volume.',
    status: 'Design example.',
    published: PUBLISHED,
    review: REVIEW,
  },
  {
    slug: 'when-a-signal-should-be-ignored',
    title: 'When a signal should be ignored',
    category: 'signals',
    question: 'What should a monitoring system deliberately refuse to pass on?',
    designChoice:
      'Give every observed item an explicit disposition and a reason, and keep the ignored ones inspectable. A filter nobody can audit is indistinguishable from a system that missed something.',
    body: 'Our example observes squad news next to a fixture time change, a facility announcement next to a price notice, and a national feature next to a local index reading. In each pair one item can move a decision and one cannot. Ignoring the second is not a failure to notice it — the item is recorded with the reason it was dropped, and the visitor can open the list and disagree.',
    sources: [{ label: 'Demonstration — what was filtered out', to: '/?state=filtering' }],
    limitation:
      'Scope in the demonstration is fixed in advance. Deciding scope well for a real case is the harder problem, and this does not solve it.',
    status: 'Design example.',
    published: PUBLISHED,
    review: REVIEW,
  },
  {
    slug: 'when-not-to-interrupt',
    title: 'When not to interrupt',
    category: 'signals',
    question: 'Which changes deserve a person’s attention, and which only deserve a record?',
    designChoice:
      'Surface the first relevant item, record later duplicates without a new alert, and let a rise sit under a stated persistence rule before it becomes anyone’s problem.',
    body: 'A duplicate update is still an event, but it may not deserve another notification. In the attention example a category rises above its baseline and is marked "monitor" rather than escalated, because the business itself set a rule about how long a rise must last before it is worth spending on. Four weeks is recorded and nobody is interrupted; six weeks changes the answer. The open question is how to balance missed changes against unnecessary interruptions in a real setting.',
    sources: [
      { label: 'Demonstration — a rise held under a persistence rule', to: '/?state=filtering' },
      { label: 'Demonstration — a decision not to act', to: '/?state=decision' },
    ],
    limitation: 'Timing and filtering use scripted data, not a live model.',
    status: 'Design example.',
    published: PUBLISHED,
    review: REVIEW,
  },
  {
    slug: 'when-a-recommendation-should-expire',
    title: 'When a recommendation should expire',
    category: 'decisions',
    question: 'When should a recommendation stop being treated as valid?',
    designChoice:
      'Tie a recommendation to the facts it was built from. When those facts are replaced, mark it superseded and ask for a new review instead of quietly carrying the old approval forward.',
    body: 'A recommendation depends on the facts available when it was made. If a supplier replaces a notice, a program publishes a transition provision, or the expected volume changes, the old recommendation may no longer fit. Our example marks the earlier decision superseded and asks for a new review. It does not silently reuse an approval for a changed action, and it does not defend the earlier reasoning — that reasoning was correct on facts that have since moved.',
    sources: [
      { label: 'Demonstration — a superseding notice', to: '/?state=superseded' },
      { label: 'Demonstration — approval invalidated by a changed input', to: '/?state=permission' },
    ],
    limitation:
      'This demonstrates a proposed behavior. It does not establish production monitoring reliability.',
    status: 'Design example.',
    published: PUBLISHED,
    review: REVIEW,
  },
  {
    slug: 'why-impact-needs-assumptions',
    title: 'Why impact needs assumptions',
    category: 'decisions',
    question: 'What has to be visible before a number is worth showing?',
    designChoice:
      'Show the formula, the inputs, and what the model excludes. Let the visitor change the inputs and watch the conclusion move, so the estimate can be argued with rather than believed.',
    body: 'A monthly payment change of sixty-two dollars is not a fact about the world; it is the output of a balance, an amortisation, and a rate, run through an amortisation formula. Change the balance and it becomes something else. In the local-event example the capture rate — what share of an arena crowd buys coffee — is an assumption with no measurement behind it, and the staffing conclusion depends on it entirely. Making it a control rather than a constant is the honest form.',
    sources: [
      { label: 'Demonstration — change an assumption', to: '/?state=assumptions' },
      { label: 'Demonstration — the same change with no impact figure', to: '/?state=superseded' },
    ],
    limitation:
      'The models are deliberately small. They exclude far more than they include, and each one lists what it leaves out.',
    status: 'Design example.',
    published: PUBLISHED,
    review: REVIEW,
  },
  {
    slug: 'when-a-system-should-hold',
    title: 'When a system should hold instead of act',
    category: 'decisions',
    question: 'What should happen when the fact that decides the answer is missing?',
    designChoice:
      'Hold, name the missing fact, and request exactly that one thing. Do not produce a consequential recommendation on top of a gap, and do not present the gap as a minor caveat underneath a confident answer.',
    body: 'In the benefits example a household income figure on file is a year out of date, and the threshold it would be compared against has just moved. Both the confident answers available — "you are still eligible" and "you are no longer eligible" — are unsupported. The system holds, marks the evidence stale, and asks for the one figure that resolves it. Holding is recorded as a decision with its reason, not as an absence of one.',
    sources: [{ label: 'Demonstration — a hold on missing evidence', to: '/?state=missing-evidence' }],
    limitation:
      'Knowing which single fact decides an answer is easy in a scripted example and hard in general. This shows the behaviour, not a method for finding it.',
    status: 'Design example.',
    published: PUBLISHED,
    review: REVIEW,
  },
  {
    slug: 'what-counts-as-done',
    title: 'What counts as done?',
    category: 'action',
    question: 'At what point can a system claim the work is finished?',
    designChoice:
      'Keep prepared, approved, sent, unconfirmed, confirmed and completed as separate states, and never let a timeout collapse into either success or failure.',
    body: 'Preparing a message, approving it, submitting it and confirming delivery are different states. A timeout does not prove failure or success. In this example an unconfirmed submission remains unconfirmed until its status is checked, and a confirmed delivery still does not mean the recipient has agreed to anything. The outcome only enters the context once it is verified, which is what stops the next cycle inheriting a result that never happened.',
    sources: [
      { label: 'Demonstration — an unconfirmed outcome', to: '/?state=unconfirmed' },
      { label: 'Demonstration — the verified outcome entering context', to: '/?state=closed-loop' },
    ],
    limitation: 'No messages are sent from this site.',
    status: 'Design example.',
    published: PUBLISHED,
    review: REVIEW,
  },
];

export const findNote = (slug) => labNotes.find((n) => n.slug === slug);
