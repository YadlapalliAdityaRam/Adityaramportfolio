import React, { useRef, useEffect, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useGenie } from '../context/GenieContext';

// ─── Lerp / ease helpers ──────────────────────────────────────────────────────
function lerp(a, b, t) { return a + (b - a) * Math.max(0, Math.min(1, t)); }
function easeOutCubic(t) { return 1 - Math.pow(1 - t, 3); }
function easeInCubic(t)  { return t * t * t; }
function easeOutQuart(t) { return 1 - Math.pow(1 - t, 4); }
function easeInQuart(t)  { return t * t * t * t; }

// ─── Core genie polygon math ──────────────────────────────────────────────────
// Generates a clip-path polygon string at progress t (0=full, 1=collapsed)
// This models the REAL macOS genie:
//   - Bottom pinches to dock target FAST (leads by ~35% of duration)
//   - Top stays wide until ~35% through, then collapses FAST
//   - Left/right edges form S-curves (bezier sampled as polygon points)
//   - The "neck" bulge is the hallmark shape

function sampleBezier(t, p0, cp1, cp2, p3) {
  const u = 1 - t;
  return {
    x: u*u*u*p0.x + 3*u*u*t*cp1.x + 3*u*t*t*cp2.x + t*t*t*p3.x,
    y: u*u*u*p0.y + 3*u*u*t*cp1.y + 3*u*t*t*cp2.y + t*t*t*p3.y,
  };
}

function buildGenieClipPath(progress, direction, target, W, H) {
  const tx = target?.x || W / 2;
  const ty = target?.y || H;

  // For a fluid "fold" effect, we use smooth cubic easings
  const easeOutQuart = (t) => 1 - Math.pow(1 - t, 4);
  const easeInOutCubic = (t) => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  
  // The bottom corners move toward the single point smoothly
  const tBot = easeOutQuart(Math.min(1, progress * 1.6));
  
  // The top corners FOLD INWARD quickly on the X-axis, while moving down smoothly on the Y-axis
  const tTopX = easeOutQuart(Math.min(1, progress * 1.8)); // Folds inward fast
  const tTopY = easeInOutCubic(Math.max(0, progress));      // Draws down fluidly

  let topL, topR, botL, botR;

  if (direction === 'down' || direction === 'up') {
    const isDown = direction === 'down';
    if (isDown) {
      topL = { x: lerp(0, tx, tTopX), y: lerp(0, ty, tTopY) };
      topR = { x: lerp(W, tx, tTopX), y: lerp(0, ty, tTopY) };
      botL = { x: lerp(0, tx, tBot), y: lerp(H, ty, tBot) };
      botR = { x: lerp(W, tx, tBot), y: lerp(H, ty, tBot) };
    } else {
      topL = { x: lerp(0, tx, tBot), y: lerp(0, ty, tBot) };
      topR = { x: lerp(W, tx, tBot), y: lerp(0, ty, tBot) };
      botL = { x: lerp(0, tx, tTopX), y: lerp(H, ty, tTopY) };
      botR = { x: lerp(W, tx, tTopX), y: lerp(H, ty, tTopY) };
    }
  } else if (direction === 'right') {
    const tR = easeOutQuart(Math.min(1, progress * 1.6));
    const tLY = easeOutQuart(Math.min(1, progress * 1.8)); // Fold Y inward fast
    const tLX = easeInOutCubic(Math.max(0, progress));     // Draw X across smoothly
    topL = { x: lerp(0, tx, tLX), y: lerp(0, ty, tLY) };
    topR = { x: lerp(W, tx, tR), y: lerp(0, ty, tR) };
    botL = { x: lerp(0, tx, tLX), y: lerp(H, ty, tLY) };
    botR = { x: lerp(W, tx, tR), y: lerp(H, ty, tR) };
  } else {
    const tL = easeOutQuart(Math.min(1, progress * 1.6));
    const tRY = easeOutQuart(Math.min(1, progress * 1.8)); // Fold Y inward fast
    const tRX = easeInOutCubic(Math.max(0, progress));     // Draw X across smoothly
    topL = { x: lerp(0, tx, tL), y: lerp(0, ty, tL) };
    topR = { x: lerp(W, tx, tRX), y: lerp(0, ty, tRY) };
    botL = { x: lerp(0, tx, tL), y: lerp(H, ty, tL) };
    botR = { x: lerp(W, tx, tRX), y: lerp(H, ty, tRY) };
  }

  const SEG = 24; 
  const pts = [];

  // Fold inward bow - negative makes it cave INWARD toward the center like folding paper
  const bow = -Math.sin(Math.PI * Math.min(progress * 1.5, 1)) * 0.12 * W;

  // TOP edge
  for (let i = 0; i <= SEG; i++) {
    const t = i / SEG;
    pts.push({ x: lerp(topL.x, topR.x, t), y: lerp(topL.y, topR.y, t) });
  }

  // RIGHT edge: curves INWARD (left)
  {
    const midBow = bow; // Negative bow pushes left
    const cp1 = { x: topR.x + midBow * 0.8, y: lerp(topR.y, botR.y, 0.3) };
    const cp2 = { x: botR.x + midBow * 0.5, y: lerp(topR.y, botR.y, 0.7) };
    for (let i = 1; i <= SEG; i++) {
      pts.push(sampleBezier(i / SEG, topR, cp1, cp2, botR));
    }
  }

  // BOTTOM edge
  for (let i = 1; i <= SEG; i++) {
    const t = i / SEG;
    pts.push({ x: lerp(botR.x, botL.x, t), y: lerp(botR.y, botL.y, t) });
  }

  // LEFT edge: curves INWARD (right)
  {
    const midBow = bow; // Negative bow on the left edge pushes right
    const cp1 = { x: botL.x - midBow * 0.5, y: lerp(botL.y, topL.y, 0.3) };
    const cp2 = { x: topL.x - midBow * 0.8, y: lerp(botL.y, topL.y, 0.7) };
    for (let i = 1; i <= SEG; i++) {
      pts.push(sampleBezier(i / SEG, botL, cp1, cp2, topL));
    }
  }

  return `polygon(${pts.map(p =>
    `${((p.x / W) * 100).toFixed(3)}% ${((p.y / H) * 100).toFixed(3)}%`
  ).join(', ')})`;
}



