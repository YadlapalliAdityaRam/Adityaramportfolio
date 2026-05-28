import React, { useState } from 'react';
import { useAdmin } from '../context/AdminContext';
import InlineEdit from './InlineEdit';
import InlineFieldEditor from './InlineFieldEditor';
import { ExternalLink, Plus, Trash2 } from 'lucide-react';

const Education = () => {
  const { portfolioData, updateSection, isLoggedIn } = useAdmin();
  const education = portfolioData?.education || [];

  const [editIndex, setEditIndex] = useState(null); // null = not editing, -1 = adding new, >=0 = editing existing

  const handleSave = async (data) => {
    let newEducation = [...education];
    
    // Convert highlights textarea back to array
    const processedData = {
      ...data,
      highlights: (data.highlights || '').split('\n').map(s => s.trim()).filter(s => s)
    };

    if (editIndex === -1) {
      newEducation.push(processedData);
    } else if (editIndex >= 0) {
      newEducation[editIndex] = processedData;
    }

    await updateSection('education', newEducation);
  };

  const handleDelete = async (idx, e) => {
    e.stopPropagation(); // prevent opening edit modal
    if (window.confirm('Delete this education item?')) {
      const newEducation = education.filter((_, i) => i !== idx);
      await updateSection('education', newEducation);
    }
  };

  const currentEditData = editIndex >= 0 && education[editIndex] ? {
    ...education[editIndex],
    highlights: (education[editIndex].highlights || []).join('\n')
  } : {};

  return (
    <div className="page-container" id="education">
      <div className="page-header">
        <h2 className="page-title">Education</h2>
        <p className="page-subtitle">My academic journey and qualifications.</p>
      </div>

      <div className="page-two-col">
        {/* Left Column: Timeline */}
        <div className="page-col-left">
          <div className="timeline">
            {education.length === 0 && !isLoggedIn && (
              <p style={{ color: 'var(--text-muted)' }}>No education data available.</p>
            )}

            {education.map((edu, idx) => {
              const content = (
                <div className="timeline-item glass-card" style={{ padding: '20px', marginBottom: '16px', position: 'relative' }}>
                  <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start' }}>
                    <div style={{ minWidth: '80px', color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: 500 }}>
                      {edu.startYear} - {edu.endYear}
                    </div>
                    <div style={{ flex: 1 }}>
                      <h3 style={{ fontWeight: 600, marginBottom: '4px', fontSize: '1.1rem' }}>{edu.degree}</h3>
                      <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginBottom: '8px' }}>{edu.institution}</p>
                      {edu.address && (
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '10px' }}>{edu.address}</p>
                      )}
                      
                      {edu.link && (
                        <a href={edu.link} target="_blank" rel="noreferrer" className="btn-secondary" style={{ fontSize: '0.75rem', display: 'inline-flex', alignItems: 'center', gap: '4px', textDecoration: 'none' }}>
                          Visit Institute <ExternalLink size={12} />
                        </a>
                      )}
                    </div>
                  </div>
                  
                  {isLoggedIn && (
                    <button 
                      onClick={(e) => handleDelete(idx, e)}
                      style={{ position: 'absolute', bottom: '12px', right: '12px', background: 'rgba(248, 113, 113, 0.1)', color: '#f87171', border: 'none', borderRadius: '8px', padding: '6px', cursor: 'pointer', zIndex: 60 }}
                      title="Delete"
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
              );

              return isLoggedIn ? (
                <InlineEdit key={idx} onEdit={() => setEditIndex(idx)} label="Edit Item">
                  {content}
                </InlineEdit>
              ) : (
                <React.Fragment key={idx}>
                  {content}
                </React.Fragment>
              );
            })}

            {isLoggedIn && (
              <button 
                onClick={() => setEditIndex(-1)}
                className="btn-primary" 
                style={{ width: '100%', display: 'flex', justifyContent: 'center', gap: '8px', padding: '12px', marginTop: '8px', borderRadius: '16px' }}
              >
                <Plus size={18} /> Add Education Item
              </button>
            )}
          </div>
        </div>

        {/* Right Column: Highlights Summary */}
        <div className="page-col-right">
          <div className="glass-card" style={{ padding: '24px', height: '100%' }}>
            <h3 style={{ fontWeight: 600, marginBottom: '24px', fontSize: '1.2rem' }}>Education Highlights</h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {education.map(edu => (
                edu.highlights && edu.highlights.length > 0 && edu.highlights.map((hl, i) => (
                  <div key={`${edu.institution}-${i}`} style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                     <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(99,102,241,0.1)', display: 'flex', justifyContent: 'center', alignItems: 'center', color: '#8b5cf6', flexShrink: 0 }}>
                       <span style={{ fontSize: '12px' }}>★</span>
                     </div>
                     <p style={{ fontSize: '0.9rem', color: 'var(--text-dark)' }}>{hl}</p>
                  </div>
                ))
              ))}
              
              {education.length === 0 && <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Highlights will appear here.</p>}
            </div>
          </div>
        </div>
      </div>

      <InlineFieldEditor
        isOpen={editIndex !== null}
        onClose={() => setEditIndex(null)}
        onSave={handleSave}
        title={editIndex === -1 ? "Add Education" : "Edit Education"}
        initialData={currentEditData}
        fields={[
          { name: 'institution', label: 'Institution Name', type: 'text', placeholder: 'e.g., Stanford University' },
          { name: 'address', label: 'Address / Location', type: 'text', placeholder: 'e.g., Hyderabad, Telangana' },
          { name: 'degree', label: 'Degree / Course', type: 'text', placeholder: 'e.g., BS Computer Science' },
          { name: 'startYear', label: 'Start Year', type: 'text', placeholder: 'e.g., 2018' },
          { name: 'endYear', label: 'End Year', type: 'text', placeholder: 'e.g., 2022' },
          { name: 'link', label: 'Institution Link (URL)', type: 'text', placeholder: 'https://...' },
          { name: 'highlights', label: 'Highlights (One per line)', type: 'textarea', placeholder: 'Graduated with honors\nPresident of CS Club' }
        ]}
      />
    </div>
  );
};

export default Education;
