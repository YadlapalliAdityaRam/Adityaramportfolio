import React, { createContext, useContext, useEffect, useState } from 'react';
import { normalizeProjects } from '../utils/projectText';

const AdminContext = createContext();

export const useAdmin = () => useContext(AdminContext);

const API_ENABLED = import.meta.env.VITE_API_ENABLED !== 'false';
export const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000').replace(/\/$/, '');
export const apiUrl = (path) => `${API_BASE_URL}${path}`;

const DEFAULT_DATA = {
  hero: {
    name: 'Yadlapalli Aditya Ram',
    title: 'Full Stack Developer',
    description: '[Admin to fill]',
    photoUrl: ''
  },
  education: [],
  skills: [],
  projects: [],
  internships: [],
  achievements: [],
  certifications: [],
  resume: {
    headline: 'My Resume',
    summary: '',
    resumeUrl: '',
    fileName: '',
    skills: '',
    highlights: ''
  },
  contact: {
    email: '',
    phone: '',
    github: '',
    linkedin: ''
  }
};

const normalizePortfolioData = (data = DEFAULT_DATA) => ({
  ...data,
  projects: normalizeProjects(data.projects)
});

const LOCAL_ADMIN_EMAIL = 'adityaramyadlapalli@gmail.com';
const LOCAL_ADMIN_PASSWORD = 'yadlapalli@55';

export const AdminProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [portfolioData, setPortfolioData] = useState(DEFAULT_DATA);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [isLoading, setIsLoading] = useState(true);
  const [pages, setPages] = useState([]);
  const [hasCache] = useState(() => {
    try {
      const savedData = localStorage.getItem('portfolioData');
      return !!savedData;
    } catch {
      return false;
    }
  });

  useEffect(() => {
    if (token) {
      setIsLoggedIn(true);
    }

    const savedData = localStorage.getItem('portfolioData');
    if (savedData) {
      const normalizedData = normalizePortfolioData(JSON.parse(savedData));
      setPortfolioData(normalizedData);
      localStorage.setItem('portfolioData', JSON.stringify(normalizedData));
    }

    const savedPages = localStorage.getItem('portfolioPages');
    if (savedPages) {
      setPages(JSON.parse(savedPages));
    }

    if (!API_ENABLED) {
      setIsLoading(false);
      return;
    }

    const loadFromBackend = async () => {
      try {
        const [portfolioRes, pagesRes] = await Promise.all([
          fetch(apiUrl('/api/portfolio')),
          fetch(apiUrl('/api/pages'))
        ]);

        if (portfolioRes.ok) {
          const data = await portfolioRes.json();
          if (data && Object.keys(data).length > 0) {
            const normalizedData = normalizePortfolioData(data);
            setPortfolioData(normalizedData);
            localStorage.setItem('portfolioData', JSON.stringify(normalizedData));
          }
        }

        if (pagesRes.ok) {
          const data = await pagesRes.json();
          if (Array.isArray(data)) {
            setPages(data);
            localStorage.setItem('portfolioPages', JSON.stringify(data));
          }
        }
      } catch {
        // Backend offline: keep the localStorage data already loaded above.
      } finally {
        setIsLoading(false);
      }
    };

    loadFromBackend();
  }, [token]);

  const login = async (email, password) => {
    const isLocalAdmin = email === LOCAL_ADMIN_EMAIL && password === LOCAL_ADMIN_PASSWORD;

    if (!API_ENABLED) {
      setIsLoggedIn(isLocalAdmin);
      return isLocalAdmin;
    }

    try {
      const response = await fetch(apiUrl('/api/auth/login'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.token) {
          localStorage.setItem('token', data.token);
          setToken(data.token);
        }
        setIsLoggedIn(true);
        return true;
      }

      if (isLocalAdmin) {
        setIsLoggedIn(true);
        return true;
      }

      return false;
    } catch (err) {
      console.error('Login error', err);
      if (isLocalAdmin) {
        setIsLoggedIn(true);
        return true;
      }
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setIsLoggedIn(false);
  };

  const updateSection = async (section, data) => {
    const nextSectionData = section === 'projects' ? normalizeProjects(data) : data;
    const updatedData = { ...portfolioData, [section]: nextSectionData };
    setPortfolioData(updatedData);
    localStorage.setItem('portfolioData', JSON.stringify(updatedData));

    try {
      if (API_ENABLED && token) {
        const response = await fetch(apiUrl(`/api/portfolio/${section}`), {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(nextSectionData)
        });

        if (response.ok) {
          const savedData = await response.json();
          const normalizedData = normalizePortfolioData(savedData);
          setPortfolioData(normalizedData);
          localStorage.setItem('portfolioData', JSON.stringify(normalizedData));
        }
      }
      return true;
    } catch (err) {
      console.error(`Failed to update ${section} on backend`, err);
      return true;
    }
  };

  const savePage = async (pageData) => {
    const updatedPages = [...pages];
    const idx = updatedPages.findIndex(p => p.id === pageData.id);
    if (idx >= 0) updatedPages[idx] = pageData;
    else updatedPages.push(pageData);

    setPages(updatedPages);
    localStorage.setItem('portfolioPages', JSON.stringify(updatedPages));

    try {
      if (API_ENABLED && token) {
        const response = await fetch(apiUrl(`/api/pages/${pageData.id}`), {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(pageData)
        });

        if (response.ok) {
          const savedPages = await response.json();
          if (Array.isArray(savedPages)) {
            setPages(savedPages);
            localStorage.setItem('portfolioPages', JSON.stringify(savedPages));
          }
        }
      }
      return true;
    } catch (err) {
      console.error('Failed to save page on backend', err);
      return true;
    }
  };

  const deletePage = async (pageId) => {
    const updatedPages = pages.filter(p => p.id !== pageId);
    setPages(updatedPages);
    localStorage.setItem('portfolioPages', JSON.stringify(updatedPages));

    try {
      if (API_ENABLED && token) {
        await fetch(apiUrl(`/api/pages/${pageId}`), {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` }
        });
      }
      return true;
    } catch {
      return true;
    }
  };

  return (
    <AdminContext.Provider value={{
      isLoggedIn,
      login,
      logout,
      isLoading,
      hasCache,
      portfolioData,
      updateSection,
      pages,
      savePage,
      deletePage
    }}>
      {children}
    </AdminContext.Provider>
  );
};
