import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { MaterialCard } from './MaterialCard';
import { PdfViewerModal } from './PdfViewerModal';
import { StudyMaterial } from '../types';
import {
  Bookmark,
  UploadCloud,
  Clock,
  Download,
  Eye,
  CheckCircle2,
  AlertCircle,
  FileText,
  User,
  ExternalLink,
} from 'lucide-react';

export const UserVaultView: React.FC = () => {
  const { user, materials, downloadMaterial, navigateTo, toggleBookmark } = useApp();
  const [activeTab, setActiveTab] = useState<'saved' | 'uploads' | 'downloads'>('saved');
  const [previewMaterial, setPreviewMaterial] = useState<StudyMaterial | null>(null);

  // User's bookmarked materials
  const savedMaterials = useMemo(() => {
    return materials.filter((m) => user.bookmarks.includes(m.id));
  }, [materials, user.bookmarks]);

  // Materials uploaded by this user
  const userUploads = useMemo(() => {
    return materials.filter((m) => m.uploaderId === user.id || m.uploaderName === user.name);
  }, [materials, user.id, user.name]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Student Profile Card */}
      <div className="p-6 sm:p-8 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <img
            src={user.avatar}
            alt={user.name}
            referrerPolicy="no-referrer"
            className="w-16 h-16 rounded-full bg-neutral-200 dark:bg-neutral-800 object-cover border-2 border-indigo-500/20"
          />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50">
                {user.name}
              </h1>
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-400">
                {user.role === 'admin' ? 'Faculty Admin' : 'Verified Student'}
              </span>
            </div>
            <p className="text-xs text-neutral-500 mt-0.5">{user.email}</p>
            {/* Unboxed Metadata Line */}
            <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-neutral-500 dark:text-neutral-400">
              <span className="font-semibold text-neutral-800 dark:text-neutral-200">
                {user.branchId.toUpperCase()} Department
              </span>
              <span aria-hidden="true">·</span>
              <span>Year {user.year}</span>
              <span aria-hidden="true">·</span>
              <span>Semester {user.semester}</span>
              <span aria-hidden="true">·</span>
              <span>Joined {user.joinedDate}</span>
            </div>
          </div>
        </div>

        {/* Upload new note shortcut */}
        <button
          onClick={() => navigateTo('upload')}
          className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 rounded-lg shadow-sm transition-colors whitespace-nowrap"
        >
          <UploadCloud className="w-4 h-4" />
          <span>Upload New Note</span>
        </button>
      </div>

      {/* Tabs Navigation (Functional Segmented Control) */}
      <div className="flex items-center gap-2 p-1.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-100 dark:bg-neutral-900 max-w-md">
        <button
          onClick={() => setActiveTab('saved')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-semibold rounded-lg transition-all ${
            activeTab === 'saved'
              ? 'bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white shadow-xs'
              : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900'
          }`}
        >
          <Bookmark className="w-3.5 h-3.5" />
          <span>Saved Notes ({savedMaterials.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('uploads')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-semibold rounded-lg transition-all ${
            activeTab === 'uploads'
              ? 'bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white shadow-xs'
              : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900'
          }`}
        >
          <UploadCloud className="w-3.5 h-3.5" />
          <span>My Uploads ({userUploads.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('downloads')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-semibold rounded-lg transition-all ${
            activeTab === 'downloads'
              ? 'bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white shadow-xs'
              : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900'
          }`}
        >
          <Clock className="w-3.5 h-3.5" />
          <span>History ({user.downloads.length})</span>
        </button>
      </div>

      {/* Tab 1: Bookmarked Saved Notes */}
      {activeTab === 'saved' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-neutral-500">
            <span>
              All study materials saved to your personal vault for fast offline reference.
            </span>
            <span className="font-mono tabular-nums">{savedMaterials.length} items</span>
          </div>

          {savedMaterials.length === 0 ? (
            <div className="py-16 text-center rounded-2xl border border-dashed border-neutral-300 dark:border-neutral-800 bg-white dark:bg-neutral-900 space-y-3">
              <Bookmark className="w-8 h-8 text-neutral-400 mx-auto" />
              <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                Your Saved Vault is Empty
              </h3>
              <p className="text-xs text-neutral-500 max-w-sm mx-auto">
                Click the bookmark icon on any lecture note, PYQ paper, or lab manual to keep it handy here.
              </p>
              <button
                onClick={() => navigateTo('browse')}
                className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Browse Study Materials
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {savedMaterials.map((material) => (
                <MaterialCard
                  key={material.id}
                  material={material}
                  onPreviewClick={() => setPreviewMaterial(material)}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Student Uploads & Review Status */}
      {activeTab === 'uploads' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-neutral-500">
            <span>
              Track the moderation review status and student reach of your contributions.
            </span>
            <span className="font-mono tabular-nums">{userUploads.length} uploads</span>
          </div>

          {userUploads.length === 0 ? (
            <div className="py-16 text-center rounded-2xl border border-dashed border-neutral-300 dark:border-neutral-800 bg-white dark:bg-neutral-900 space-y-3">
              <UploadCloud className="w-8 h-8 text-neutral-400 mx-auto" />
              <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                No Notes Uploaded Yet
              </h3>
              <p className="text-xs text-neutral-500 max-w-sm mx-auto">
                Share your semester lecture notes, formulas, or question papers to help your peers.
              </p>
              <button
                onClick={() => navigateTo('upload')}
                className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Upload First Material
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {userUploads.map((up) => {
                let statusBadge = (
                  <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Approved & Live</span>
                  </span>
                );

                if (up.status === 'pending') {
                  statusBadge = (
                    <span className="text-xs font-semibold text-amber-600 dark:text-amber-400 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      <span>Pending Faculty Review</span>
                    </span>
                  );
                } else if (up.status === 'rejected') {
                  statusBadge = (
                    <span className="text-xs font-semibold text-rose-600 dark:text-rose-400 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" />
                      <span>Revision Required</span>
                    </span>
                  );
                }

                return (
                  <div
                    key={up.id}
                    className="p-5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center gap-2">
                        {statusBadge}
                        <span aria-hidden="true" className="text-neutral-300 dark:text-neutral-700">·</span>
                        <span className="text-xs text-neutral-500 font-mono">Uploaded {up.uploadDate}</span>
                      </div>

                      <h3
                        onClick={() => navigateTo('material-detail', { materialId: up.id })}
                        className="text-sm sm:text-base font-semibold text-neutral-900 dark:text-neutral-100 hover:text-indigo-600 cursor-pointer truncate"
                      >
                        {up.title}
                      </h3>

                      <p className="text-xs text-neutral-500">
                        {up.subjectCode} · {up.subjectName} · {up.unit === 'all' ? 'All Units' : `Unit ${up.unit}`} · {up.fileSize}
                      </p>

                      {up.status === 'rejected' && up.rejectionReason && (
                        <p className="text-xs text-rose-500 bg-rose-50 dark:bg-rose-950/40 p-2 rounded-lg mt-2">
                          Moderator Note: {up.rejectionReason}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <div className="text-right text-xs hidden sm:block">
                        <p className="font-mono tabular-nums font-bold text-neutral-900 dark:text-neutral-100">
                          {up.downloadsCount}
                        </p>
                        <p className="text-[11px] text-neutral-400">Downloads</p>
                      </div>

                      <button
                        onClick={() => setPreviewMaterial(up)}
                        className="p-2 rounded-lg border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300 transition-colors"
                        title="Preview uploaded note"
                      >
                        <Eye className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => downloadMaterial(up)}
                        className="p-2 rounded-lg bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 hover:bg-neutral-800 transition-colors"
                        title="Download file"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Download History */}
      {activeTab === 'downloads' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-neutral-500">
            <span>Audit record of materials downloaded to your computer.</span>
            <span className="font-mono tabular-nums">{user.downloads.length} downloads</span>
          </div>

          {user.downloads.length === 0 ? (
            <div className="py-16 text-center rounded-2xl border border-dashed border-neutral-300 dark:border-neutral-800 bg-white dark:bg-neutral-900 space-y-3">
              <Download className="w-8 h-8 text-neutral-400 mx-auto" />
              <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                No Download History
              </h3>
              <p className="text-xs text-neutral-500 max-w-sm mx-auto">
                Any materials you download will be logged here for convenient re-downloading anytime.
              </p>
              <button
                onClick={() => navigateTo('browse')}
                className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Explore Materials
              </button>
            </div>
          ) : (
            <div className="overflow-hidden rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-xs">
              <table className="w-full text-left text-xs">
                <thead className="bg-neutral-50 dark:bg-neutral-800/60 border-b border-neutral-200 dark:border-neutral-800 text-neutral-500 font-semibold">
                  <tr>
                    <th className="px-4 py-3">Material Document</th>
                    <th className="px-4 py-3 hidden sm:table-cell">Subject</th>
                    <th className="px-4 py-3">File Size</th>
                    <th className="px-4 py-3">Downloaded At</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800/80">
                  {user.downloads.map((dl) => {
                    const targetMaterial = materials.find((m) => m.id === dl.materialId);

                    return (
                      <tr key={dl.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-800/30">
                        <td className="px-4 py-3 font-medium text-neutral-900 dark:text-neutral-100 max-w-xs truncate">
                          {dl.title}
                        </td>
                        <td className="px-4 py-3 text-neutral-500 hidden sm:table-cell truncate">
                          {dl.subjectName}
                        </td>
                        <td className="px-4 py-3 font-mono tabular-nums text-neutral-600 dark:text-neutral-400">
                          {dl.fileSize}
                        </td>
                        <td className="px-4 py-3 font-mono text-neutral-500">
                          {dl.downloadedAt}
                        </td>
                        <td className="px-4 py-3 text-right">
                          {targetMaterial ? (
                            <button
                              onClick={() => downloadMaterial(targetMaterial)}
                              className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
                            >
                              <Download className="w-3.5 h-3.5" />
                              <span>Re-download</span>
                            </button>
                          ) : (
                            <span className="text-neutral-400">Archived</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* PDF Modal if active */}
      {previewMaterial && (
        <PdfViewerModal
          material={previewMaterial}
          isOpen={true}
          onClose={() => setPreviewMaterial(null)}
        />
      )}
    </div>
  );
};
