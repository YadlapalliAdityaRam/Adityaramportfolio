import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useSystemExperience } from '../context/SystemExperienceContext';
import './Particles.css';

const Particles = () => {
  const [particles] = useState(() => Array.from({ length: 15 }).map((_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 4 + 1,
    duration: Math.random() * 20 + 10,
    delay: Math.random() * 5
  })));
  const { isShuttingDown } = useSystemExperience();

  return (
    <div className="particles-container">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="particle"
          initial={{ x: `${p.x}vw`, y: `${p.y}vh`, opacity: 0 }}
          animate={{
            y: [`${p.y}vh`, `${p.y - 20}vh`, `${p.y}vh`],
            x: [`${p.x}vw`, `${p.x + 10}vw`, `${p.x}vw`],
            opacity: isShuttingDown ? [0, 0.08, 0] : [0, 0.5, 0]
          }}
          transition={{
            duration: isShuttingDown ? p.duration * 2.2 : p.duration,
            repeat: Infinity,
            delay: p.delay,
            ease: "easeInOut"
          }}
          style={{
            width: p.size,
            height: p.size,
          }}
        />
      ))}
    </div>
  );
};

export default Particles;
