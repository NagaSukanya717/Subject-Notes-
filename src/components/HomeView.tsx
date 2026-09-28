import React, { useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { HeroSection } from './HeroSection';
import { MaterialCard } from './MaterialCard';
import { SubjectCard } from './SubjectCard';
import { BRANCHES } from '../data/mockData';
import { BranchId } from '../types';
import {
  TrendingUp,
  Clock,
  Sparkles,
  BookOpen,
  ArrowRight,
  ShieldCheck,
  Award,
  Layers,
  FileCheck,
} from 'lucide-react';

export const HomeView: React.FC = () => {
  const { materials, subjects, quickFilterBranch, quickFilterSubject, navigateTo } = useApp();

  // Approved materials only
  const approvedMaterials = useMemo(() => {
    return materials.filter((m) => m.status === 'approved');
  }, [materials]);

  // Most Downloaded Materials
  const mostDownloaded = useMemo(() => {
    return [...approvedMaterials]
      .sort((a, b) => b.downloadsCount - a.downloadsCount)
      .slice(0, 3);
  }, [approvedMaterials]);

  // Recently Uploaded Notes
  const recentNotes = useMemo(() => {
    return [...approvedMaterials]
      .sort((a, b) => new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime())
      .slice(0, 3);
  }, [approvedMaterials]);

  // Popular CSE & Cyber Security Subjects
  const popularSubjects = useMemo(() => {
    return subjects
      .filter((s) => s.branchId === 'cse' || s.branchId === 'cyber')
      .slice(0, 6);
  }, [subjects]);

  return (
    <div className="space-y-12 pb-16">
      {/* Hero Section with Search and Multi-step Navigator */}
      <HeroSection />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-14">
        {/* Section 1: Popular Academic Subjects (CSE & Cyber Security) */}
        <section className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-neutral-200 dark:border-neutral-800 pb-3">
            <div>
              <div className="text-xs font-bold text-indigo-600 dark:text-indigo-400 tracking-wider uppercase flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5" />
                <span>CURRICULUM ARCHITECTURE</span>
              </div>
              <h2 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50 mt-1">
                Popular Subjects & Unit Maps
              </h2>
            </div>

            <button
              onClick={() => navigateTo('browse')}
              className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              <span>View all {subjects.length} subjects</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {popularSubjects.map((subj) => (
              <SubjectCard key={subj.id} subject={subj} />
            ))}
          </div>
        </section>

        {/* Section 2: Most Downloaded Materials */}
        <section className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-neutral-200 dark:border-neutral-800 pb-3">
            <div>
              <div className="text-xs font-bold text-amber-600 dark:text-amber-400 tracking-wider uppercase flex items-center gap-1.5">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>COMMUNITY REPUTATION</span>
              </div>
              <h2 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50 mt-1">
                Most Downloaded Study Materials
              </h2>
            </div>

            <button
              onClick={() => navigateTo('browse')}
              className="inline-flex items-center gap-1 text-xs font-semibold text-neutral-600 dark:text-neutral-300 hover:text-indigo-600 transition-colors"
            >
              <span>Explore top rankers</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mostDownloaded.map((material) => (
              <MaterialCard key={material.id} material={material} />
            ))}
          </div>
        </section>

        {/* Section 3: Recently Uploaded Notes & Solved Papers */}
        <section className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-neutral-200 dark:border-neutral-800 pb-3">
            <div>
              <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400 tracking-wider uppercase flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                <span>FRESH SYLLABUS CONTRIBUTIONS</span>
              </div>
              <h2 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50 mt-1">
                Recently Added Notes & PYQs
              </h2>
            </div>

            <button
              onClick={() => navigateTo('browse')}
              className="inline-flex items-center gap-1 text-xs font-semibold text-neutral-600 dark:text-neutral-300 hover:text-indigo-600 transition-colors"
            >
              <span>Browse recent updates</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentNotes.map((material) => (
              <MaterialCard key={material.id} material={material} />
            ))}
          </div>
        </section>

        {/* Section 4: Academic Departments Catalog */}
        <section className="p-8 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/60 dark:bg-neutral-900/60 space-y-6">
          <div>
            <h3 className="text-xl font-bold text-neutral-900 dark:text-neutral-100">
              Browse Notes by College Department
            </h3>
            <p className="text-xs text-neutral-500 mt-1">
              Select your academic discipline to access specialized semester syllabi, question banks, and lab guides.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {BRANCHES.map((b) => {
              const branchMaterialsCount = materials.filter(
                (m) => m.branchId === b.id && m.status === 'approved'
              ).length;
              const branchSubjectsCount = subjects.filter((s) => s.branchId === b.id).length;

              return (
                <div
                  key={b.id}
                  onClick={() => quickFilterBranch(b.id)}
                  className="p-5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 hover:border-indigo-400 dark:hover:border-indigo-500 hover:shadow-sm transition-all cursor-pointer space-y-3 group"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-indigo-600 dark:text-indigo-400">
                      {b.code}
                    </span>
                    <span className="text-[11px] text-neutral-400 font-mono">
                      8 Semesters
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-neutral-900 dark:text-neutral-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    {b.name}
                  </h4>

                  <p className="text-xs text-neutral-500 line-clamp-2 leading-relaxed">
                    {b.description}
                  </p>

                  <div className="pt-2 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between text-xs text-neutral-500">
                    <span>{branchSubjectsCount} Courses</span>
                    <span className="font-semibold text-neutral-800 dark:text-neutral-200">
                      {branchMaterialsCount} Notes Available
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
};
