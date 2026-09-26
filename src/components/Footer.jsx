import { Link } from 'react-router-dom';
import { footerColumns, site } from '../data/content.js';
import Logo from './ui/Logo.jsx';
import { Wrap } from './ui/Layout.jsx';

const heading = 'mb-[18px] font-mono text-xs leading-[1.27] font-medium tracking-[.16em] text-ink uppercase';
const link = 'hover:text-ink';

export default function Footer() {
  return (
    <footer data-theme="dark" className="bg-surface pt-[72px] text-[15px] text-muted">
      <Wrap>
        <div className="grid grid-cols-[1.4fr_1fr_1fr_1fr_1.2fr] gap-10 pb-14 max-lg:grid-cols-2 max-sm:grid-cols-1 max-sm:gap-8 *:min-w-0">
          <div>
            <Logo plate className="inline-flex" />
            <p className="mt-[18px] mb-0 max-w-[340px]">Ushering a paradigm change in energy storage. Best-in-class ultracapacitor technologies, made in India.</p>
          </div>
          {footerColumns.map((col) => (
            <div key={col.title}>
              <h3 className={heading}>{col.title}</h3>
              <ul>
                {col.links.map((l) => (
                  <li key={l.label} className="mb-2.5">
                    {l.to ? <Link to={l.to} className={link}>{l.label}</Link> : <a href={l.href} className={link} {...(l.external && { target: '_blank', rel: 'noopener' })}>{l.label}</a>}
                  </li>
                ))}
              </ul>
            </div>
          ))}
          <div>
            <h3 className={heading}>Get in touch</h3>
            <ul>
              <li className="mb-2.5"><a href={`mailto:${site.email}`} className={link}>{site.email}</a></li>
              <li className="mb-2.5"><a href={site.phoneHref} className={link}>{site.phoneDisplay}</a></li>
              <li className="mb-2.5">Mandideep, Madhya Pradesh, India</li>
            </ul>
          </div>
        </div>
        <div className="flex flex-wrap justify-between gap-4 border-t py-6 text-sm">
          <span>Copyright © {new Date().getFullYear()} Faradigm® Ultracapacitors Pvt. Ltd. All rights reserved.</span>
          <span>Faradigm® is a registered trademark of Aartech Solonics Limited.</span>
        </div>
      </Wrap>
    </footer>
  );
}
