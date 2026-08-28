import React, { useEffect, useState } from 'react';
import { HashRouter, NavLink, Route, Routes, useLocation } from 'react-router-dom';
import { ArrowRight, Menu, X } from 'lucide-react';
import HomePage from './pages/HomePage.jsx';
import { ProductDetailPage, ProductsPage } from './pages/ProductsPage.jsx';
import ThinkingPage from './pages/ThinkingPage.jsx';
import { LabNotePage, LabPage } from './pages/LabPage.jsx';
import AboutPage from './pages/AboutPage.jsx';
import ContactPage from './pages/ContactPage.jsx';
import { LogoMark } from './components/ui/Primitives.jsx';

const nav = [
  ['Home', '/'],
  ['Products', '/products'],
  ['How We Think', '/thinking'],
  ['Lab', '/lab'],
  ['About', '/about'],
  ['Contact', '/contact'],
];

function ScrollTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    try {
      window.scrollTo(0, 0);
    } catch (e) { /* no-op */ }
  }, [pathname]);
  return null;
}

function Footer() {
  return (
    <footer className="footer section-shell">
      <div className="footer-brand">
        <div className="brand"><LogoMark /><span>PILINIX</span></div>
        <p>Practical intelligence. Real action.</p>
      </div>
      <div className="footer-links">
        <div>
          <h5>Company</h5>
          <NavLink to="/">Home</NavLink>
          <NavLink to="/products">Products</NavLink>
          <NavLink to="/thinking">How We Think</NavLink>
          <NavLink to="/lab">Lab</NavLink>
          <NavLink to="/about">About</NavLink>
          <NavLink to="/contact">Contact</NavLink>
        </div>
        <div>
          <h5>Products</h5>
          <a href="https://fampal.ca" target="_blank" rel="noreferrer">FAMPAL</a>
          <span>ARIMENT</span>
          <span>EXSINOI</span>
          <span>Business AI Advisor</span>
        </div>
      </div>
      <div className="footer-bottom">
        <span>© {new Date().getFullYear()} Pilinix.</span>
        <span>Built around real decisions.</span>
      </div>
    </footer>
  );
}

function Shell() {
  const [open, setOpen] = useState(false);
  const loc = useLocation();
  useEffect(() => setOpen(false), [loc.pathname]);

  return (
    <>
      <div className="ambient ambient-a" /><div className="ambient ambient-b" />
      <a className="skip-link" href="#main">Skip to content</a>
      <header className="nav-wrap">
        <NavLink to="/" className="brand"><LogoMark /><span>PILINIX</span></NavLink>
        <nav className="desktop-nav">
          {nav.map(([l, p]) => (
            <NavLink key={p} to={p} end={p === '/'}>{l}</NavLink>
          ))}
          <NavLink to="/products" className="nav-cta">Explore Products <ArrowRight size={15} /></NavLink>
        </nav>
        <button
          className="menu-btn"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
        >
          {open ? <X /> : <Menu />}
        </button>
        {open && (
          <div className="mobile-menu reveal">
            {nav.map(([l, p]) => (
              <NavLink key={p} to={p} end={p === '/'}>{l}</NavLink>
            ))}
          </div>
        )}
      </header>
      <main id="main">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/products/:slug" element={<ProductDetailPage />} />
          <Route path="/thinking" element={<ThinkingPage />} />
          <Route path="/lab" element={<LabPage />} />
          <Route path="/lab/:slug" element={<LabNotePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="*" element={<HomePage />} />
        </Routes>
      </main>
      <Footer />
    </>
  );
}

export default function App() {
  return (
    <HashRouter>
      <ScrollTop />
      <Shell />
    </HashRouter>
  );
}
