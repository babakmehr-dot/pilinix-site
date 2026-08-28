import React, { useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { HashRouter, NavLink, Route, Routes, useLocation, useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowRight, BrainCircuit, Compass, Eye, Layers3, Menu, Network, Orbit,
  Radar, Route as RouteIcon, Sparkles, X, Zap, ShieldCheck, Search, CircleDot
} from 'lucide-react';
import './styles.css';

const products = [
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


const productDetails = {
  fampal: {label:'FAMILY INTELLIGENCE',headline:'A family advisor built around what happens next.',intro:'FAMPAL helps families move from scattered information to a practical next step across activities, benefits, services, support and everyday family life.',audience:['Families navigating everyday decisions','Parents coordinating activities and services','Newcomer families learning local systems'],owns:['Family context','Decision support','Benefits and service navigation','Activities and planning','Follow-through and family actions'],difference:'FAMPAL is designed as an advisor, not a directory. The goal is not to return more listings — it is to understand the family, narrow the options and help move the decision forward.',lifecycle:['Discover','Understand family context','Compare relevant options','Recommend a next step','Support the action'],external:'https://fampal.ca',externalLabel:'Visit FAMPAL',accent:'#79f0c7'},
  ariment: {label:'CROSS-BORDER INTELLIGENCE',headline:'Connect rules, business reality and viable paths.',intro:'ARIMENT brings immigration, business immigration, market intelligence, programs and opportunity context into one decision system.',audience:['People evaluating immigration paths','Entrepreneurs and business owners','Cross-border business decision makers'],owns:['Program and rule intelligence','Eligibility context','Business and market fit','Evidence gaps','Next-step planning'],difference:'ARIMENT is intended to reason across changing rules, business realities and user context instead of presenting a static program directory.',lifecycle:['Understand the goal','Map relevant pathways','Check constraints and evidence','Compare viable options','Build next steps'],accent:'#72a7ff'},
  exsinoi: {label:'BUSINESS SIGNAL INTELLIGENCE',headline:'The external eyes and ears of a business.',intro:'EXSINOI continuously looks outside the company for changes that may create risk, savings, demand, opportunity or revenue — then connects those signals to business action.',audience:['Small and mid-sized businesses','Owners who cannot monitor every external signal','Teams looking for opportunity and cost intelligence'],owns:['External signal monitoring','Opportunity detection','Risk and regulation changes','Cost-saving signals','Revenue and market signals'],difference:'The system is not built to summarize the internet. It is designed to identify what changed, why it matters to this business and what should happen next.',lifecycle:['Watch relevant sources','Detect meaningful change','Relate it to the business','Prioritize impact','Recommend or trigger action'],accent:'#c79cff'},
  'business-ai-advisor': {label:'AI CAPABILITY INTELLIGENCE',headline:'Before buying AI, understand the business.',intro:'The Business AI Advisor is being designed to reconstruct how a company actually works, identify real problems and then determine whether AI, automation, an existing product or a process fix is the best answer.',audience:['Owners unsure where AI fits','SMBs evaluating AI investment','Teams comparing tools, automation and custom agents'],owns:['Business diagnosis','Workflow mapping','AI suitability','Buy vs build','Tool and agent comparison','ROI and implementation priority'],difference:'Its job is not to sell AI. A valid recommendation can be to use an existing tool, improve a process, automate without AI — or do nothing yet.',lifecycle:['Understand the business','Find friction and opportunity','Evaluate AI suitability','Compare options','Prioritize by impact and cost'],accent:'#ffba7a'}
};

const flow = [
  ['Observe', 'Gather signals, context, data and evidence.', Eye],
  ['Understand', 'Connect information across people, systems and time.', Network],
  ['Decide', 'Identify the most useful next step.', CircleDot],
  ['Act', 'Execute or coordinate real workflows.', Zap],
  ['Learn', 'Improve from outcomes and changing context.', Orbit],
];

function ScrollTop(){
  const { pathname } = useLocation();
  useEffect(()=> window.scrollTo({top:0, behavior:'instant'}), [pathname]);
  return null;
}

function Shell(){
  const [open,setOpen] = useState(false);
  const loc = useLocation();
  useEffect(()=>setOpen(false),[loc.pathname]);
  const nav = [['Products','/products'],['How We Think','/thinking'],['Lab','/lab'],['About','/about'],['Contact','/contact']];
  return <>
    <div className="ambient ambient-a"/><div className="ambient ambient-b"/>
    <header className="nav-wrap">
      <a href="#/" className="brand"><LogoMark/><span>PILINIX</span></a>
      <nav className="desktop-nav">{nav.map(([l,p])=><a key={p} href={`#${p}`}>{l}</a>)}<a href="#/products" className="nav-cta">Explore Products <ArrowRight size={15}/></a></nav>
      <button className="menu-btn" onClick={()=>setOpen(v=>!v)} aria-label="Menu">{open?<X/>:<Menu/>}</button>
      <AnimatePresence>{open && <motion.div initial={{opacity:0,y:-8}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-8}} className="mobile-menu">{nav.map(([l,p])=><a key={p} href={`#${p}`}>{l}</a>)}</motion.div>}</AnimatePresence>
    </header>
    <main><Routes>
      <Route path="/" element={<Home/>}/>
      <Route path="/products" element={<ProductsPage/>}/>
      <Route path="/products/:slug" element={<ProductDetailPage/>}/>
      <Route path="/thinking" element={<ThinkingPage/>}/>
      <Route path="/lab" element={<LabPage/>}/>
      <Route path="/about" element={<AboutPage/>}/>
      <Route path="/contact" element={<ContactPage/>}/>
    </Routes></main>
    <Footer/>
  </>
}

function LogoMark(){return <svg className="logo-mark" viewBox="0 0 42 42" aria-hidden="true"><path d="M7 12.5 20.8 4l13.8 8.2v17.6L20.8 38 7 29.5Z" fill="none" stroke="currentColor" strokeWidth="2"/><path d="M13 16.2 21 11l8 4.8v10.4L21 31l-8-4.9Z" fill="currentColor" opacity=".16"/><path d="M13 26 29 16M13 16l16 10" stroke="currentColor" strokeWidth="1.5" opacity=".85"/></svg>}

function HeroGraph(){
  const nodes = useMemo(()=>Array.from({length:18},(_,i)=>({x:8+(i*37)%84,y:10+(i*53)%76,d:(i%5)*.35})),[]);
  return <div className="hero-graph" aria-hidden="true">
    <div className="graph-grid"/>
    <svg viewBox="0 0 800 500" preserveAspectRatio="none">
      {[...Array(8)].map((_,i)=><motion.path key={i} d={`M ${20+i*25} ${410-i*35} C ${190+i*28} ${350-i*12}, ${430-i*20} ${100+i*33}, ${770-i*12} ${70+i*41}`} fill="none" stroke="rgba(121,240,199,.20)" strokeWidth="1" strokeDasharray="6 9" initial={{pathLength:0,opacity:0}} animate={{pathLength:1,opacity:1}} transition={{duration:2.2,delay:i*.08}} />)}
    </svg>
    {nodes.map((n,i)=><motion.span key={i} className="graph-node" style={{left:`${n.x}%`,top:`${n.y}%`}} animate={{scale:[1,1.7,1],opacity:[.35,1,.35]}} transition={{duration:2.7,repeat:Infinity,delay:n.d}}/>)}
    <div className="flow-labels">{['SIGNAL','UNDERSTAND','DECIDE','ACT'].map((t,i)=><motion.span key={t} initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} transition={{delay:.5+i*.2}}>{t}</motion.span>)}</div>
    <motion.div className="pulse-orb" animate={{x:[0,260,520], y:[320,190,70], scale:[.9,1.25,.9]}} transition={{duration:5.5,repeat:Infinity,ease:'easeInOut'}}/>
  </div>
}

