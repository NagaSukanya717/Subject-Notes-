import React from 'react';
import { useApp } from '../context/AppContext';
import { BRANCHES } from '../data/mockData';
import { BookOpen, ShieldCheck, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  const { navigateTo, quickFilterBranch, setFilters } = useApp();

  return (
    <footer className="border-t border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Col 1 & 2: Brand & Mission */}
          <div className="lg:col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
                <BookOpen className="w-4 h-4" />
              </div>
              <span className="text-lg font-bold tracking-tight text-neutral-900 dark:text-neutral-50">
                StudyVault
              </span>
            </div>

            <p className="text-xs text-neutral-500 dark:text-neutral-400 max-w-sm leading-relaxed">
              An open-access academic repository engineered for college students to upload, preview, and download verified engineering lecture notes, question banks, and lab guides.
            </p>

            <div className="pt-2 text-[11px] text-neutral-400 flex items-center gap-1.5 font-medium">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>Academic Integrity Compliant · Zero Ads · Peer Verified</span>
            </div>
          </div>

          {/* Col 3: Quick Navigation */}
          <div className="space-y-2 text-xs">
            <h4 className="font-semibold text-neutral-900 dark:text-neutral-100 uppercase tracking-wider text-[11px]">
              Repository Links
            </h4>
            <ul className="space-y-1.5 text-neutral-600 dark:text-neutral-400">
              <li>
                <button
                  onClick={() => {
                    setFilters((p) => ({ ...p, materialType: 'all' }));
                    navigateTo('browse');
                  }}
                  className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                >
                  All Lecture Notes
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setFilters((p) => ({ ...p, materialType: 'pyq' }));
                    navigateTo('browse');
                  }}
                  className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                >
                  Previous Year Papers (PYQ)
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setFilters((p) => ({ ...p, materialType: 'lab_manual' }));
                    navigateTo('browse');
                  }}
                  className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                >
                  Laboratory Manuals
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setFilters((p) => ({ ...p, materialType: 'formula_sheet' }));
                    navigateTo('browse');
                  }}
                  className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                >
                  Formula Cheat Sheets
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Departments */}
          <div className="space-y-2 text-xs">
            <h4 className="font-semibold text-neutral-900 dark:text-neutral-100 uppercase tracking-wider text-[11px]">
              Departments
            </h4>
            <ul className="space-y-1.5 text-neutral-600 dark:text-neutral-400">
              {BRANCHES.map((b) => (
                <li key={b.id}>
                  <button
                    onClick={() => quickFilterBranch(b.id)}
                    className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                  >
                    {b.code} ({b.name.split(' ')[0]})
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 5: User Tools */}
          <div className="space-y-2 text-xs">
            <h4 className="font-semibold text-neutral-900 dark:text-neutral-100 uppercase tracking-wider text-[11px]">
              Student Tools
            </h4>
            <ul className="space-y-1.5 text-neutral-600 dark:text-neutral-400">
              <li>
                <button
                  onClick={() => navigateTo('upload')}
                  className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                >
                  Upload Study Notes
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('vault')}
                  className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                >
                  My Saved Bookmarks
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('vault')}
                  className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                >
                  Download History
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('admin')}
                  className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                >
                  Faculty Moderation
                </button>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-neutral-100 dark:border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-400">
          <p>© 2026 StudyVault Academic Portal. Built for college engineers.</p>
          <div className="flex items-center gap-4">
            <span>Semester 1 to 8 Syllabi</span>
            <span>·</span>
            <span>Protected Downloads</span>
            <span>·</span>
            <span>Peer Knowledge Exchange</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
