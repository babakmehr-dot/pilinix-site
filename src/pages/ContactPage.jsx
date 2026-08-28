import React, { useState } from 'react';
import { Mail, MailPlus, ShieldAlert } from 'lucide-react';
import { PageHero } from '../components/ui/Primitives.jsx';
import { CONTACT_EMAIL } from '../data/site.js';

const topics = ['A product question', 'A partnership', 'Research feedback', 'Something else'];

export default function ContactPage() {
  const [topic, setTopic] = useState(topics[0]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [opened, setOpened] = useState(false);

  // No backend exists, so nothing is transmitted from this page. The button
  // hands the message to the visitor's own email client.
  const submit = (e) => {
    e.preventDefault();
    const body = [
      `Topic: ${topic}`,
      name && `Name: ${name}`,
      email && `Reply to: ${email}`,
      '',
      message,
    ]
      .filter(Boolean)
      .join('\n');
    const href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(`Pilinix — ${topic}`)}&body=${encodeURIComponent(body)}`;
    setOpened(true);
    window.location.href = href;
  };

  return (
    <>
      <PageHero
        eyebrow="CONTACT"
        title="What would you like to discuss?"
        copy="Share the context we need to understand your message. Please do not include passwords, account numbers, or sensitive personal records."
      />

      <section className="section-shell contact-simple">
        <form className="contact-form" onSubmit={submit}>
          <fieldset className="topic-fieldset">
            <legend>Topic</legend>
            <div className="topic-options">
              {topics.map((t) => (
                <label key={t} className={`topic-option${topic === t ? ' is-active' : ''}`}>
                  <input
                    type="radio"
                    name="topic"
                    value={t}
                    checked={topic === t}
                    onChange={() => setTopic(t)}
                  />
                  <span>{t}</span>
                </label>
              ))}
            </div>
          </fieldset>

          <label>
            Name
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" />
          </label>
          <label>
            Email
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
            />
          </label>
          <label>
            Message
            <textarea
              required
              rows="7"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="What are you exploring?"
            />
          </label>

          <p className="contact-warning">
            <ShieldAlert size={14} aria-hidden="true" />
            Your email app will open. Nothing has been sent yet.
          </p>

          <button className="primary" type="submit">
            <MailPlus size={17} aria-hidden="true" /> Send message
          </button>

          <p className="contact-status" role="status">
            {opened
              ? 'Your email app should have opened with a draft. Nothing has been sent from this site.'
              : 'This site has no contact backend. The button opens a draft in your own email app.'}
          </p>

          <p className="contact-direct">
            <Mail size={13} aria-hidden="true" /> Or write directly:{' '}
            <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
          </p>
        </form>
      </section>
    </>
  );
}
