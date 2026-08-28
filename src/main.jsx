import React, { useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { HashRouter, NavLink, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowRight, BrainCircuit, Compass, Eye, Layers3, Menu, Network, Orbit,
  Radar, Route as RouteIcon, Sparkles, X, Zap, ShieldCheck, Search, CircleDot
} from 'lucide-react';
import './styles.css';

const products = [
  {
    name: 'FAMPAL',
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
    category: 'Cross-Border Intelligence',
    question: 'What path actually fits this person or business?',
    description: 'Immigration, business immigration and cross-border intelligence that connects rules, opportunities, markets, evidence and next steps.',
    status: 'In Development',
    accent: '#72a7ff',
    icon: RouteIcon,
  },
  {
    name: 'EXSINOI',
    category: 'Business Signal Intelligence',
    question: 'What is changing outside the business that matters inside it?',
    description: 'External intelligence that looks for signals, risks, savings, demand and revenue opportunities — then turns them into decisions.',
    status: 'R&D',
    accent: '#c79cff',
    icon: Radar,
  },
  {
    name: 'Business AI Advisor',
    category: 'AI Capability Intelligence',
    question: 'Does this business actually need AI — and where?',
    description: 'A diagnostic agent that understands how a business works, then compares process fixes, automation, existing AI tools and custom agents.',
    status: 'Coming Soon',
    accent: '#ffba7a',
    icon: BrainCircuit,
  },
];

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
      <NavLink to="/" className="brand"><LogoMark/><span>PILINIX</span></NavLink>
      <nav className="desktop-nav">{nav.map(([l,p])=><NavLink key={p} to={p}>{l}</NavLink>)}<NavLink to="/products" className="nav-cta">Explore Products <ArrowRight size={15}/></NavLink></nav>
      <button className="menu-btn" onClick={()=>setOpen(v=>!v)} aria-label="Menu">{open?<X/>:<Menu/>}</button>
      <AnimatePresence>{open && <motion.div initial={{opacity:0,y:-8}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-8}} className="mobile-menu">{nav.map(([l,p])=><NavLink key={p} to={p}>{l}</NavLink>)}</motion.div>}</AnimatePresence>
    </header>
    <main><Routes>
      <Route path="/" element={<Home/>}/>
      <Route path="/products" element={<ProductsPage/>}/>
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
        <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:.24}} className="actions"><button className="primary" onClick={()=>navigate('/products')}>Explore Products <ArrowRight size={18}/></button><button className="ghost" onClick={()=>navigate('/thinking')}>How Pilinix Thinks</button></motion.div>
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
      <div className="center-action"><button className="ghost" onClick={()=>navigate('/thinking')}>Explore the model <ArrowRight size={16}/></button></div>
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
  {p.href?<a className="text-link" href={p.href} target="_blank" rel="noreferrer">Explore {p.name} <ArrowRight size={15}/></a>:<span className="text-link muted-link">Explore {p.name} <ArrowRight size={15}/></span>}
  <div className="card-glow"/>
</motion.article>}

function SectionHeading({num,eyebrow,title,copy}){return <div className="section-heading"><span className="section-number">{num}</span><div><div className="eyebrow">{eyebrow}</div><h2>{title}</h2>{copy&&<p>{copy}</p>}</div></div>}
function FlowStrip(){return <div className="flow-strip">{flow.map(([name,desc,Icon],i)=><React.Fragment key={name}><motion.div whileHover={{scale:1.03}} className="flow-step"><Icon/><span>{String(i+1).padStart(2,'0')}</span><h4>{name}</h4><p>{desc}</p></motion.div>{i<flow.length-1&&<div className="flow-arrow"><ArrowRight size={18}/></div>}</React.Fragment>)}</div>}
function Outcome({title,items,accent}){return <article className="outcome" style={{'--accent':accent}}><div className="outcome-title">{title}</div>{items.map((x,i)=><React.Fragment key={x}><motion.div whileHover={{x:5}} className="outcome-item">{x}</motion.div>{i<items.length-1&&<div className="outcome-line"><span/></div>}</React.Fragment>)}</article>}

function PageHero({eyebrow,title,copy}){return <section className="page-hero section-shell"><div className="eyebrow">{eyebrow}</div><h1>{title}</h1><p>{copy}</p></section>}

function ProductsPage(){return <><PageHero eyebrow="PRODUCTS" title="Four products. Four real decision problems." copy="Pilinix products are designed around domains where context, state, evidence and action matter."/><section className="section-shell"><div className="product-grid expanded">{products.map((p,i)=><ProductCard p={p} i={i} key={p.name}/>)}</div><div className="future-slot"><Sparkles/><div><h3>More systems will follow.</h3><p>The portfolio is designed to expand without turning Pilinix into a collection of disconnected experiments.</p></div></div></section></>}

