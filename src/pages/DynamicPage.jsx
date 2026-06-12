import React from 'react';
import { useAdmin } from '../context/AdminContext';
import SectionRenderer from '../builder/SectionRenderer';

const DynamicPage = ({ slug }) => {
  const { pages, isLoading } = useAdmin();

  if (isLoading) {
    return (
      <div style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(0, 0, 0, 0.25)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        zIndex: 999,
        gap: '16px',
        borderRadius: '16px'
      }}>
        <style>{`
          @keyframes dp-spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          .dp-spinner {
            width: 32px;
            height: 32px;
            border: 2px solid rgba(255, 255, 255, 0.1);
            border-top-color: rgba(255, 255, 255, 0.85);
            border-radius: 50%;
            animation: dp-spin 0.8s linear infinite;
          }
          .dp-loading-text {
            font-size: 0.76rem;
            font-weight: 300;
            color: rgba(255, 255, 255, 0.65);
            letter-spacing: 0.08em;
            text-transform: uppercase;
          }
        `}</style>
        <div className="dp-spinner" />
        <div className="dp-loading-text">Loading Content</div>
      </div>
    );
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
