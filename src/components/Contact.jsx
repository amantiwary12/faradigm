import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { site } from '../data/content.js';
import { ApiError, submitEnquiry } from '../lib/api.js';
import { cn } from '../lib/env.js';
import useSpotlight from '../hooks/useSpotlight.js';
import Reveal from './ui/Reveal.jsx';
import Button from './ui/Button.jsx';
import Glow from './ui/Glow.jsx';
import RegMarks from './ui/RegMarks.jsx';
import SectionHead from './ui/SectionHead.jsx';
import { Section, Wrap } from './ui/Layout.jsx';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const rules = {
  name: { label: 'Name', error: 'Please enter your name.', ok: (v) => v.length > 1 },
  email: { label: 'Email Address', error: 'Please enter a valid email address.', ok: (v) => EMAIL_RE.test(v) },
  message: { label: 'Message', error: 'Please write a short message.', ok: (v) => v.length > 1 },
};
const empty = { name: '', email: '', message: '' };

const whatsappLink = (v) =>
  `https://wa.me/${site.whatsappNumber}?text=${encodeURIComponent(`New enquiry from Faradigm site\nName: ${v.name}\nEmail: ${v.email}\nMessage: ${v.message}`)}`;

const inputClass =
  'w-full rounded-control border bg-surface px-4 py-3.5 text-base text-ink transition-[border-color,outline-color] duration-200 placeholder:text-muted focus:border-focus focus:outline-2 focus:outline-offset-0 focus:outline-focus';

function Field({ name, type = 'text', placeholder, autoComplete, textarea, value, invalid, error, onChange }) {
  const Control = textarea ? 'textarea' : 'input';
  return (
    <div className="relative mb-[18px]">
      <label htmlFor={name} className="mb-2 block font-sans text-sm font-semibold text-ink">{rules[name].label}</label>
      <Control
        id={name}
        name={name}
        type={textarea ? undefined : type}
        placeholder={placeholder}
        autoComplete={autoComplete}
        value={value}
        required
        aria-invalid={invalid || undefined}
        aria-describedby={invalid ? `${name}-err` : undefined}
        onChange={onChange}
        className={cn(inputClass, invalid ? 'border-brand-red' : 'border-line-control', textarea && 'min-h-[150px] resize-y')}
      />
      {invalid && <div id={`${name}-err`} className="mt-1.5 text-[13px] text-accent">{error}</div>}
    </div>
  );
}

const infoCard =
  'group isolate relative block overflow-hidden border border-l-4 border-l-brand-cyan bg-surface-alt px-6 py-5 hover:border-brand-cyan';

