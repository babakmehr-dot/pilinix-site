import { BrainCircuit, Compass, Radar, Route as RouteIcon } from 'lucide-react';

export const products = [
  {
    name: 'FAMPAL',
    slug: 'fampal',
    category: 'Family Intelligence',
    question: 'What should this family do next?',
    description: 'An AI Family Advisor that helps families navigate activities, benefits, services, support, planning, and everyday decisions.',
    status: 'Live / Public Test',
    accent: '#79f0c7',
    href: 'https://fampal.ca',
    icon: Compass,
  },
  {
    name: 'ARIMENT',
    slug: 'ariment',
    category: 'Cross-Border Intelligence',
    question: 'What path actually fits this person or business?',
    description: 'Immigration, business immigration and cross-border intelligence that connects rules, opportunities, markets, evidence and next steps.',
    status: 'In Development',
    accent: '#72a7ff',
    icon: RouteIcon,
  },
  {
    name: 'EXSINOI',
    slug: 'exsinoi',
    category: 'Business Signal Intelligence',
    question: 'What is changing outside the business that matters inside it?',
    description: 'External intelligence that looks for signals, risks, savings, demand and revenue opportunities — then turns them into decisions.',
    status: 'R&D',
    accent: '#c79cff',
    icon: Radar,
  },
  {
    name: 'Business AI Advisor',
    slug: 'business-ai-advisor',
    category: 'AI Capability Intelligence',
    question: 'Does this business actually need AI — and where?',
    description: 'A diagnostic agent that understands how a business works, then compares process fixes, automation, existing AI tools and custom agents.',
    status: 'Coming Soon',
    accent: '#ffba7a',
    icon: BrainCircuit,
  },
];

export const productDetails = {
  fampal: {label:'FAMILY INTELLIGENCE',headline:'A family advisor built around what happens next.',intro:'FAMPAL helps families move from scattered information to a practical next step across activities, benefits, services, support and everyday family life.',audience:['Families navigating everyday decisions','Parents coordinating activities and services','Newcomer families learning local systems'],owns:['Family context','Decision support','Benefits and service navigation','Activities and planning','Follow-through and family actions'],difference:'FAMPAL is designed as an advisor, not a directory. The goal is not to return more listings — it is to understand the family, narrow the options and help move the decision forward.',lifecycle:['Discover','Understand family context','Compare relevant options','Recommend a next step','Support the action'],external:'https://fampal.ca',externalLabel:'Visit FAMPAL',accent:'#79f0c7'},
  ariment: {label:'CROSS-BORDER INTELLIGENCE',headline:'Connect rules, business reality and viable paths.',intro:'ARIMENT brings immigration, business immigration, market intelligence, programs and opportunity context into one decision system.',audience:['People evaluating immigration paths','Entrepreneurs and business owners','Cross-border business decision makers'],owns:['Program and rule intelligence','Eligibility context','Business and market fit','Evidence gaps','Next-step planning'],difference:'ARIMENT is intended to reason across changing rules, business realities and user context instead of presenting a static program directory.',lifecycle:['Understand the goal','Map relevant pathways','Check constraints and evidence','Compare viable options','Build next steps'],accent:'#72a7ff'},
  exsinoi: {label:'BUSINESS SIGNAL INTELLIGENCE',headline:'The external eyes and ears of a business.',intro:'EXSINOI continuously looks outside the company for changes that may create risk, savings, demand, opportunity or revenue — then connects those signals to business action.',audience:['Small and mid-sized businesses','Owners who cannot monitor every external signal','Teams looking for opportunity and cost intelligence'],owns:['External signal monitoring','Opportunity detection','Risk and regulation changes','Cost-saving signals','Revenue and market signals'],difference:'The system is not built to summarize the internet. It is designed to identify what changed, why it matters to this business and what should happen next.',lifecycle:['Watch relevant sources','Detect meaningful change','Relate it to the business','Prioritize impact','Recommend or trigger action'],accent:'#c79cff'},
  'business-ai-advisor': {label:'AI CAPABILITY INTELLIGENCE',headline:'Before buying AI, understand the business.',intro:'The Business AI Advisor is being designed to reconstruct how a company actually works, identify real problems and then determine whether AI, automation, an existing product or a process fix is the best answer.',audience:['Owners unsure where AI fits','SMBs evaluating AI investment','Teams comparing tools, automation and custom agents'],owns:['Business diagnosis','Workflow mapping','AI suitability','Buy vs build','Tool and agent comparison','ROI and implementation priority'],difference:'Its job is not to sell AI. A valid recommendation can be to use an existing tool, improve a process, automate without AI — or do nothing yet.',lifecycle:['Understand the business','Find friction and opportunity','Evaluate AI suitability','Compare options','Prioritize by impact and cost'],accent:'#ffba7a'}
};
