import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { BRANCHES } from '../data/mockData';
import { BranchId } from '../types';
import {
  Search,
  BookOpen,
  ArrowRight,
  Filter,
  CheckCircle2,
  FileCheck,
  Shield,
  Layers,
  Sparkles,
} from 'lucide-react';

export const HeroSection: React.FC = () => {
  const {
    filters,
    setFilters,
    quickFilterBranch,
    subjects,
    materials,
    navigateTo,
  } = useApp();

  const [searchVal, setSearchVal] = useState('');
  const [selectedBranch, setSelectedBranch] = useState<BranchId | 'all'>(
    filters.branchId === 'all' ? 'cse' : filters.branchId
  );
  const [selectedSem, setSelectedSem] = useState<number | 'all'>(filters.semester);
  const [selectedSubject, setSelectedSubject] = useState<string>('all');
  const [selectedUnit, setSelectedUnit] = useState<number | 'all'>('all');

  // Filtered subjects based on branch & semester
  const availableSubjects = useMemo(() => {
    return subjects.filter((s) => {
      const matchBranch = selectedBranch === 'all' || s.branchId === selectedBranch;
      const matchSem = selectedSem === 'all' || s.semester === selectedSem;
      return matchBranch && matchSem;
    });
  }, [subjects, selectedBranch, selectedSem]);

  // Live search suggestions
  const liveSuggestions = useMemo(() => {
    if (!searchVal.trim() || searchVal.length < 2) return [];
    const q = searchVal.toLowerCase();
    return materials
      .filter(
        (m) =>
          m.status === 'approved' &&
          (m.title.toLowerCase().includes(q) ||
            m.subjectName.toLowerCase().includes(q) ||
            m.subjectCode.toLowerCase().includes(q) ||
            m.tags.some((t) => t.toLowerCase().includes(q)) ||
            m.description.toLowerCase().includes(q))
      )
      .slice(0, 5);
  }, [searchVal, materials]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFilters((prev) => ({
      ...prev,
      searchQuery: searchVal.trim(),
    }));
    navigateTo('browse');
  };

  const handleStepApply = () => {
    setFilters((prev) => ({
      ...prev,
      branchId: selectedBranch,
      semester: selectedSem,
      subjectId: selectedSubject,
      unit: selectedUnit,
    }));
    navigateTo('browse');
  };

  return (
    <div className="relative border-b border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 transition-colors">
      {/* Background Subtle Gradient & Grid Pattern */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left Column: Headline, Search, Branch Selector */}
          <div className="lg:col-span-7 space-y-6">
            {/* Clean kicker text */}
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-indigo-600 dark:text-indigo-400">
              <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
              <span>COLLEGE STUDY REPOSITORY & RESOURCE EXCHANGE</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50 leading-[1.15]" style={{ textWrap: 'balance' }}>
              Subject-wise lecture notes, question papers & lab manuals.
            </h1>

            <p className="text-base text-neutral-600 dark:text-neutral-300 max-w-xl leading-relaxed">
              Curated, peer-reviewed engineering notes organized by Branch, Semester, Subject, and Unit. Browse online, preview verified pages, or download for offline exam revision.
            </p>

            {/* High-Intent Search Bar */}
            <div className="relative max-w-xl">
              <form onSubmit={handleSearchSubmit} className="relative">
                <div className="relative flex items-center">
                  <Search className="absolute left-4 w-5 h-5 text-neutral-400 pointer-events-none" />
                  <input
                    type="text"
                    value={searchVal}
                    onChange={(e) => setSearchVal(e.target.value)}
                    placeholder="Search by subject (e.g. DBMS, Cryptography), unit, or topic..."
                    className="w-full pl-12 pr-28 py-3.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800/80 text-sm text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all shadow-xs"
                  />
                  <button
                    type="submit"
                    className="absolute right-2 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 rounded-lg transition-colors whitespace-nowrap"
                  >
                    Search
                  </button>
                </div>
              </form>

              {/* Live search suggestions dropdown */}
              {liveSuggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-xl z-30 p-2 space-y-1">
                  <div className="px-3 py-1.5 text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">
                    Matching Materials
                  </div>
                  {liveSuggestions.map((m) => (
                    <button
                      key={m.id}
                      onClick={() => navigateTo('material-detail', { materialId: m.id })}
                      className="w-full text-left px-3 py-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors flex items-center justify-between gap-3 group"
                    >
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-neutral-900 dark:text-neutral-100 truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                          {m.title}
                        </p>
                        <p className="text-[11px] text-neutral-500 truncate">
                          {m.subjectCode} · {m.subjectName} · Sem {m.semester}
                        </p>
                      </div>
                      <ArrowRight className="w-3.5 h-3.5 text-neutral-400 group-hover:translate-x-0.5 transition-transform shrink-0" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Quick Branch Filter Tabs (Interactive Segmented Control) */}
            <div className="pt-2">
              <div className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 mb-2">
                Popular Academic Departments:
              </div>
              <div className="flex flex-wrap items-center gap-1.5">
                {BRANCHES.map((b) => (
                  <button
                    key={b.id}
                    onClick={() => quickFilterBranch(b.id)}
                    className="px-3 py-1.5 text-xs font-medium rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800/60 text-neutral-700 dark:text-neutral-300 hover:border-indigo-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all cursor-pointer whitespace-nowrap"
                  >
                    {b.code} ({b.name.split(' ')[0]})
                  </button>
                ))}
              </div>
            </div>

            {/* Trust and Activity metrics */}
            <div className="pt-3 border-t border-neutral-100 dark:border-neutral-800/80 flex flex-wrap items-center gap-6 text-xs text-neutral-500 dark:text-neutral-400 font-medium">
              <div>
                <span className="font-mono tabular-nums font-bold text-neutral-900 dark:text-neutral-100">
                  {materials.filter((m) => m.status === 'approved').length}
                </span>{' '}
                Verified Notes
              </div>
              <span aria-hidden="true" className="text-neutral-300 dark:text-neutral-700">·</span>
              <div>
                <span className="font-mono tabular-nums font-bold text-neutral-900 dark:text-neutral-100">
                  {subjects.length}
                </span>{' '}
                Curriculum Subjects
              </div>
              <span aria-hidden="true" className="text-neutral-300 dark:text-neutral-700">·</span>
              <div>
                <span className="font-mono tabular-nums font-bold text-neutral-900 dark:text-neutral-100">
                  18,400+
                </span>{' '}
                Student Downloads
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Multi-Step Navigator & Visual Asset */}
          <div className="lg:col-span-5">
            <div className="p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/70 dark:bg-neutral-800/40 shadow-sm backdrop-blur-xs space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Layers className="w-4 h-4 text-indigo-500" />
                  <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
                    Quick Syllabus Navigator
                  </h3>
                </div>
                <span className="text-[11px] text-neutral-500 font-mono">Step 1 to 4</span>
              </div>

              {/* Step 1: Branch */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-neutral-600 dark:text-neutral-300">
                  1. Select Branch:
                </label>
                <select
                  value={selectedBranch}
                  onChange={(e) => {
                    const val = e.target.value as BranchId | 'all';
                    setSelectedBranch(val);
                    setSelectedSubject('all');
                  }}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                >
                  <option value="all">All Engineering Branches</option>
                  {BRANCHES.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.code} - {b.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Step 2: Semester */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-neutral-600 dark:text-neutral-300">
                  2. Select Semester:
                </label>
                <select
                  value={selectedSem}
                  onChange={(e) => {
                    const val = e.target.value === 'all' ? 'all' : Number(e.target.value);
                    setSelectedSem(val);
                    setSelectedSubject('all');
                  }}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                >
                  <option value="all">All Semesters (1 to 8)</option>
                  <option value={1}>Semester 1 (1st Year)</option>
                  <option value={2}>Semester 2 (1st Year)</option>
                  <option value={3}>Semester 3 (2nd Year)</option>
                  <option value={4}>Semester 4 (2nd Year)</option>
                  <option value={5}>Semester 5 (3rd Year)</option>
                  <option value={6}>Semester 6 (3rd Year)</option>
                  <option value={7}>Semester 7 (4th Year)</option>
                  <option value={8}>Semester 8 (4th Year)</option>
                </select>
              </div>

              {/* Step 3: Subject */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-neutral-600 dark:text-neutral-300">
                  3. Select Subject:
                </label>
                <select
                  value={selectedSubject}
                  onChange={(e) => setSelectedSubject(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                >
                  <option value="all">All Available Subjects ({availableSubjects.length})</option>
                  {availableSubjects.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.code} - {s.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Step 4: Unit */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-neutral-600 dark:text-neutral-300">
                  4. Choose Unit:
                </label>
                <select
                  value={selectedUnit}
                  onChange={(e) =>
                    setSelectedUnit(e.target.value === 'all' ? 'all' : Number(e.target.value))
                  }
                  className="w-full px-3 py-2 text-xs rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                >
                  <option value="all">All Units (Complete Syllabus)</option>
                  <option value={1}>Unit 1: Fundamentals & Core Principles</option>
                  <option value={2}>Unit 2: Algorithms & Models</option>
                  <option value={3}>Unit 3: Architecture & Implementations</option>
                  <option value={4}>Unit 4: Advanced Systems & Protocols</option>
                  <option value={5}>Unit 5: Applications & Case Studies</option>
                </select>
              </div>

              {/* Go Button */}
              <button
                onClick={handleStepApply}
                className="w-full mt-3 py-2.5 px-4 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 rounded-lg shadow-sm transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>View Filtered Materials</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