function Home(){
  const navigate=useNavigate();
  return <>
    <section className="hero section-shell">
      <div className="hero-copy">
        <motion.div initial={{opacity:0,y:18}} animate={{opacity:1,y:0}} className="eyebrow"><span className="dot"/> PRACTICAL AGENTIC SYSTEMS</motion.div>
        <motion.h1 initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:.08}}>Intelligence<br/><span>that acts.</span></motion.h1>
        <motion.p initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:.16}} className="lead">Pilinix builds AI systems and agentic products that turn information into decisions — and decisions into action.</motion.p>
        <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:.24}} className="actions"><a className="primary" href="#/products">Explore Products <ArrowRight size={18}/></a><a className="ghost" href="#/thinking">How Pilinix Thinks</a></motion.div>
      </div>
      <HeroGraph/>
      <div className="scroll-cue">SCROLL <span/></div>
    </section>

    <section className="statement section-shell reveal-block">
      <div className="section-number">01</div>
      <div><div className="eyebrow">WHY PILINIX</div><h2>AI is useful when it<br/><span>changes what happens next.</span></h2><p>We focus on systems that observe context, reason across information, maintain state, recommend meaningful next actions and increasingly execute real workflows.</p></div>
    </section>

    <section className="section-shell products-home">
      <SectionHeading num="02" eyebrow="PRODUCT PORTFOLIO" title="Different domains. One operating idea." copy="Each product owns a real decision problem — not just a conversation."/>
      <div className="product-grid">{products.map((p,i)=><ProductCard key={p.name} p={p} i={i}/>)}</div>
    </section>

    <section className="section-shell think-preview">
      <SectionHeading num="03" eyebrow="HOW PILINIX THINKS" title="From signal to outcome." copy="Intelligence becomes useful when it moves through a system."/>
      <FlowStrip/>
      <div className="center-action"><a className="ghost" href="#/thinking">Explore the model <ArrowRight size={16}/></a></div>
    </section>

    <section className="section-shell outcome-section">
      <SectionHeading num="04" eyebrow="FROM INFORMATION TO OUTCOME" title="Not a chatbot. Not a directory." copy="Context, state and execution change the value of intelligence."/>
      <div className="outcomes">
        <Outcome title="Family" items={['Activities · Benefits · Services','Family context','Recommendation','Action']} accent="#79f0c7"/>
        <Outcome title="Business" items={['Signals · Costs · Demand · Risk','Opportunity analysis','Decision','Action']} accent="#c79cff"/>
        <Outcome title="Cross-Border" items={['Rules · Programs · Markets','Context + evidence','Viable paths','Next steps']} accent="#72a7ff"/>
      </div>
    </section>

    <section className="section-shell principles">
      <SectionHeading num="05" eyebrow="PRINCIPLES" title="Built around what matters."/>
      <div className="principle-grid">{['Advisor, not directory.','AI when useful — not AI for its own sake.','Evidence before confidence.','Context and state matter.','Action is the goal.','Humans stay in control where judgment or trust requires it.'].map((x,i)=><motion.div whileHover={{y:-5}} key={x}><span>0{i+1}</span>{x}</motion.div>)}</div>
    </section>
  </>
}

