import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

// ──────────────────────────────────────────────────────────────
// Individual component renderers
// ──────────────────────────────────────────────────────────────

const AnimatedText = ({ content }) => {
  const [idx, setIdx] = useState(0);
  const words = content.words || [];
  useEffect(() => {
    if (!words.length) return;
    const t = setInterval(() => setIdx(i => (i + 1) % words.length), 2000);
    return () => clearInterval(t);
  }, [words.length]);
  return (
    <p style={{ fontSize: content.style?.fontSize || '2rem', fontWeight: 600, color: 'var(--heading-color)' }}>
      {content.prefix && <span style={{ opacity: 0.7 }}>{content.prefix}</span>}
      <motion.span
        key={idx}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -12 }}
        style={{ color: 'var(--primary-accent)' }}
      >
        {words[idx]}
      </motion.span>
    </p>
  );
};

const StatBlock = ({ content, style }) => (
  <div style={{ textAlign: 'center', ...style }}>
    <div style={{ fontSize: '3rem', fontWeight: 600, color: 'var(--primary-accent)' }}>{content.value}</div>
    <div style={{ fontSize: '0.9rem', opacity: 0.7, marginTop: 4 }}>{content.label}</div>
  </div>
);

const GlassCard = ({ content, style }) => (
  <div style={{
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.1)',
    backdropFilter: 'blur(12px)',
    borderRadius: '16px',
    padding: '24px',
    ...style
  }}>
    {content.icon && <div style={{ fontSize: '2rem', marginBottom: 12 }}>{content.icon}</div>}
    {content.title && <h3 style={{ fontWeight: 700, marginBottom: 8 }}>{content.title}</h3>}
    {content.body && <p style={{ opacity: 0.75, lineHeight: 1.6 }}>{content.body}</p>}
  </div>
);

const FeatureCard = ({ content }) => (
  <div style={{
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '16px',
    padding: '28px 24px',
    textAlign: 'center'
  }}>
    <div style={{ fontSize: '2.5rem', marginBottom: 12 }}>{content.icon}</div>
    <h3 style={{ fontWeight: 600, marginBottom: 8, color: 'var(--text-dark)' }}>{content.title}</h3>
    <p style={{ opacity: 0.65, fontSize: '0.9rem', lineHeight: 1.6 }}>{content.description}</p>
  </div>
);

const ProjectCard = ({ content }) => (
  <div style={{
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '16px',
    overflow: 'hidden'
  }}>
    {content.imageUrl && (
      <div style={{ height: 180, backgroundImage: `url(${content.imageUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
    )}
    <div style={{ padding: '20px' }}>
      <h3 style={{ fontWeight: 700, marginBottom: 8 }}>{content.title}</h3>
      <p style={{ opacity: 0.7, fontSize: '0.875rem', marginBottom: 12 }}>{content.description}</p>
      {(content.tags || []).map(tag => (
        <span key={tag} style={{ display: 'inline-block', background: 'rgba(255,255,255,0.08)', color: 'var(--text-dark)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 20, padding: '2px 10px', fontSize: '0.75rem', marginRight: 6 }}>{tag}</span>
      ))}
      <div style={{ marginTop: 14, display: 'flex', gap: 10 }}>
        {content.liveUrl && <a href={content.liveUrl} target="_blank" rel="noreferrer" style={{ color: 'var(--primary-accent)', fontSize: '0.85rem' }}>Live →</a>}
        {content.githubUrl && <a href={content.githubUrl} target="_blank" rel="noreferrer" style={{ opacity: 0.7, fontSize: '0.85rem' }}>GitHub →</a>}
      </div>
    </div>
  </div>
);

const TimelineItem = ({ content }) => (
  <div style={{ display: 'flex', gap: 20, alignItems: 'flex-start' }}>
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: 40 }}>
      <div style={{ width: 12, height: 12, borderRadius: '50%', background: 'var(--primary-accent)', flexShrink: 0 }} />
      <div style={{ width: 2, flex: 1, background: 'rgba(37,99,235,0.2)', marginTop: 6, minHeight: 40 }} />
    </div>
    <div style={{ paddingBottom: 24 }}>
      <div style={{ fontSize: '0.8rem', color: 'var(--primary-accent)', marginBottom: 4 }}>{content.date}</div>
      <h4 style={{ fontWeight: 700, marginBottom: 6 }}>{content.title}</h4>
      <p style={{ opacity: 0.7, fontSize: '0.9rem', lineHeight: 1.6 }}>{content.description}</p>
    </div>
  </div>
);

const VideoEmbed = ({ content, style }) => {
  const getEmbedUrl = (url) => {
    if (!url) return '';
    const ytMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/);
    if (ytMatch) return `https://www.youtube.com/embed/${ytMatch[1]}${content.autoplay ? '?autoplay=1&mute=1' : ''}`;
    return url;
  };
  return (
    <div style={{ borderRadius: style?.borderRadius || '12px', overflow: 'hidden', aspectRatio: '16/9' }}>
      <iframe
        src={getEmbedUrl(content.url)}
        style={{ width: '100%', height: '100%', border: 'none' }}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        title="video"
      />
    </div>
  );
};

const SocialLinks = ({ content }) => {
  const icons = { github: '⬡', linkedin: '💼', twitter: '𝕏', instagram: '📷', youtube: '▶', email: '✉' };
  return (
    <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', justifyContent: 'center' }}>
      {(content.links || []).map((link, i) => (
        <a key={i} href={link.url} target="_blank" rel="noreferrer"
          style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 10, padding: '10px 18px', color: 'var(--text-dark)', textDecoration: 'none', fontSize: '0.9rem', transition: 'all 0.2s' }}>
          {icons[link.platform] || '🔗'} {link.platform}
        </a>
      ))}
    </div>
  );
};

// ──────────────────────────────────────────────────────────────
// Animation variants
// ──────────────────────────────────────────────────────────────
const ANIM_VARIANTS = {
  'fade': { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { duration: 0.6 } } },
  'slide-up': { hidden: { opacity: 0, y: 40 }, visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22,1,0.36,1] } } },
  'scale': { hidden: { opacity: 0, scale: 0.9 }, visible: { opacity: 1, scale: 1, transition: { duration: 0.6, ease: [0.22,1,0.36,1] } } },
  'none': { hidden: {}, visible: {} },
};

