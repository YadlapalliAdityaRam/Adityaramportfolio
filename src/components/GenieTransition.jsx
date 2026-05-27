import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useGenie } from '../context/GenieContext';

function getBezierPoint(t, p0, p1, p2, p3) {
  const u = 1 - t;
  const tt = t * t;
  const uu = u * u;
  const uuu = uu * u;
  const ttt = tt * t;

  return {
    x: uuu * p0.x + 3 * uu * t * p1.x + 3 * u * tt * p2.x + ttt * p3.x,
    y: uuu * p0.y + 3 * uu * t * p1.y + 3 * u * tt * p2.y + ttt * p3.y,
  };
}

function getLineCPs(p0, p3) {
  return [
    { x: p0.x + (p3.x - p0.x) / 3, y: p0.y + (p3.y - p0.y) / 3 },
    { x: p0.x + (p3.x - p0.x) * (2 / 3), y: p0.y + (p3.y - p0.y) * (2 / 3) },
  ];
}

function makePolygon(p, segments = 10) {
  const points = [];
  const [tCp1, tCp2] = p.t_cp1 ? [p.t_cp1, p.t_cp2] : getLineCPs(p.tl, p.tr);
  const [rCp1, rCp2] = p.r_cp1 ? [p.r_cp1, p.r_cp2] : getLineCPs(p.tr, p.br);
  const [bCp1, bCp2] = p.b_cp1 ? [p.b_cp1, p.b_cp2] : getLineCPs(p.br, p.bl);
  const [lCp1, lCp2] = p.l_cp1 ? [p.l_cp1, p.l_cp2] : getLineCPs(p.bl, p.tl);

  for (let i = 0; i < segments; i += 1) points.push(getBezierPoint(i / segments, p.tl, tCp1, tCp2, p.tr));
  for (let i = 0; i < segments; i += 1) points.push(getBezierPoint(i / segments, p.tr, rCp1, rCp2, p.br));
  for (let i = 0; i < segments; i += 1) points.push(getBezierPoint(i / segments, p.br, bCp1, bCp2, p.bl));
  for (let i = 0; i < segments; i += 1) points.push(getBezierPoint(i / segments, p.bl, lCp1, lCp2, p.tl));

  return `polygon(${points.map(pt => `${(pt.x * 100).toFixed(2)}% ${(pt.y * 100).toFixed(2)}%`).join(', ')})`;
}

const FULL = {
  tl: { x: 0, y: 0 },
  tr: { x: 1, y: 0 },
  br: { x: 1, y: 1 },
  bl: { x: 0, y: 1 },
};

const FULL_POLY = makePolygon(FULL);

function getCollapsedPoly(target) {
  const vw = window.innerWidth || 1;
  const vh = window.innerHeight || 1;
  const tx = target?.x ? target.x / vw : 0.5;
  const ty = target?.y ? target.y / vh : 0.98;
  const hw = 0.025;
  const th = 0.018;

  return makePolygon({
    tl: { x: tx - hw, y: ty - th },
    tr: { x: tx + hw, y: ty - th },
    br: { x: tx + hw * 0.8, y: ty + th },
    bl: { x: tx - hw * 0.8, y: ty + th },
    r_cp1: { x: tx + hw, y: ty - th * 0.3 },
    r_cp2: { x: tx + hw, y: ty + th * 0.3 },
    l_cp1: { x: tx - hw, y: ty + th * 0.3 },
    l_cp2: { x: tx - hw, y: ty - th * 0.3 },
  });
}

function buildExitPolys(direction, target) {
  if (direction === 'right') {
    const mid1 = makePolygon({
      tl: { x: 0, y: 0 },
      tr: { x: 0.65, y: 0.15 },
      br: { x: 0.35, y: 1 },
      bl: { x: 0, y: 1 },
      r_cp1: { x: 0.42, y: 0.35 },
      r_cp2: { x: 0.24, y: 0.82 },
    });
    const mid2 = makePolygon({
      tl: { x: 0, y: 0 },
      tr: { x: 0.34, y: 0.35 },
      br: { x: 0.14, y: 1 },
      bl: { x: 0, y: 1 },
      r_cp1: { x: 0.16, y: 0.48 },
      r_cp2: { x: 0.05, y: 0.9 },
    });
    return [FULL_POLY, mid1, mid2, getCollapsedPoly(target)];
  }

  if (direction === 'left') {
    const mid1 = makePolygon({
      tl: { x: 0.35, y: 0.15 },
      tr: { x: 1, y: 0 },
      br: { x: 1, y: 1 },
      bl: { x: 0.65, y: 1 },
      l_cp1: { x: 0.76, y: 0.82 },
      l_cp2: { x: 0.58, y: 0.38 },
    });
    const mid2 = makePolygon({
      tl: { x: 0.66, y: 0.35 },
      tr: { x: 1, y: 0 },
      br: { x: 1, y: 1 },
      bl: { x: 0.86, y: 1 },
      l_cp1: { x: 0.94, y: 0.9 },
      l_cp2: { x: 0.84, y: 0.5 },
    });
    return [FULL_POLY, mid1, mid2, getCollapsedPoly(target)];
  }

  const mid = makePolygon({
    tl: { x: 0.18, y: 0.5 },
    tr: { x: 0.82, y: 0.5 },
    br: { x: 0.9, y: 1 },
    bl: { x: 0.1, y: 1 },
    r_cp1: { x: 0.82, y: 0.62 },
    r_cp2: { x: 0.86, y: 0.82 },
    l_cp1: { x: 0.14, y: 0.82 },
    l_cp2: { x: 0.18, y: 0.62 },
  });
  return [FULL_POLY, mid, getCollapsedPoly(target)];
}

