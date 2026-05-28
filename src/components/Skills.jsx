import React, { useState } from 'react';
import { useAdmin } from '../context/AdminContext';
import InlineFieldEditor from './InlineFieldEditor';
import { Plus, Trash2 } from 'lucide-react';

const Skills = () => {
  const { portfolioData, updateSection, isLoggedIn } = useAdmin();
  const skillsData = portfolioData?.skills || [];
  
  // Create default categories if none exist and not logged in
  const categories = skillsData.length > 0 ? skillsData.map(s => s.category) : ['Frontend', 'Backend', 'Database'];
  const [activeCategory, setActiveCategory] = useState(categories[0] || 'Frontend');

  const activeSkillObj = skillsData.find(s => s.category === activeCategory) || { category: activeCategory, items: [] };

  const [editCategoryIdx, setEditCategoryIdx] = useState(null); // null, -1, >=0

  const handleSave = async (data) => {
    let newSkills = [...skillsData];
    
    const processedData = {
      category: data.category || 'New Category',
      items: (data.items || '').split('\n').map(s => s.trim()).filter(s => s)
    };

    if (editCategoryIdx === -1) {
      newSkills.push(processedData);
      setActiveCategory(processedData.category);
    } else if (editCategoryIdx >= 0) {
      newSkills[editCategoryIdx] = processedData;
      setActiveCategory(processedData.category); // update active if renamed
    }

    await updateSection('skills', newSkills);
  };

  const handleDelete = async (idx, e) => {
    e.stopPropagation();
    if (window.confirm('Delete this skill category?')) {
      const newSkills = skillsData.filter((_, i) => i !== idx);
      await updateSection('skills', newSkills);
      if (newSkills.length > 0) setActiveCategory(newSkills[0].category);
    }
  };

  const currentEditData = editCategoryIdx >= 0 && skillsData[editCategoryIdx] ? {
    category: skillsData[editCategoryIdx].category,
    items: (skillsData[editCategoryIdx].items || []).join('\n')
  } : {};

  return (
    <div className="page-container" id="skills">
      <div className="page-header">
        <h2 className="page-title">Skills</h2>
        <p className="page-subtitle">Technologies and tools I work with.</p>
      </div>

      <div className="page-sidebar-layout">
        {/* Left Sidebar */}
        <div className="page-sidebar">
          {skillsData.length === 0 && !isLoggedIn && (
             <div className="sidebar-item active">No Skills</div>
          )}

          {skillsData.map((catObj, idx) => (
            <div 
              key={catObj.category + idx} 
              className={`sidebar-item ${activeCategory === catObj.category ? 'active' : ''}`}
              onClick={() => setActiveCategory(catObj.category)}
              style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
            >
              <span>{catObj.category}</span>
              {isLoggedIn && (
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button onClick={(e) => { e.stopPropagation(); setEditCategoryIdx(idx); }} style={{ background: 'none', border: 'none', color: '#6366f1', cursor: 'pointer' }}>Edit</button>
                  <button onClick={(e) => handleDelete(idx, e)} style={{ background: 'none', border: 'none', color: '#f87171', cursor: 'pointer' }}><Trash2 size={12} /></button>
                </div>
              )}
            </div>
          ))}

          {isLoggedIn && (
            <button 
              className="btn-primary" 
              style={{ width: '100%', marginTop: '16px', padding: '10px', fontSize: '0.85rem', display: 'flex', justifyContent: 'center', gap: '6px' }}
              onClick={() => setEditCategoryIdx(-1)}
            >
              <Plus size={14} /> Add Category
            </button>
          )}
        </div>

        {/* Right Content Area */}
        <div className="page-content-area">
          <div className="glass-card" style={{ padding: '32px', minHeight: '400px' }}>
             
             <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 240px), 1fr))', gap: '20px' }}>
                {activeSkillObj.items.length === 0 ? (
                  <p style={{ color: 'var(--text-muted)' }}>No skills added to this category yet.</p>
                ) : (
                  activeSkillObj.items.map((item, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '16px', paddingBottom: '16px', borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                      <div style={{ width: '40px', height: '40px', background: 'rgba(255,255,255,0.05)', borderRadius: '10px', display: 'flex', justifyContent: 'center', alignItems: 'center', color: '#8b5cf6', fontWeight: 'bold' }}>
                        {item.charAt(0).toUpperCase()}
                      </div>
                      <div style={{ flex: 1 }}>
                        <h4 style={{ fontWeight: 600, fontSize: '1rem', color: 'var(--text-dark)' }}>{item}</h4>
                      </div>
                    </div>
                  ))
                )}
             </div>

          </div>
        </div>
      </div>

      <InlineFieldEditor
        isOpen={editCategoryIdx !== null}
        onClose={() => setEditCategoryIdx(null)}
        onSave={handleSave}
        title={editCategoryIdx === -1 ? "Add Skill Category" : "Edit Skill Category"}
        initialData={currentEditData}
        fields={[
          { name: 'category', label: 'Category Name', type: 'text', placeholder: 'e.g., Frontend' },
          { name: 'items', label: 'Skills (One per line)', type: 'textarea', placeholder: 'React\nVue\nTailwind CSS' }
        ]}
      />
    </div>
  );
};

export default Skills;
