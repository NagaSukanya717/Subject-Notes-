import React, { useState } from 'react';
import { StudyMaterial, NotePage } from '../types';
import { useApp } from '../context/AppContext';
import {
  X,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Download,
  Bookmark,
  Search,
  Maximize2,
  FileText,
  CheckCircle2,
  AlertTriangle,
  Copy,
  Printer,
  Moon,
  Sun,
} from 'lucide-react';

interface PdfViewerModalProps {
  material: StudyMaterial;
  isOpen: boolean;
  onClose: () => void;
}

export const PdfViewerModal: React.FC<PdfViewerModalProps> = ({
  material,
  isOpen,
  onClose,
}) => {
  const { downloadMaterial, toggleBookmark, isBookmarked, showToast } = useApp();
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [zoomLevel, setZoomLevel] = useState(100);
  const [searchTerm, setSearchTerm] = useState('');
  const [isReaderDark, setIsReaderDark] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  if (!isOpen) return null;

  const pages = material.pages && material.pages.length > 0 ? material.pages : [
    {
      pageNumber: 1,
      title: material.title,
      summary: material.description,
      content: [
        'This material was uploaded to the StudyVault academic repository.',
        'File size: ' + material.fileSize,
        'Subject: ' + material.subjectName + ' (' + material.subjectCode + ')',
        'Branch: ' + material.branchName + ' - Semester ' + material.semester,
        'Use the Download button above to save the complete document offline.',
      ],
      keyPoints: ['Peer reviewed college material', 'Verified semester syllabus coverage'],
    },
  ];

  const currentPage: NotePage = pages[currentPageIndex] || pages[0];
  const bookmarked = isBookmarked(material.id);

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(true);
    showToast('Code Copied', 'Snippet copied to clipboard.', 'info');
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/70 backdrop-blur-xs">
      <div
        className={`relative flex flex-col w-full max-w-5xl rounded-2xl overflow-hidden border border-neutral-200 dark:border-neutral-800 bg-neutral-100 dark:bg-neutral-900 shadow-2xl transition-all ${
          isFullscreen ? 'h-full max-w-none rounded-none' : 'max-h-[92vh] h-[850px]'
        }`}
      >
        {/* Top Viewer Control Bar */}
        <div className="flex items-center justify-between px-4 py-3 bg-neutral-900 text-white border-b border-neutral-800 shrink-0">
          {/* Document Title & Subject Info */}
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-7 h-7 rounded bg-indigo-600 flex items-center justify-center shrink-0">
              <FileText className="w-4 h-4 text-white" />
            </div>
            <div className="min-w-0">
              <h2 className="text-xs sm:text-sm font-semibold text-white truncate max-w-xs sm:max-w-md">
                {material.fileName}
              </h2>
              <p className="text-[11px] text-neutral-400 truncate">
                {material.subjectCode} · {material.subjectName} · {material.unit === 'all' ? 'All Units' : `Unit ${material.unit}`}
              </p>
            </div>
          </div>

          {/* Controls: Zoom, Page Turn, Reader theme, Download */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Page navigation */}
            <div className="flex items-center gap-1 bg-neutral-800/80 px-2 py-1 rounded-lg text-xs font-mono">
              <button
                disabled={currentPageIndex <= 0}
                onClick={() => setCurrentPageIndex((prev) => Math.max(0, prev - 1))}
                className="p-1 text-neutral-300 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                title="Previous Page"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <span className="tabular-nums px-1">
                {currentPageIndex + 1} / {pages.length}
              </span>
              <button
                disabled={currentPageIndex >= pages.length - 1}
                onClick={() => setCurrentPageIndex((prev) => Math.min(pages.length - 1, prev + 1))}
                className="p-1 text-neutral-300 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                title="Next Page"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Zoom Controls */}
            <div className="hidden sm:flex items-center gap-0.5 bg-neutral-800/80 p-1 rounded-lg text-xs">
              <button
                onClick={() => setZoomLevel((z) => Math.max(75, z - 15))}
                className="p-1 text-neutral-300 hover:text-white"
                title="Zoom Out"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <span className="font-mono text-[11px] px-1 text-neutral-300 w-10 text-center">
                {zoomLevel}%
              </span>
              <button
                onClick={() => setZoomLevel((z) => Math.min(150, z + 15))}
                className="p-1 text-neutral-300 hover:text-white"
                title="Zoom In"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setZoomLevel(100)}
                className="p-1 text-neutral-400 hover:text-white"
                title="Reset Zoom"
              >
                <RotateCcw className="w-3 h-3" />
              </button>
            </div>

            {/* Bookmark button */}
            <button
              onClick={() => toggleBookmark(material.id)}
              className={`p-2 rounded-lg transition-colors ${
                bookmarked
                  ? 'text-amber-400 bg-amber-950/60'
                  : 'text-neutral-300 hover:text-white hover:bg-neutral-800'
              }`}
              title="Bookmark Note"
            >
              <Bookmark className={`w-4 h-4 ${bookmarked ? 'fill-amber-400' : ''}`} />
            </button>

            {/* Reader Theme Toggle */}
            <button
              onClick={() => setIsReaderDark(!isReaderDark)}
              className="p-2 text-neutral-300 hover:text-white hover:bg-neutral-800 rounded-lg transition-colors"
              title="Toggle Reader Mode Contrast"
            >
              {isReaderDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Download button */}
            <button
              onClick={() => downloadMaterial(material)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg transition-colors"
              title="Download full material"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Download</span>
            </button>

            {/* Close button */}
            <button
              onClick={onClose}
              className="p-1.5 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-lg transition-colors ml-1"
              aria-label="Close viewer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Search within document bar */}
        <div className="flex items-center justify-between px-4 py-1.5 bg-neutral-200 dark:bg-neutral-800/60 border-b border-neutral-300 dark:border-neutral-800 text-xs">
          <div className="flex items-center gap-2 flex-1 max-w-sm">
            <Search className="w-3.5 h-3.5 text-neutral-500" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Find in page (e.g. theorem, formula)..."
              className="w-full bg-transparent border-none text-xs text-neutral-800 dark:text-neutral-200 placeholder-neutral-500 focus:outline-none"
            />
            {searchTerm && (
              <button onClick={() => setSearchTerm('')} className="text-neutral-500 hover:text-neutral-700">
                <X className="w-3 h-3" />
              </button>
            )}
          </div>
          <div className="text-[11px] text-neutral-500 font-mono">
            {material.uploaderName} · Verified Document
          </div>
        </div>

        {/* Reader Canvas Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-8 flex justify-center bg-neutral-200/70 dark:bg-neutral-950">
          <div
            style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: 'top center' }}
            className={`w-full max-w-3xl min-h-[650px] p-8 sm:p-12 rounded-xl shadow-lg border transition-all duration-150 ${
              isReaderDark
                ? 'bg-neutral-900 border-neutral-800 text-neutral-100'
                : 'bg-white border-neutral-200 text-neutral-900'
            }`}
          >
            {/* Note Sheet Header */}
            <div className="border-b pb-6 mb-6 border-neutral-200 dark:border-neutral-800">
              <div className="flex items-center justify-between text-xs text-neutral-500 font-mono mb-2">
                <span>
                  {material.subjectCode} · {material.branchName}
                </span>
                <span>
                  PAGE {currentPage.pageNumber} OF {pages.length}
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50">
                {currentPage.title}
              </h1>
              <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400 italic">
                {currentPage.summary}
              </p>
            </div>

            {/* Lecture Content Paragraphs */}
            <div className="space-y-3.5 text-sm sm:text-base leading-relaxed text-neutral-800 dark:text-neutral-200">
              {currentPage.content.map((para, idx) => (
                <p key={idx}>{para}</p>
              ))}
            </div>

            {/* Table Matrix if provided */}
            {currentPage.tableData && (
              <div className="my-6 overflow-x-auto rounded-lg border border-neutral-200 dark:border-neutral-800">
                <table className="w-full text-xs text-left">
                  <thead className="bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 font-semibold">
                    <tr>
                      {currentPage.tableData.headers.map((h, i) => (
                        <th key={i} className="px-3 py-2 border-b border-neutral-200 dark:border-neutral-700">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
                    {currentPage.tableData.rows.map((row, rIdx) => (
                      <tr key={rIdx} className="hover:bg-neutral-50 dark:hover:bg-neutral-800/40">
                        {row.map((cell, cIdx) => (
                          <td key={cIdx} className="px-3 py-2 font-mono text-neutral-600 dark:text-neutral-300">
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Code Snippet if provided */}
            {currentPage.codeSnippet && (
              <div className="my-6 rounded-xl overflow-hidden border border-neutral-800 bg-neutral-900 text-neutral-100 shadow-sm">
                <div className="flex items-center justify-between px-4 py-2 bg-neutral-950 border-b border-neutral-800 text-xs font-mono text-neutral-400">
                  <span>{currentPage.codeSnippet.language.toUpperCase()}</span>
                  <button
                    onClick={() => handleCopyCode(currentPage.codeSnippet!.code)}
                    className="flex items-center gap-1 hover:text-white transition-colors"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>{copiedCode ? 'Copied!' : 'Copy Code'}</span>
                  </button>
                </div>
                <pre className="p-4 text-xs font-mono overflow-x-auto text-emerald-400 leading-relaxed">
                  <code>{currentPage.codeSnippet.code}</code>
                </pre>
              </div>
            )}

            {/* Key Takeaways */}
            {currentPage.keyPoints && currentPage.keyPoints.length > 0 && (
              <div className="my-6 p-4 rounded-xl border border-indigo-200 dark:border-indigo-900/40 bg-indigo-50/50 dark:bg-indigo-950/20">
                <h4 className="text-xs font-bold text-indigo-900 dark:text-indigo-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                  Key Takeaways
                </h4>
                <ul className="space-y-1.5 text-xs text-neutral-700 dark:text-neutral-300">
                  {currentPage.keyPoints.map((kp, kIdx) => (
                    <li key={kIdx} className="flex items-start gap-2">
                      <span className="text-indigo-500 font-bold">•</span>
                      <span>{kp}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Exam Strategy Tip */}
            {currentPage.examTip && (
              <div className="my-6 p-4 rounded-xl border border-amber-200 dark:border-amber-900/40 bg-amber-50/60 dark:bg-amber-950/20">
                <div className="flex items-start gap-2.5">
                  <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <h5 className="text-xs font-bold text-amber-900 dark:text-amber-300 uppercase tracking-wider">
                      University Exam Strategy
                    </h5>
                    <p className="mt-1 text-xs text-neutral-700 dark:text-neutral-300 leading-relaxed">
                      {currentPage.examTip}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Sheet Footer */}
            <div className="mt-10 pt-4 border-t border-neutral-200 dark:border-neutral-800 flex items-center justify-between text-xs text-neutral-400 font-mono">
              <span>StudyVault Verified Notes</span>
              <span>Uploader: {material.uploaderName}</span>
            </div>
          </div>
        </div>

        {/* Bottom Pagination Bar */}
        <div className="flex items-center justify-between px-4 py-2.5 bg-white dark:bg-neutral-900 border-t border-neutral-200 dark:border-neutral-800 text-xs shrink-0">
          <div className="text-neutral-500 dark:text-neutral-400">
            Showing Page <span className="font-semibold">{currentPageIndex + 1}</span> of{' '}
            <span className="font-semibold">{pages.length}</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              disabled={currentPageIndex <= 0}
              onClick={() => setCurrentPageIndex((prev) => Math.max(0, prev - 1))}
              className="px-3 py-1.5 rounded-lg border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 disabled:opacity-40 disabled:cursor-not-allowed font-medium transition-colors"
            >
              Previous Page
            </button>
            <button
              disabled={currentPageIndex >= pages.length - 1}
              onClick={() => setCurrentPageIndex((prev) => Math.min(pages.length - 1, prev + 1))}
              className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white disabled:opacity-40 disabled:cursor-not-allowed font-medium transition-colors"
            >
              Next Page
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
