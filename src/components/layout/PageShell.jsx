import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import { Navbar } from './Navbar';
import { BottomNav } from './BottomNav';
import { Footer } from './Footer';

const routeTitles = {
  '/': 'CityPulse — Live City Dashboard & Pulse',
  '/explore': 'Explore Places & Hospitality — CityPulse',
  '/history': 'History & Culture Heritage Trails — CityPulse',
  '/safety': 'Safety Heatmap & Safer Route Finder — CityPulse',
  '/compare': 'Best vs Worst Location Comparison — CityPulse',
  '/insights': 'Smart City Insights & AI Pulse — CityPulse',
  '/report': 'Submit Citizen Incident Report — CityPulse',
  '/saved': 'Saved Places & Bookmarks — CityPulse',
  '/settings': 'Settings & Livability Preferences — CityPulse',
  '/about': 'About Architecture & Free Open Data — CityPulse',
};

export const PageShell = ({ children, noFooter = false, title }) => {
  const location = useLocation();

  useEffect(() => {
    const pageTitle = title || routeTitles[location.pathname] || (location.pathname.startsWith('/explore/') ? 'Place Details — CityPulse' : 'CityPulse — Smart City Exploration');
    document.title = pageTitle;

    // Update meta description
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.name = 'description';
      document.head.appendChild(metaDesc);
    }
    metaDesc.content = `${pageTitle}. Real-time city exploration, safety navigation, heritage walking trails & citizen reporting.`;

    // Open Graph meta tags
    const updateOGTag = (property, content) => {
      let og = document.querySelector(`meta[property="${property}"]`);
      if (!og) {
        og = document.createElement('meta');
        og.setAttribute('property', property);
        document.head.appendChild(og);
      }
      og.content = content;
    };

    updateOGTag('og:title', pageTitle);
    updateOGTag('og:description', `${pageTitle}. Explore attractions, safety heatmaps, safer routes, and citizen insights.`);
    updateOGTag('og:image', '/favicon.svg');
    updateOGTag('og:type', 'website');
  }, [location.pathname, title]);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100 relative">
      <Navbar />
      <motion.main
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
        className="flex-1 pb-16 lg:pb-0"
      >
        {children}
      </motion.main>
      {!noFooter && <Footer />}
      <BottomNav />
    </div>
  );
};
