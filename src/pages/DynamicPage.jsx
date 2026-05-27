import React from 'react';
import { useAdmin } from '../context/AdminContext';
import SectionRenderer from '../builder/SectionRenderer';

const DynamicPage = ({ slug }) => {
  const { pages, isLoading } = useAdmin();

  if (isLoading) {
    return <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Loading...</div>;
  }

  const page = pages.find(p => p.slug === slug);

  if (!page) {
    return <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Page not found</div>;
  }

  return (
    <div className="dynamic-page" style={{ paddingBottom: 100 }}>
      {page.sections?.map(section => (
        <SectionRenderer key={section.id} section={section} />
      ))}
    </div>
  );
};

export default DynamicPage;