export default function Contact({ headless = false, index = '06' }) {
  const spot = useSpotlight();
  // Product pages link here with ?product=MODEL to start the message
  const product = useSearchParams()[0].get('product');
  const [values, setValues] = useState(() => (product ? { ...empty, message: `I would like a quote for ${product.slice(0, 60)}. ` } : empty));
  const [errors, setErrors] = useState({}); // field name -> message
  const [sending, setSending] = useState(false);
  const [status, setStatus] = useState(null); // { kind: 'ok' | 'error', text, link? }

  const onChange = (e) => {
    const { name, value } = e.target;
    setValues((v) => ({ ...v, [name]: value }));
    setErrors((er) => (er[name] ? { ...er, [name]: undefined } : er));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (sending) return;
    const trimmed = Object.fromEntries(Object.entries(values).map(([k, v]) => [k, v.trim()]));
    const bad = Object.keys(rules).filter((k) => !rules[k].ok(trimmed[k]));
    if (bad.length) {
      setErrors(Object.fromEntries(bad.map((k) => [k, rules[k].error])));
      document.getElementById(bad[0])?.focus();
      return;
    }

    setSending(true);
    setStatus(null);
    try {
      await submitEnquiry(trimmed);
      setStatus({
        kind: 'ok',
        text: `Thanks, ${trimmed.name}! Your enquiry has reached our team and we will reply by email. In a hurry? `,
        link: { href: whatsappLink(trimmed), label: 'Message us on WhatsApp' },
      });
      setValues(empty);
    } catch (err) {
      if (err instanceof ApiError && err.fields) {
        setErrors(err.fields); // the server rejected a field the browser let through
        document.getElementById(Object.keys(err.fields)[0])?.focus();
      } else {
        setStatus({
          kind: 'error',
          text: `${err.message} Your message is still here. `,
          link: { href: whatsappLink(trimmed), label: `Send it on WhatsApp (${site.phonePlain})` },
        });
      }
    } finally {
      setSending(false);
    }
  };

  return (
    <Section id="contact" className="overflow-hidden bg-surface text-ink">
      <Wrap>
        {!headless && <SectionHead index={index} eyebrow="Contact Us" title="Tell us about your" bold="application.">
          Whether it's a pain point, an OEM requirement or a partnership idea, our team would love to hear from you.
        </SectionHead>}

        <div className="relative grid grid-cols-[1.2fr_.8fr] gap-7 max-md:grid-cols-1 *:min-w-0">
          <Reveal as="form" noValidate onSubmit={onSubmit} className="reg border bg-surface-raised p-[clamp(28px,4vw,44px)]">
            <div className="grid grid-cols-2 gap-x-[18px] max-sm:grid-cols-1 max-sm:gap-x-0">
              <Field name="name" placeholder="Your full name" autoComplete="name" value={values.name} invalid={!!errors.name} error={errors.name} onChange={onChange} />
              <Field name="email" type="email" placeholder="you@company.com" autoComplete="email" value={values.email} invalid={!!errors.email} error={errors.email} onChange={onChange} />
            </div>
            <Field name="message" textarea placeholder="Describe your application or energy storage challenge…" value={values.message} invalid={!!errors.message} error={errors.message} onChange={onChange} />
            <div className="mt-1.5 flex flex-wrap items-center justify-between gap-[18px]">
              <small className="max-w-[320px] text-[13px] text-muted">Your message goes straight to our team. Prefer chat? WhatsApp us on {site.phonePlain}.</small>
              <Button type="submit" variant="accent" arrow lean disabled={sending} className="max-sm:w-full disabled:cursor-wait disabled:opacity-70">
                {sending ? 'Sending…' : 'Submit'}
              </Button>
            </div>
            <div
              role="status"
              aria-live="polite"
              className={cn(
                'mt-[18px] border-l-4 px-4 py-3.5 text-[14.5px]',
                status ? (status.kind === 'ok' ? 'block border-brand-cyan bg-cyan-100' : 'block border-brand-red bg-red-100') : 'hidden',
              )}
            >
              {status?.text}
              {status?.link && (
                <a href={status.link.href} target="_blank" rel="noopener" className="font-semibold text-link underline underline-offset-[3px]">{status.link.label}</a>
              )}
            </div>
            <RegMarks />
          </Reveal>

          <div className="grid content-start gap-4">
            {[
              { id: 'address', label: 'Address', text: site.addressLine, href: site.mapsHref, external: true, delay: 1 },
              { label: 'Phone', text: site.phoneDisplay, href: site.phoneHref, delay: 2 },
              { label: 'Email', text: site.email, href: `mailto:${site.email}`, delay: 3 },
            ].map((c) => (
              <Reveal
                as="a"
                key={c.label}
                id={c.id}
                delay={c.delay}
                href={c.href}
                {...(c.external && { target: '_blank', rel: 'noopener' })}
                className={cn(infoCard, 'hover:bg-surface-highlight')}
                {...spot}
              >
                <Glow />
                <small className="mb-1 block font-mono text-xs font-medium tracking-[.16em] text-muted uppercase">{c.label}</small>
                <p className="m-0 text-[15px] leading-[1.55] text-ink [overflow-wrap:anywhere]">{c.text}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </Wrap>
    </Section>
  );
}
