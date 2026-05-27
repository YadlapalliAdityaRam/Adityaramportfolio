import React, { useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Home as HomeIcon, GraduationCap, Code, Folder, Briefcase, Award, FileBadge, Mail, Layout, FileText } from 'lucide-react';
import { useAdmin } from '../context/AdminContext';
import { useGenie } from '../context/GenieContext';
import { useSystemExperience } from '../context/SystemExperienceContext';
import './Dock.css';

const staticDockItems = [
  { id: 'home',            name: 'Home',            icon: HomeIcon,      color: '#3b82f6' },
  { id: 'education',       name: 'Education',       icon: GraduationCap, color: '#3b82f6' },
  { id: 'skills',          name: 'Skills',          icon: Code,          color: '#8b5cf6' },
  { id: 'projects',        name: 'Projects',        icon: Folder,        color: '#0ea5e9' },
  { id: 'internships',     name: 'Internships',     icon: Briefcase,     color: '#a16207' },
  { id: 'achievements',    name: 'Achievements',    icon: Award,         color: '#eab308' },
  { id: 'certifications',  name: 'Certifications',  icon: FileBadge,     color: '#64748b' },
  { id: 'resume',          name: 'Resume',          icon: FileText,      color: '#14b8a6' },
  { id: 'contact',         name: 'Contact',         icon: Mail,          color: '#3b82f6' },
];

function DockIcon({ item, activeTab, setActiveTab, mouseX }) {
  const ref = useRef(null);
  const { recordNavigation } = useGenie();
  const { isShuttingDown } = useSystemExperience();

  // Distance from mouse to center of this icon
  const distance = useTransform(mouseX, (val) => {
    const bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };
    return val - bounds.x - bounds.width / 2;
  });

  // macOS magnification spring
  const scaleSync = useTransform(distance, [-150, 0, 150], [1, 1.85, 1]);
  const scale     = useSpring(scaleSync, { mass: 0.1, stiffness: 160, damping: 14 });

  // Subtle vertical lift as well
  const ySync = useTransform(distance, [-150, 0, 150], [0, -8, 0]);
  const y     = useSpring(ySync, { mass: 0.1, stiffness: 160, damping: 14 });

  const isActive = activeTab === item.id;
  const Icon = item.icon;

  const handleClick = () => {
    if (isActive) return;
    // Record direction + dock target BEFORE changing tab
    recordNavigation(activeTab, item.id, ref.current);
    setActiveTab(item.id);
  };

  return (
    <div className="dock-item-container" onClick={handleClick}>
      <motion.div
        ref={ref}
        style={{ scale: isShuttingDown ? 1 : scale, y: isShuttingDown ? 0 : y }}
        className={`dock-item ${isActive ? 'dock-item--active' : ''}`}
        whileTap={{ scale: 0.88 }}
      >
        {/* Glow ring for active item */}
        {isActive && (
          <motion.div
            className="dock-item-glow"
            layoutId="dock-glow"
            style={{ backgroundColor: item.color }}
          />
        )}

        <div
          className="dock-icon-bg"
          style={isActive ? { boxShadow: `0 0 18px ${item.color}88, inset 0 1px 1px rgba(255,255,255,1)` } : {}}
        >
          <Icon size={24} color={item.color} />
        </div>
      </motion.div>

      <span className="dock-label">{item.name}</span>

      {isActive && (
        <motion.div layoutId="dock-indicator" className="dock-indicator" />
      )}
    </div>
  );
}

const Dock = ({ activeTab, setActiveTab }) => {
  const mouseX = useMotionValue(Infinity);
  const { pages } = useAdmin();
  const { isShuttingDown } = useSystemExperience();

  const dynamicItems = (pages || [])
    .filter(p => p.isVisible)
    .map(p => ({ id: `dynamic_${p.slug}`, name: p.name, icon: Layout, color: '#a855f7' }));

  const allItems = [...staticDockItems, ...dynamicItems];

  return (
    <div className="dock-container">
      <motion.div
        className="dock glass"
        onMouseMove={(e) => !isShuttingDown && mouseX.set(e.pageX)}
        onMouseLeave={() => mouseX.set(Infinity)}
        initial={{ y: 80, opacity: 0 }}
        animate={{ y: 0,  opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      >
        {allItems.map((item) => (
          <DockIcon
            key={item.id}
            item={item}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            mouseX={mouseX}
          />
        ))}
      </motion.div>

      {/* Dock reflection strip */}
      <div className="dock-reflection" />
    </div>
  );
};

export default Dock;
