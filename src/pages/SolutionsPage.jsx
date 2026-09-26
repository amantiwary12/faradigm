import { Navigate, useParams } from 'react-router-dom';
import PageHero from '../components/PageHero.jsx';
import Solutions from '../components/Solutions.jsx';
import Partner from '../components/Partner.jsx';
import { applicationTabs } from '../data/content.js';

export default function SolutionsPage() {
  const { tab } = useParams();
  const current = applicationTabs.find((t) => t.id === tab);
  if (!current) return <Navigate to="/solutions/proven" replace />;
  return (
    <>
      <PageHero eyebrow="Our Capabilities" title="We know this:" bold="applications.">
        {current.text}
      </PageHero>
      <Solutions tab={tab} headless />
      <Partner />
    </>
  );
}
