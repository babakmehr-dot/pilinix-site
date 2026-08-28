// ---------------------------------------------------------------------------
// "Should AI be here?" — a deterministic, rule-based guide.
//
// No model call, no scoring, no percentages. The first rule that matches wins,
// and the matched rule is shown to the visitor.
// ---------------------------------------------------------------------------

export const questions = [
  {
    id: 'owner',
    text: 'Is there a clear owner and desired result?',
    options: [
      { value: 'yes', label: 'Yes' },
      { value: 'no', label: 'No' },
      { value: 'unsure', label: 'Not sure' },
    ],
  },
  {
    id: 'access',
    text: 'Are the necessary data and tools available and permitted?',
    options: [
      { value: 'yes', label: 'Yes' },
      { value: 'no', label: 'No' },
      { value: 'partly', label: 'Partly' },
      { value: 'unsure', label: 'Not sure' },
    ],
  },
  {
    id: 'rules',
    text: 'Can the steps and exceptions be described with stable rules?',
    options: [
      { value: 'mostly-yes', label: 'Mostly yes' },
      { value: 'mostly-no', label: 'Mostly no' },
      { value: 'mixed', label: 'Mixed' },
      { value: 'unsure', label: 'Not sure' },
    ],
  },
  {
    id: 'interpretation',
    text: 'Does the next step require interpreting variable information?',
    options: [
      { value: 'yes', label: 'Yes' },
      { value: 'no', label: 'No' },
      { value: 'sometimes', label: 'Sometimes' },
      { value: 'unsure', label: 'Not sure' },
    ],
  },
  {
    id: 'consequence',
    text: 'What is the consequence of a wrong action, and can it be checked or reversed?',
    options: [
      { value: 'low-reversible', label: 'Low and reversible' },
      { value: 'moderate-reviewable', label: 'Moderate and reviewable' },
      { value: 'high-consequence', label: 'High consequence' },
      { value: 'hard-to-verify', label: 'Hard to verify' },
      { value: 'unsure', label: 'Not sure' },
    ],
  },
];

export const results = {
  'process-fix': {
    title: 'Process fix first',
    accent: '#ffba7a',
    next: 'Name one owner and one desired result, then map where the work actually stops.',
    limitation: 'This is based on five answers about how the work behaves. It does not evaluate your team, systems or constraints.',
  },
  'better-software': {
    title: 'Better software first',
    accent: '#c79cff',
    next: 'Fix where the information lives and who may reach it before adding anything that acts on it.',
    limitation: 'Access and permission problems are usually organisational as well as technical. This guide only sees the answers you gave.',
  },
  'simple-automation': {
    title: 'Simple automation',
    accent: '#72a7ff',
    next: 'Write the rules down, automate the stable path, and route the exceptions to a person.',
    limitation: 'Rule-based automation stays cheap only while the exceptions stay rare. That is worth re-checking later.',
  },
  'ai-agent': {
    title: 'An AI agent may fit',
    accent: '#79f0c7',
    next: 'Start with one decision, one scope and one required approval — not a general assistant.',
    limitation: 'This says an agent may fit the shape of the work. It says nothing about feasibility, cost or data quality in your case.',
  },
  'human-judgment': {
    title: 'Human judgment leads',
    accent: '#a9b8ca',
    next: 'Keep the decision with a person and use software to assemble evidence and options for them.',
    limitation: 'Where accountability sits is a business and legal question. This guide cannot answer it for you.',
  },
  insufficient: {
    title: 'Not enough information yet',
    accent: '#94a0af',
    next: 'The unclear answers are the useful part. Establishing them is the first piece of work.',
    limitation: 'An honest “not yet” is a valid outcome. Guessing here would be worse than waiting.',
  },
};

