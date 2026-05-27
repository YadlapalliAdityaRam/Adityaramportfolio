import React, { useEffect, useRef } from 'react';
import Lenis from '@studio-freight/lenis';

const SmoothScroll = ({ children }) => {
  const scrollRef = useRef(null);

  useEffect(() => {
    if (!scrollRef.current || !scrollRef.current.children[0]) return;

    // We only want to apply Lenis to the scrollable content area,
    // not the whole window, since this is a desktop OS UI.
    // Actually, Lenis by default attaches to window, but we can pass a custom wrapper.
    const lenis = new Lenis({
      wrapper: scrollRef.current, // element that has overflow
      content: scrollRef.current.children[0], // element that scrolls
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      direction: 'vertical',
      gestureDirection: 'vertical',
      smooth: true,
      mouseMultiplier: 1,
      smoothTouch: false,
      touchMultiplier: 2,
      infinite: false,
    });

    let frameId;
    function raf(time) {
      lenis.raf(time);
      frameId = requestAnimationFrame(raf);
    }

    frameId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(frameId);
      lenis.destroy();
    };
  }, []);

  return (
    <div ref={scrollRef} style={{ height: '100%', overflowY: 'auto', overflowX: 'hidden' }} className="lenis-wrapper">
      <div className="lenis-content">
        {children}
      </div>
    </div>
  );
};

export default SmoothScroll;
