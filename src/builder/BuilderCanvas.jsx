import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RenderComponent } from './SectionRenderer';

// ── Single draggable component row inside a section ──────────
const ComponentRow = ({ comp, isSelected, onSelect, onDelete, onMoveUp, onMoveDown, isFirst, isLast }) => (
  <motion.div
    layout
    className={`canvas-comp-row ${isSelected ? 'selected' : ''}`}
    onClick={() => onSelect(comp.id)}
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, scale: 0.95 }}
    transition={{ duration: 0.25 }}
  >
    {/* Drag handle & label */}
    <div className="canvas-comp-handle">
      <span className="comp-type-badge">{comp.type}</span>
    </div>

    {/* Live mini preview */}
    <div className="canvas-comp-preview" style={{ pointerEvents: 'none', color: '#fff' }}>
      <RenderComponent component={comp} />
    </div>

    {/* Actions */}
    <div className="canvas-comp-actions" onClick={e => e.stopPropagation()}>
      <button title="Move Up" disabled={isFirst} onClick={onMoveUp}>↑</button>
      <button title="Move Down" disabled={isLast} onClick={onMoveDown}>↓</button>
      <button title="Delete" className="danger" onClick={() => onDelete(comp.id)}>✕</button>
    </div>
  </motion.div>
);

// ── A section block (header + its component rows) ────────────
const SectionBlock = ({
  section, isActive, onActivate,
  onMoveUp, onMoveDown, onDelete,
  selectedCompId, onSelectComp, onDeleteComp,
  onMoveCompUp, onMoveCompDown,
  isFirst, isLast
}) => (
  <motion.div
    layout
    className={`canvas-section ${isActive ? 'active' : ''}`}
    onClick={() => onActivate(section.id)}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, height: 0 }}
    transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
  >
    {/* Section header bar */}
    <div className="canvas-section-header" onClick={e => { e.stopPropagation(); onActivate(section.id); }}>
      <div className="section-header-left">
        <span className="section-drag-dots">⣿</span>
        <span className="section-type-tag">{section.sectionType}</span>
        <span className="section-label">{section.label || 'Untitled Section'}</span>
        <span className="section-comp-count">{section.components?.length || 0} components</span>
      </div>
      <div className="section-header-actions" onClick={e => e.stopPropagation()}>
        <button disabled={isFirst} onClick={onMoveUp} title="Move section up">↑</button>
        <button disabled={isLast} onClick={onMoveDown} title="Move section down">↓</button>
        <button className="danger" onClick={onDelete} title="Delete section">🗑</button>
      </div>
    </div>

    {/* Component list */}
    <AnimatePresence>
      {isActive && (
        <motion.div
          className="canvas-section-body"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
        >
          {(!section.components || section.components.length === 0) ? (
            <div className="canvas-empty-state">
              <span>No components yet.</span>
              <span style={{ opacity: 0.5, fontSize: '0.8rem' }}>Add components from the palette on the left.</span>
            </div>
          ) : (
            <AnimatePresence>
              {section.components.map((comp, idx) => (
                <ComponentRow
                  key={comp.id}
                  comp={comp}
                  isSelected={selectedCompId === comp.id}
                  onSelect={onSelectComp}
                  onDelete={onDeleteComp}
                  onMoveUp={() => onMoveCompUp(idx)}
                  onMoveDown={() => onMoveCompDown(idx)}
                  isFirst={idx === 0}
                  isLast={idx === section.components.length - 1}
                />
              ))}
            </AnimatePresence>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  </motion.div>
);

// ── Builder Canvas ───────────────────────────────────────────
const BuilderCanvas = ({
  sections,
  activeSectionId,
  onActivateSection,
  onMoveSectionUp,
  onMoveSectionDown,
  onDeleteSection,
  selectedCompId,
  onSelectComp,
  onDeleteComp,
  onMoveCompUp,
  onMoveCompDown,
  onAddSection,
}) => (
  <div className="builder-canvas">
    {sections.length === 0 ? (
      <motion.div
        className="canvas-placeholder"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="canvas-placeholder-inner">
          <div style={{ fontSize: 48, marginBottom: 16 }}>🎨</div>
          <h3>Your canvas is empty</h3>
          <p>Click "Add Section" to begin building your page</p>
          <motion.button
            className="canvas-add-first"
            onClick={onAddSection}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
          >
            + Add Your First Section
          </motion.button>
        </div>
      </motion.div>
    ) : (
      <AnimatePresence>
        {sections.map((section, idx) => (
          <SectionBlock
            key={section.id}
            section={section}
            isActive={activeSectionId === section.id}
            onActivate={onActivateSection}
            onMoveUp={() => onMoveSectionUp(idx)}
            onMoveDown={() => onMoveSectionDown(idx)}
            onDelete={() => onDeleteSection(section.id)}
            selectedCompId={selectedCompId}
            onSelectComp={onSelectComp}
            onDeleteComp={onDeleteComp}
            onMoveCompUp={(compIdx) => onMoveCompUp(section.id, compIdx)}
            onMoveCompDown={(compIdx) => onMoveCompDown(section.id, compIdx)}
            isFirst={idx === 0}
            isLast={idx === sections.length - 1}
          />
        ))}
      </AnimatePresence>
    )}
  </div>
);

export default BuilderCanvas;