function ThinkingPage(){return <><PageHero eyebrow="HOW WE THINK" title="Observe. Understand. Decide. Act. Learn." copy="A useful agentic system is more than a model response. It is a loop that keeps context, makes decisions and moves work forward."/><section className="section-shell"><FlowStrip/></section><section className="section-shell deep-grid">{flow.map(([name,desc,Icon],i)=><article key={name}><div className="deep-index">0{i+1}</div><Icon/><h2>{name}</h2><p>{desc}</p><small>{['Signals · context · evidence','Relationships · history · state','Options · trade-offs · confidence','Execution · coordination · handoff','Outcomes · feedback · change'][i]}</small></article>)}</section></>}

function LabPage(){ const themes=['Family systems','Business intelligence','AI capability diagnosis','Cross-border intelligence','Agentic workflows','Decision systems','Persistent intelligent systems','Signal-to-action systems']; return <><PageHero eyebrow="PILINIX LAB" title="We look for utility, not novelty." copy="Pilinix Lab explores where intelligent systems can own real workflows, reduce friction and create meaningful outcomes."/><section className="section-shell constellation"><div className="constellation-core"><LogoMark/><span>PILINIX LAB</span></div>{themes.map((t,i)=><motion.div key={t} className={`theme theme-${i+1}`} whileHover={{scale:1.08}}>{t}</motion.div>)}<svg viewBox="0 0 1000 560" preserveAspectRatio="none">{themes.map((_,i)=><line key={i} x1="500" y1="280" x2={120+(i*113)%780} y2={70+(i*97)%420} stroke="rgba(255,255,255,.08)"/>)}</svg></section></>}

function AboutPage(){return <><PageHero eyebrow="ABOUT PILINIX" title="Practical intelligent systems for decisions that matter." copy="Pilinix is a product company building agentic systems for people and businesses."/><section className="section-shell about-grid"><div><h2>Beyond a model response.</h2><p>General-purpose AI models are powerful. But valuable real-world products often need persistent context, specialized information, verified evidence, state, monitoring, integration, orchestration and action.</p></div><div className="about-list">{['Persistent context','Specialized information','Verified evidence','State & memory','Monitoring','Integration','Orchestration','Action'].map((x,i)=><div key={x}><span>{String(i+1).padStart(2,'0')}</span>{x}</div>)}</div></section><section className="section-shell name-origin"><div className="eyebrow">THE NAME</div><h2>PILINIX</h2><p><strong>Platform Intelligence Layer for Integrated Network Infrastructure and eXecution.</strong></p><p>It is a useful description of how we think about intelligent systems. But Pilinix is first and foremost the name of the company.</p></section></>}

function ContactPage(){ const [sent,setSent]=useState(false); return <><PageHero eyebrow="CONTACT" title="Start a conversation." copy="Product, pilot, partnership or a business AI question — tell us what you are exploring."/><section className="section-shell contact-grid"><div className="contact-side"><div className="mini-card"><Search/><h3>Product</h3><p>Explore where one of our existing products may fit.</p></div><div className="mini-card"><Layers3/><h3>Partnership</h3><p>Discuss pilots, integrations or distribution.</p></div><div className="mini-card"><ShieldCheck/><h3>Business AI Assessment</h3><p>Explore whether AI actually fits the business problem.</p></div></div><form className="contact-form" onSubmit={e=>{e.preventDefault();setSent(true)}}>{sent?<motion.div initial={{opacity:0,scale:.98}} animate={{opacity:1,scale:1}} className="success"><Sparkles/><h2>Thanks.</h2><p>Contact routing is being connected for the public launch. This preview does not transmit form data yet.</p><button type="button" className="ghost" onClick={()=>setSent(false)}>Back</button></motion.div>:<><label>Name<input required placeholder="Your name"/></label><label>Email<input required type="email" placeholder="you@company.com"/></label><label>Organization <span>optional</span><input placeholder="Organization"/></label><label>What are you interested in?<select defaultValue="Products"><option>Products</option><option>Partnership</option><option>Pilot</option><option>Business AI Assessment</option><option>Other</option></select></label><label>Message<textarea required rows="6" placeholder="Tell us what you're exploring..."/></label><button className="primary">Start a Conversation <ArrowRight size={17}/></button><small>Preview mode: submissions are not transmitted yet.</small></>}</form></section></>}

function Footer(){return <footer className="footer section-shell"><div className="footer-brand"><div className="brand"><LogoMark/><span>PILINIX</span></div><p>Practical intelligence. Real action.</p></div><div className="footer-links"><div><h5>Company</h5><NavLink to="/products">Products</NavLink><NavLink to="/lab">Lab</NavLink><NavLink to="/about">About</NavLink><NavLink to="/contact">Contact</NavLink></div><div><h5>Products</h5><a href="https://fampal.ca" target="_blank" rel="noreferrer">FAMPAL</a><span>ARIMENT</span><span>EXSINOI</span><span>Business AI Advisor</span></div></div><div className="footer-bottom"><span>© {new Date().getFullYear()} Pilinix.</span><span>Built around real decisions.</span></div></footer>}

function App(){return <HashRouter><ScrollTop/><Shell/></HashRouter>}
createRoot(document.getElementById('root')).render(<App/>);
