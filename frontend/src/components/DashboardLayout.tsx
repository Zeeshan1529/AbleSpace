'use client';

import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const savedState = localStorage.getItem('sidebar_collapsed');
    if (savedState) {
      setIsCollapsed(savedState === 'true');
    }
  }, []);

  const handleToggle = () => {
    const newState = !isCollapsed;
    setIsCollapsed(newState);
    localStorage.setItem('sidebar_collapsed', String(newState));
  };

  if (!mounted) {
    return (
      <div className="min-h-screen bg-theme-bg flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-theme-bg text-theme-text transition-colors duration-300">
      <Sidebar isCollapsed={isCollapsed} onToggle={handleToggle} />
      <div
        className={`transition-all duration-300 ease-in-out min-h-screen ${
          isCollapsed ? 'pl-20' : 'pl-64'
        }`}
      >
        {children}
      </div>
    </div>
  );
}