// ─── Main component ───────────────────────────────────────────────────────────
import { usePresence } from 'framer-motion';

function GeniePage({ children, enterPolys, enterTimes, direction, target, transformOrigin }) {
  const [isPresent, safeToRemove] = usePresence();
  const ref = useRef(null);

  useEffect(() => {
    if (!isPresent) {
      const el = ref.current;
      if (!el) return safeToRemove();

      const W = window.innerWidth;
      const H = window.innerHeight;
      const duration = 600; // 0.6s duration

      function cubicBezier(t, x1, y1, x2, y2) {
        function sX(u) { return 3*u*(1-u)*(1-u)*x1 + 3*u*u*(1-u)*x2 + u*u*u; }
        function sY(u) { return 3*u*(1-u)*(1-u)*y1 + 3*u*u*(1-u)*y2 + u*u*u; }
        let g = t;
        for (let i = 0; i < 8; i++) {
          const e = sX(g) - t;
          const d = 3*(1-g)*(1-g)*x1 + 6*(1-g)*g*x2 + 3*g*g;
          g -= e / (d || 1e-6);
        }
        return sY(Math.max(0, Math.min(1, g)));
      }

      let start = null;
      let rafId;

      function frame(ts) {
        if (!start) start = ts;
        const raw = Math.min((ts - start) / duration, 1);
        const eased = cubicBezier(raw, 0.16, 1, 0.3, 1);

        const clip = buildGenieClipPath(eased, direction, target, W, H);
        el.style.clipPath = clip;
        el.style.webkitClipPath = clip;
        
        // "Text and images fade slightly but remain visible until halfway through"
        el.style.opacity = eased < 0.5 ? '1' : String(lerp(1, 0, (eased - 0.5) / 0.5));
        el.style.filter = eased > 0.6 ? `blur(${lerp(0, 8, (eased - 0.6) / 0.4).toFixed(1)}px)` : '';

        // "The whole window begins to shrink and tilt forward a little"
        const scaleAmt = lerp(1, 0.6, eased); // Shrink evenly
        const tiltX = lerp(0, -12, eased); // Tilt forward adding depth
        el.style.transform = `perspective(1200px) scale(${scaleAmt}) rotateX(${tiltX}deg)`;

        if (raw < 1) {
          rafId = requestAnimationFrame(frame);
        } else {
          el.style.opacity = '0';
          safeToRemove();
        }
      }

      rafId = requestAnimationFrame(frame);
      return () => cancelAnimationFrame(rafId);
    }
  }, [isPresent, safeToRemove, direction, target]);

  return (
    <motion.div
      ref={ref}
      initial={{
        clipPath: enterPolys[0],
        WebkitClipPath: enterPolys[0],
        opacity: 0,
        filter: 'blur(8px)',
        scale: 0.6,
        rotateX: -12,
        transformPerspective: 1200,
      }}
      animate={{
        clipPath: enterPolys,
        WebkitClipPath: enterPolys,
        opacity: [0, 0, 0.5, 0.9, 1, 1],
        filter: ['blur(8px)', 'blur(4px)', 'blur(2px)', 'blur(0px)', 'blur(0px)', 'blur(0px)'],
        scale: [0.6, 0.8, 1.02, 1],
        rotateX: [-12, -6, 2, 0],
        transformPerspective: 1200,
      }}
      transition={{
        duration: 0.6,
        ease: [0.16, 1, 0.3, 1],
        times: enterTimes,
      }}
      style={{
        position: 'absolute',
        inset: 0,
        overflow: 'hidden',
        transformOrigin,
        willChange: 'clip-path, opacity, filter',
        backfaceVisibility: 'hidden',
        WebkitBackfaceVisibility: 'hidden',
        contain: 'layout paint',
      }}
    >
      <motion.div
        aria-hidden="true"
        initial={{ opacity: 0, x: '-110%' }}
        animate={{ opacity: [0, 0.8, 0.8, 0], x: ['-110%', '-110%', '110%', '110%'] }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.40, ease: 'linear', times: [0, 0.1, 0.9, 1] }}
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(118deg, transparent 18%, rgba(255,255,255,0.13) 50%, transparent 82%)',
          pointerEvents: 'none',
          zIndex: 10,
        }}
      />
      <div style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
        {children}
      </div>
    </motion.div>
  );
}

