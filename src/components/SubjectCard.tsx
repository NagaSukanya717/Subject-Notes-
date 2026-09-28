import React from 'react';
import { Subject } from '../types';
import { useApp } from '../context/AppContext';
import { BookOpen, ArrowRight, Layers } from 'lucide-react';

interface SubjectCardProps {
  subject: Subject;
}

export const SubjectCard: React.FC<SubjectCardProps> = ({ subject }) => {
  const { quickFilterSubject } = useApp();

  return (
    <div
      onClick={() => quickFilterSubject(subject.id)}
      className="group p-5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 hover:border-indigo-400 dark:hover:border-indigo-500 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
    >
      <div>
        <div className="flex items-start justify-between gap-2">
          {/* Unboxed Metadata */}
          <div className="text-xs text-neutral-500 dark:text-neutral-400 font-medium flex items-center gap-1.5">
            <span className="text-indigo-600 dark:text-indigo-400 font-bold uppercase tracking-wider">
              {subject.code}
            </span>
            <span aria-hidden="true" className="text-neutral-300 dark:text-neutral-700">·</span>
            <span>Sem {subject.semester}</span>
            <span aria-hidden="true" className="text-neutral-300 dark:text-neutral-700">·</span>
            <span>Year {subject.year}</span>
          </div>

          <div className="text-xs font-mono tabular-nums text-neutral-500 dark:text-neutral-400 flex items-center gap-1">
            <Layers className="w-3.5 h-3.5 text-neutral-400" />
            <span>{subject.unitsCount} Units</span>
          </div>
        </div>

        <h3 className="mt-2 text-base font-semibold text-neutral-900 dark:text-neutral-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
          {subject.name}
        </h3>

        <p className="mt-1.5 text-xs text-neutral-500 dark:text-neutral-400 line-clamp-2 leading-relaxed">
          {subject.description}
        </p>
      </div>

      <div className="mt-4 pt-3 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between text-xs">
        <span className="font-medium text-neutral-600 dark:text-neutral-300">
          <span className="font-mono tabular-nums font-bold text-neutral-900 dark:text-neutral-100">
            {subject.materialsCount}
          </span>{' '}
          materials available
        </span>

        <span className="inline-flex items-center gap-1 font-semibold text-indigo-600 dark:text-indigo-400 group-hover:translate-x-1 transition-transform">
          <span>Explore</span>
          <ArrowRight className="w-3 h-3" />
        </span>
      </div>
    </div>
  );
};
