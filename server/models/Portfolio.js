const mongoose = require('mongoose');

// ─────────────────────────────────────────────────────────
// Dynamic Page Builder Schema
// ─────────────────────────────────────────────────────────

const componentSchema = new mongoose.Schema({
  id: { type: String, required: true },          // nanoid client-side
  type: { type: String, required: true },        // 'heading', 'paragraph', 'image', 'button', 'card', 'stat', 'video', 'divider', 'spacer'
  content: { type: mongoose.Schema.Types.Mixed, default: {} }, // flexible content payload
  style: { type: mongoose.Schema.Types.Mixed, default: {} },   // inline style overrides
  animation: { type: String, default: 'fade' }   // 'fade', 'slide-up', 'scale', 'none'
}, { _id: false });

const sectionSchema = new mongoose.Schema({
  id: { type: String, required: true },
  sectionType: { type: String, default: 'custom' }, // 'hero','descriptive','projects','gallery','timeline','skills','contact','custom'
  label: { type: String, default: 'Untitled Section' },
  layout: { type: String, default: 'single' },   // 'single', 'two-col', 'three-col', 'masonry', 'hero-split'
  components: [componentSchema],
  settings: {
    background: { type: String, default: 'transparent' },
    backgroundType: { type: String, default: 'color' }, // 'color','gradient','image'
    gradientFrom: { type: String, default: '#0f0f1a' },
    gradientTo: { type: String, default: '#1a1a3e' },
    glassBlur: { type: Number, default: 10 },
    paddingY: { type: Number, default: 80 },
    borderRadius: { type: Number, default: 0 },
    animation: { type: String, default: 'fade-up' }
  },
  order: { type: Number, default: 0 }
}, { _id: false });

const pageSchema = new mongoose.Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },        // display name
  slug: { type: String, required: true },        // URL slug e.g. 'about-me'
  sections: [sectionSchema],
  isVisible: { type: Boolean, default: true },
  order: { type: Number, default: 99 }
}, { _id: false });

// ─────────────────────────────────────────────────────────
// Main Portfolio Schema (static + dynamic pages)
// ─────────────────────────────────────────────────────────

const portfolioSchema = new mongoose.Schema({
  // ── Legacy static sections (kept for backward compat) ──
  hero: {
    name: { type: String, default: '[Admin to fill]' },
    title: { type: String, default: '[Admin to fill]' },
    description: { type: String, default: '[Admin to fill]' },
    photoUrl: { type: String, default: '' }
  },
  education: [{
    institution: String,
    address: String,
    degree: String,
    startYear: String,
    endYear: String,
    highlights: [String],
    link: String
  }],
  skills: [{
    category: String,
    items: [String]
  }],
  projects: [{
    title: String,
    description: String,
    imageUrl: String,
    githubUrl: String,
    liveUrl: String
  }],
  internships: [{
    company: String,
    role: String,
    dateFrom: String,
    dateTo: String,
    description: String
  }],
  achievements: [{
    title: String,
    description: String,
    imageUrl: String
  }],
  certifications: [{
    title: String,
    issuer: String,
    date: String,
    imageUrl: String,
    description: String
  }],
  resume: {
    headline: { type: String, default: 'My Resume' },
    summary: { type: String, default: '' },
    resumeUrl: { type: String, default: '' },
    fileName: { type: String, default: '' },
    skills: { type: String, default: '' },
    highlights: { type: String, default: '' }
  },
  contact: {
    email: { type: String, default: '' },
    phone: { type: String, default: '' },
    github: { type: String, default: '' },
    linkedin: { type: String, default: '' }
  },

  // ── Dynamic CMS pages ──
  pages: [pageSchema]

}, { timestamps: true });

module.exports = mongoose.model('Portfolio', portfolioSchema);