function ProductCard({p,i}){ const Icon=p.icon; return <motion.article initial={{opacity:0,y:22}} whileInView={{opacity:1,y:0}} viewport={{once:true,amount:.2}} transition={{delay:i*.07}} whileHover={{y:-8}} className="product-card" style={{'--accent':p.accent}}>
  <div className="product-top"><div className="icon-box"><Icon size={21}/></div><span className="status">{p.status}</span></div>
  <div className="product-category">{p.category}</div><h3>{p.name}</h3><blockquote>“{p.question}”</blockquote><p>{p.description}</p>
  <a className="text-link" href={`#/products/${p.slug}`}>Explore {p.name} <ArrowRight size={15}/></a>
  <div className="card-glow"/>
</motion.article>}

function SectionHeading({num,eyebrow,title,copy}){return <div className="section-heading"><span className="section-number">{num}</span><div><div className="eyebrow">{eyebrow}</div><h2>{title}</h2>{copy&&<p>{copy}</p>}</div></div>}
function FlowStrip(){return <div className="flow-strip">{flow.map(([name,desc,Icon],i)=><React.Fragment key={name}><motion.div whileHover={{scale:1.03}} className="flow-step"><Icon/><span>{String(i+1).padStart(2,'0')}</span><h4>{name}</h4><p>{desc}</p></motion.div>{i<flow.length-1&&<div className="flow-arrow"><ArrowRight size={18}/></div>}</React.Fragment>)}</div>}
function Outcome({title,items,accent}){return <article className="outcome" style={{'--accent':accent}}><div className="outcome-title">{title}</div>{items.map((x,i)=><React.Fragment key={x}><motion.div whileHover={{x:5}} className="outcome-item">{x}</motion.div>{i<items.length-1&&<div className="outcome-line"><span/></div>}</React.Fragment>)}</article>}

