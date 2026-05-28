import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, X, Plus, Trash2 } from 'lucide-react';
import { GithubIcon } from './BrandIcons';
import { useAdmin } from '../context/AdminContext';
import InlineEdit from './InlineEdit';
import InlineFieldEditor from './InlineFieldEditor';
import './Projects.css';

const Projects = () => {
  const { portfolioData, updateSection, isLoggedIn } = useAdmin();
  const projects = portfolioData?.projects || [];
  
  const [activeFilter, setActiveFilter] = useState('All');
  const filters = ['All', 'Web Applications', 'Full Stack', 'Frontend', 'Backend'];

  const [selectedId, setSelectedId] = useState(null); // title of expanded project
  const selectedProject = projects.find(p => p.title === selectedId);

  const [editIndex, setEditIndex] = useState(null); // null, -1 (add), >=0 (edit)

  useEffect(() => {
    const handleMacClose = (event) => {
      if (selectedId) {
        event.detail?.handle?.();
        setSelectedId(null);
        return;
      }

      if (editIndex !== null) {
        event.detail?.handle?.();
        setEditIndex(null);
      }
    };

    window.addEventListener('mac-window-close', handleMacClose);
    return () => window.removeEventListener('mac-window-close', handleMacClose);
  }, [editIndex, selectedId]);

  const handleSave = async (data) => {
    let newProjects = [...projects];
    if (editIndex === -1) {
      newProjects.push(data);
    } else if (editIndex >= 0) {
      newProjects[editIndex] = data;
    }
    await updateSection('projects', newProjects);
  };

  const handleDelete = async (idx, e) => {
    e.stopPropagation();
    if (window.confirm('Delete this project?')) {
      const newProjects = projects.filter((_, i) => i !== idx);
      await updateSection('projects', newProjects);
    }
  };

  const currentEditData = editIndex >= 0 ? projects[editIndex] : {};
  const selectedDescriptionLines = (selectedProject?.description || '')
    .split(/\r?\n/)
    .map(line => line.trim())
    .filter(Boolean);
  const selectedDescriptionBullets = selectedDescriptionLines
    .map(line => line.match(/^-\s*(.+)$/)?.[1])
    .filter(Boolean);

  return (
    <div className="page-container" id="projects">
      <div className="page-header">
        <h2 className="page-title">My Projects</h2>
        <p className="page-subtitle">Things I've built with passion.</p>
      </div>

      <div style={{ display: 'flex', gap: '12px', marginBottom: '32px', flexWrap: 'wrap' }}>
        {filters.map(filter => (
          <button 
            key={filter}
            className={activeFilter === filter ? 'btn-primary' : 'btn-secondary'}
            onClick={() => setActiveFilter(filter)}
            style={{ borderRadius: '20px', padding: '6px 16px', fontSize: '0.875rem' }}
          >
            {filter}
          </button>
        ))}
      </div>

      <motion.div className="page-grid" layout>
        {projects.length === 0 && !isLoggedIn && (
          <p style={{ color: 'var(--text-muted)' }}>No projects available yet.</p>
        )}

        {projects.map((project, idx) => {
          const content = (
            <motion.div 
              layoutId={`card-${project.title}`}
              className="glass-card" 
              style={{ display: 'flex', flexDirection: 'column', padding: '16px', cursor: 'pointer', position: 'relative', height: '100%' }}
              onClick={() => !isLoggedIn && setSelectedId(project.title)}
              whileHover={!isLoggedIn ? { scale: 1.02, y: -5 } : {}}
              whileTap={!isLoggedIn ? { scale: 0.98 } : {}}
            >
              <motion.div layoutId={`image-${project.title}`} style={{ width: '100%', height: '160px', background: project.imageUrl ? `rgba(0,0,0,0.08) url(${project.imageUrl}) center / contain no-repeat` : 'rgba(0,0,0,0.05)', borderRadius: '12px', marginBottom: '16px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                {!project.imageUrl && <span style={{ color: 'var(--text-muted)' }}>[No Image]</span>}
              </motion.div>
              <motion.h3 layoutId={`title-${project.title}`} style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '8px' }}>{project.title || '[Untitled Project]'}</motion.h3>
              <motion.p layoutId={`desc-${project.title}`} className="project-card-description">
                {project.description}
              </motion.p>
              
              {isLoggedIn && (
                <button 
                  onClick={(e) => handleDelete(idx, e)}
                  style={{ position: 'absolute', bottom: '16px', right: '16px', background: 'rgba(248, 113, 113, 0.1)', color: '#f87171', border: 'none', borderRadius: '8px', padding: '6px', cursor: 'pointer', zIndex: 60 }}
                  title="Delete Project"
                >
                  <Trash2 size={14} />
                </button>
              )}
            </motion.div>
          );

          return isLoggedIn ? (
            <InlineEdit key={idx} onEdit={() => setEditIndex(idx)} label="Edit Project">
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
            <h3 style={{ fontWeight: 600, color: 'var(--text-dark)' }}>Add New Project</h3>
          </div>
        )}
      </motion.div>

      {/* Mission Control Fullscreen Expansion (Only when NOT editing) */}
      <AnimatePresence>
        {selectedId && selectedProject && !isLoggedIn && (
          <motion.div 
            className="project-modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'absolute',
              inset: 0,
              background: 'rgba(0, 0, 0, 0.6)',
              backdropFilter: 'blur(20px)',
              zIndex: 9000,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              padding: 'clamp(12px, 3vw, 24px)',
              boxSizing: 'border-box'
            }}
            onClick={() => setSelectedId(null)}
          >
            <motion.div 
              layoutId={`card-${selectedProject.title}`}
              className="glass-card"
              style={{
                width: '100%',
                maxWidth: 'min(760px, 100%)',
                maxHeight: '100%',
                overflowY: 'auto',
                overflowX: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                padding: 'clamp(18px, 3vw, 30px)',
                background: 'rgba(30, 30, 30, 0.8)',
                cursor: 'default',
                position: 'relative',
                boxSizing: 'border-box'
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <button 
                onClick={() => setSelectedId(null)}
                style={{ position: 'absolute', top: '20px', right: '20px', background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}
              >
                <X size={24} />
              </button>

              <motion.div layoutId={`image-${selectedProject.title}`} style={{ width: '100%', height: 'clamp(160px, 35vh, 300px)', background: selectedProject.imageUrl ? `rgba(0,0,0,0.08) url(${selectedProject.imageUrl}) center / contain no-repeat` : 'rgba(0,0,0,0.1)', borderRadius: '16px', marginBottom: '24px' }} />
              
              <motion.h3 layoutId={`title-${selectedProject.title}`} style={{ fontSize: 'clamp(1.4rem, 4vw, 2rem)', fontWeight: 700, marginBottom: '16px', paddingRight: '36px', overflowWrap: 'anywhere' }}>{selectedProject.title}</motion.h3>
              
              {selectedDescriptionBullets.length === selectedDescriptionLines.length && selectedDescriptionBullets.length > 0 ? (
                <motion.ul
                  layoutId={`desc-${selectedProject.title}`}
                  style={{ fontSize: 'clamp(0.95rem, 2vw, 1.1rem)', color: 'rgba(255,255,255,0.8)', margin: '0 0 24px 20px', lineHeight: 1.6, overflowWrap: 'anywhere' }}
                >
                  {selectedDescriptionBullets.map((line, index) => (
                    <li key={index} style={{ marginBottom: '8px', color: 'rgba(255,255,255,0.8)' }}>{line}</li>
                  ))}
                </motion.ul>
              ) : (
                <motion.p layoutId={`desc-${selectedProject.title}`} style={{ fontSize: 'clamp(0.95rem, 2vw, 1.1rem)', color: 'rgba(255,255,255,0.8)', marginBottom: '24px', lineHeight: 1.6, overflowWrap: 'anywhere', whiteSpace: 'pre-line' }}>
                  {selectedProject.description}
                </motion.p>
              )}
              
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                {selectedProject.liveUrl && (
                  <a href={selectedProject.liveUrl} target="_blank" rel="noreferrer" className="btn-primary" style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    Live Demo <ExternalLink size={16} />
                  </a>
                )}
                {selectedProject.githubUrl && (
                  <a href={selectedProject.githubUrl} target="_blank" rel="noreferrer" className="btn-secondary" style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <GithubIcon size={16} /> Source Code
                  </a>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <InlineFieldEditor
        isOpen={editIndex !== null}
        onClose={() => setEditIndex(null)}
        onSave={handleSave}
        title={editIndex === -1 ? "Add Project" : "Edit Project"}
        initialData={currentEditData}
        fields={[
          { name: 'title', label: 'Project Title', type: 'text', placeholder: 'e.g., Apple Vision Pro Clone' },
          { name: 'description', label: 'Description', type: 'textarea', placeholder: 'Project details...' },
          { name: 'imageUrl', label: 'Project Cover Image', type: 'image' },
          { name: 'liveUrl', label: 'Live Demo URL', type: 'text', placeholder: 'https://...' },
          { name: 'githubUrl', label: 'GitHub Repository URL', type: 'text', placeholder: 'https://github.m...' }
        ]}
      />
    </div>
  );
};

export default Projects;