function buildExitTranslate(direction, target) {
  const cx = window.innerWidth / 2;
  const cy = window.innerHeight / 2;
  if (!target) return { x: 0, y: cy };
  if (direction === 'up') return { x: 0, y: -cy };
  if (direction === 'down') return { x: 0, y: cy };
  return { x: target.x - cx, y: target.y - cy };
}

const TRANSFORM_ORIGINS = {
  right: '0% 100%',
  left: '100% 100%',
  up: '50% 0%',
  down: '50% 100%',
};

export default function GenieTransition({ children, activeKey }) {
  const { navDirection, dockTargetRef } = useGenie();
  const direction = navDirection;
  const target = { ...dockTargetRef.current };
  const exitPolys = buildExitPolys(direction, target);
  const enterPolys = [...exitPolys].reverse();
  const exitTranslate = buildExitTranslate(direction, target);
  const transformOrigin = TRANSFORM_ORIGINS[direction] ?? '0% 100%';
  const skewX = direction === 'left' ? [0, 7, 14, 20] : [0, -7, -14, -20];
  const rotateY = direction === 'left' ? [0, 5, 10, 15] : [0, -5, -10, -15];

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={activeKey}
        initial={{
          clipPath: enterPolys[0],
          WebkitClipPath: enterPolys[0],
          opacity: 0,
          scale: 0.22,
          x: exitTranslate.x,
          y: exitTranslate.y,
          transformPerspective: 1200,
        }}
        animate={{
          clipPath: enterPolys,
          WebkitClipPath: enterPolys,
          opacity: [0, 0.45, 0.9, 1],
          scale: [0.22, 1.04, 0.99, 1],
          x: [exitTranslate.x, exitTranslate.x * 0.25, 0, 0],
          y: [exitTranslate.y, exitTranslate.y * 0.25, 0, 0],
          skewX: [skewX[3], skewX[1], 0, 0],
          skewY: [6, 2, 0, 0],
          rotateY: [rotateY[3], rotateY[1], 0, 0],
          filter: ['blur(6px)', 'blur(2px)', 'blur(0px)', 'blur(0px)'],
          transformPerspective: 1200,
        }}
        exit={{
          clipPath: exitPolys,
          WebkitClipPath: exitPolys,
          opacity: [1, 0.92, 0.62, 0],
          scale: [1, 0.96, 0.72, 0.18],
          x: [0, exitTranslate.x * 0.25, exitTranslate.x * 0.7, exitTranslate.x],
          y: [0, exitTranslate.y * 0.2, exitTranslate.y * 0.6, exitTranslate.y],
          skewX,
          skewY: [0, 2, 4, 6],
          rotateY,
          filter: ['blur(0px)', 'blur(1px)', 'blur(3px)', 'blur(6px)'],
          transformPerspective: 1200,
        }}
        transition={{
          duration: 0.86,
          ease: [0.22, 1, 0.36, 1],
          times: exitPolys.length === 3 ? [0, 0.55, 1] : [0, 0.28, 0.72, 1],
        }}
        style={{
          position: 'absolute',
          inset: 0,
          overflow: 'hidden',
          transformOrigin,
          willChange: 'transform, opacity, filter, clip-path',
          backfaceVisibility: 'hidden',
          WebkitBackfaceVisibility: 'hidden',
          contain: 'layout paint',
        }}
      >
        <motion.div
          aria-hidden="true"
          initial={{ opacity: 0, x: '-100%' }}
          animate={{ opacity: [0, 1, 0], x: ['-100%', '100%'] }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.62, ease: 'linear' }}
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(120deg, transparent 22%, rgba(255,255,255,0.18) 50%, transparent 78%)',
            pointerEvents: 'none',
            zIndex: 10,
          }}
        />

        <div style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
          {children}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
