import React, { createContext, useContext, useRef, useState } from 'react';

/**
 * GenieContext
 * ────────────
 * Tracks:
 *  - navDirection: 'left' | 'right' | 'up' | 'down'
 *  - dockTarget: { x, y, width, height } — clicked dock icon bounding rect
 *  - tabOrder: ordered list of tab ids for direction inference
 */

const GenieContext = createContext(null);

export const TAB_ORDER = [
  'home',
  'education',
  'skills',
  'projects',
  'internships',
  'achievements',
  'certifications',
  'resume',
  'contact',
];

export function GenieProvider({ children }) {
  const [navDirection, setNavDirection] = useState('right');
  const dockTargetRef = useRef({ x: window.innerWidth / 2, y: window.innerHeight, width: 48, height: 48 });

  /**
   * Call this BEFORE changing activeTab.
   * Computes direction from current → next tab index,
   * and stores the clicked element's bounding rect.
   */
  const recordNavigation = (fromId, toId, clickedEl) => {
    // Compute direction
    const fromIdx = TAB_ORDER.indexOf(fromId);
    const toIdx   = TAB_ORDER.indexOf(toId);
    if (fromIdx === -1 || toIdx === -1) {
      setNavDirection('right');
    } else {
      setNavDirection(toIdx > fromIdx ? 'right' : 'left');
    }

    // Store dock icon coords
    if (clickedEl) {
      const rect = clickedEl.getBoundingClientRect();
      dockTargetRef.current = {
        x: rect.left + rect.width  / 2,
        y: rect.top  + rect.height / 2,
        width:  rect.width,
        height: rect.height,
      };
    }
  };

  return (
    <GenieContext.Provider value={{ navDirection, dockTargetRef, recordNavigation }}>
      {children}
    </GenieContext.Provider>
  );
}

export function useGenie() {
  const ctx = useContext(GenieContext);
  if (!ctx) throw new Error('useGenie must be used inside <GenieProvider>');
  return ctx;
}
