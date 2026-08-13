'use client';

import React, { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { useTheme } from '@/context/ThemeContext';
import {
  ListTodo,
  FolderKanban,
  ChevronLeft,
  ChevronRight,
  Sun,
  Moon,
  LogOut,
  Sparkles
} from 'lucide-react';

interface SidebarProps {
  isCollapsed?: boolean;
  onToggle?: () => void;
}

export default function Sidebar({ isCollapsed: controlledCollapsed, onToggle }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useApp();
  const { theme, accent, toggleTheme, setAccent } = useTheme();
  
  const [localCollapsed, setLocalCollapsed] = useState(false);
  const [mounted, setMounted] = useState(false);

  const isCollapsed = controlledCollapsed !== undefined ? controlledCollapsed : localCollapsed;

  useEffect(() => {
    setMounted(true);
    if (controlledCollapsed === undefined) {
      const savedState = localStorage.getItem('sidebar_collapsed');
      if (savedState) {
        setLocalCollapsed(savedState === 'true');
      }
    }
  }, [controlledCollapsed]);

  const handleCollapseToggle = () => {
    if (onToggle) {
      onToggle();
    } else {
      const newState = !localCollapsed;
      setLocalCollapsed(newState);
      localStorage.setItem('sidebar_collapsed', String(newState));
    }
  };

  if (!user || !mounted) return null;

  const navItems = [
    { name: 'Tasks', href: '/tasks', icon: ListTodo },
    { name: 'Projects', href: '/projects', icon: FolderKanban },
  ];

  const accentColors: Array<{ name: 'black' | 'pink' | 'rose' | 'emerald'; class: string }> = [
    { name: 'black', class: 'bg-slate-900 dark:bg-slate-50 border-slate-300 dark:border-slate-700' },
    { name: 'pink', class: 'bg-pink-500 border-pink-300' },
    { name: 'rose', class: 'bg-rose-500 border-rose-300' },
    { name: 'emerald', class: 'bg-emerald-500 border-emerald-300' },
  ];

  return (
    <aside
      className={`fixed top-0 left-0 h-screen bg-theme-card border-r border-theme-border z-40 flex flex-col justify-between transition-all duration-300 ease-in-out ${
        isCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Top Section - Brand */}
      <div>
        <div className={`relative flex items-center h-20 px-6 border-b border-theme-border ${isCollapsed ? 'justify-center' : 'justify-between'}`}>
          {!isCollapsed ? (
            <div className="flex items-center gap-3 animate-fade-in">
              <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-primary text-white transition-colors duration-300">
                <Sparkles className="w-4 h-4" />
              </div>
              <span className="text-xl font-extrabold tracking-tight text-theme-text select-none">
                AbleSpace
              </span>
            </div>
          ) : (
            <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-primary text-white transition-colors duration-300">
              <Sparkles className="w-5 h-5" />
            </div>
          )}

          {/* Collapse Toggle Button */}
          <button
            onClick={handleCollapseToggle}
            className={`absolute -right-3 top-7 flex items-center justify-center w-6 h-6 rounded-full border border-theme-border bg-theme-card hover:bg-theme-bg text-theme-text-secondary hover:text-theme-text shadow-sm transition-all duration-200`}
            aria-label="Toggle Sidebar"
          >
            {isCollapsed ? (
              <ChevronRight className="w-3.5 h-3.5" />
            ) : (
              <ChevronLeft className="w-3.5 h-3.5" />
            )}
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="p-4 space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <button
                key={item.name}
                onClick={() => router.push(item.href)}
                className={`w-full h-11 flex items-center gap-3 px-4 rounded-xl font-semibold transition-all duration-200 ${
                  isActive
                    ? 'bg-primary-light text-primary'
                    : 'text-theme-text-secondary hover:bg-theme-bg hover:text-theme-text'
                } ${isCollapsed ? 'justify-center' : ''}`}
                title={isCollapsed ? item.name : undefined}
              >
                <Icon className={`w-5 h-5 flex-shrink-0 ${isActive ? 'text-primary' : 'text-theme-text-secondary'}`} />
                {!isCollapsed && <span className="animate-fade-in">{item.name}</span>}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Section - Settings & Profile */}
      <div className="border-t border-theme-border p-4 space-y-4">
        {/* Customization Widget */}
        <div className={`space-y-3 ${isCollapsed ? 'flex flex-col items-center' : ''}`}>
          {!isCollapsed && (
            <span className="block text-[10px] font-bold tracking-widest text-theme-text-secondary/70 uppercase px-1">
              Customize
            </span>
          )}

          {/* Light/Dark Toggle */}
          <button
            onClick={toggleTheme}
            className={`flex items-center gap-3 w-full h-10 px-4 rounded-xl text-sm font-semibold text-theme-text-secondary hover:bg-theme-bg hover:text-theme-text transition-all duration-200 ${
              isCollapsed ? 'justify-center' : ''
            }`}
            title="Toggle Light/Dark Theme"
          >
            {theme === 'dark' ? (
              <>
                <Sun className="w-5 h-5 text-amber-500 flex-shrink-0" />
                {!isCollapsed && <span className="animate-fade-in">Light Mode</span>}
              </>
            ) : (
              <>
                <Moon className="w-5 h-5 text-indigo-500 flex-shrink-0" />
                {!isCollapsed && <span className="animate-fade-in">Dark Mode</span>}
              </>
            )}
          </button>

          {/* Accent Color Chooser */}
          {!isCollapsed ? (
            <div className="flex items-center justify-between px-2 py-1.5 animate-fade-in">
              <span className="text-xs font-semibold text-theme-text-secondary">Accent</span>
              <div className="flex items-center gap-2">
                {accentColors.map((color) => (
                  <button
                    key={color.name}
                    onClick={() => setAccent(color.name)}
                    className={`w-4 h-4 rounded-full border transition-all duration-200 hover:scale-125 ${color.class} ${
                      accent === color.name
                        ? 'ring-2 ring-primary ring-offset-2 ring-offset-theme-card scale-110'
                        : ''
                    }`}
                    title={`${color.name.charAt(0).toUpperCase() + color.name.slice(1)} Accent`}
                  />
                ))}
              </div>
            </div>
          ) : (
            <div className="relative group flex items-center justify-center">
              <div className="w-8 h-8 rounded-xl hover:bg-theme-bg flex items-center justify-center cursor-pointer">
                <div className="w-3.5 h-3.5 rounded-full bg-primary transition-all duration-300" />
              </div>
              {/* Tooltip Hover Menu for collapsed state */}
              <div className="absolute left-16 bottom-0 hidden group-hover:flex items-center gap-2 bg-theme-card border border-theme-border p-2.5 rounded-xl shadow-lg z-50 animate-fade-in">
                {accentColors.map((color) => (
                  <button
                    key={color.name}
                    onClick={() => setAccent(color.name)}
                    className={`w-4.5 h-4.5 rounded-full border transition-all duration-200 hover:scale-125 ${color.class} ${
                      accent === color.name
                        ? 'ring-2 ring-primary ring-offset-2 ring-offset-theme-card'
                        : ''
                    }`}
                    title={color.name}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User Profile Info */}
        <div className={`pt-2 border-t border-theme-border flex items-center gap-3 ${isCollapsed ? 'justify-center' : 'justify-between'}`}>
          <div className="flex items-center gap-3 overflow-hidden">
            {/* User Avatar */}
            <div className="relative w-9 h-9 rounded-xl overflow-hidden bg-primary/10 flex-shrink-0 flex items-center justify-center font-bold text-primary">
              {user.avatarUrl ? (
                <img src={user.avatarUrl} alt={user.name} className="w-full h-full object-cover" />
              ) : (
                user.name.charAt(0).toUpperCase()
              )}
            </div>

            {/* Name Details */}
            {!isCollapsed && (
              <div className="flex flex-col overflow-hidden animate-fade-in">
                <span className="text-sm font-bold text-theme-text truncate leading-tight">
                  {user.name}
                </span>
                <span className="text-[10px] font-bold text-theme-text-secondary/70 uppercase tracking-wider leading-none">
                  {user.isGuest ? 'Guest Space' : 'Team Member'}
                </span>
              </div>
            )}
          </div>

          {/* Logout Button */}
          {!isCollapsed ? (
            <button
              onClick={logout}
              className="p-2 rounded-xl text-theme-text-secondary hover:text-rose-500 hover:bg-rose-500/10 transition-colors duration-200"
              title="Logout"
            >
              <LogOut className="w-5 h-5" />
            </button>
          ) : (
            <button
              onClick={logout}
              className="p-2 rounded-xl text-theme-text-secondary hover:text-rose-500 hover:bg-rose-500/10 transition-colors duration-200"
              title="Logout"
            >
              <LogOut className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>
    </aside>
  );
}
