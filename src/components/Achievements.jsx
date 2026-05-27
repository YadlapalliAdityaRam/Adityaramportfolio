import React, { useState } from 'react';
import { useAdmin } from '../context/AdminContext';
import InlineEdit from './InlineEdit';
import InlineFieldEditor from './InlineFieldEditor';
import { Plus, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';

const Achievements = () => {
  const { portfolioData, updateSection, isLoggedIn } = useAdmin();
  const achievements = portfolioData?.achievements || [];

  const [editIndex, setEditIndex] = useState(null);

  const handleSave = async (data) => {
    let newAchievements = [...achievements];
    if (editIndex === -1) {
      newAchievements.push(data);
    } else if (editIndex >= 0) {
      newAchievements[editIndex] = data;
    }
    await updateSection('achievements', newAchievements);
  };

  const handleDelete = async (idx, e) => {
    e.stopPropagation();
    if (window.confirm('Delete this achievement?')) {
      const newAchievements = achievements.filter((_, i) => i !== idx);
      await updateSection('achievements', newAchievements);
    }
  };

  const currentEditData = editIndex >= 0 ? achievements[editIndex] : {};

  return (
    <div className="page-container" id="achievements">
      <div className="page-header">
        <h2 className="page-title">My Achievements</h2>
        <p className="page-subtitle">Milestones that keep me motivated.</p>
      </div>

      <div className="page-grid">
        {achievements.length === 0 && !isLoggedIn && (
          <p style={{ color: 'var(--text-muted)' }}>No achievements available yet.</p>
        )}

        {achievements.map((achievement, idx) => {
          const content = (
            <motion.div 
              className="glass-card" 
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '32px 24px', textAlign: 'center', position: 'relative', height: '100%' }}
              whileHover={!isLoggedIn ? { scale: 1.02 } : {}}
            >
              <div style={{ width: '80px', height: '80px', background: achievement.imageUrl ? `url(${achievement.imageUrl}) center/cover` : 'rgba(255,255,255,0.05)', borderRadius: '50%', marginBottom: '24px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                 {!achievement.imageUrl && <span style={{ fontSize: '24px' }}>🏆</span>}
              </div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '12px', color: 'var(--text-dark)' }}>{achievement.title}</h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '16px', lineHeight: 1.5 }}>
                {achievement.description}
              </p>
              
              {isLoggedIn && (
                <button 
                  onClick={(e) => handleDelete(idx, e)}
                  style={{ position: 'absolute', top: '16px', right: '16px', background: 'rgba(248, 113, 113, 0.1)', color: '#f87171', border: 'none', borderRadius: '8px', padding: '6px', cursor: 'pointer', zIndex: 60 }}
                  title="Delete"
                >
                  <Trash2 size={14} />
                </button>
              )}
            </motion.div>
          );

          return isLoggedIn ? (
            <InlineEdit key={idx} onEdit={() => setEditIndex(idx)} label="Edit Achievement">
              {content}
            </InlineEdit>
          ) : (
            <React.Fragment key={idx}>{content}</React.Fragment>
          );
        })}

        {isLoggedIn && (
          <div 
            className="glass-card" 
            style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '32px', cursor: 'pointer', minHeight: '280px', border: '2px dashed rgba(255,255,255,0.1)' }}
            onClick={() => setEditIndex(-1)}
          >
            <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'rgba(99, 102, 241, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#8b5cf6', marginBottom: '16px' }}>
              <Plus size={24} />
            </div>
            <h3 style={{ fontWeight: 600, color: 'var(--text-dark)' }}>Add Achievement</h3>
          </div>
        )}
      </div>

      <InlineFieldEditor
        isOpen={editIndex !== null}
        onClose={() => setEditIndex(null)}
        onSave={handleSave}
        title={editIndex === -1 ? "Add Achievement" : "Edit Achievement"}
        initialData={currentEditData}
        fields={[
          { name: 'title', label: 'Title', type: 'text', placeholder: 'e.g., Hackathon Winner' },
          { name: 'description', label: 'Description', type: 'textarea', placeholder: 'Details about the achievement...' },
          { name: 'imageUrl', label: 'Icon / Image', type: 'image' }
        ]}
      />
    </div>
  );
};

export default Achievements;