// Ordered rules. First match wins.
export const rules = [
  {
    id: 'no-owner',
    label: 'No clear owner or desired result',
    when: (a) => a.owner === 'no',
    result: 'process-fix',
    why: 'Without an owner and an agreed result, there is nothing for a system to be correct about. Automating the work would preserve the gap.',
    change: 'A named owner and one agreed measure of success would change this result.',
  },
  {
    id: 'too-unclear',
    label: 'Too many unknowns to answer',
    when: (a) => a.owner === 'unsure' || countUnsure(a) >= 2,
    result: 'insufficient',
    why: 'Several answers were unclear. A recommendation built on them would be more confident than the information behind it.',
    change: 'Answering the unclear questions — particularly ownership and access — would produce a usable result.',
  },
  {
    id: 'no-access',
    label: 'Required data or tools are not available or not permitted',
    when: (a) => a.access === 'no',
    result: 'better-software',
    why: 'The work depends on data or tools that cannot be reached or used yet. That is an access and structure problem, not a reasoning problem.',
    change: 'Permitted access to the necessary systems would move this toward automation or an agent.',
  },
  {
    id: 'high-stakes',
    label: 'High consequence or hard to verify',
    when: (a) => a.consequence === 'high-consequence' || a.consequence === 'hard-to-verify',
    result: 'human-judgment',
    why: 'A wrong action here is expensive or difficult to check. Accountability should stay with a person.',
    change: 'If the same work became low-risk and reversible, more of it could be delegated.',
    mixed: (a) =>
      a.interpretation === 'yes' || a.interpretation === 'sometimes'
        ? 'with AI assistance possible for evidence gathering'
        : a.rules === 'mostly-yes'
          ? 'with automation possible for the preparatory steps'
          : null,
  },
  {
    id: 'stable-and-literal',
    label: 'Stable rules, no interpretation needed',
    when: (a) => a.rules === 'mostly-yes' && a.interpretation === 'no',
    result: 'simple-automation',
    why: 'The steps are describable and nothing needs interpreting. An agent would add moving parts without adding judgment.',
    change: 'Frequent exceptions that need interpreting across sources would change this result.',
    mixed: (a) => (a.access === 'partly' ? 'once the missing access is in place' : null),
  },
  {
    id: 'interpretation-needed',
    label: 'Interpretation needed, consequences checkable',
    when: (a) =>
      (a.interpretation === 'yes' || a.interpretation === 'sometimes') &&
      (a.consequence === 'low-reversible' || a.consequence === 'moderate-reviewable'),
    result: 'ai-agent',
    why: 'The next step depends on reading variable information, and a wrong action can be caught and corrected. That is the shape of work an agent can hold.',
    change: 'If the consequences became hard to verify, the decision should move back to a person.',
    mixed: (a) => {
      const parts = [];
      if (a.consequence === 'moderate-reviewable') parts.push('with review before each consequential step');
      if (a.rules === 'mostly-yes') parts.push('with fixed rules for the stable steps');
      if (a.access === 'partly') parts.push('once the missing access is in place');
      return parts.length ? parts.join(', ') : null;
    },
  },
  {
    id: 'partly-stable',
    label: 'Mixed rules, no interpretation needed',
    when: (a) => a.rules === 'mixed' && a.interpretation === 'no',
    result: 'simple-automation',
    why: 'Part of the work is describable and none of it needs interpreting. Automate the stable part and handle the rest separately.',
    change: 'If the undescribable part grew and started needing interpretation, an agent would become relevant.',
    mixed: () => 'for the stable part, with the exceptions handled separately',
  },
  {
    id: 'partial-access',
    label: 'Access only partly available',
    when: (a) => a.access === 'partly',
    result: 'better-software',
    why: 'The shape of the work is workable, but the data and tools are only partly reachable. That gap decides what is possible next.',
    change: 'Completing the access, or narrowing the scope to what is already reachable, would change this result.',
  },
  {
    id: 'undescribable',
    label: 'Steps not describable, no interpretation needed',
    when: (a) => a.rules === 'mostly-no' && a.interpretation === 'no',
    result: 'process-fix',
    why: 'The steps cannot be described, yet nothing needs interpreting. That usually means the process itself is unclear rather than the information.',
    change: 'A described process would show whether automation or an agent fits.',
  },
  {
    id: 'fallback',
    label: 'No rule matched cleanly',
    when: () => true,
    result: 'insufficient',
    why: 'The answers do not point clearly at one approach.',
    change: 'More detail about consequences and access would usually resolve this.',
  },
];

function countUnsure(answers) {
  return questions.filter((q) => answers[q.id] === 'unsure').length;
}

export function evaluate(answers) {
  const rule = rules.find((r) => r.when(answers));
  const result = results[rule.result];
  const mixed = rule.mixed ? rule.mixed(answers) : null;
  return {
    ruleId: rule.id,
    ruleLabel: rule.label,
    resultId: rule.result,
    title: mixed ? `${result.title}, ${mixed}` : result.title,
    baseTitle: result.title,
    mixed,
    accent: result.accent,
    why: rule.why,
    change: rule.change,
    next: result.next,
    limitation: result.limitation,
  };
}

// One worked example, drawn from the supplier scenario on this site.
export const example = {
  label: 'Monitoring supplier notices for one purchasing decision',
  answers: {
    owner: 'yes',
    access: 'partly',
    rules: 'mixed',
    interpretation: 'sometimes',
    consequence: 'moderate-reviewable',
  },
};
