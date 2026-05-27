import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { nanoid } from 'nanoid';
import { getComponentDef } from './componentRegistry';
import BuilderCanvas from './BuilderCanvas';
import ComponentPalette from './ComponentPalette';
import SettingsPanel from './SettingsPanel';
import SectionWizard from './SectionWizard';
import './builder.css';

// ── Array helpers ────────────────────────────────────────────
const moveItem = (arr, from, to) => {
  const next = [...arr];
  const [item] = next.splice(from, 1);
  next.splice(to, 0, item);
  return next;
};

const VisualBuilder = ({ page, onSave, onClose }) => {
  const [sections, setSections] = useState(page?.sections || []);
  const [activeSectionId, setActiveSectionId] = useState(null);
  const [selectedCompId, setSelectedCompId] = useState(null);
  const [showWizard, setShowWizard] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const [pageName, setPageName] = useState(page?.name || 'New Page');
  const [pageSlug, setPageSlug] = useState(page?.slug || 'new-page');
  // ── Derived ─────────────────────────────────────────────────
  const activeSection = sections.find(s => s.id === activeSectionId) || null;

  // ── Section operations ───────────────────────────────────────
  const handleWizardSelect = useCallback((sectionType) => {
    const newSection = {
      id: nanoid(),
      sectionType: sectionType.id,
      label: sectionType.label,
      layout: sectionType.defaultLayout,
      settings: { ...sectionType.defaultSettings },
      components: sectionType.defaultComponents.map(type => {
        const def = getComponentDef(type);
        if (!def) return null;
        return {
          id: nanoid(),
          type: def.type,
          content: { ...def.defaultContent },
          style: { ...def.defaultStyle },
          animation: 'slide-up',
        };
      }).filter(Boolean),
      order: sections.length,
    };
    setSections(prev => [...prev, newSection]);
    setActiveSectionId(newSection.id);
    setSelectedCompId(null);
    setShowWizard(false);
  }, [sections.length]);

  const handleMoveSectionUp = useCallback((idx) => {
    if (idx === 0) return;
    setSections(prev => moveItem(prev, idx, idx - 1));
  }, []);

  const handleMoveSectionDown = useCallback((idx) => {
    setSections(prev => {
      if (idx >= prev.length - 1) return prev;
      return moveItem(prev, idx, idx + 1);
    });
  }, []);

  const handleDeleteSection = useCallback((sectionId) => {
    setSections(prev => prev.filter(s => s.id !== sectionId));
    if (activeSectionId === sectionId) setActiveSectionId(null);
    setSelectedCompId(null);
  }, [activeSectionId]);

  const handleUpdateSection = useCallback((updated) => {
    setSections(prev => prev.map(s => s.id === updated.id ? updated : s));
  }, []);

  // ── Component operations ─────────────────────────────────────
  const handleAddComponent = useCallback((def) => {
    if (!activeSectionId) {
      alert('Please click on a section first to add a component to it.');
      return;
    }
    const newComp = {
      id: nanoid(),
      type: def.type,
      content: { ...def.defaultContent },
      style: { ...def.defaultStyle },
      animation: 'slide-up',
    };
    setSections(prev => prev.map(s => {
      if (s.id !== activeSectionId) return s;
      return { ...s, components: [...(s.components || []), newComp] };
    }));
    setSelectedCompId(newComp.id);
  }, [activeSectionId]);

  const handleUpdateComponent = useCallback((updated) => {
    setSections(prev => prev.map(s => {
      if (s.id !== activeSectionId) return s;
      return { ...s, components: s.components.map(c => c.id === updated.id ? updated : c) };
    }));
  }, [activeSectionId]);

  const handleDeleteComponent = useCallback((compId) => {
    setSections(prev => prev.map(s => {
      if (s.id !== activeSectionId) return s;
      return { ...s, components: s.components.filter(c => c.id !== compId) };
    }));
    setSelectedCompId(null);
  }, [activeSectionId]);

  const handleMoveCompUp = useCallback((sectionId, compIdx) => {
    if (compIdx === 0) return;
    setSections(prev => prev.map(s => {
      if (s.id !== sectionId) return s;
      return { ...s, components: moveItem(s.components, compIdx, compIdx - 1) };
    }));
  }, []);

  const handleMoveCompDown = useCallback((sectionId, compIdx) => {
    setSections(prev => prev.map(s => {
      if (s.id !== sectionId) return s;
      if (compIdx >= s.components.length - 1) return s;
      return { ...s, components: moveItem(s.components, compIdx, compIdx + 1) };
    }));
  }, []);

  // ── Save ─────────────────────────────────────────────────────
  const handleSave = async () => {
    setIsSaving(true);
    const updatedPage = {
      ...(page || {}),
      id: page?.id || nanoid(),
      name: pageName,
      slug: pageSlug,
      sections: sections.map((s, i) => ({ ...s, order: i })),
    };
    await onSave(updatedPage);
    setIsSaving(false);
  };

  return (
    <div className="visual-builder">
      {/* ── Top Bar ─────────────────────────────────────────────── */}
      <div className="builder-topbar">
        <div className="builder-topbar-left">
          <button className="builder-back-btn" onClick={onClose}>← Back</button>
          <div className="builder-page-name">
            <input
              type="text"
              value={pageName}
              onChange={e => setPageName(e.target.value)}
              className="builder-name-input"
              placeholder="Page Name"
            />
            <span className="builder-slug">/</span>
            <input
              type="text"
              value={pageSlug}
              onChange={e => setPageSlug(e.target.value.toLowerCase().replace(/\s+/g, '-'))}
              className="builder-slug-input"
              placeholder="page-slug"
            />
          </div>
        </div>

        <div className="builder-topbar-center">
          <div className="builder-device-tabs">
            <button className={!previewMode ? 'active' : ''} onClick={() => setPreviewMode(false)}>
              🔨 Edit
            </button>
            <button className={previewMode ? 'active' : ''} onClick={() => setPreviewMode(true)}>
              👁 Preview
            </button>
          </div>
        </div>

        <div className="builder-topbar-right">
          <motion.button
            className="builder-add-section-btn"
            onClick={() => setShowWizard(true)}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            + Add Section
          </motion.button>
          <motion.button
            className={`builder-save-btn ${isSaving ? 'saving' : ''}`}
            onClick={handleSave}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            disabled={isSaving}
          >
            {isSaving ? '⏳ Saving…' : '💾 Save Page'}
          </motion.button>
        </div>
      </div>

      {/* ── Three-column layout ──────────────────────────────────── */}
      {!previewMode ? (
        <div className="builder-workspace">
          {/* Left: Component Palette */}
          <aside className="builder-left-panel">
            <div className="panel-header">Components</div>
            {activeSectionId
              ? <ComponentPalette onAddComponent={handleAddComponent} />
              : <div className="panel-hint">Click a section on the canvas to start adding components.</div>
            }
          </aside>

          {/* Center: Canvas */}
          <main className="builder-center">
            <BuilderCanvas
              sections={sections}
              activeSectionId={activeSectionId}
              onActivateSection={(id) => {
                setActiveSectionId(id);
                setSelectedCompId(null);
              }}
              onMoveSectionUp={handleMoveSectionUp}
              onMoveSectionDown={handleMoveSectionDown}
              onDeleteSection={handleDeleteSection}
              selectedCompId={selectedCompId}
              onSelectComp={setSelectedCompId}
              onDeleteComp={handleDeleteComponent}
              onMoveCompUp={handleMoveCompUp}
              onMoveCompDown={handleMoveCompDown}
              onAddSection={() => setShowWizard(true)}
            />
          </main>

          {/* Right: Settings Panel */}
          <aside className="builder-right-panel">
            <div className="panel-header">
              {selectedCompId ? 'Component' : 'Section'} Settings
            </div>
            {activeSection ? (
              <SettingsPanel
                section={activeSection}
                selectedCompId={selectedCompId}
                onUpdateSection={handleUpdateSection}
                onUpdateComponent={handleUpdateComponent}
                onDeleteComponent={handleDeleteComponent}
              />
            ) : (
              <div className="panel-hint">Select a section to edit its settings.</div>
            )}
          </aside>
        </div>
      ) : (
        /* ── PREVIEW MODE ─────────────────────────────────────────── */
        <div className="builder-preview-mode">
          <div className="preview-device-frame">
            {sections.map(section => {
              const SectionRenderer = React.lazy(() => import('./SectionRenderer'));
              return (
                <React.Suspense key={section.id} fallback={<div>…</div>}>
                  <SectionRenderer section={section} />
                </React.Suspense>
              );
            })}
            {sections.length === 0 && (
              <div style={{ textAlign: 'center', padding: 80, opacity: 0.4 }}>
                No sections added yet. Switch to Edit mode to add sections.
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── Section Wizard Modal ─────────────────────────────────── */}
      <AnimatePresence>
        {showWizard && (
          <SectionWizard
            onSelect={handleWizardSelect}
            onClose={() => setShowWizard(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default VisualBuilder;
