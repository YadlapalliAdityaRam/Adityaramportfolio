import React from 'react';
import ProjectCard from './ProjectCard';
import { Briefcase, ChevronRight } from 'lucide-react';
import { useAdmin } from '../context/AdminContext';
import './FeaturedProjects.css';

const fallbackProjects = [
  {
    id: 'fallback-1',
    title: 'No projects yet',
    description: 'Add projects from the Projects page and they will appear here automatically.',
    imagePlaceholder: 'linear-gradient(135deg, #fdfbfb 0%, #ebedee 100%)',
    tags: []
  }
];

const FeaturedProjects = ({ setActiveTab }) => {
  const { portfolioData } = useAdmin();
  const savedProjects = portfolioData?.projects || [];
  const projects = savedProjects.length > 0 ? savedProjects.slice(0, 3) : fallbackProjects;

  return (
    <section className="projects-section glass-card" id="projects">
      <div className="projects-header">
        <div className="projects-title-container">
          <div className="projects-icon">
            <Briefcase size={20} color="var(--primary-accent)" />
          </div>
          <div>
            <h2 className="projects-title">Featured Projects</h2>
            <p className="projects-subtitle">Some of my recent work</p>
          </div>
        </div>
        <button className="btn-secondary" type="button" onClick={() => setActiveTab?.('projects')}>
          View All Projects <ChevronRight size={14} />
        </button>
      </div>

      <div className="projects-grid">
        {projects.map((project, idx) => (
          <ProjectCard key={project.id || project.title || idx} project={project} />
        ))}
      </div>
    </section>
  );
};

export default FeaturedProjects;
