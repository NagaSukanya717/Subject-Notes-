import React, { useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { MaterialCard } from './MaterialCard';
import { BRANCHES } from '../data/mockData';
import { MaterialType, BranchId } from '../types';
import {
  Search,
  Filter,
  RotateCcw,
  BookOpen,
  Layers,
  ArrowUpDown,
  Sparkles,
} from 'lucide-react';

export const BrowseView: React.FC = () => {
  const { filters, setFilters, resetFilters, materials, subjects } = useApp();

  // Filtered materials
  const filteredMaterials = useMemo(() => {
    return materials.filter((m) => {
      // Must be approved to show in general public browse
      if (m.status !== 'approved') return false;

      // Search query
      if (filters.searchQuery.trim()) {
        const q = filters.searchQuery.toLowerCase();
        const matchesTitle = m.title.toLowerCase().includes(q);
        const matchesSubject = m.subjectName.toLowerCase().includes(q) || m.subjectCode.toLowerCase().includes(q);
        const matchesTags = m.tags.some((t) => t.toLowerCase().includes(q));
        const matchesDesc = m.description.toLowerCase().includes(q);
        if (!matchesTitle && !matchesSubject && !matchesTags && !matchesDesc) {
          return false;
        }
      }

      // Branch filter
      if (filters.branchId !== 'all' && m.branchId !== filters.branchId) {
        return false;
      }

      // Semester filter
      if (filters.semester !== 'all' && m.semester !== filters.semester) {
        return false;
      }

      // Year filter
      if (filters.year !== 'all' && m.year !== filters.year) {
        return false;
      }

      // Subject filter
      if (filters.subjectId !== 'all' && m.subjectId !== filters.subjectId) {
        return false;
      }

      // Unit filter
      if (filters.unit !== 'all') {
        if (m.unit !== filters.unit && m.unit !== 'all') {
          return false;
        }
      }

      // Material type filter
      if (filters.materialType !== 'all' && m.materialType !== filters.materialType) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      if (filters.sortBy === 'popular' || filters.sortBy === 'downloads') {
        return b.downloadsCount - a.downloadsCount;
      }
      if (filters.sortBy === 'rating') {
        return b.rating - a.rating;
      }
      if (filters.sortBy === 'recent') {
        return new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime();
      }
      return 0;
    });
  }, [materials, filters]);

  // Subjects filtered by current branch selection
  const relevantSubjects = useMemo(() => {
    if (filters.branchId === 'all') return subjects;
    return subjects.filter((s) => s.branchId === filters.branchId);
  }, [subjects, filters.branchId]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Top Banner & Search */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50">
              Study Materials Directory
            </h1>
            <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 mt-1">
              Explore syllabus notes, question papers, and manuals with multi-parameter filtering.
            </p>
          </div>

          {/* Search Input */}
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
            <input
              type="text"
              value={filters.searchQuery}
              onChange={(e) => setFilters((p) => ({ ...p, searchQuery: e.target.value }))}
              placeholder="Quick search notes, topics..."
              className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>
        </div>

        {/* Filter Controls Bar */}
        <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-neutral-700 dark:text-neutral-300">
              <Filter className="w-3.5 h-3.5 text-indigo-500" />
              <span>Filter Syllabus</span>
            </div>

            <button
              onClick={resetFilters}
              className="text-xs text-neutral-500 hover:text-indigo-600 dark:hover:text-indigo-400 flex items-center gap-1 transition-colors"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset All</span>
            </button>
          </div>

          {/* Filter Dropdown Selectors */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 text-xs">
            {/* Branch */}
            <div>
              <label className="block text-[11px] font-semibold text-neutral-500 mb-1">Branch</label>
              <select
                value={filters.branchId}
                onChange={(e) =>
                  setFilters((p) => ({
                    ...p,
                    branchId: e.target.value as BranchId | 'all',
                    subjectId: 'all',
                  }))
                }
                className="w-full p-2 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-none"
              >
                <option value="all">All Branches</option>
                {BRANCHES.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.code}
                  </option>
                ))}
              </select>
            </div>

            {/* Semester */}
            <div>
              <label className="block text-[11px] font-semibold text-neutral-500 mb-1">Semester</label>
              <select
                value={filters.semester}
                onChange={(e) =>
                  setFilters((p) => ({
                    ...p,
                    semester: e.target.value === 'all' ? 'all' : Number(e.target.value),
                  }))
                }
                className="w-full p-2 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-none"
              >
                <option value="all">All Semesters</option>
                {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
                  <option key={s} value={s}>
                    Sem {s}
                  </option>
                ))}
              </select>
            </div>

            {/* Subject */}
            <div className="col-span-2 sm:col-span-1">
              <label className="block text-[11px] font-semibold text-neutral-500 mb-1">Subject</label>
              <select
                value={filters.subjectId}
                onChange={(e) => setFilters((p) => ({ ...p, subjectId: e.target.value }))}
                className="w-full p-2 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-none truncate"
              >
                <option value="all">All Subjects ({relevantSubjects.length})</option>
                {relevantSubjects.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.code} - {s.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Unit */}
            <div>
              <label className="block text-[11px] font-semibold text-neutral-500 mb-1">Unit</label>
              <select
                value={filters.unit}
                onChange={(e) =>
                  setFilters((p) => ({
                    ...p,
                    unit: e.target.value === 'all' ? 'all' : Number(e.target.value),
                  }))
                }
                className="w-full p-2 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-none"
              >
                <option value="all">All Units</option>
                <option value={1}>Unit 1</option>
                <option value={2}>Unit 2</option>
                <option value={3}>Unit 3</option>
                <option value={4}>Unit 4</option>
                <option value={5}>Unit 5</option>
              </select>
            </div>

            {/* Material Type */}
            <div>
              <label className="block text-[11px] font-semibold text-neutral-500 mb-1">Format Type</label>
              <select
                value={filters.materialType}
                onChange={(e) =>
                  setFilters((p) => ({
                    ...p,
                    materialType: e.target.value as MaterialType | 'all',
                  }))
                }
                className="w-full p-2 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-none"
              >
                <option value="all">All Formats</option>
                <option value="handwritten_notes">Handwritten</option>
                <option value="lecture_notes">Lecture Notes</option>
                <option value="pyq">PYQ Papers</option>
                <option value="lab_manual">Lab Manuals</option>
                <option value="important_questions">Question Bank</option>
                <option value="ppt">Slide Deck</option>
                <option value="formula_sheet">Formula Sheet</option>
              </select>
            </div>

            {/* Sort Order */}
            <div>
              <label className="block text-[11px] font-semibold text-neutral-500 mb-1">Sort By</label>
              <select
                value={filters.sortBy}
                onChange={(e) =>
                  setFilters((p) => ({
                    ...p,
                    sortBy: e.target.value as any,
                  }))
                }
                className="w-full p-2 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-none"
              >
                <option value="popular">Most Downloaded</option>
                <option value="rating">Highest Rated</option>
                <option value="recent">Newest Uploads</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between text-xs text-neutral-500">
        <div>
          Showing{' '}
          <span className="font-mono tabular-nums font-bold text-neutral-900 dark:text-neutral-100">
            {filteredMaterials.length}
          </span>{' '}
          study materials
        </div>
        <div className="font-mono text-[11px] text-neutral-400">
          Peer-reviewed college notes
        </div>
      </div>

      {/* Materials Cards Grid */}
      {filteredMaterials.length === 0 ? (
        <div className="py-16 text-center rounded-2xl border border-dashed border-neutral-300 dark:border-neutral-800 bg-white dark:bg-neutral-900 space-y-3">
          <BookOpen className="w-10 h-10 text-neutral-400 mx-auto" />
          <h3 className="text-base font-semibold text-neutral-900 dark:text-neutral-100">
            No study materials found
          </h3>
          <p className="text-xs text-neutral-500 max-w-sm mx-auto">
            Try broadening your search term or clearing branch and unit filters.
          </p>
          <button
            onClick={resetFilters}
            className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 rounded-lg shadow-sm hover:bg-indigo-700 transition-colors"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMaterials.map((material) => (
            <MaterialCard key={material.id} material={material} />
          ))}
        </div>
      )}
    </div>
  );
};
