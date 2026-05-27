import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

const SystemExperienceContext = createContext(null);

export const useSystemExperience = () => {
  const context = useContext(SystemExperienceContext);
  if (!context) {
    throw new Error('useSystemExperience must be used inside SystemExperienceProvider');
  }
  return context;
};

export const SystemExperienceProvider = ({ children }) => {
  const [isShuttingDown, setIsShuttingDown] = useState(false);

  const triggerShutdown = useCallback(() => {
    setIsShuttingDown(true);
  }, []);

  const restoreExperience = useCallback(() => {
    setIsShuttingDown(false);
  }, []);

  useEffect(() => {
    document.body.classList.toggle('system-shutdown-active', isShuttingDown);

    return () => {
      document.body.classList.remove('system-shutdown-active');
    };
  }, [isShuttingDown]);
  const value = useMemo(() => ({
    isShuttingDown,
    triggerShutdown,
    restoreExperience,
  }), [isShuttingDown, triggerShutdown, restoreExperience]);

  return (
    <SystemExperienceContext.Provider value={value}>
      {children}
    </SystemExperienceContext.Provider>
  );
};