function PageHero({eyebrow,title,copy}){return <section className="page-hero section-shell"><div className="eyebrow">{eyebrow}</div><h1>{title}</h1><p>{copy}</p></section>}

function ProductsPage(){return <>
  <PageHero eyebrow="PRODUCTS" title="A portfolio built around decisions, not demos." copy="Each Pilinix product owns a different real-world problem where context, evidence, state and action matter."/>
  <section className="section-shell portfolio-intro"><div className="portfolio-kicker">THE PORTFOLIO</div><p>Different domains. The same operating idea: observe what matters, understand context, decide what should happen next and help move the work forward.</p></section>
  <section className="section-shell product-list-full">{products.map((p,i)=><ProductRow key={p.name} p={p} i={i}/>)}</section>
  <section className="section-shell future-band"><div><div className="eyebrow">BUILT TO EXPAND</div><h2>More products can join the system without diluting the company.</h2></div><p>Pilinix is the parent product brand. Each product keeps a clear domain, problem and user while sharing a common philosophy around intelligent action.</p></section>
</>}

function ProductRow({p,i}){const Icon=p.icon; return <motion.article initial={{opacity:0,y:24}} whileInView={{opacity:1,y:0}} viewport={{once:true,amount:.15}} className="product-row" style={{'--accent':p.accent}}><div className="product-row-index">0{i+1}</div><div className="product-row-icon"><Icon/></div><div className="product-row-main"><div className="product-category">{p.category}</div><h2>{p.name}</h2><blockquote>“{p.question}”</blockquote><p>{p.description}</p></div><div className="product-row-side"><span className="status">{p.status}</span><a href={`#/products/${p.slug}`} className="round-link" aria-label={`Open ${p.name}`}><ArrowRight/></a></div></motion.article>}

function ProductDetailPage(){const {slug}=useParams(); const p=products.find(x=>x.slug===slug); const d=productDetails[slug]; if(!p||!d) return <PageHero eyebrow="PRODUCT" title="Product not found." copy="Return to the Pilinix product portfolio."/>; const Icon=p.icon; return <><section className="product-detail-hero section-shell" style={{'--accent':d.accent}}><div className="eyebrow"><Icon size={15}/>{d.label}</div><div className="product-detail-grid"><div><span className="status">{p.status}</span><h1>{p.name}</h1><h2>{d.headline}</h2><p>{d.intro}</p><div className="actions"><a className="ghost" href="#/products">Back to Products</a>{d.external&&<a className="primary" href={d.external} target="_blank" rel="noreferrer">{d.externalLabel}<ArrowRight size={17}/></a>}</div></div><div className="detail-orbit"><div className="orbit-core"><Icon/></div>{['Context','Evidence','Decision','Action'].map((x,i)=><span key={x} className={`orbit-label orbit-${i+1}`}>{x}</span>)}</div></div></section><section className="section-shell detail-three"><article><div className="eyebrow">WHO IT IS FOR</div>{d.audience.map(x=><p key={x}>{x}</p>)}</article><article><div className="eyebrow">WHAT IT OWNS</div>{d.owns.map(x=><p key={x}>{x}</p>)}</article><article><div className="eyebrow">WHY IT IS DIFFERENT</div><p className="long-copy">{d.difference}</p></article></section><section className="section-shell lifecycle"><SectionHeading num="01" eyebrow="PRODUCT LOGIC" title="From input to useful next step." copy="The product is designed around a working decision loop, not a single response."/><div className="lifecycle-track">{d.lifecycle.map((x,i)=><div key={x}><span>{String(i+1).padStart(2,'0')}</span><h3>{x}</h3>{i<d.lifecycle.length-1&&<ArrowRight/>}</div>)}</div></section><section className="section-shell product-cta"><div><div className="eyebrow">CURRENT STAGE</div><h2>{p.status}</h2></div><p>{p.name==='FAMPAL'?'FAMPAL is the current live public-test product in the Pilinix portfolio.':'This product is still being developed and shaped. The public site describes the product direction without inventing launch claims.'}</p></section></>}

