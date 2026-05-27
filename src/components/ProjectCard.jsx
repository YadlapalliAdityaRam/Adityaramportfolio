import React from 'react';
import { ChevronRight } from 'lucide-react';
import './FeaturedProjects.css';

const ProjectCard = ({ project }) => {
  const tags = Array.isArray(project.tags) ? project.tags : [];
  const imageStyle = project.imageUrl
    ? {
        backgroundImage: `url(${project.imageUrl})`,
        backgroundSize: 'contain',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundColor: 'rgba(0, 0, 0, 0.08)'
      }
    : { background: project.imagePlaceholder || 'rgba(255,255,255,0.2)' };

  return (
    <div className="project-card glass">
      <div className="project-image-placeholder" style={imageStyle}>
        {!project.imageUrl && (
          <div className="mock-ui">
          <div className="mock-header">
            <span className="dot"></span>
            <span className="dot"></span>
            <span className="dot"></span>
          </div>
          <div className="mock-body"></div>
        </div>
        )}
      </div>
      <div className="project-info">
        <h3 className="project-title-text">{project.title || '[Untitled Project]'}</h3>
        <p className="project-desc">{project.description}</p>
        {tags.length > 0 && (
          <div className="project-tags">
            {tags.map((tag, idx) => (
              <span key={idx} className={`badge ${tag.class || ''}`}>{tag.name || tag}</span>
            ))}
          </div>
        )}
        {(project.liveUrl || project.githubUrl) && (
          <a href={project.liveUrl || project.githubUrl} target="_blank" rel="noreferrer" className="project-link">
            View Project <ChevronRight size={14} />
          </a>
        )}
      </div>
    </div>
  );
};

export default ProjectCard;
