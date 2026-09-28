import React from 'react';
import { StudyMaterial } from '../types';
import { useApp } from '../context/AppContext';
import {
  FileText,
  Download,
  Bookmark,
  Star,
  Eye,
  CheckCircle2,
  Clock,
  ExternalLink,
} from 'lucide-react';

interface MaterialCardProps {
  material: StudyMaterial;
  onPreviewClick?: () => void;
}

export const MaterialCard: React.FC<MaterialCardProps> = ({ material, onPreviewClick }) => {
  const { navigateTo, toggleBookmark, isBookmarked, downloadMaterial } = useApp();
  const bookmarked = isBookmarked(material.id);

  const getFormatLabel = (type: string) => {
    switch (type) {
      case 'handwritten_notes':
        return 'Handwritten Notes';
      case 'lecture_notes':
        return 'Lecture Notes';
      case 'ppt':
        return 'Slide Deck (PPT)';
      case 'pyq':
        return 'Previous Year Paper';
      case 'lab_manual':
        return 'Lab Manual';
      case 'important_questions':
        return 'Question Bank';
      case 'formula_sheet':
        return 'Formula Sheet';
      default:
        return 'Study Notes';
    }
  };

  const handleCardClick = () => {
    if (onPreviewClick) {
      onPreviewClick();
    } else {
      navigateTo('material-detail', { materialId: material.id });
    }
  };

  return (
    <div className="group relative flex flex-col justify-between p-5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 hover:border-neutral-300 dark:hover:border-neutral-700 transition-all hover:shadow-md">
      {/* Top Header & Bookmark */}
      <div>
        <div className="flex items-start justify-between gap-3">
          {/* Unboxed Metadata Header */}
          <div className="text-xs text-neutral-500 dark:text-neutral-400 flex flex-wrap items-center gap-1.5 font-medium">
            <span className="text-indigo-600 dark:text-indigo-400 font-semibold uppercase tracking-wider">
              {material.subjectCode}
            </span>
            <span aria-hidden="true" className="text-neutral-300 dark:text-neutral-700">·</span>
            <span>{material.branchName.split(' ')[0]}</span>
            <span aria-hidden="true" className="text-neutral-300 dark:text-neutral-700">·</span>
            <span>Sem {material.semester}</span>
            <span aria-hidden="true" className="text-neutral-300 dark:text-neutral-700">·</span>
            <span>{material.unit === 'all' ? 'All Units' : `Unit ${material.unit}`}</span>
          </div>

          {/* Bookmark Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleBookmark(material.id);
            }}
            className={`p-1.5 rounded-lg transition-colors ${
              bookmarked
                ? 'text-amber-500 bg-amber-50 dark:bg-amber-950/40'
                : 'text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800'
            }`}
            aria-label={bookmarked ? 'Remove bookmark' : 'Bookmark material'}
            title={bookmarked ? 'Bookmarked in My Vault' : 'Bookmark this note'}
          >
            <Bookmark className={`w-4 h-4 ${bookmarked ? 'fill-amber-500' : ''}`} />
          </button>
        </div>

        {/* Title */}
        <h3
          onClick={handleCardClick}
          className="mt-2.5 text-base font-semibold text-neutral-900 dark:text-neutral-100 hover:text-indigo-600 dark:hover:text-indigo-400 cursor-pointer transition-colors leading-snug line-clamp-2"
        >
          {material.title}
        </h3>

        {/* Quiet Subtitle / Subject */}
        <p className="mt-1 text-xs text-neutral-600 dark:text-neutral-400 font-medium">
          {material.subjectName}
        </p>

        {/* Description snippet */}
        <p className="mt-2 text-xs text-neutral-500 dark:text-neutral-400 line-clamp-2 leading-relaxed">
          {material.description}
        </p>

        {/* Tags: Unboxed text separated by dots */}
        <div className="mt-3 flex flex-wrap items-center gap-2 text-[11px] text-neutral-400 dark:text-neutral-500">
          <span>{getFormatLabel(material.materialType)}</span>
          <span aria-hidden="true">·</span>
          <span>{material.pageCount} Pages</span>
          <span aria-hidden="true">·</span>
          <span className="font-mono tabular-nums">{material.fileSize}</span>
        </div>
      </div>

      {/* Footer Metrics & Actions */}
      <div className="mt-5 pt-3.5 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between gap-2">
        {/* Rating and Downloads */}
        <div className="flex items-center gap-3 text-xs text-neutral-500 dark:text-neutral-400">
          <div className="flex items-center gap-1 font-medium">
            <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
            <span className="font-mono tabular-nums font-semibold text-neutral-800 dark:text-neutral-200">
              {material.rating.toFixed(1)}
            </span>
            <span className="text-[11px] text-neutral-400">({material.reviewsCount})</span>
          </div>

          <span aria-hidden="true" className="text-neutral-300 dark:text-neutral-700">·</span>

          <div className="flex items-center gap-1">
            <Download className="w-3.5 h-3.5 text-neutral-400" />
            <span className="font-mono tabular-nums">{material.downloadsCount.toLocaleString()}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={handleCardClick}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-neutral-700 dark:text-neutral-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-md transition-colors"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Preview</span>
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              downloadMaterial(material);
            }}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-white bg-neutral-900 hover:bg-neutral-800 dark:bg-neutral-100 dark:text-neutral-900 dark:hover:bg-white rounded-md shadow-xs transition-colors"
            title="Download study file"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download</span>
          </button>
        </div>
      </div>
    </div>
  );
};