function ThinkingPage(){return <><PageHero eyebrow="HOW PILINIX THINKS" title="A useful intelligent system is a loop, not a reply." copy="The model matters. But durable value comes from context, state, evidence, orchestration and the ability to move work forward."/><section className="section-shell"><FlowStrip/></section><section className="section-shell deep-grid">{flow.map(([name,desc,Icon],i)=><article key={name}><div className="deep-index">0{i+1}</div><Icon/><h2>{name}</h2><p>{desc}</p><small>{['Signals · context · evidence','Relationships · history · state','Options · trade-offs · confidence','Execution · coordination · handoff','Outcomes · feedback · change'][i]}</small></article>)}</section><section className="section-shell architecture-band"><div><div className="eyebrow">WHY THIS MATTERS</div><h2>Chat is an interface. The system is everything behind it.</h2></div><div className="architecture-list">{['Persistent context','Authoritative data','Verification','State transitions','Monitoring','Tools & integrations','Human handoff','Outcome feedback'].map((x,i)=><div key={x}><span>{String(i+1).padStart(2,'0')}</span>{x}</div>)}</div></section><section className="section-shell thinking-example"><SectionHeading num="02" eyebrow="EXAMPLE" title="One question. A system behind it." copy="A useful answer may require profile context, schedules, eligibility, cost, preferences, availability and the ability to save or act on the result."/><div className="thinking-chain">{['Question','Context','Relevant evidence','Decision logic','Recommended action','Follow-through'].map((x,i)=><React.Fragment key={x}><div>{x}</div>{i<5&&<ArrowRight/>}</React.Fragment>)}</div></section></>}

function LabPage(){ const themes=['Family systems','Business intelligence','AI capability diagnosis','Cross-border intelligence','Agentic workflows','Decision systems','Persistent intelligent systems','Signal-to-action systems']; return <><PageHero eyebrow="PILINIX LAB" title="We look for utility, not novelty." copy="Pilinix Lab explores where intelligent systems can own a meaningful workflow, reduce friction and create a measurable outcome."/><section className="section-shell constellation"><div className="constellation-core"><LogoMark/><span>PILINIX LAB</span></div>{themes.map((t,i)=><motion.div key={t} className={`theme theme-${i+1}`} whileHover={{scale:1.08}}>{t}</motion.div>)}<svg viewBox="0 0 1000 560" preserveAspectRatio="none">{themes.map((_,i)=><line key={i} x1="500" y1="280" x2={120+(i*113)%780} y2={70+(i*97)%420} stroke="rgba(255,255,255,.08)"/>)}</svg></section><section className="section-shell lab-method"><div><div className="eyebrow">R&D FILTER</div><h2>Not every AI idea deserves to become a product.</h2><p>We look for problems where a persistent system can do materially more than a general-purpose model in a single conversation.</p></div><div className="lab-criteria">{['A real recurring or trigger-based need','Context that must persist over time','External or specialized information','A decision or workflow to own','A measurable benefit: time, money, access or risk','A reason the product remains useful after the first answer'].map((x,i)=><div key={x}><span>{String(i+1).padStart(2,'0')}</span><p>{x}</p></div>)}</div></section><section className="section-shell lab-note"><Radar/><div><div className="eyebrow">CURRENT EXPLORATION</div><h2>Research stays broad. Products stay focused.</h2><p>The Lab can investigate many domains, but a product only moves forward when the problem, user, workflow and reason to exist are clear.</p></div></section></>}

