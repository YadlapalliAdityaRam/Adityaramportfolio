import React, { useState, useEffect, useMemo } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import WindowFrame from './components/WindowFrame';
import Home from './components/Home';
import Education from './components/Education';
import Skills from './components/Skills';
import Projects from './components/Projects';
import Internships from './components/Internships';
import Achievements from './components/Achievements';
import Certifications from './components/Certifications';
import Resume from './components/Resume';
import Contact from './components/Contact';
import Dock from './components/Dock';
import './pages.css';
import StartupSequence from './components/StartupSequence';
import Particles from './components/Particles';
import DynamicPage from './pages/DynamicPage';
import { SystemExperienceProvider, useSystemExperience } from './context/SystemExperienceContext';
import SystemShutdownOverlay from './components/SystemShutdownOverlay';
import { useAdmin, apiUrl } from './context/AdminContext';
import { Analytics } from '@vercel/analytics/react';

const backgrounds = {
  home: {
    url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&q=90&w=2200',
    position: 'center',
  },
  education: {
    url: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&q=90&w=2200',
    position: 'center',
  },
  skills: {
    url: 'https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&q=90&w=2200',
    position: 'center',
  },
  projects: {
    url: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&q=90&w=2200',
    position: 'center',
  },
  internships: {
    url: 'https://images.unsplash.com/photo-1501854140801-50d01698950b?auto=format&fit=crop&q=90&w=2200',
    position: 'center',
  },
  achievements: {
    url: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&q=90&w=2200',
    position: 'center',
  },
  certifications: {
    url: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&q=90&w=2200',
    position: 'center',
  },
  resume: {
    url: 'https://images.unsplash.com/photo-1433086966358-54859d0ed716?auto=format&fit=crop&q=90&w=2200',
    position: 'center',
  },
  contact: {
    url: 'https://images.unsplash.com/photo-1518173946687-a4c8892bbd9f?auto=format&fit=crop&q=90&w=2200',
    position: 'center',
  },
};

const dynamicBackgroundRules = [
  { keywords: ['education', 'study', 'school', 'college', 'course', 'learn'], tab: 'education' },
  { keywords: ['skill', 'code', 'tech', 'stack', 'developer'], tab: 'skills' },
  { keywords: ['project', 'work', 'case', 'build', 'portfolio'], tab: 'projects' },
  { keywords: ['intern', 'experience', 'career', 'job', 'office'], tab: 'internships' },
  { keywords: ['achievement', 'award', 'honor', 'win', 'recognition'], tab: 'achievements' },
  { keywords: ['cert', 'credential', 'certificate', 'license'], tab: 'certifications' },
  { keywords: ['resume', 'cv', 'profile'], tab: 'resume' },
  { keywords: ['contact', 'connect', 'message', 'email'], tab: 'contact' },
];

const getBackgroundForTab = (activeTab, pages = []) => {
  if (backgrounds[activeTab]) return backgrounds[activeTab];

  if (!activeTab.startsWith('dynamic_')) return backgrounds.home;

  const slug = activeTab.replace('dynamic_', '');
  const page = pages.find(item => item.slug === slug);
  const searchableName = `${page?.name || ''} ${page?.slug || slug}`.toLowerCase();
  const matchingRule = dynamicBackgroundRules.find(rule =>
    rule.keywords.some(keyword => searchableName.includes(keyword))
  );

  return backgrounds[matchingRule?.tab] || backgrounds.home;
};

const foregroundVariants = {
  awake: {
    opacity: 1,
    scale: 1,
    filter: 'blur(0px) brightness(1)',
  },
  shutdown: {
    opacity: 0.94,
    scale: 0.992,
    filter: 'blur(10px) brightness(0.6)',
  },
};

const mobileForegroundVariants = {
  awake: foregroundVariants.awake,
  shutdown: {
    opacity: 0.96,
    scale: 0.996,
    filter: 'blur(5px) brightness(0.68)',
  },
};

function PortfolioExperience() {
  const [activeTab, setActiveTab] = useState('home');
  const [isBooted, setIsBooted] = useState(false);
  const { isShuttingDown } = useSystemExperience();
  const { pages, isLoading, hasCache } = useAdmin();
  const shouldReduceMotion = useReducedMotion();
  const activeForegroundVariants = shouldReduceMotion ? mobileForegroundVariants : foregroundVariants;
  const activeBackground = getBackgroundForTab(activeTab, pages);
  const backgroundList = useMemo(() => Object.entries(backgrounds), []);

  // Preload images for smooth transitions
  useEffect(() => {
    Object.values(backgrounds).forEach(({ url }) => {
      const img = new Image();
      img.src = url;
    });
  }, []);

  // Notify visit when app boots up
  useEffect(() => {
    if (isBooted) {
      // Do not log visits during local development
      if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        return;
      }

      const notifyVisit = async () => {
        try {
          await fetch(apiUrl('/api/notify/notify-visit'), {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              page: window.location.pathname || 'Home',
              deviceInfo: navigator.userAgent
            })
          });
        } catch (e) {
          // Silent fail for analytics
        }
      };
      notifyVisit();
    }
  }, [isBooted]);

  const renderContent = () => {
    if (activeTab.startsWith('dynamic_')) {
      const slug = activeTab.replace('dynamic_', '');
      return <DynamicPage slug={slug} />;
    }

    switch (activeTab) {
      case 'home': return <Home setActiveTab={setActiveTab} />;
      case 'education': return <Education />;
      case 'skills': return <Skills />;
      case 'projects': return <Projects />;
      case 'internships': return <Internships />;
      case 'achievements': return <Achievements />;
      case 'certifications': return <Certifications />;
      case 'resume': return <Resume />;
      case 'contact': return <Contact />;
      default: return <Home />;
    }
  };

  return (
    <>
      {!isBooted && (
        <StartupSequence 
          isLoading={isLoading} 
          hasCache={hasCache} 
          onComplete={() => setIsBooted(true)} 
        />
      )}
      
      {/* Dynamic Smooth Backgrounds */}
      {backgroundList.map(([tab, background]) => (
        <div
          key={tab}
          className={`app-background ${activeBackground.url === background.url ? 'active' : ''}`}
          style={{
            backgroundImage: `url(${background.url})`,
            backgroundPosition: background.position,
          }}
        />
      ))}
      
      <Particles />

      <motion.div
        className="app-foreground"
        variants={activeForegroundVariants}
        animate={isShuttingDown ? 'shutdown' : 'awake'}
        transition={{ duration: isShuttingDown ? 0.9 : 0.7, ease: 'easeInOut' }}
        style={{ transformOrigin: 'center', willChange: 'transform, opacity, filter' }}
      >
        <WindowFrame activeTab={activeTab} setActiveTab={setActiveTab}>
          {renderContent()}
        </WindowFrame>
        <Dock activeTab={activeTab} setActiveTab={setActiveTab} />
      </motion.div>

      <SystemShutdownOverlay />
    </>
  );
}

function App() {
  return (
    <SystemExperienceProvider>
      <PortfolioExperience />
      <Analytics />
    </SystemExperienceProvider>
  );
}

export default App;
