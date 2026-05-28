import React, { useState } from 'react';
import { useAdmin } from '../context/AdminContext';
import InlineEdit from './InlineEdit';
import InlineFieldEditor from './InlineFieldEditor';
import { Plus, Trash2, ExternalLink } from 'lucide-react';

const Certifications = () => {
  const { portfolioData, updateSection, isLoggedIn } = useAdmin();
  const certifications = portfolioData?.certifications || [];

  const [editIndex, setEditIndex] = useState(null);

  const handleSave = async (data) => {
    let newCertifications = [...certifications];
    if (editIndex === -1) {
      newCertifications.push(data);
    } else if (editIndex >= 0) {
      newCertifications[editIndex] = data;
    }
    await updateSection('certifications', newCertifications);
  };

  const handleDelete = async (idx, e) => {
    e.stopPropagation();
    if (window.confirm('Delete this certification?')) {
      const newCertifications = certifications.filter((_, i) => i !== idx);
      await updateSection('certifications', newCertifications);
    }
  };

  const currentEditData = editIndex >= 0 ? certifications[editIndex] : {};

  return (
    <div className="page-container" id="certifications">
      <div className="page-header">
        <h2 className="page-title">Certifications</h2>
        <p className="page-subtitle">Continuous learning and growth.</p>
      </div>

      <div className="page-grid">
        {certifications.length === 0 && !isLoggedIn && (
          <p style={{ color: 'var(--text-muted)' }}>No certifications available yet.</p>
        )}

        {certifications.map((cert, idx) => {
          const content = (
            <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', padding: '24px', position: 'relative', height: '100%' }}>
              {cert.imageUrl ? (
                <div className="certification-image-frame">
                  <img
                    className="certification-image"
                    src={cert.imageUrl}
                    alt={cert.title ? `${cert.title} certificate` : 'Certification'}
                  />
                </div>
              ) : (
                <div style={{ width: '100%', height: '8px', background: 'var(--primary-accent)', borderRadius: '4px', marginBottom: '20px' }} />
              )}
              
              <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '8px' }}>{cert.title}</h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--primary-accent)', marginBottom: '4px' }}>{cert.issuer}</p>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '16px' }}>{cert.date}</p>
              
              {cert.description && (
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '20px', flex: 1, lineHeight: 1.5 }}>
                  {cert.description}
                </p>
              )}
              
              {/* If no description, ensure flex pushes button down */}
              {!cert.description && <div style={{ flex: 1 }} />}

              {cert.link && (
                <a href={cert.link} target="_blank" rel="noreferrer" className="btn-secondary" style={{ width: '100%', justifyContent: 'center', textDecoration: 'none' }}>
                  View Credential <ExternalLink size={14} style={{ marginLeft: '4px' }} />
                </a>
              )}
              
              {isLoggedIn && (
                <button 
                  onClick={(e) => handleDelete(idx, e)}
                  style={{ position: 'absolute', top: '16px', right: '16px', background: 'rgba(248, 113, 113, 0.1)', color: '#f87171', border: 'none', borderRadius: '8px', padding: '6px', cursor: 'pointer', zIndex: 60 }}
                  title="Delete"
                >
                  <Trash2 size={14} />
                </button>
              )}
            </div>
          );

          return isLoggedIn ? (
            <InlineEdit key={idx} onEdit={() => setEditIndex(idx)} label="Edit Certification">
              {content}
            </InlineEdit>
          ) : (
            <React.Fragment key={idx}>{content}</React.Fragment>
          );
        })}

        {isLoggedIn && (
          <div 
            className="glass-card" 
            style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '32px', cursor: 'pointer', minHeight: '300px', border: '2px dashed rgba(255,255,255,0.1)' }}
            onClick={() => setEditIndex(-1)}
          >
            <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'rgba(99, 102, 241, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#8b5cf6', marginBottom: '16px' }}>
              <Plus size={24} />
            </div>
            <h3 style={{ fontWeight: 600, color: 'var(--text-dark)' }}>Add Certification</h3>
          </div>
        )}
      </div>

      <InlineFieldEditor
        isOpen={editIndex !== null}
        onClose={() => setEditIndex(null)}
        onSave={handleSave}
        title={editIndex === -1 ? "Add Certification" : "Edit Certification"}
        initialData={currentEditData}
        fields={[
          { name: 'title', label: 'Certification Title', type: 'text', placeholder: 'e.g., AWS Cloud Practitioner' },
          { name: 'issuer', label: 'Issuing Organization', type: 'text', placeholder: 'e.g., Amazon Web Services' },
          { name: 'date', label: 'Date Earned', type: 'text', placeholder: 'e.g., Jan 2024' },
          { name: 'description', label: 'Description (Optional)', type: 'textarea', placeholder: 'Learned about core cloud concepts...' },
          { name: 'link', label: 'Credential Link', type: 'text', placeholder: 'https://...' },
          { name: 'imageUrl', label: 'Badge / Image (Optional)', type: 'image' }
        ]}
      />
    </div>
  );
};

export default Certifications;
