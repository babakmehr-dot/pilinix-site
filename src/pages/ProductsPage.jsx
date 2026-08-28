import React from 'react';
import { NavLink, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { PageHero, SectionHeading } from '../components/ui/Primitives.jsx';
import { productDetails, products } from '../data/products.js';

function ProductRow({ p, i }) {
  const Icon = p.icon;
  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      className="product-row"
      style={{ '--accent': p.accent }}
    >
      <div className="product-row-index">0{i + 1}</div>
      <div className="product-row-icon"><Icon /></div>
      <div className="product-row-main">
        <div className="product-category">{p.category}</div>
        <h2>{p.name}</h2>
        <blockquote>“{p.question}”</blockquote>
        <p>{p.description}</p>
      </div>
      <div className="product-row-side">
        <span className="status">{p.status}</span>
        <NavLink to={`/products/${p.slug}`} className="round-link" aria-label={`Open ${p.name}`}>
          <ArrowRight />
        </NavLink>
      </div>
    </motion.article>
  );
}

export function ProductsPage() {
  return (
    <>
      <PageHero
        eyebrow="PRODUCTS"
        title="A portfolio built around decisions, not demos."
        copy="Each Pilinix product owns a different real-world problem where context, evidence, state and action matter."
      />
      <section className="section-shell portfolio-intro">
        <div className="portfolio-kicker">THE PORTFOLIO</div>
        <p>
          Different domains. The same operating idea: observe what matters, understand context, decide
          what should happen next and help move the work forward.
        </p>
      </section>
      <section className="section-shell product-list-full">
        {products.map((p, i) => (
          <ProductRow key={p.name} p={p} i={i} />
        ))}
      </section>
      <section className="section-shell future-band">
        <div>
          <div className="eyebrow">BUILT TO EXPAND</div>
          <h2>More products can join the system without diluting the company.</h2>
        </div>
        <p>
          Pilinix is the parent product brand. Each product keeps a clear domain, problem and user
          while sharing a common philosophy around intelligent action.
        </p>
      </section>
    </>
  );
}

export function ProductDetailPage() {
  const { slug } = useParams();
  const p = products.find((x) => x.slug === slug);
  const d = productDetails[slug];
  if (!p || !d) {
    return (
      <PageHero
        eyebrow="PRODUCT"
        title="Product not found."
        copy="Return to the Pilinix product portfolio."
      />
    );
  }
  const Icon = p.icon;
  return (
    <>
      <section className="product-detail-hero section-shell" style={{ '--accent': d.accent }}>
        <div className="eyebrow"><Icon size={15} />{d.label}</div>
        <div className="product-detail-grid">
          <div>
            <span className="status">{p.status}</span>
            <h1>{p.name}</h1>
            <h2>{d.headline}</h2>
            <p>{d.intro}</p>
            <div className="actions">
              <NavLink className="ghost" to="/products">Back to Products</NavLink>
              {d.external && (
                <a className="primary" href={d.external} target="_blank" rel="noreferrer">
                  {d.externalLabel}<ArrowRight size={17} />
                </a>
              )}
            </div>
          </div>
          <div className="detail-orbit">
            <div className="orbit-core"><Icon /></div>
            {['Context', 'Evidence', 'Decision', 'Action'].map((x, i) => (
              <span key={x} className={`orbit-label orbit-${i + 1}`}>{x}</span>
            ))}
          </div>
        </div>
      </section>
      <section className="section-shell detail-three">
        <article>
          <div className="eyebrow">WHO IT IS FOR</div>
          {d.audience.map((x) => <p key={x}>{x}</p>)}
        </article>
        <article>
          <div className="eyebrow">WHAT IT OWNS</div>
          {d.owns.map((x) => <p key={x}>{x}</p>)}
        </article>
        <article>
          <div className="eyebrow">WHY IT IS DIFFERENT</div>
          <p className="long-copy">{d.difference}</p>
        </article>
      </section>
      <section className="section-shell lifecycle">
        <SectionHeading
          num="01"
          eyebrow="PRODUCT LOGIC"
          title="From input to useful next step."
          copy="The product is designed around a working decision loop, not a single response."
        />
        <div className="lifecycle-track">
          {d.lifecycle.map((x, i) => (
            <div key={x}>
              <span>{String(i + 1).padStart(2, '0')}</span>
              <h3>{x}</h3>
              {i < d.lifecycle.length - 1 && <ArrowRight />}
            </div>
          ))}
        </div>
      </section>
      <section className="section-shell product-cta">
        <div>
          <div className="eyebrow">CURRENT STAGE</div>
          <h2>{p.status}</h2>
        </div>
        <p>
          {p.name === 'FAMPAL'
            ? 'FAMPAL is the current live public-test product in the Pilinix portfolio.'
            : 'This product is still being developed and shaped. The public site describes the product direction without inventing launch claims.'}
        </p>
      </section>
    </>
  );
}
