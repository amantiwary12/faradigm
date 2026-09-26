import { Link, Navigate, useParams } from 'react-router-dom';
import PageHero from '../components/PageHero.jsx';
import Work, { CaseCard } from '../components/Work.jsx';
import Partner from '../components/Partner.jsx';
import Reveal from '../components/ui/Reveal.jsx';
import { Section, Wrap } from '../components/ui/Layout.jsx';
import { caseBySlug, cases } from '../data/cases.js';

export function WorkIndex() {
  return (
    <>
      <PageHero eyebrow="Our Work" title="Application" bold="engineering.">
        Proven in the harshest conditions and in everyday infrastructure.
      </PageHero>
      <Work headless />
      <Partner />
    </>
  );
}

export function CaseStudy() {
  const { slug } = useParams();
  const c = caseBySlug(slug);
  if (!c) return <Navigate to="/work" replace />;
  const others = cases.filter((o) => o.slug !== c.slug);
  return (
    <>
      <PageHero eyebrow={c.tag} title={c.title}>
        {c.sub}
      </PageHero>
      <Section className="bg-surface">
        <Wrap>
          <CaseCard c={c} />
          {others.length > 0 && (
            <Reveal className="mt-4">
              <h2 className="mb-4 text-[1.4rem]">More case studies</h2>
              {others.map((o) => (
                <Link key={o.slug} to={`/work/${o.slug}`} className="mr-6 font-semibold text-link underline underline-offset-[3px]">
                  {o.title} →
                </Link>
              ))}
            </Reveal>
          )}
        </Wrap>
      </Section>
      <Partner />
    </>
  );
}