function AboutPage(){return <><PageHero eyebrow="ABOUT PILINIX" title="A product company for practical intelligent systems." copy="Pilinix builds AI and agentic products around real decisions, persistent context and workflows that matter."/><section className="section-shell about-grid"><div><div className="eyebrow">WHAT WE BUILD</div><h2>Beyond a model response.</h2><p>General-purpose AI models are powerful. But valuable real-world products often need persistent context, specialized information, verified evidence, state, monitoring, integration, orchestration and action.</p><p>That is the space Pilinix is built to explore: where intelligence becomes a working system instead of another answer box.</p></div><div className="about-list">{['Persistent context','Specialized information','Verified evidence','State & memory','Monitoring','Integration','Orchestration','Action'].map((x,i)=><div key={x}><span>{String(i+1).padStart(2,'0')}</span>{x}</div>)}</div></section><section className="section-shell company-model"><div className="eyebrow">COMPANY MODEL</div><div className="company-model-grid"><article><h3>Parent brand</h3><p>Pilinix is the company and product platform.</p></article><article><h3>Independent products</h3><p>FAMPAL, ARIMENT, EXSINOI and future products each own a distinct domain.</p></article><article><h3>Shared philosophy</h3><p>Understand context. Make a useful decision. Move toward action.</p></article></div></section><section className="section-shell name-origin"><div className="eyebrow">THE NAME</div><h2>PILINIX</h2><p><strong>Platform Intelligence Layer for Integrated Network Infrastructure and eXecution.</strong></p><p>It is a useful description of how we think about intelligent systems. But Pilinix is first and foremost the name of the company.</p></section></>}

function ContactPage(){ const [sent,setSent]=useState(false); return <><PageHero eyebrow="CONTACT" title="Start a conversation." copy="Product, pilot, partnership or a business AI question — tell us what you are exploring."/><section className="section-shell contact-grid"><div className="contact-side"><div className="mini-card"><Search/><h3>Products</h3><p>Ask about FAMPAL, ARIMENT, EXSINOI or an upcoming Pilinix product.</p></div><div className="mini-card"><Layers3/><h3>Partnership</h3><p>Explore a pilot, integration, distribution relationship or domain collaboration.</p></div><div className="mini-card"><ShieldCheck/><h3>Business AI Assessment</h3><p>Discuss whether AI actually fits a business problem before choosing a tool or build.</p></div><div className="contact-note"><div className="eyebrow">PREVIEW</div><p>This public review build does not transmit form submissions yet. The final production site will connect the contact workflow before launch.</p></div></div><form className="contact-form" onSubmit={e=>{e.preventDefault();setSent(true)}}>{sent?<motion.div initial={{opacity:0,scale:.98}} animate={{opacity:1,scale:1}} className="success"><Sparkles/><h2>Thanks.</h2><p>This is still the review build, so nothing was transmitted. The production contact workflow will be connected before the final domain launch.</p><button type="button" className="ghost" onClick={()=>setSent(false)}>Back</button></motion.div>:<><label>Name<input required placeholder="Your name"/></label><label>Email<input required type="email" placeholder="you@company.com"/></label><label>Organization <span>optional</span><input placeholder="Organization"/></label><label>What are you interested in?<select defaultValue="Products"><option>Products</option><option>Partnership</option><option>Pilot</option><option>Business AI Assessment</option><option>Other</option></select></label><label>Message<textarea required rows="6" placeholder="Tell us what you're exploring..."/></label><button className="primary">Start a Conversation <ArrowRight size={17}/></button><small>Review build: submissions are not transmitted yet.</small></>}</form></section></>}

function Footer(){return <footer className="footer section-shell"><div className="footer-brand"><div className="brand"><LogoMark/><span>PILINIX</span></div><p>Practical intelligence. Real action.</p></div><div className="footer-links"><div><h5>Company</h5><a href="#/products">Products</a><a href="#/lab">Lab</a><a href="#/about">About</a><a href="#/contact">Contact</a></div><div><h5>Products</h5><a href="https://fampal.ca" target="_blank" rel="noreferrer">FAMPAL</a><span>ARIMENT</span><span>EXSINOI</span><span>Business AI Advisor</span></div></div><div className="footer-bottom"><span>© {new Date().getFullYear()} Pilinix.</span><span>Built around real decisions.</span></div></footer>}

function App(){return <HashRouter><ScrollTop/><Shell/></HashRouter>}
createRoot(document.getElementById('root')).render(<App/>);
