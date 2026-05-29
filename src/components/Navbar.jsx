import React from 'react';
import { useAdmin } from '../context/AdminContext';
import { useGenie } from '../context/GenieContext';
import ThemeToggle from './ThemeToggle';
import './Navbar.css';

const Navbar = ({ activeTab, setActiveTab }) => {
  const { pages } = useAdmin();
  const { recordNavigation } = useGenie();

  const staticNavItems = [
    { id: 'home', label: 'Home' },
    { id: 'education', label: 'Education' },
    { id: 'skills', label: 'Skills' },
    { id: 'projects', label: 'Projects' },
    { id: 'internships', label: 'Internships' },
    { id: 'achievements', label: 'Achievements' },
    { id: 'certifications', label: 'Certifications' },
    { id: 'resume', label: 'Resume' },
    { id: 'contact', label: 'Contact' },
  ];

  const dynamicItems = (pages || [])
    .filter(p => p.isVisible)
    .map(p => ({ id: `dynamic_${p.slug}`, label: p.name, icon: '✨' }));

  const allItems = [...staticNavItems, ...dynamicItems];

  const handleNav = (e, item) => {
    e.preventDefault();
    if (activeTab === item.id) return;
    recordNavigation(activeTab, item.id, null);
    setActiveTab(item.id);
  };

  return (
    <nav className="navbar">
      <ul className="nav-list">
        {allItems.map(item => (
          <li key={item.id} className="nav-item">
            <a
              href={`#${item.id}`}
              className={`nav-link ${activeTab === item.id ? 'active' : ''}`}
              onClick={(e) => handleNav(e, item)}
            >
              <span className="nav-icon">{item.icon}</span> {item.label}
            </a>
          </li>
        ))}
        <li className="nav-item">
          <ThemeToggle />
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
