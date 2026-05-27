import React, { useRef } from 'react';
import { compressImage } from '../utils/imageCompressor';

// ── Deep setter for nested paths like 'content.text' ────────
const setDeep = (obj, path, val) => {
  const parts = path.split('.');
  const clone = { ...obj };
  let cur = clone;
  for (let i = 0; i < parts.length - 1; i++) {
    cur[parts[i]] = { ...(cur[parts[i]] || {}) };
    cur = cur[parts[i]];
  }
  cur[parts[parts.length - 1]] = val;
  return clone;
};

// ── Field renderer for a single value ───────────────────────
const Field = ({ label, value, path, onChange, type }) => {
  const fileRef = useRef(null);
  const isColor = typeof value === 'string' && /^#/.test(value);
  const isLong = typeof value === 'string' && value.length > 60;
  const isNum = typeof value === 'number';
  const isBoolean = typeof value === 'boolean';
  const isImage = type === 'image';

  const handleImageFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const dataUrl = await compressImage(file);
      onChange(path, dataUrl);
    } catch (err) {
      console.error("Failed to process file", err);
    }
  };

  if (isImage) {
    return (
      <div className="sp-field">
        <label className="sp-label">{label}</label>
        <div className="sp-image-control">
          {value ? (
            <div className="sp-image-preview" style={{ backgroundImage: `url(${value})` }} />
          ) : (
            <div className="sp-image-preview empty">Image</div>
          )}
          <div className="sp-image-actions">
            <input type="file" accept="image/*" ref={fileRef} onChange={handleImageFile} style={{ display: 'none' }} />
            <button type="button" className="sp-upload-btn" onClick={() => fileRef.current?.click()}>
              {value ? 'Change Upload' : 'Upload Image'}
            </button>
            <input
              type="text"
              value={String(value ?? '')}
              onChange={e => onChange(path, e.target.value)}
              className="sp-input"
              placeholder="Image URL or uploaded data URL"
            />
          </div>
        </div>
      </div>
    );
  }

  if (isBoolean) {
    return (
      <div className="sp-field">
        <label className="sp-label">{label}</label>
        <label className="sp-toggle">
          <input type="checkbox" checked={value} onChange={e => onChange(path, e.target.checked)} />
          <span className="sp-toggle-track" />
        </label>
      </div>
    );
  }
  if (isColor) {
    return (
      <div className="sp-field">
        <label className="sp-label">{label}</label>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <input type="color" value={value} onChange={e => onChange(path, e.target.value)} className="sp-color" />
          <input type="text" value={value} onChange={e => onChange(path, e.target.value)} className="sp-input" style={{ flex: 1 }} />
        </div>
      </div>
    );
  }
  if (isNum) {
    return (
      <div className="sp-field">
        <label className="sp-label">{label} <span style={{ opacity: 0.5 }}>{value}px</span></label>
        <input type="range" min={0} max={200} value={value} onChange={e => onChange(path, Number(e.target.value))} className="sp-range" />
      </div>
    );
  }
  if (isLong) {
    return (
      <div className="sp-field">
        <label className="sp-label">{label}</label>
        <textarea value={value} onChange={e => onChange(path, e.target.value)} className="sp-textarea" rows={3} />
      </div>
    );
  }
  return (
    <div className="sp-field">
      <label className="sp-label">{label}</label>
      <input type="text" value={String(value ?? '')} onChange={e => onChange(path, e.target.value)} className="sp-input" />
    </div>
  );
};

// ── Renders fields for the component's content object ───────
const ContentFields = ({ content = {}, onChange }) => (
  <>
    {Object.entries(content).map(([key, val]) => {
      const lowerKey = key.toLowerCase();
      const isImageField = lowerKey === 'src' || lowerKey.includes('image') || lowerKey.includes('photo');
      // Skip arrays for now (handled specially)
      if (Array.isArray(val)) {
        return (
          <div key={key} className="sp-field">
            <label className="sp-label">{key} (comma-separated)</label>
            <input
              type="text"
              value={val.join(', ')}
              onChange={e => onChange(`content.${key}`, e.target.value.split(',').map(s => s.trim()))}
              className="sp-input"
            />
          </div>
        );
      }
      if (typeof val === 'object' && val !== null) return null; // skip nested objects
      return <Field key={key} label={key} value={val} path={`content.${key}`} onChange={onChange} type={isImageField ? 'image' : undefined} />;
    })}
  </>
);

