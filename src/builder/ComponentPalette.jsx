import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { COMPONENT_REGISTRY, PALETTE_CATEGORIES } from './componentRegistry';

const ComponentPalette = ({ onAddComponent }) => {
  const [activeCategory, setActiveCategory] = useState('text');
  const [search, setSearch] = useState('');

  const filtered = Object.values(COMPONENT_REGISTRY).filter(c =>
    c.category === activeCategory &&
    (search === '' || c.label.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="palette-panel">
      <div className="palette-search">
        <input
          type="text"
          placeholder="Search components…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="palette-search-input"
        />
      </div>

      <div className="palette-tabs">
        {PALETTE_CATEGORIES.map(cat => (
          <button
            key={cat.id}
            className={`palette-tab ${activeCategory === cat.id ? 'active' : ''}`}
            onClick={() => setActiveCategory(cat.id)}
          >
            <span>{cat.icon}</span>
            <span>{cat.label}</span>
          </button>
        ))}
      </div>

      <div className="palette-items">
        {filtered.map(def => (
          <motion.button
            key={def.type}
            className="palette-item"
            whileHover={{ x: 4, background: 'rgba(96,165,250,0.1)' }}
            whileTap={{ scale: 0.96 }}
            onClick={() => onAddComponent(def)}
          >
            <span className="palette-item-icon">{def.icon}</span>
            <span className="palette-item-label">{def.label}</span>
            <span className="palette-item-add">+</span>
          </motion.button>
        ))}
        {filtered.length === 0 && (
          <div style={{ padding: '20px', textAlign: 'center', opacity: 0.4, fontSize: '0.85rem' }}>
            No components found
          </div>
        )}
      </div>
    </div>
  );
};

export default ComponentPalette;