export default function GenieTransition({ children, activeKey }) {
  const { navDirection, dockTargetRef } = useGenie();

  const direction = navDirection ?? 'down';
  const target = { ...dockTargetRef.current };

  const vw = typeof window !== 'undefined' ? window.innerWidth : 1;
  const vh = typeof window !== 'undefined' ? window.innerHeight : 1;
  const targetNX = target?.x ? target.x / vw : 0.5;
  const targetNY = target?.y ? target.y / vh : 0.98;

  const TRANSFORM_ORIGINS = {
    right: '100% 50%',
    left: '0%   50%',
    up: '50% 0%',
    down: '50% 100%',
  };
  const transformOrigin = TRANSFORM_ORIGINS[direction] ?? '50% 100%';

  const W = vw, H = vh;

  const enterPolys = Array.from({ length: 6 }, (_, i) => {
    const t = 1 - i / 5;
    return buildGenieClipPath(t, direction, target, W, H);
  });

  const enterTimes = [0, 0.12, 0.32, 0.58, 0.82, 1];

  return (
    <AnimatePresence mode="wait" initial={false}>
      <GeniePage
        key={activeKey}
        enterPolys={enterPolys}
        enterTimes={enterTimes}
        direction={direction}
        target={target}
        transformOrigin={transformOrigin}
      >
        {children}
      </GeniePage>
    </AnimatePresence>
  );
}
