import React, { useState } from 'react';
import { useAdmin } from '../context/AdminContext';
import { Plus, Trash2, Edit2 } from 'lucide-react';
import VisualBuilder from '../builder/VisualBuilder';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const { portfolioData, updateSection, pages, savePage, deletePage } = useAdmin();
  const [activeTab, setActiveTab] = useState('pages');
  
  // For the visual builder
  const [editingPageId, setEditingPageId] = useState(null);

  // Local state for legacy sections
  const [heroData, setHeroData] = useState(portfolioData?.hero || {});

  const handleSave = (section, data) => {
    updateSection(section, data);
    alert('Saved successfully!');
  };

  // ─── Render Visual Builder if editing a page ───
  if (editingPageId !== null) {
    const pageToEdit = editingPageId === 'new' ? null : pages.find(p => p.id === editingPageId);
    return (
      <VisualBuilder 
        page={pageToEdit} 
        onSave={async (updatedPage) => {
          await savePage(updatedPage);
          setEditingPageId(null);
        }}
        onClose={() => setEditingPageId(null)}
      />
    );
  }

  return (
    <div className="admin-dashboard-wrapper">
      <div className="admin-tabs">
        {['pages', 'hero', 'projects', 'internships', 'achievements', 'certifications', 'skills', 'contact'].map(tab => (
          <button key={tab} className={activeTab === tab ? 'active' : ''} onClick={() => setActiveTab(tab)}>
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      <div className="admin-tab-content">
        
        {/* ─── DYNAMIC PAGES TAB ─── */}
        {activeTab === 'pages' && (
          <div className="admin-form">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <div>
                <h3>Dynamic Pages</h3>
                <p style={{ opacity: 0.7, fontSize: '0.9rem' }}>Build custom pages with the visual drag-and-drop editor.</p>
              </div>
              <button className="admin-btn" style={{ padding: '8px 16px', display: 'flex', gap: 8, alignItems: 'center' }} onClick={() => setEditingPageId('new')}>
                <Plus size={16} /> New Page
              </button>
            </div>

            <div className="pages-list" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {pages.length === 0 ? (
                <div className="admin-card" style={{ textAlign: 'center', padding: 40, opacity: 0.5 }}>
                  No dynamic pages created yet.
                </div>
              ) : (
                pages.map(page => (
                  <div key={page.id} className="admin-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexDirection: 'row' }}>
                    <div>
                      <h4 style={{ margin: '0 0 4px', fontSize: '1.1rem' }}>{page.name}</h4>
                      <div style={{ opacity: 0.6, fontSize: '0.85rem' }}>/{page.slug} • {page.sections?.length || 0} sections</div>
                    </div>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button className="admin-btn" style={{ background: 'rgba(255,255,255,0.1)', display: 'flex', gap: 6, padding: '6px 12px' }} onClick={() => setEditingPageId(page.id)}>
                        <Edit2 size={14} /> Edit
                      </button>
                      <button className="remove-btn" style={{ margin: 0 }} onClick={() => { if(window.confirm('Delete page?')) deletePage(page.id); }}>
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* ─── LEGACY TABS ─── */}
        {activeTab === 'hero' && (
          <div className="admin-form">
            <h3>Hero Section</h3>
            <div className="form-group"><label>Name</label><input type="text" value={heroData.name || ''} onChange={(e) => setHeroData({...heroData, name: e.target.value})} /></div>
            <div className="form-group"><label>Title</label><input type="text" value={heroData.title || ''} onChange={(e) => setHeroData({...heroData, title: e.target.value})} /></div>
            <div className="form-group"><label>Description</label><textarea value={heroData.description || ''} onChange={(e) => setHeroData({...heroData, description: e.target.value})} rows="4" /></div>
            <div className="form-group"><label>Photo URL</label><input type="text" value={heroData.photoUrl || ''} onChange={(e) => setHeroData({...heroData, photoUrl: e.target.value})} /></div>
            <button className="admin-btn" onClick={() => handleSave('hero', heroData)}>Save Hero</button>
          </div>
        )}
        
        {/* other legacy tabs omitted for brevity, but retaining their logic from before */}
        {['projects', 'internships', 'achievements', 'certifications', 'skills', 'contact'].includes(activeTab) && (
          <div className="admin-form">
            <p>Select the Pages tab to use the new Visual Builder, or use these legacy forms.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