// ──────────────────────────────────────────────────────────────
// The single component dispatcher
// ──────────────────────────────────────────────────────────────
export const RenderComponent = ({ component }) => {
  const { type, content = {}, style = {}, animation = 'fade' } = component;
  const variants = ANIM_VARIANTS[animation] ?? ANIM_VARIANTS['fade'];

  let inner;
  switch (type) {
    case 'heading':
      inner = React.createElement(content.level || 'h2', { style: { textAlign: content.align || 'center', ...style } }, content.text);
      break;
    case 'subheading':
      inner = React.createElement(content.level || 'h3', { style: { textAlign: content.align || 'center', opacity: 0.75, ...style } }, content.text);
      break;
    case 'paragraph':
      inner = <p style={{ textAlign: content.align || 'left', lineHeight: 1.7, ...style }}>{content.text}</p>;
      break;
    case 'animated_text':
      inner = <AnimatedText content={content} />;
      break;
    case 'stat':
      inner = <StatBlock content={content} style={style} />;
      break;
    case 'image':
      inner = <img src={content.src} alt={content.alt || ''} style={{ width: '100%', display: 'block', ...style }} />;
      break;
    case 'video':
      inner = <VideoEmbed content={content} style={style} />;
      break;
    case 'button':
      inner = (
        <a href={content.href || '#'} target={content.target || '_self'}
          className={content.variant === 'primary' ? 'btn-primary' : 'btn-secondary'}
          style={{ display: 'inline-flex', ...style }}>
          {content.text}
        </a>
      );
      break;
    case 'divider':
      inner = <hr style={{ border: 'none', borderTop: '1px solid rgba(255,255,255,0.15)', ...style }} />;
      break;
    case 'spacer':
      inner = <div style={{ height: content.height || 40 }} />;
      break;
    case 'glass_card':
      inner = <GlassCard content={content} style={style} />;
      break;
    case 'feature_card':
      inner = <FeatureCard content={content} />;
      break;
    case 'project_card':
      inner = <ProjectCard content={content} />;
      break;
    case 'timeline_item':
      inner = <TimelineItem content={content} />;
      break;
    case 'social_links':
      inner = <SocialLinks content={content} />;
      break;
    default:
      inner = <div style={{ opacity: 0.4, padding: 12, border: '1px dashed rgba(255,255,255,0.2)', borderRadius: 8 }}>Unknown component: {type}</div>;
  }

  return (
    <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={variants}>
      {inner}
    </motion.div>
  );
};

// ──────────────────────────────────────────────────────────────
// Grid layouts
// ──────────────────────────────────────────────────────────────
const LAYOUT_STYLES = {
  'single':     { display: 'flex', flexDirection: 'column', gap: 24, maxWidth: 760, margin: '0 auto' },
  'two-col':    { display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 24 },
  'three-col':  { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 },
  'masonry':    { columns: '3 300px', columnGap: 24 },
  'hero-split': { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48, alignItems: 'center' },
};

// ──────────────────────────────────────────────────────────────
// Section Renderer (public-facing)
// ──────────────────────────────────────────────────────────────
const SectionRenderer = ({ section }) => {
  const { settings = {}, components = [], layout = 'single', label } = section;

  const bg = settings.backgroundType === 'gradient'
    ? `linear-gradient(135deg, ${settings.gradientFrom || '#0f0f1a'}, ${settings.gradientTo || '#1a1a3e'})`
    : settings.backgroundType === 'image'
      ? `url(${settings.background}) center/cover no-repeat`
      : (settings.background || 'transparent');

  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      style={{
        background: bg,
        backdropFilter: `blur(${settings.glassBlur || 0}px)`,
        paddingTop: settings.paddingY ?? 80,
        paddingBottom: settings.paddingY ?? 80,
        paddingLeft: 32,
        paddingRight: 32,
        borderRadius: settings.borderRadius ?? 0,
      }}
      aria-label={label}
    >
      <div style={LAYOUT_STYLES[layout] || LAYOUT_STYLES['single']}>
        {components.map((comp) => (
          <RenderComponent key={comp.id} component={comp} />
        ))}
      </div>
    </motion.section>
  );
};

export default SectionRenderer;
