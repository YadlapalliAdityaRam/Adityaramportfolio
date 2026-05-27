import React, { useEffect, useState, useRef } from 'react';
import BrandLogo from './BrandLogo';

// ── Inline CSS ──────────────────────────────────────────────────────────────
const css = `
  @import url('https://fonts.googleapis.com/css2?family=SF+Pro+Display:wght@100;200;300&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  .su-root {
    position: fixed; inset: 0; z-index: 9999;
    background: #000;
    display: flex; align-items: center; justify-content: center;
    flex-direction: column;
    font-family: -apple-system, 'SF Pro Display', 'Helvetica Neue', sans-serif;
    overflow: hidden;
  }

  /* ── Radial nebula glow ── */
  .su-nebula {
    position: absolute; inset: 0; pointer-events: none;
    background: radial-gradient(ellipse 60% 55% at 50% 48%,
      rgba(255,255,255,0.055) 0%,
      rgba(255,255,255,0.018) 40%,
      transparent 70%);
    opacity: 0; transition: opacity 2.4s ease;
  }
  .su-nebula.show { opacity: 1; }

  /* ── Particle canvas ── */
  .su-particles { position: absolute; inset: 0; pointer-events: none; }

  /* ── Logo wrapper ── */
  .su-logo-wrap {
    position: relative; z-index: 10;
    display: flex; flex-direction: column;
    align-items: center; gap: 52px;
  }

  /* ── SVG Apple logo ── */
  .su-apple {
    width: 210px; height: 210px;
    opacity: 0;
    transform: scale(0.82) translateY(18px);
    filter: blur(14px) brightness(0.4);
    transition:
      opacity 1.9s cubic-bezier(0.12, 0.82, 0.18, 1),
      transform 1.9s cubic-bezier(0.12, 0.82, 0.18, 1),
      filter 1.9s cubic-bezier(0.12, 0.82, 0.18, 1);
  }
  .su-apple.show {
    opacity: 1; transform: scale(1) translateY(0); filter: blur(0) brightness(1);
  }
  .su-apple svg { width: 100%; height: 100%; }

  /* ── Halo ring behind logo ── */
  .su-halo {
    position: absolute;
    width: 310px; height: 310px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(255,255,255,0.06) 0%, transparent 70%);
    opacity: 0; transform: scale(0.6);
    transition: opacity 2s ease, transform 2s ease;
    pointer-events: none;
  }
  .su-halo.show { opacity: 1; transform: scale(1); }

  /* ── Idle pulse keyframe ── */
  @keyframes applePulse {
    0%, 100% { filter: drop-shadow(0 0 12px rgba(255,255,255,0.18)); transform: scale(1); }
    50%       { filter: drop-shadow(0 0 32px rgba(255,255,255,0.42)); transform: scale(1.016); }
  }
  .su-apple.pulse { animation: applePulse 3s ease-in-out infinite; }

  /* ── Progress bar track ── */
  .su-bar-track {
    width: 168px; height: 2px;
    background: rgba(255,255,255,0.1);
    border-radius: 999px;
    overflow: hidden;
    opacity: 0; transform: scaleX(0.6);
    transition: opacity 0.8s ease, transform 0.8s cubic-bezier(0.34,1.56,0.64,1);
  }
  .su-bar-track.show { opacity: 1; transform: scaleX(1); }

  .su-bar-fill {
    height: 100%; width: 0%;
    background: linear-gradient(90deg,
      rgba(255,255,255,0.55) 0%,
      rgba(255,255,255,0.92) 50%,
      rgba(255,255,255,0.55) 100%);
    border-radius: 999px;
    transition: width linear;
    box-shadow: 0 0 8px rgba(255,255,255,0.5);
  }

  /* ── Shine sweep on fill ── */
  @keyframes barShine {
    0%   { background-position: -200% center; }
    100% { background-position: 300% center; }
  }
  .su-bar-fill.shine {
    background-size: 200% auto;
    animation: barShine 1.4s linear infinite;
  }

  /* ── Welcome text ── */
  .su-text {
    position: absolute; bottom: 0;
    display: flex; flex-direction: column; align-items: center; gap: 6px;
    opacity: 0; transform: translateY(10px) scale(0.97);
    filter: blur(5px);
    transition: opacity 1.3s ease, transform 1.3s cubic-bezier(0.16,1,0.3,1), filter 1.3s ease;
    text-align: center;
    margin-top: 72px; /* gap from bar */
  }
  .su-text.show { opacity: 1; transform: translateY(0) scale(1); filter: blur(0); }

  .su-text-primary {
    font-size: clamp(0.95rem, 2.5vw, 1.25rem);
    font-weight: 200;
    color: rgba(255,255,255,0.92);
    letter-spacing: 0.04em;
  }
  .su-text-secondary {
    font-size: clamp(0.72rem, 1.8vw, 0.9rem);
    font-weight: 100;
    color: rgba(255,255,255,0.45);
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }

  /* ── Exit ── */
  .su-root.exit {
    opacity: 0;
    transform: scale(1.04);
    filter: blur(10px);
    transition: opacity 1.2s cubic-bezier(0.22,1,0.36,1),
                transform 1.2s cubic-bezier(0.22,1,0.36,1),
                filter 1.2s ease;
    pointer-events: none;
  }

  /* ── Scanline grain overlay ── */
  .su-grain {
    position: absolute; inset: 0; pointer-events: none; z-index: 20;
    opacity: 0.022;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
    background-size: 180px 180px;
  }
`;



