import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// ── Section type definitions with preview metadata ──────────
const SECTION_TYPES = [
  {
    id: 'hero',
    label: 'Hero Section',
    icon: '🌟',
    description: 'Bold title, subtitle, CTA buttons & background',
    previewGradient: 'linear-gradient(135deg, #0f0c29, #302b63, #24243e)',
    previewEl: (
      <div style={{ textAlign: 'center', padding: '20px 10px' }}>
        <div style={{ height: 8, background: 'rgba(255,255,255,0.9)', borderRadius: 4, width: '70%', margin: '0 auto 8px' }} />
        <div style={{ height: 5, background: 'rgba(255,255,255,0.5)', borderRadius: 4, width: '50%', margin: '0 auto 12px' }} />
        <div style={{ display: 'flex', gap: 6, justifyContent: 'center' }}>
          <div style={{ height: 22, width: 64, borderRadius: 20, background: '#3b82f6' }} />
          <div style={{ height: 22, width: 64, borderRadius: 20, background: 'rgba(255,255,255,0.15)' }} />
        </div>
      </div>
    ),
    defaultComponents: ['heading', 'subheading', 'animated_text', 'button'],
    defaultLayout: 'single',
    defaultSettings: { backgroundType: 'gradient', gradientFrom: '#0f0c29', gradientTo: '#24243e', paddingY: 120, glassBlur: 0, animation: 'fade-up' },
  },
  {
    id: 'descriptive',
    label: 'Descriptive Content',
    icon: '📝',
    description: 'Headings, paragraphs, stats & feature cards',
    previewGradient: 'linear-gradient(135deg, #1a1a2e, #16213e)',
    previewEl: (
      <div style={{ padding: '14px 10px' }}>
        <div style={{ height: 7, background: 'rgba(255,255,255,0.8)', borderRadius: 4, width: '55%', marginBottom: 8 }} />
        <div style={{ height: 4, background: 'rgba(255,255,255,0.4)', borderRadius: 4, marginBottom: 4 }} />
        <div style={{ height: 4, background: 'rgba(255,255,255,0.4)', borderRadius: 4, width: '80%', marginBottom: 4 }} />
        <div style={{ display: 'flex', gap: 6, marginTop: 10 }}>
          {[1,2,3].map(i => <div key={i} style={{ flex: 1, height: 36, borderRadius: 8, background: 'rgba(96,165,250,0.2)' }} />)}
        </div>
      </div>
    ),
    defaultComponents: ['heading', 'paragraph', 'stat', 'feature_card'],
    defaultLayout: 'single',
    defaultSettings: { backgroundType: 'color', background: 'transparent', paddingY: 80, glassBlur: 0 },
  },
  {
    id: 'projects',
    label: 'Project Showcase',
    icon: '📁',
    description: 'Project cards with images, links & tags',
    previewGradient: 'linear-gradient(135deg, #0d1b2a, #1b263b)',
    previewEl: (
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6, padding: '12px 10px' }}>
        {[1,2,3,4].map(i => (
          <div key={i} style={{ borderRadius: 8, background: 'rgba(255,255,255,0.07)', padding: 6 }}>
            <div style={{ height: 28, borderRadius: 6, background: 'rgba(255,255,255,0.1)', marginBottom: 4 }} />
            <div style={{ height: 4, background: 'rgba(255,255,255,0.3)', borderRadius: 4, marginBottom: 2 }} />
            <div style={{ height: 4, background: 'rgba(255,255,255,0.2)', borderRadius: 4, width: '60%' }} />
          </div>
        ))}
      </div>
    ),
    defaultComponents: ['heading', 'subheading', 'project_card'],
    defaultLayout: 'two-col',
    defaultSettings: { backgroundType: 'gradient', gradientFrom: '#0d1b2a', gradientTo: '#1b263b', paddingY: 80 },
  },
  {
    id: 'gallery',
    label: 'Image Gallery',
    icon: '🖼',
    description: 'Masonry images, carousel, fullscreen preview',
    previewGradient: 'linear-gradient(135deg, #1a0533, #2d1b69)',
    previewEl: (
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 5, padding: '12px 10px' }}>
        {[1,2,3,4,5,6].map(i => <div key={i} style={{ height: i % 2 ? 32 : 22, borderRadius: 6, background: 'rgba(255,255,255,0.15)' }} />)}
      </div>
    ),
    defaultComponents: ['heading', 'image', 'image', 'image'],
    defaultLayout: 'masonry',
    defaultSettings: { backgroundType: 'color', background: 'transparent', paddingY: 60, glassBlur: 5 },
  },
  {
    id: 'video',
    label: 'Video Section',
    icon: '▶',
    description: 'YouTube embeds, cinematic autoplay reels',
    previewGradient: 'linear-gradient(135deg, #000000, #1a1a1a)',
    previewEl: (
      <div style={{ padding: '14px 10px' }}>
        <div style={{ height: 60, borderRadius: 10, background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>▶</div>
      </div>
    ),
    defaultComponents: ['heading', 'video'],
    defaultLayout: 'single',
    defaultSettings: { backgroundType: 'color', background: '#000', paddingY: 80, glassBlur: 0 },
  },
  {
    id: 'timeline',
    label: 'Timeline',
    icon: '📅',
    description: 'Experience timeline, roadmap, journey animation',
    previewGradient: 'linear-gradient(135deg, #0f2027, #203a43, #2c5364)',
    previewEl: (
      <div style={{ padding: '12px 10px' }}>
        {[1,2,3].map(i => (
          <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#3b82f6', marginTop: 4, flexShrink: 0 }} />
            <div style={{ flex: 1 }}>
              <div style={{ height: 5, background: 'rgba(255,255,255,0.7)', borderRadius: 4, marginBottom: 4, width: '60%' }} />
              <div style={{ height: 4, background: 'rgba(255,255,255,0.3)', borderRadius: 4 }} />
            </div>
          </div>
        ))}
      </div>
    ),
    defaultComponents: ['heading', 'timeline_item', 'timeline_item'],
    defaultLayout: 'single',
    defaultSettings: { backgroundType: 'gradient', gradientFrom: '#0f2027', gradientTo: '#2c5364', paddingY: 80 },
  },
  {
    id: 'skills',
    label: 'Skills Section',
    icon: '⚡',
    description: 'Skill icons, animated charts, tag grids',
    previewGradient: 'linear-gradient(135deg, #0a0a0a, #1a1a1a)',
    previewEl: (
      <div style={{ padding: '12px 10px' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
          {['React','Node','Python','GSAP','MongoDB','TypeScript'].map(t => (
            <div key={t} style={{ height: 18, borderRadius: 20, background: 'rgba(96,165,250,0.2)', padding: '0 8px', fontSize: 9, display: 'flex', alignItems: 'center', color: '#60a5fa' }}>{t}</div>
          ))}
        </div>
      </div>
    ),
    defaultComponents: ['heading', 'glass_card', 'glass_card'],
    defaultLayout: 'two-col',
    defaultSettings: { backgroundType: 'color', background: 'transparent', paddingY: 80 },
  },
  {
    id: 'contact',
    label: 'Contact Section',
    icon: '✉',
    description: 'Social links, email, contact information',
    previewGradient: 'linear-gradient(135deg, #1a1a2e, #0f3460)',
    previewEl: (
      <div style={{ padding: '14px 10px', textAlign: 'center' }}>
        <div style={{ height: 7, background: 'rgba(255,255,255,0.7)', borderRadius: 4, width: '50%', margin: '0 auto 10px' }} />
        <div style={{ display: 'flex', gap: 6, justifyContent: 'center' }}>
          {[1,2,3].map(i => <div key={i} style={{ width: 30, height: 30, borderRadius: 8, background: 'rgba(255,255,255,0.1)' }} />)}
        </div>
      </div>
    ),
    defaultComponents: ['heading', 'paragraph', 'social_links'],
    defaultLayout: 'single',
    defaultSettings: { backgroundType: 'gradient', gradientFrom: '#1a1a2e', gradientTo: '#0f3460', paddingY: 80, glassBlur: 10 },
  },
  {
    id: 'custom',
    label: 'Custom Section',
    icon: '🔧',
    description: 'Blank canvas — build any layout from scratch',
    previewGradient: 'linear-gradient(135deg, #111, #222)',
    previewEl: (
      <div style={{ padding: 20, textAlign: 'center' }}>
        <div style={{ width: 40, height: 40, borderRadius: '50%', border: '2px dashed rgba(255,255,255,0.3)', margin: '0 auto 8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>+</div>
        <div style={{ height: 4, background: 'rgba(255,255,255,0.15)', borderRadius: 4, width: '60%', margin: '0 auto' }} />
      </div>
    ),
    defaultComponents: [],
    defaultLayout: 'single',
    defaultSettings: { backgroundType: 'color', background: 'transparent', paddingY: 80 },
  },
];

const SectionWizard = ({ onSelect, onClose }) => {
  return (
    <AnimatePresence>
      <motion.div
        className="wizard-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="wizard-panel"
          initial={{ opacity: 0, scale: 0.92, y: 40 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 40 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          onClick={e => e.stopPropagation()}
        >
          <div className="wizard-header">
            <h2>What type of section do you want to create?</h2>
            <p>Choose a template — you can customise everything afterwards.</p>
            <button className="wizard-close" onClick={onClose}>✕</button>
          </div>

          <div className="wizard-grid">
            {SECTION_TYPES.map(type => (
              <motion.div
                key={type.id}
                className="wizard-card"
                whileHover={{ scale: 1.03, y: -4 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => onSelect(type)}
              >
                <div className="wizard-card-preview" style={{ background: type.previewGradient }}>
                  {type.previewEl}
                </div>
                <div className="wizard-card-body">
                  <span className="wizard-card-icon">{type.icon}</span>
                  <div>
                    <div className="wizard-card-label">{type.label}</div>
                    <div className="wizard-card-desc">{type.description}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default SectionWizard;
