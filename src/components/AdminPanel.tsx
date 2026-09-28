import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { BRANCHES } from '../data/mockData';
import { BranchId, StudyMaterial } from '../types';
import { PdfViewerModal } from './PdfViewerModal';
import {
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Trash2,
  Eye,
  Plus,
  BookOpen,
  Users,
  Layers,
  Star,
  Download,
  AlertCircle,
  Search,
  Filter,
} from 'lucide-react';

export const AdminPanel: React.FC = () => {
  const {
    materials,
    subjects,
    user,
    switchRole,
    approveMaterial,
    rejectMaterial,
    deleteMaterial,
    toggleFeatured,
    addNewSubject,
    showToast,
    navigateTo,
  } = useApp();

  const [activeAdminTab, setActiveAdminTab] = useState<'queue' | 'materials' | 'subjects' | 'users'>('queue');
  const [previewMaterial, setPreviewMaterial] = useState<StudyMaterial | null>(null);

  // Reject modal state
  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');

  // Add subject modal state
  const [isAddSubjectOpen, setIsAddSubjectOpen] = useState(false);
  const [newSubjCode, setNewSubjCode] = useState('');
  const [newSubjName, setNewSubjName] = useState('');
  const [newSubjBranch, setNewSubjBranch] = useState<BranchId>('cse');
  const [newSubjSem, setNewSubjSem] = useState(5);
  const [newSubjYear, setNewSubjYear] = useState(3);
  const [newSubjUnits, setNewSubjUnits] = useState(5);
  const [newSubjDesc, setNewSubjDesc] = useState('');

  // Catalog search
  const [catalogSearch, setCatalogSearch] = useState('');
  const [catalogStatusFilter, setCatalogStatusFilter] = useState<'all' | 'approved' | 'pending' | 'rejected'>('all');

  // Pending queue
  const pendingMaterials = useMemo(() => {
    return materials.filter((m) => m.status === 'pending');
  }, [materials]);

  // Catalog materials
  const catalogMaterials = useMemo(() => {
    return materials.filter((m) => {
      const matchSearch =
        catalogSearch.trim() === '' ||
        m.title.toLowerCase().includes(catalogSearch.toLowerCase()) ||
        m.subjectName.toLowerCase().includes(catalogSearch.toLowerCase()) ||
        m.uploaderName.toLowerCase().includes(catalogSearch.toLowerCase());
      const matchStatus = catalogStatusFilter === 'all' || m.status === catalogStatusFilter;
      return matchSearch && matchStatus;
    });
  }, [materials, catalogSearch, catalogStatusFilter]);

  const handleConfirmReject = () => {
    if (!rejectingId) return;
    rejectMaterial(rejectingId, rejectionReason || 'Syllabus mismatch or quality resolution inadequate.');
    setRejectingId(null);
    setRejectionReason('');
  };

  const handleCreateSubject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubjCode || !newSubjName) {
      showToast('Validation Error', 'Subject code and name are required.', 'warning');
      return;
    }
    addNewSubject({
      code: newSubjCode.trim(),
      name: newSubjName.trim(),
      branchId: newSubjBranch,
      semester: newSubjSem,
      year: newSubjYear,
      unitsCount: newSubjUnits,
      description: newSubjDesc.trim() || 'Comprehensive course syllabus.',
    });
    setIsAddSubjectOpen(false);
    setNewSubjCode('');
    setNewSubjName('');
    setNewSubjDesc('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Banner with Admin Context */}
      <div className="p-6 sm:p-8 rounded-2xl border border-emerald-500/20 bg-gradient-to-r from-emerald-950/20 to-neutral-900/10 dark:from-emerald-950/40 dark:to-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400 mb-1">
            <ShieldCheck className="w-4 h-4" />
            <span>ACADEMIC MODERATION & GOVERNANCE</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50">
            StudyVault Admin Console
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 mt-1">
            Review peer submissions, manage university department catalogs, and oversee user permissions.
          </p>
        </div>

        {/* Admin status pill + quick role switcher */}
        <div className="flex items-center gap-3">
          <div className="text-right text-xs hidden sm:block">
            <p className="font-semibold text-neutral-900 dark:text-neutral-100">{user.name}</p>
            <p className="text-neutral-500">Role: {user.role === 'admin' ? 'Administrator' : 'Student'}</p>
          </div>
          {user.role !== 'admin' ? (
            <button
              onClick={() => switchRole('admin')}
              className="px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-sm transition-colors"
            >
              Switch to Admin Mode
            </button>
          ) : (
            <button
              onClick={() => switchRole('student')}
              className="px-4 py-2 text-xs font-semibold border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors text-neutral-700 dark:text-neutral-300"
            >
              Switch to Student View
            </button>
          )}
        </div>
      </div>

      {/* Admin Stat Overview */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
          <p className="text-xs font-medium text-neutral-500">Total Materials</p>
          <p className="mt-1 text-2xl font-bold font-mono tabular-nums text-neutral-900 dark:text-neutral-100">
            {materials.length}
          </p>
          <p className="mt-1 text-[11px] text-neutral-400">Approved & in review</p>
        </div>

        <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-neutral-500">Pending Review</p>
            {pendingMaterials.length > 0 && (
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
            )}
          </div>
          <p className="mt-1 text-2xl font-bold font-mono tabular-nums text-amber-500">
            {pendingMaterials.length}
          </p>
          <p className="mt-1 text-[11px] text-neutral-400">Awaiting faculty sign-off</p>
        </div>

        <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
          <p className="text-xs font-medium text-neutral-500">Curriculum Subjects</p>
          <p className="mt-1 text-2xl font-bold font-mono tabular-nums text-neutral-900 dark:text-neutral-100">
            {subjects.length}
          </p>
          <p className="mt-1 text-[11px] text-neutral-400">Across 5 departments</p>
        </div>

        <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
          <p className="text-xs font-medium text-neutral-500">Total Downloads</p>
          <p className="mt-1 text-2xl font-bold font-mono tabular-nums text-indigo-600 dark:text-indigo-400">
            {materials.reduce((acc, m) => acc + m.downloadsCount, 0).toLocaleString()}
          </p>
          <p className="mt-1 text-[11px] text-neutral-400">Protected student transfers</p>
        </div>
      </div>

      {/* Admin Segmented Tabs (Functional Buttons) */}
      <div className="flex items-center gap-2 p-1.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-100 dark:bg-neutral-900 max-w-xl">
        <button
          onClick={() => setActiveAdminTab('queue')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-semibold rounded-lg transition-all ${
            activeAdminTab === 'queue'
              ? 'bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white shadow-xs'
              : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900'
          }`}
        >
          <span>Approval Queue</span>
          {pendingMaterials.length > 0 && (
            <span className="font-mono text-[10px] px-1.5 py-0.2 bg-amber-500 text-white rounded-full">
              {pendingMaterials.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveAdminTab('materials')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-semibold rounded-lg transition-all ${
            activeAdminTab === 'materials'
              ? 'bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white shadow-xs'
              : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900'
          }`}
        >
          <span>Catalog Manager</span>
        </button>

        <button
          onClick={() => setActiveAdminTab('subjects')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-semibold rounded-lg transition-all ${
            activeAdminTab === 'subjects'
              ? 'bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white shadow-xs'
              : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900'
          }`}
        >
          <span>Subjects ({subjects.length})</span>
        </button>

        <button
          onClick={() => setActiveAdminTab('users')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-semibold rounded-lg transition-all ${
            activeAdminTab === 'users'
              ? 'bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white shadow-xs'
              : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900'
          }`}
        >
          <span>User Directory</span>
        </button>
      </div>

      {/* TAB 1: Approval Queue */}
      {activeAdminTab === 'queue' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-neutral-500">
            <span>
              Verify that uploaded documents adhere to university academic standards before approving.
            </span>
            <span className="font-mono tabular-nums">{pendingMaterials.length} pending items</span>
          </div>

          {pendingMaterials.length === 0 ? (
            <div className="py-16 text-center rounded-2xl border border-dashed border-neutral-300 dark:border-neutral-800 bg-white dark:bg-neutral-900 space-y-3">
              <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto" />
              <h3 className="text-base font-semibold text-neutral-900 dark:text-neutral-100">
                Moderation Queue is Clear!
              </h3>
              <p className="text-xs text-neutral-500 max-w-sm mx-auto">
                All submitted study notes have been reviewed. New student uploads will appear here in real-time.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {pendingMaterials.map((item) => (
                <div
                  key={item.id}
                  className="p-6 rounded-2xl border border-amber-300 dark:border-amber-900/60 bg-amber-50/20 dark:bg-amber-950/10 space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2 text-xs text-neutral-500 font-medium">
                        <span className="font-bold text-amber-600 dark:text-amber-400 uppercase">
                          {item.subjectCode}
                        </span>
                        <span aria-hidden="true">·</span>
                        <span>{item.branchName}</span>
                        <span aria-hidden="true">·</span>
                        <span>Sem {item.semester}</span>
                        <span aria-hidden="true">·</span>
                        <span>{item.unit === 'all' ? 'All Units' : `Unit ${item.unit}`}</span>
                        <span aria-hidden="true">·</span>
                        <span>{item.materialType.replace('_', ' ')}</span>
                      </div>

                      <h3 className="text-base sm:text-lg font-bold text-neutral-900 dark:text-neutral-100">
                        {item.title}
                      </h3>

                      <p className="text-xs text-neutral-600 dark:text-neutral-400">
                        {item.description}
                      </p>

                      <div className="pt-2 flex items-center gap-3 text-xs text-neutral-500 font-mono">
                        <span>Uploader: {item.uploaderName}</span>
                        <span>·</span>
                        <span>File: {item.fileName} ({item.fileSize})</span>
                        <span>·</span>
                        <span>Submitted: {item.uploadDate}</span>
                      </div>
                    </div>

                    {/* Actions: Preview, Approve, Reject */}
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => setPreviewMaterial(item)}
                        className="px-3 py-2 text-xs font-semibold rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 hover:bg-neutral-100 transition-colors flex items-center gap-1.5"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Preview Note</span>
                      </button>

                      <button
                        onClick={() => approveMaterial(item.id)}
                        className="px-3.5 py-2 text-xs font-semibold rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Approve</span>
                      </button>

                      <button
                        onClick={() => setRejectingId(item.id)}
                        className="px-3.5 py-2 text-xs font-semibold rounded-lg bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-900/40 transition-colors flex items-center gap-1.5 cursor-pointer"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        <span>Reject</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: Catalog Manager */}
      {activeAdminTab === 'materials' && (
        <div className="space-y-4">
          {/* Search & Filter Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
              <input
                type="text"
                value={catalogSearch}
                onChange={(e) => setCatalogSearch(e.target.value)}
                placeholder="Search catalog notes or uploader..."
                className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-none"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <span className="text-xs text-neutral-500 whitespace-nowrap">Filter Status:</span>
              <select
                value={catalogStatusFilter}
                onChange={(e) => setCatalogStatusFilter(e.target.value as any)}
                className="p-2 text-xs rounded-lg border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-none"
              >
                <option value="all">All Statuses ({materials.length})</option>
                <option value="approved">Approved</option>
                <option value="pending">Pending</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </div>

          {/* Table of Materials */}
          <div className="overflow-x-auto rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-xs">
            <table className="w-full text-left text-xs">
              <thead className="bg-neutral-50 dark:bg-neutral-800/60 border-b border-neutral-200 dark:border-neutral-800 text-neutral-500 font-semibold">
                <tr>
                  <th className="px-4 py-3">Material Title</th>
                  <th className="px-4 py-3">Branch / Sem</th>
                  <th className="px-4 py-3">Uploader</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Downloads</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
                {catalogMaterials.map((mat) => (
                  <tr key={mat.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-800/30">
                    <td className="px-4 py-3 max-w-xs">
                      <p className="font-semibold text-neutral-900 dark:text-neutral-100 truncate">
                        {mat.title}
                      </p>
                      <p className="text-[11px] text-neutral-500 font-mono">
                        {mat.subjectCode} · {mat.fileName}
                      </p>
                    </td>

                    <td className="px-4 py-3 text-neutral-600 dark:text-neutral-300">
                      {mat.branchId.toUpperCase()} · Sem {mat.semester}
                    </td>

                    <td className="px-4 py-3 text-neutral-600 dark:text-neutral-300">
                      {mat.uploaderName}
                    </td>

                    <td className="px-4 py-3">
                      <span
                        className={`text-[11px] font-semibold px-2 py-0.5 rounded-md ${
                          mat.status === 'approved'
                            ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400'
                            : mat.status === 'pending'
                            ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400'
                            : 'bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-400'
                        }`}
                      >
                        {mat.status.toUpperCase()}
                      </span>
                    </td>

                    <td className="px-4 py-3 font-mono tabular-nums text-neutral-600 dark:text-neutral-400">
                      {mat.downloadsCount.toLocaleString()}
                    </td>

                    <td className="px-4 py-3 text-right space-x-2">
                      <button
                        onClick={() => toggleFeatured(mat.id)}
                        className={`p-1.5 rounded hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors ${
                          mat.isFeatured ? 'text-amber-500' : 'text-neutral-400'
                        }`}
                        title={mat.isFeatured ? 'Featured on Homepage' : 'Pin to Homepage'}
                      >
                        <Star className={`w-3.5 h-3.5 ${mat.isFeatured ? 'fill-amber-400' : ''}`} />
                      </button>

                      <button
                        onClick={() => setPreviewMaterial(mat)}
                        className="p-1.5 text-neutral-500 hover:text-indigo-600 rounded hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                        title="Preview"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => deleteMaterial(mat.id)}
                        className="p-1.5 text-neutral-400 hover:text-rose-600 rounded hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                        title="Delete material"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: Subjects & Curriculum Management */}
      {activeAdminTab === 'subjects' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-xs text-neutral-500">
              Manage university course units, semester allocations, and curriculum metadata.
            </p>
            <button
              onClick={() => setIsAddSubjectOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add New Subject</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {subjects.map((s) => (
              <div
                key={s.id}
                className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 font-mono">
                    {s.code}
                  </span>
                  <span className="text-[11px] text-neutral-500">
                    {s.branchId.toUpperCase()} · Sem {s.semester}
                  </span>
                </div>
                <h4 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                  {s.name}
                </h4>
                <p className="text-xs text-neutral-500 line-clamp-2">{s.description}</p>
                <div className="pt-2 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between text-xs text-neutral-400">
                  <span>{s.unitsCount} Units in Syllabus</span>
                  <span className="font-mono tabular-nums">
                    {materials.filter((m) => m.subjectId === s.id).length} Materials
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: User Directory */}
      {activeAdminTab === 'users' && (
        <div className="p-6 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
              Active Registered Students & Moderators
            </h3>
            <span className="text-xs text-neutral-500 font-mono">Role-Based Access Control</span>
          </div>

          <div className="divide-y divide-neutral-100 dark:divide-neutral-800 text-xs">
            <div className="py-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img
                  src="https://api.dicebear.com/7.x/avataaars/svg?seed=RajeshSharma"
                  alt="Dr. Rajesh Sharma"
                  className="w-8 h-8 rounded-full bg-neutral-200"
                />
                <div>
                  <p className="font-semibold text-neutral-900 dark:text-neutral-100">
                    Dr. Rajesh Sharma (You)
                  </p>
                  <p className="text-neutral-500">rajesh.sharma@studyvault.college.edu</p>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400">
                Super Administrator
              </span>
            </div>

            <div className="py-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img
                  src="https://api.dicebear.com/7.x/avataaars/svg?seed=VikramAditya"
                  alt="Vikram Aditya"
                  className="w-8 h-8 rounded-full bg-neutral-200"
                />
                <div>
                  <p className="font-semibold text-neutral-900 dark:text-neutral-100">
                    Vikram Aditya
                  </p>
                  <p className="text-neutral-500">vikram.aditya@college.edu (CSE Year 3)</p>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300">
                Verified Student
              </span>
            </div>

            <div className="py-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img
                  src="https://api.dicebear.com/7.x/avataaars/svg?seed=Ananya"
                  alt="Ananya Deshmukh"
                  className="w-8 h-8 rounded-full bg-neutral-200"
                />
                <div>
                  <p className="font-semibold text-neutral-900 dark:text-neutral-100">
                    Ananya Deshmukh
                  </p>
                  <p className="text-neutral-500">ananya.deshmukh@college.edu (Dept Rank 2)</p>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-400">
                Peer Contributor
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {rejectingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-md p-6 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xl space-y-4">
            <h3 className="text-base font-bold text-neutral-900 dark:text-neutral-100">
              Provide Reason for Rejection
            </h3>
            <p className="text-xs text-neutral-500">
              The student will receive this feedback in their upload dashboard to help them re-submit a compliant version.
            </p>
            <textarea
              rows={3}
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="e.g. Missing Unit 4 proofs; Please re-scan with higher resolution..."
              className="w-full p-2.5 text-xs rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-none"
            />
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setRejectingId(null)}
                className="px-3 py-1.5 text-xs text-neutral-600 dark:text-neutral-400 hover:text-neutral-900"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmReject}
                className="px-4 py-1.5 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-lg transition-colors"
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Subject Modal */}
      {isAddSubjectOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <form
            onSubmit={handleCreateSubject}
            className="w-full max-w-md p-6 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xl space-y-4"
          >
            <h3 className="text-base font-bold text-neutral-900 dark:text-neutral-100">
              Add New University Subject
            </h3>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block text-neutral-600 dark:text-neutral-400 mb-1">
                  Subject Code
                </label>
                <input
                  type="text"
                  required
                  value={newSubjCode}
                  onChange={(e) => setNewSubjCode(e.target.value)}
                  placeholder="e.g. CS-504"
                  className="w-full p-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100"
                />
              </div>

              <div>
                <label className="block text-neutral-600 dark:text-neutral-400 mb-1">
                  Branch
                </label>
                <select
                  value={newSubjBranch}
                  onChange={(e) => setNewSubjBranch(e.target.value as BranchId)}
                  className="w-full p-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100"
                >
                  {BRANCHES.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.code}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="text-xs">
              <label className="block text-neutral-600 dark:text-neutral-400 mb-1">
                Course Name
              </label>
              <input
                type="text"
                required
                value={newSubjName}
                onChange={(e) => setNewSubjName(e.target.value)}
                placeholder="e.g. Distributed Cloud Computing"
                className="w-full p-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100"
              />
            </div>

            <div className="grid grid-cols-3 gap-2 text-xs">
              <div>
                <label className="block text-neutral-600 dark:text-neutral-400 mb-1">
                  Semester
                </label>
                <select
                  value={newSubjSem}
                  onChange={(e) => setNewSubjSem(Number(e.target.value))}
                  className="w-full p-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100"
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                    <option key={sem} value={sem}>
                      Sem {sem}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-neutral-600 dark:text-neutral-400 mb-1">
                  Year
                </label>
                <select
                  value={newSubjYear}
                  onChange={(e) => setNewSubjYear(Number(e.target.value))}
                  className="w-full p-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100"
                >
                  {[1, 2, 3, 4].map((yr) => (
                    <option key={yr} value={yr}>
                      Year {yr}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-neutral-600 dark:text-neutral-400 mb-1">
                  Units
                </label>
                <input
                  type="number"
                  min={1}
                  max={10}
                  value={newSubjUnits}
                  onChange={(e) => setNewSubjUnits(Number(e.target.value))}
                  className="w-full p-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100"
                />
              </div>
            </div>

            <div className="text-xs">
              <label className="block text-neutral-600 dark:text-neutral-400 mb-1">
                Syllabus Scope Description
              </label>
              <textarea
                rows={2}
                value={newSubjDesc}
                onChange={(e) => setNewSubjDesc(e.target.value)}
                placeholder="Brief course objectives..."
                className="w-full p-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsAddSubjectOpen(false)}
                className="px-3 py-1.5 text-xs text-neutral-600 dark:text-neutral-400 hover:text-neutral-900"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors"
              >
                Save Subject
              </button>
            </div>
          </form>
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
