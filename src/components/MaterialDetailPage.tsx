import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { MaterialCard } from './MaterialCard';
import { PdfViewerModal } from './PdfViewerModal';
import {
  FileText,
  Download,
  Bookmark,
  Star,
  Eye,
  Calendar,
  Layers,
  ArrowLeft,
  Share2,
  CheckCircle2,
  Shield,
  MessageSquare,
  Sparkles,
} from 'lucide-react';

export const MaterialDetailPage: React.FC = () => {
  const {
    selectedMaterialId,
    materials,
    reviews,
    addReview,
    downloadMaterial,
    toggleBookmark,
    isBookmarked,
    navigateTo,
    showToast,
  } = useApp();

  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const [userRating, setUserRating] = useState(5);
  const [commentText, setCommentText] = useState('');
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  const material = useMemo(() => {
    return materials.find((m) => m.id === selectedMaterialId) || materials[0];
  }, [materials, selectedMaterialId]);

  const bookmarked = isBookmarked(material.id);

  // Reviews for this material
  const materialReviews = useMemo(() => {
    return reviews.filter((r) => r.materialId === material.id);
  }, [reviews, material.id]);

  // Related materials
  const relatedMaterials = useMemo(() => {
    return materials
      .filter(
        (m) =>
          m.id !== material.id &&
          m.status === 'approved' &&
          (m.subjectId === material.subjectId || m.branchId === material.branchId)
      )
      .slice(0, 3);
  }, [materials, material]);

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) {
      showToast('Review Required', 'Please enter your thoughts before submitting.', 'warning');
      return;
    }
    setIsSubmittingReview(true);
    addReview(material.id, userRating, commentText.trim());
    setCommentText('');
    setIsSubmittingReview(false);
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    showToast('Link Copied', 'Material link copied to clipboard.', 'info');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Back button & Breadcrumb */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigateTo('browse')}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Notes Directory</span>
        </button>

        <button
          onClick={handleShare}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
        >
          <Share2 className="w-3.5 h-3.5" />
          <span>Share Note</span>
        </button>
      </div>

      {/* Main Material Header Card */}
      <div className="p-6 sm:p-8 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-sm">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Details & Metadata */}
          <div className="lg:col-span-8 space-y-4">
            {/* Unboxed Metadata Line */}
            <div className="flex flex-wrap items-center gap-2 text-xs text-neutral-500 dark:text-neutral-400 font-medium">
              <span className="text-indigo-600 dark:text-indigo-400 font-bold uppercase tracking-wider">
                {material.subjectCode}
              </span>
              <span aria-hidden="true">·</span>
              <span>{material.branchName}</span>
              <span aria-hidden="true">·</span>
              <span>Semester {material.semester}</span>
              <span aria-hidden="true">·</span>
              <span>{material.unit === 'all' ? 'All Units' : `Unit ${material.unit}`}</span>
              <span aria-hidden="true">·</span>
              <span className="capitalize">{material.materialType.replace('_', ' ')}</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50 leading-tight">
              {material.title}
            </h1>

            <p className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
              Subject: {material.subjectName}
            </p>

            <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
              {material.description}
            </p>

            {/* Tags (Unboxed text with dots) */}
            <div className="flex flex-wrap items-center gap-2 pt-2 text-xs text-neutral-400">
              <span className="font-semibold text-neutral-500">Tags:</span>
              {material.tags.map((tag, idx) => (
                <span key={tag} className="text-indigo-600 dark:text-indigo-400">
                  #{tag}
                  {idx < material.tags.length - 1 && (
                    <span aria-hidden="true" className="text-neutral-300 dark:text-neutral-700 ml-1.5">
                      ·
                    </span>
                  )}
                </span>
              ))}
            </div>

            {/* Uploader Card */}
            <div className="pt-4 border-t border-neutral-100 dark:border-neutral-800 flex items-center gap-3">
              <img
                src={
                  material.uploaderAvatar ||
                  'https://api.dicebear.com/7.x/avataaars/svg?seed=Uploader'
                }
                alt={material.uploaderName}
                referrerPolicy="no-referrer"
                className="w-10 h-10 rounded-full bg-neutral-200 dark:bg-neutral-800 object-cover"
              />
              <div>
                <div className="flex items-center gap-1.5 text-xs font-semibold text-neutral-900 dark:text-neutral-100">
                  <span>{material.uploaderName}</span>
                  <CheckCircle2 className="w-3.5 h-3.5 text-indigo-500" />
                </div>
                <p className="text-[11px] text-neutral-500">{material.uploaderRole}</p>
              </div>
            </div>
          </div>

          {/* Right Column: Actions & File Specs Box */}
          <div className="lg:col-span-4 p-5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800/40 space-y-4">
            <div className="flex items-center justify-between text-xs text-neutral-500">
              <span>File Details</span>
              <span className="uppercase font-mono font-bold text-neutral-700 dark:text-neutral-300">
                {material.fileExtension}
              </span>
            </div>

            {/* File Metrics List */}
            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-neutral-200 dark:border-neutral-700/60">
                <span className="text-neutral-500">File Size:</span>
                <span className="font-mono tabular-nums font-semibold text-neutral-800 dark:text-neutral-200">
                  {material.fileSize}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-neutral-200 dark:border-neutral-700/60">
                <span className="text-neutral-500">Pages:</span>
                <span className="font-mono tabular-nums font-semibold text-neutral-800 dark:text-neutral-200">
                  {material.pageCount} Pages
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-neutral-200 dark:border-neutral-700/60">
                <span className="text-neutral-500">Upload Date:</span>
                <span className="font-mono tabular-nums text-neutral-800 dark:text-neutral-200">
                  {material.uploadDate}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-neutral-200 dark:border-neutral-700/60">
                <span className="text-neutral-500">Downloads:</span>
                <span className="font-mono tabular-nums text-neutral-800 dark:text-neutral-200">
                  {material.downloadsCount.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-neutral-500">Student Rating:</span>
                <div className="flex items-center gap-1 font-mono tabular-nums font-bold text-amber-500">
                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                  <span>{material.rating.toFixed(1)}</span>
                  <span className="text-[11px] text-neutral-400">({material.reviewsCount})</span>
                </div>
              </div>
            </div>

            {/* Primary Action Buttons */}
            <div className="space-y-2 pt-2">
              <button
                onClick={() => setIsViewerOpen(true)}
                className="w-full py-2.5 px-4 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 rounded-lg shadow-sm transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <Eye className="w-4 h-4" />
                <span>Read & Preview Online</span>
              </button>

              <button
                onClick={() => downloadMaterial(material)}
                className="w-full py-2.5 px-4 text-xs font-semibold text-neutral-900 dark:text-neutral-100 bg-white dark:bg-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-700 border border-neutral-300 dark:border-neutral-700 rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs"
              >
                <Download className="w-4 h-4 text-neutral-500" />
                <span>Download Study Material ({material.fileSize})</span>
              </button>

              <button
                onClick={() => toggleBookmark(material.id)}
                className={`w-full py-2 px-4 text-xs font-medium rounded-lg border transition-colors flex items-center justify-center gap-2 ${
                  bookmarked
                    ? 'border-amber-400 text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/30'
                    : 'border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800'
                }`}
              >
                <Bookmark className={`w-3.5 h-3.5 ${bookmarked ? 'fill-amber-500' : ''}`} />
                <span>{bookmarked ? 'Bookmarked in My Vault' : 'Save to My Vault'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Quick In-Page Document Preview Snippet */}
      <div className="p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-indigo-500" />
            <h3 className="text-base font-bold text-neutral-900 dark:text-neutral-100">
              Document Preview (Page 1 of {material.pages?.length || 1})
            </h3>
          </div>
          <button
            onClick={() => setIsViewerOpen(true)}
            className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
          >
            <span>Open Interactive Viewer</span>
            <Eye className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Rendered Preview Page */}
        <div className="p-5 sm:p-6 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950/60 font-sans space-y-3">
          <h4 className="text-base font-bold text-neutral-900 dark:text-neutral-100">
            {material.pages?.[0]?.title || material.title}
          </h4>
          <p className="text-xs text-neutral-600 dark:text-neutral-400 italic">
            {material.pages?.[0]?.summary || material.description}
          </p>
          <div className="space-y-2 text-xs sm:text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed">
            {material.pages?.[0]?.content?.slice(0, 3).map((line, lIdx) => (
              <p key={lIdx}>{line}</p>
            ))}
          </div>

          <div className="pt-3">
            <button
              onClick={() => setIsViewerOpen(true)}
              className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              + Click here to view all {material.pages?.length || 1} pages with exam formulas & diagrams...
            </button>
          </div>
        </div>
      </div>

      {/* Student Peer Reviews & Rating Submission */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Reviews List */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-indigo-500" />
              <span>Student Reviews & Feedback ({materialReviews.length})</span>
            </h3>
            <div className="flex items-center gap-1 text-xs font-mono font-bold text-amber-500">
              <Star className="w-4 h-4 fill-amber-400" />
              <span>{material.rating.toFixed(1)} / 5.0</span>
            </div>
          </div>

          {materialReviews.length === 0 ? (
            <div className="p-6 text-center rounded-xl border border-dashed border-neutral-300 dark:border-neutral-800 text-xs text-neutral-500">
              No reviews submitted yet. Be the first student to review these notes!
            </div>
          ) : (
            <div className="space-y-3">
              {materialReviews.map((rev) => (
                <div
                  key={rev.id}
                  className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <img
                        src={rev.authorAvatar}
                        alt={rev.authorName}
                        referrerPolicy="no-referrer"
                        className="w-6 h-6 rounded-full bg-neutral-200 dark:bg-neutral-800 object-cover"
                      />
                      <span className="text-xs font-semibold text-neutral-900 dark:text-neutral-100">
                        {rev.authorName}
                      </span>
                      <span className="text-[11px] text-neutral-400">
                        ({rev.branch} · Sem {rev.semester})
                      </span>
                    </div>

                    <div className="flex items-center gap-0.5 text-amber-500">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3 h-3 ${
                            i < rev.rating ? 'fill-amber-400' : 'text-neutral-300 dark:text-neutral-700'
                          }`}
                        />
                      ))}
                    </div>
                  </div>

                  <p className="text-xs text-neutral-600 dark:text-neutral-300 leading-relaxed">
                    "{rev.comment}"
                  </p>

                  <div className="text-[10px] text-neutral-400 font-mono">{rev.createdAt}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Submit Review Box */}
        <div className="lg:col-span-5 p-5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-sm space-y-3">
          <h4 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
            Rate & Review this Note
          </h4>
          <p className="text-xs text-neutral-500">
            Help your fellow batchmates identify the most accurate and syllabus-relevant study materials.
          </p>

          <form onSubmit={handleReviewSubmit} className="space-y-3 pt-2">
            <div>
              <label className="block text-xs font-medium text-neutral-600 dark:text-neutral-300 mb-1">
                Your Star Rating:
              </label>
              <div className="flex items-center gap-1.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    type="button"
                    key={star}
                    onClick={() => setUserRating(star)}
                    className="p-1 hover:scale-110 transition-transform focus:outline-none"
                  >
                    <Star
                      className={`w-5 h-5 ${
                        star <= userRating
                          ? 'text-amber-500 fill-amber-400'
                          : 'text-neutral-300 dark:text-neutral-700'
                      }`}
                    />
                  </button>
                ))}
                <span className="ml-2 text-xs font-mono font-semibold text-neutral-600 dark:text-neutral-300">
                  {userRating} / 5 Stars
                </span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-600 dark:text-neutral-300 mb-1">
                Feedback & Exam Relevance:
              </label>
              <textarea
                rows={3}
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Mention whether diagrams, algorithms, or question paper answers were helpful..."
                className="w-full p-2.5 text-xs rounded-lg border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmittingReview}
              className="w-full py-2 px-3 text-xs font-semibold text-white bg-neutral-900 hover:bg-neutral-800 dark:bg-neutral-100 dark:text-neutral-900 rounded-lg transition-colors cursor-pointer"
            >
              Post Review
            </button>
          </form>
        </div>
      </div>

      {/* Related Study Materials */}
      {relatedMaterials.length > 0 && (
        <div className="pt-6 border-t border-neutral-200 dark:border-neutral-800 space-y-4">
          <h3 className="text-lg font-bold text-neutral-900 dark:text-neutral-100">
            Related Study Materials in this Department
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {relatedMaterials.map((rel) => (
              <MaterialCard key={rel.id} material={rel} />
            ))}
          </div>
        </div>
      )}

      {/* Online PDF Viewer Modal */}
      <PdfViewerModal
        material={material}
        isOpen={isViewerOpen}
        onClose={() => setIsViewerOpen(false)}
      />
    </div>
  );
};