// ── Particle system ──────────────────────────────────────────────────────────
function useParticles(canvasRef, active) {
  useEffect(() => {
    if (!active || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let raf;
    const particles = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    for (let i = 0; i < 55; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 1.2 + 0.2,
        alpha: Math.random() * 0.35 + 0.05,
        vx: (Math.random() - 0.5) * 0.15,
        vy: -(Math.random() * 0.2 + 0.05),
        life: Math.random(),
        maxLife: Math.random() * 0.5 + 0.5,
      });
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        p.life += 0.003;
        if (p.life > p.maxLife) {
          p.life = 0;
          p.x = canvas.width / 2 + (Math.random() - 0.5) * 160;
          p.y = canvas.height / 2 + (Math.random() - 0.5) * 80;
        }
        const t = p.life / p.maxLife;
        const fade = t < 0.2 ? t / 0.2 : t > 0.8 ? (1 - t) / 0.2 : 1;
        ctx.beginPath();
        ctx.arc(p.x + p.vx * p.life * 200, p.y + p.vy * p.life * 200, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${p.alpha * fade})`;
        ctx.fill();
      });
      raf = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
    };
  }, [active, canvasRef]);
}

// ── Main Component ───────────────────────────────────────────────────────────
const StartupSequence = ({ onComplete }) => {
  const [logoShow, setLogoShow] = useState(false);
  const [logoPulse, setLogoPulse] = useState(false);
  const [haloShow, setHaloShow] = useState(false);
  const [nebulaShow, setNebulaShow] = useState(false);
  const [barShow, setBarShow] = useState(false);
  const [barWidth, setBarWidth] = useState(0);
  const [barDuration, setBarDuration] = useState('0ms');
  const [textShow, setTextShow] = useState(false);
  const [exiting, setExiting] = useState(false);
  const [particlesActive, setParticlesActive] = useState(false);
  const canvasRef = useRef(null);

  useParticles(canvasRef, particlesActive);

  useEffect(() => {
    const ts = [];

    // 400ms — logo + nebula appear
    ts.push(setTimeout(() => {
      setLogoShow(true);
      setNebulaShow(true);
      setHaloShow(true);
    }, 400));

    // 1400ms — particles on
    ts.push(setTimeout(() => setParticlesActive(true), 1400));

    // 1600ms — idle pulse starts
    ts.push(setTimeout(() => setLogoPulse(true), 1600));

    // 1800ms — bar appears, starts filling quickly to 15%
    ts.push(setTimeout(() => {
      setBarShow(true);
      setTimeout(() => {
        setBarDuration('600ms');
        setBarWidth(15);
      }, 80);
    }, 1800));

    // 2400ms — fill to 55% slower
    ts.push(setTimeout(() => {
      setBarDuration('1200ms');
      setBarWidth(55);
    }, 2400));

    // 3000ms — text appears
    ts.push(setTimeout(() => setTextShow(true), 3000));

    // 3700ms — fill to 88%
    ts.push(setTimeout(() => {
      setBarDuration('900ms');
      setBarWidth(88);
    }, 3700));

    // 4600ms — fill to 100%
    ts.push(setTimeout(() => {
      setBarDuration('350ms');
      setBarWidth(100);
    }, 4600));

    // 5100ms — exit
    ts.push(setTimeout(() => {
      setExiting(true);
      setTimeout(() => onComplete?.(), 1200);
    }, 5100));

    return () => ts.forEach(clearTimeout);
  }, [onComplete]);

  return (
    <>
      <style>{css}</style>
      <div className={`su-root${exiting ? ' exit' : ''}`}>
        {/* Grain */}
        <div className="su-grain" />

        {/* Nebula */}
        <div className={`su-nebula${nebulaShow ? ' show' : ''}`} />

        {/* Particles */}
        <canvas ref={canvasRef} className="su-particles" />

        {/* Center group */}
        <div className="su-logo-wrap">
          {/* Halo */}
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div className={`su-halo${haloShow ? ' show' : ''}`} />

            {/* Custom Brand Logo */}
            <div className={`su-apple${logoShow ? ' show' : ''}${logoPulse ? ' pulse' : ''}`}>
              <BrandLogo size={210} title="Aditya portfolio logo" />
            </div>
          </div>

          {/* Progress bar */}
          <div className={`su-bar-track${barShow ? ' show' : ''}`}>
            <div
              className="su-bar-fill"
              style={{ width: `${barWidth}%`, transitionDuration: barDuration }}
            />
          </div>

          {/* Welcome text — positioned below bar via margin */}
          <div className={`su-text${textShow ? ' show' : ''}`} style={{ position: 'relative', marginTop: '28px' }}>
            <span className="su-text-primary">Welcome to Yadlapalli Aditya Ram's Portfolio</span>
            <span className="su-text-secondary">Engineering excellence · Web &amp; Beyond</span>
          </div>
        </div>
      </div>
    </>
  );
};

export default StartupSequence;