/**
 * COMPONENT REGISTRY
 * Maps component type strings → metadata used by:
 *  - the builder palette (icon, label, defaultContent)
 *  - SectionRenderer (decides which React element to render)
 */

export const COMPONENT_REGISTRY = {
  // ── Text ─────────────────────────────────────────────
  heading: {
    type: 'heading',
    label: 'Heading',
    icon: '𝗛',
    category: 'text',
    defaultContent: { text: 'Section Heading', level: 'h2', align: 'center' },
    defaultStyle: { fontSize: '2.5rem', fontWeight: 700, color: '#ffffff' },
  },
  subheading: {
    type: 'subheading',
    label: 'Sub-heading',
    icon: 'H₂',
    category: 'text',
    defaultContent: { text: 'A compelling sub-heading', level: 'h3', align: 'center' },
    defaultStyle: { fontSize: '1.4rem', fontWeight: 400, color: 'rgba(255,255,255,0.75)' },
  },
  paragraph: {
    type: 'paragraph',
    label: 'Paragraph',
    icon: '¶',
    category: 'text',
    defaultContent: { text: 'Start writing your story here. This is a paragraph block.', align: 'left' },
    defaultStyle: { fontSize: '1rem', lineHeight: 1.7, color: 'rgba(255,255,255,0.8)' },
  },
  animated_text: {
    type: 'animated_text',
    label: 'Animated Text',
    icon: '✨',
    category: 'text',
    defaultContent: { words: ['Developer', 'Designer', 'Creator'], prefix: "I'm a " },
    defaultStyle: { fontSize: '2rem', fontWeight: 700 },
  },
  stat: {
    type: 'stat',
    label: 'Stat Counter',
    icon: '📊',
    category: 'text',
    defaultContent: { value: '100+', label: 'Projects' },
    defaultStyle: {},
  },

  // ── Media ────────────────────────────────────────────
  image: {
    type: 'image',
    label: 'Image',
    icon: '🖼',
    category: 'media',
    defaultContent: { src: '', alt: '', caption: '' },
    defaultStyle: { borderRadius: '12px', objectFit: 'cover' },
  },
  video: {
    type: 'video',
    label: 'Video Embed',
    icon: '▶',
    category: 'media',
    defaultContent: { url: '', type: 'youtube', autoplay: false },
    defaultStyle: { borderRadius: '12px' },
  },

  // ── Interactive ──────────────────────────────────────
  button: {
    type: 'button',
    label: 'Button',
    icon: '⬤',
    category: 'interactive',
    defaultContent: { text: 'Click Me', href: '#', variant: 'primary', target: '_self' },
    defaultStyle: {},
  },
  divider: {
    type: 'divider',
    label: 'Divider',
    icon: '─',
    category: 'layout',
    defaultContent: { style: 'line' },
    defaultStyle: { opacity: 0.2 },
  },
  spacer: {
    type: 'spacer',
    label: 'Spacer',
    icon: '↕',
    category: 'layout',
    defaultContent: { height: 40 },
    defaultStyle: {},
  },

  // ── Cards / Containers ───────────────────────────────
  glass_card: {
    type: 'glass_card',
    label: 'Glass Card',
    icon: '◻',
    category: 'layout',
    defaultContent: { title: 'Card Title', body: 'Card description text.', icon: '' },
    defaultStyle: { padding: '24px', borderRadius: '16px' },
  },
  feature_card: {
    type: 'feature_card',
    label: 'Feature Card',
    icon: '⭐',
    category: 'layout',
    defaultContent: { icon: '🚀', title: 'Feature Title', description: 'Short description of this feature.' },
    defaultStyle: {},
  },
  project_card: {
    type: 'project_card',
    label: 'Project Card',
    icon: '📁',
    category: 'layout',
    defaultContent: { title: 'Project Name', description: '', imageUrl: '', githubUrl: '', liveUrl: '', tags: [] },
    defaultStyle: {},
  },
  timeline_item: {
    type: 'timeline_item',
    label: 'Timeline Item',
    icon: '📅',
    category: 'layout',
    defaultContent: { title: 'Event Title', date: '2024', description: 'What happened at this point.' },
    defaultStyle: {},
  },
  social_links: {
    type: 'social_links',
    label: 'Social Links',
    icon: '🔗',
    category: 'interactive',
    defaultContent: { links: [{ platform: 'github', url: '' }, { platform: 'linkedin', url: '' }] },
    defaultStyle: {},
  },
};

// Categorised for the palette UI
export const PALETTE_CATEGORIES = [
  { id: 'text',        label: 'Text',        icon: 'T' },
  { id: 'media',       label: 'Media',       icon: '🖼' },
  { id: 'layout',      label: 'Layout',      icon: '▦' },
  { id: 'interactive', label: 'Interactive', icon: '⚡' },
];

export const getComponentDef = (type) => COMPONENT_REGISTRY[type] ?? null;
