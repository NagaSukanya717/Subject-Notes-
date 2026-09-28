import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Sun,
  Moon,
  Search,
  BookOpen,
  UploadCloud,
  Bookmark,
  ShieldCheck,
  UserCheck,
  ChevronDown,
  Sparkles,
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const {
    currentView,
    navigateTo,
    isDark,
    toggleTheme,
    user,
    switchRole,
    setFilters,
  } = useApp();

  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const handleNavClick = (view: any, filterAction?: () => void) => {
    if (filterAction) {
      filterAction();
    }
    navigateTo(view);
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-neutral-200 dark:border-neutral-800 bg-white/95 dark:bg-neutral-900/95 backdrop-blur-md transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Zone 1: Single text element wordmark */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigateTo('home')}
            className="flex items-center gap-2.5 text-left group focus:outline-none"
          >
            <div className="w-9 h-9 rounded-xl bg-indigo-600 dark:bg-indigo-500 text-white flex items-center justify-center font-bold shadow-sm shadow-indigo-600/30 group-hover:scale-105 transition-transform">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50 flex items-center gap-1.5">
                StudyVault
              </span>
            </div>
          </button>
        </div>

        {/* Zone 2: 4-6 clean text navigation links */}
        <nav className="hidden md:flex items-center gap-6 lg:gap-8 text-sm font-medium text-neutral-600 dark:text-neutral-300">
          <button
            onClick={() => handleNavClick('browse', () => setFilters((p) => ({ ...p, materialType: 'all' })))}
            className={`transition-colors hover:text-neutral-900 dark:hover:text-white ${
              currentView === 'browse' ? 'text-indigo-600 dark:text-indigo-400 font-semibold' : ''
            }`}
          >
            Browse Notes
          </button>

          <button
            onClick={() =>
              handleNavClick('browse', () =>
                setFilters((p) => ({ ...p, materialType: 'pyq' }))
              )
            }
            className="transition-colors hover:text-neutral-900 dark:hover:text-white"
          >
            PYQ Papers
          </button>

          <button
            onClick={() => handleNavClick('home')}
            className="transition-colors hover:text-neutral-900 dark:hover:text-white"
          >
            Subjects & Units
          </button>

          <button
            onClick={() => handleNavClick('upload')}
            className={`flex items-center gap-1.5 transition-colors hover:text-neutral-900 dark:hover:text-white ${
              currentView === 'upload' ? 'text-indigo-600 dark:text-indigo-400 font-semibold' : ''
            }`}
          >
            <UploadCloud className="w-4 h-4 text-indigo-500" />
            <span>Upload Notes</span>
          </button>

          <button
            onClick={() => handleNavClick('vault')}
            className={`flex items-center gap-1.5 transition-colors hover:text-neutral-900 dark:hover:text-white ${
              currentView === 'vault' ? 'text-indigo-600 dark:text-indigo-400 font-semibold' : ''
            }`}
          >
            <Bookmark className="w-4 h-4 text-amber-500" />
            <span>My Vault</span>
          </button>

          {user.role === 'admin' ? (
            <button
              onClick={() => handleNavClick('admin')}
              className={`flex items-center gap-1.5 transition-colors hover:text-neutral-900 dark:hover:text-white text-emerald-600 dark:text-emerald-400 font-semibold ${
                currentView === 'admin' ? 'underline underline-offset-4' : ''
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Admin Panel</span>
            </button>
          ) : (
            <button
              onClick={() => handleNavClick('admin')}
              className="hidden lg:flex items-center gap-1 text-xs text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 transition-colors"
              title="Admin review & moderation console"
            >
              <span>Admin</span>
            </button>
          )}
        </nav>

        {/* Zone 3: 1-2 primary actions + theme & profile */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Quick Search Button */}
          <button
            onClick={() => {
              navigateTo('browse');
            }}
            className="p-2 text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
            aria-label="Search study materials"
            title="Search notes"
          >
            <Search className="w-4 h-4" />
          </button>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
            aria-label="Toggle color mode"
            title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* Role Switcher & Account Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              className="flex items-center gap-2 p-1.5 pr-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700 bg-neutral-50/50 dark:bg-neutral-800/50 transition-colors"
            >
              <img
                src={user.avatar}
                alt={user.name}
                referrerPolicy="no-referrer"
                className="w-7 h-7 rounded-full bg-neutral-200 dark:bg-neutral-700 object-cover"
              />
              <div className="text-left hidden sm:block">
                <p className="text-xs font-semibold leading-tight text-neutral-900 dark:text-neutral-100 truncate max-w-[100px]">
                  {user.name.split(' ')[0]}
                </p>
                <p className="text-[10px] text-neutral-500 dark:text-neutral-400 leading-none">
                  {user.role === 'admin' ? 'Admin' : `${user.branchId.toUpperCase()} Y${user.year}`}
                </p>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-neutral-400" />
            </button>

            {isUserMenuOpen && (
              <div className="absolute right-0 mt-2 w-64 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-xl p-2.5 z-50 text-neutral-800 dark:text-neutral-200">
                <div className="px-2.5 py-2 border-b border-neutral-100 dark:border-neutral-800">
                  <p className="text-sm font-semibold">{user.name}</p>
                  <p className="text-xs text-neutral-500 truncate">{user.email}</p>
                  <div className="flex items-center gap-1.5 mt-1.5 text-[11px] text-indigo-600 dark:text-indigo-400">
                    <Sparkles className="w-3 h-3" />
                    <span>Role: {user.role === 'admin' ? 'Administrator' : 'Verified Student'}</span>
                  </div>
                </div>

                {/* Role Switcher segment */}
                <div className="my-2 p-1 bg-neutral-100 dark:bg-neutral-800 rounded-lg">
                  <div className="text-[10px] uppercase font-semibold text-neutral-500 px-2 py-1">
                    Switch Persona Demo
                  </div>
                  <div className="grid grid-cols-2 gap-1 text-xs">
                    <button
                      onClick={() => {
                        switchRole('student');
                        setIsUserMenuOpen(false);
                      }}
                      className={`flex items-center justify-center gap-1 py-1.5 rounded-md font-medium transition-all ${
                        user.role === 'student'
                          ? 'bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white shadow-xs'
                          : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900'
                      }`}
                    >
                      <UserCheck className="w-3.5 h-3.5" />
                      Student
                    </button>
                    <button
                      onClick={() => {
                        switchRole('admin');
                        setIsUserMenuOpen(false);
                      }}
                      className={`flex items-center justify-center gap-1 py-1.5 rounded-md font-medium transition-all ${
                        user.role === 'admin'
                          ? 'bg-emerald-600 text-white shadow-xs'
                          : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900'
                      }`}
                    >
                      <ShieldCheck className="w-3.5 h-3.5" />
                      Admin
                    </button>
                  </div>
                </div>

                <div className="space-y-1 text-xs font-medium">
                  <button
                    onClick={() => {
                      navigateTo('vault');
                      setIsUserMenuOpen(false);
                    }}
                    className="w-full text-left px-2.5 py-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors flex items-center justify-between"
                  >
                    <span>My Saved Vault</span>
                    <span className="font-mono text-[11px] text-neutral-400">{user.bookmarks.length}</span>
                  </button>
                  <button
                    onClick={() => {
                      navigateTo('upload');
                      setIsUserMenuOpen(false);
                    }}
                    className="w-full text-left px-2.5 py-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                  >
                    Upload New Material
                  </button>
                  {user.role === 'admin' && (
                    <button
                      onClick={() => {
                        navigateTo('admin');
                        setIsUserMenuOpen(false);
                      }}
                      className="w-full text-left px-2.5 py-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 font-semibold"
                    >
                      Open Admin Panel
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Primary CTA */}
          <button
            onClick={() => navigateTo('upload')}
            className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 rounded-lg shadow-sm transition-colors whitespace-nowrap"
          >
            <UploadCloud className="w-4 h-4" />
            <span>Upload Notes</span>
          </button>
        </div>
      </div>
    </header>
  );
};