// ── Main Settings Panel ──────────────────────────────────────
const SettingsPanel = ({ section, selectedCompId, onUpdateSection, onUpdateComponent, onDeleteComponent }) => {
  const selectedComp = section?.components?.find(c => c.id === selectedCompId);

  // ── Section-level settings ───────────────────────────────
  const handleSectionSetting = (key, val) => {
    onUpdateSection({ ...section, settings: { ...section.settings, [key]: val } });
  };

  // ── Component-level field change ─────────────────────────
  const handleCompChange = (path, val) => {
    const updated = setDeep(selectedComp, path, val);
    onUpdateComponent(updated);
  };

  const ANIMATION_OPTIONS = ['fade', 'slide-up', 'scale', 'none'];
  const LAYOUT_OPTIONS = ['single', 'two-col', 'three-col', 'masonry', 'hero-split'];

  return (
    <div className="settings-panel">
      {selectedComp ? (
        <>
          <div className="sp-header">
            <span>✏️ Editing: <strong>{selectedComp.type}</strong></span>
            <button className="sp-delete" onClick={() => onDeleteComponent(selectedComp.id)}>🗑 Remove</button>
          </div>

          <div className="sp-section-title">Content</div>
          <ContentFields content={selectedComp.content} onChange={handleCompChange} />

          <div className="sp-section-title">Animation</div>
          <div className="sp-field">
            <label className="sp-label">Enter Animation</label>
            <select value={selectedComp.animation || 'fade'} onChange={e => handleCompChange('animation', e.target.value)} className="sp-select">
              {ANIMATION_OPTIONS.map(a => <option key={a} value={a}>{a}</option>)}
            </select>
          </div>
        </>
      ) : (
        <>
          <div className="sp-header">
            <span>⚙️ Section Settings</span>
          </div>

          <div className="sp-section-title">Identity</div>
          <div className="sp-field">
            <label className="sp-label">Section Label</label>
            <input type="text" value={section?.label || ''} onChange={e => onUpdateSection({ ...section, label: e.target.value })} className="sp-input" />
          </div>

          <div className="sp-section-title">Layout</div>
          <div className="sp-field">
            <label className="sp-label">Grid Layout</label>
            <select value={section?.layout || 'single'} onChange={e => onUpdateSection({ ...section, layout: e.target.value })} className="sp-select">
              {LAYOUT_OPTIONS.map(l => <option key={l} value={l}>{l}</option>)}
            </select>
          </div>

          <div className="sp-section-title">Background</div>
          <div className="sp-field">
            <label className="sp-label">Type</label>
            <select value={section?.settings?.backgroundType || 'color'} onChange={e => handleSectionSetting('backgroundType', e.target.value)} className="sp-select">
              <option value="color">Solid Color</option>
              <option value="gradient">Gradient</option>
              <option value="image">Image URL</option>
            </select>
          </div>
          {section?.settings?.backgroundType === 'gradient' && (
            <>
              <Field label="From Color" value={section.settings.gradientFrom || '#0f0f1a'} path="gradientFrom" onChange={(_, v) => handleSectionSetting('gradientFrom', v)} />
              <Field label="To Color" value={section.settings.gradientTo || '#1a1a3e'} path="gradientTo" onChange={(_, v) => handleSectionSetting('gradientTo', v)} />
            </>
          )}
          {section?.settings?.backgroundType === 'color' && (
            <Field label="Background Color" value={section.settings.background || '#000000'} path="bg" onChange={(_, v) => handleSectionSetting('background', v)} />
          )}
          {section?.settings?.backgroundType === 'image' && (
            <Field
              label="Background Image"
              value={section.settings.background || ''}
              path="background"
              onChange={(_, v) => handleSectionSetting('background', v)}
              type="image"
            />
          )}

          <div className="sp-section-title">Spacing & Effects</div>
          <Field label="Vertical Padding" value={section?.settings?.paddingY ?? 80} path="paddingY" onChange={(_, v) => handleSectionSetting('paddingY', v)} />
          <Field label="Glass Blur" value={section?.settings?.glassBlur ?? 0} path="glassBlur" onChange={(_, v) => handleSectionSetting('glassBlur', v)} />
          <Field label="Border Radius" value={section?.settings?.borderRadius ?? 0} path="borderRadius" onChange={(_, v) => handleSectionSetting('borderRadius', v)} />
        </>
      )}
    </div>
  );
};

export default SettingsPanel;
