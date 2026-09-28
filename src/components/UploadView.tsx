import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { BRANCHES } from '../data/mockData';
import { BranchId, MaterialType, NotePage } from '../types';
import {
  UploadCloud,
  FileText,
  CheckCircle2,
  AlertCircle,
  X,
  FileCheck,
  ShieldAlert,
  Sparkles,
} from 'lucide-react';

export const UploadView: React.FC = () => {
  const { user, subjects, submitUpload, showToast, navigateTo } = useApp();

  const [title, setTitle] = useState('');
  const [branchId, setBranchId] = useState<BranchId>(user.branchId || 'cse');
  const [semester, setSemester] = useState<number>(user.semester || 4);
  const [year, setYear] = useState<number>(user.year || 2);
  const [subjectId, setSubjectId] = useState<string>('cs401');
  const [unit, setUnit] = useState<number | 'all'>(1);
  const [materialType, setMaterialType] = useState<MaterialType>('lecture_notes');
  const [description, setDescription] = useState('');
  const [tagsInput, setTagsInput] = useState('');

  // File upload state
  const [uploadedFile, setUploadedFile] = useState<{
    name: string;
    size: string;
    extension: 'pdf' | 'pptx' | 'docx' | 'zip';
    bytes: number;
  } | null>(null);

  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  // Available subjects for selected branch & semester
  const availableSubjects = subjects.filter(
    (s) => s.branchId === branchId && (semester === 0 || s.semester === semester)
  );

  const MAX_FILE_SIZE_BYTES = 25 * 1024 * 1024; // 25 MB
  const ALLOWED_EXTENSIONS = ['pdf', 'ppt', 'pptx', 'docx', 'zip'];

  const validateAndSetFile = (file: File) => {
    setValidationError(null);

    // Check size
    if (file.size > MAX_FILE_SIZE_BYTES) {
      setValidationError('File size exceeds the 25 MB maximum upload limit.');
      showToast('File Too Large', 'Maximum file size allowed is 25 MB.', 'error');
      return;
    }

    // Check extension
    const ext = file.name.split('.').pop()?.toLowerCase();
    if (!ext || !ALLOWED_EXTENSIONS.includes(ext)) {
      setValidationError('Invalid file format. Please upload a PDF, PPT, PPTX, DOCX, or ZIP file.');
      showToast('Unsupported Format', 'Please upload PDF or presentation documents.', 'error');
      return;
    }

    const formattedSize = (file.size / (1024 * 1024)).toFixed(1) + ' MB';
    const normalizedExt = (ext === 'ppt' ? 'pptx' : ext) as 'pdf' | 'pptx' | 'docx' | 'zip';

    // Simulate upload progress
    setIsUploading(true);
    setUploadProgress(15);
    const interval = setInterval(() => {
      setUploadProgress((p) => {
        if (p >= 100) {
          clearInterval(interval);
          setIsUploading(false);
          setUploadedFile({
            name: file.name,
            size: formattedSize,
            extension: normalizedExt,
            bytes: file.size,
          });
          showToast('File Verified', `${file.name} passed security scanning.`, 'success');
          return 100;
        }
        return p + 25;
      });
    }, 150);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      showToast('Title Missing', 'Please enter a descriptive title for your note.', 'warning');
      return;
    }

    if (!description.trim()) {
      showToast('Description Missing', 'Please enter a brief syllabus description.', 'warning');
      return;
    }

    if (!uploadedFile) {
      showToast('File Required', 'Please choose a document file to upload.', 'warning');
      return;
    }

    // Lookup chosen branch and subject
    const chosenBranch = BRANCHES.find((b) => b.id === branchId);
    const chosenSubject = subjects.find((s) => s.id === subjectId) || {
      id: 'gen-01',
      code: 'ENG-' + semester + '01',
      name: 'Engineering Coursework',
    };

    const parsedTags = tagsInput
      .split(',')
      .map((t) => t.trim().replace(/^#/, '').toLowerCase())
      .filter((t) => t.length > 0);

    if (parsedTags.length === 0) {
      parsedTags.push(chosenSubject.code.toLowerCase(), 'semester_' + semester, 'unit_' + unit);
    }

    // Generate sample pages for immediate online reading
    const samplePages: NotePage[] = [
      {
        pageNumber: 1,
        title: title,
        summary: description,
        content: [
          `These lecture notes for ${chosenSubject.name} (${chosenSubject.code}) were compiled by ${user.name}.`,
          `Branch: ${chosenBranch?.name || 'Engineering'} · Semester ${semester} · ${unit === 'all' ? 'All Units' : `Unit ${unit}`}.`,
          'Key foundational concepts, theoretical proofs, and practical illustrations are included throughout this document.',
          'Students are advised to review the end-of-chapter summaries prior to internal assessments.',
        ],
        keyPoints: [
          'Direct alignment with current university syllabus standards.',
          'Step-by-step problem walkthroughs and conceptual diagrams.',
        ],
        examTip: 'High-frequency question alert: Review definitions and algorithmic steps outlined on this topic.',
      },
      {
        pageNumber: 2,
        title: 'Core Analytical Models & Implementations',
        summary: 'Detailed theoretical breakdown and problem derivations.',
        content: [
          'Detailed mathematical derivation and architectural flow diagrams are documented below.',
          'Review the computational complexities and worst-case scenario boundaries.',
          'Comparative metrics and experimental results correspond to the laboratory curriculum.',
        ],
        keyPoints: ['Ensure proper units and boundary condition testing during mid-terms.'],
      },
    ];

    submitUpload({
      title: title.trim(),
      description: description.trim(),
      subjectId: chosenSubject.id,
      subjectName: chosenSubject.name,
      subjectCode: chosenSubject.code,
      branchId,
      branchName: chosenBranch?.name || 'Computer Science & Engineering',
      year,
      semester,
      unit,
      unitTitle: unit === 'all' ? 'All Units' : `Unit ${unit}`,
      materialType,
      fileName: uploadedFile.name,
      fileSize: uploadedFile.size,
      fileExtension: uploadedFile.extension,
      pageCount: Math.floor(Math.random() * 15) + 8,
      uploaderName: user.name,
      uploaderRole: user.role === 'admin' ? 'Faculty Admin' : `Student (${chosenBranch?.code || 'CSE'} Year ${year})`,
      uploaderAvatar: user.avatar,
      uploaderId: user.id,
      tags: parsedTags,
      isFeatured: false,
      pages: samplePages,
    });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 dark:text-indigo-400 mb-1">
          <UploadCloud className="w-3.5 h-3.5" />
          <span>CONTRIBUTE TO THE COLLEGE VAULT</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50">
          Upload Study Material
        </h1>
        <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 mt-1">
          Share your verified notes, previous exam papers, or lab manuals with fellow college students.
        </p>
      </div>

      {/* Main Upload Form */}
      <form onSubmit={handleSubmit} className="p-6 sm:p-8 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-sm space-y-6">
        {/* Document Title */}
        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300">
            Document Title <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Unit 3: B+ Trees, Secondary Indexing & Query Cost Models"
            className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>

        {/* Branch, Year, Semester Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Branch */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300">
              Branch <span className="text-rose-500">*</span>
            </label>
            <select
              value={branchId}
              onChange={(e) => {
                const b = e.target.value as BranchId;
                setBranchId(b);
                const firstSubj = subjects.find((s) => s.branchId === b);
                if (firstSubj) setSubjectId(firstSubj.id);
              }}
              className="w-full p-2.5 text-xs rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              {BRANCHES.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name} ({b.code})
                </option>
              ))}
            </select>
          </div>

          {/* Year */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300">
              Academic Year <span className="text-rose-500">*</span>
            </label>
            <select
              value={year}
              onChange={(e) => setYear(Number(e.target.value))}
              className="w-full p-2.5 text-xs rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              <option value={1}>1st Year (Fresher)</option>
              <option value={2}>2nd Year (Sophomore)</option>
              <option value={3}>3rd Year (Junior)</option>
              <option value={4}>4th Year (Senior)</option>
            </select>
          </div>

          {/* Semester */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300">
              Semester <span className="text-rose-500">*</span>
            </label>
            <select
              value={semester}
              onChange={(e) => setSemester(Number(e.target.value))}
              className="w-full p-2.5 text-xs rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                <option key={sem} value={sem}>
                  Semester {sem}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Subject, Unit, Material Type */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Subject */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300">
              Subject <span className="text-rose-500">*</span>
            </label>
            <select
              value={subjectId}
              onChange={(e) => setSubjectId(e.target.value)}
              className="w-full p-2.5 text-xs rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-1 focus:ring-indigo-500 truncate"
            >
              {availableSubjects.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.code} - {s.name}
                </option>
              ))}
              <option value="other">Other / Custom Course</option>
            </select>
          </div>

          {/* Unit */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300">
              Unit Number <span className="text-rose-500">*</span>
            </label>
            <select
              value={unit}
              onChange={(e) =>
                setUnit(e.target.value === 'all' ? 'all' : Number(e.target.value))
              }
              className="w-full p-2.5 text-xs rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              <option value={1}>Unit 1</option>
              <option value={2}>Unit 2</option>
              <option value={3}>Unit 3</option>
              <option value={4}>Unit 4</option>
              <option value={5}>Unit 5</option>
              <option value="all">Complete Syllabus (All Units)</option>
            </select>
          </div>

          {/* Material Type */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300">
              Material Format <span className="text-rose-500">*</span>
            </label>
            <select
              value={materialType}
              onChange={(e) => setMaterialType(e.target.value as MaterialType)}
              className="w-full p-2.5 text-xs rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              <option value="lecture_notes">Lecture Notes</option>
              <option value="handwritten_notes">Handwritten Notes</option>
              <option value="pyq">Previous Question Paper (PYQ)</option>
              <option value="lab_manual">Lab Manual</option>
              <option value="important_questions">Question Bank</option>
              <option value="ppt">Slide Deck (PPT)</option>
              <option value="formula_sheet">Formula Cheat Sheet</option>
            </select>
          </div>
        </div>

        {/* Description */}
        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300">
            Description & Key Topics Covered <span className="text-rose-500">*</span>
          </label>
          <textarea
            required
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Summarize the theorems, algorithms, exam numericals, or experiment procedures included in this document..."
            className="w-full p-3 text-xs rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>

        {/* Tags */}
        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300">
            Tags (comma separated)
          </label>
          <input
            type="text"
            value={tagsInput}
            onChange={(e) => setTagsInput(e.target.value)}
            placeholder="e.g. bplus_tree, indexing, midsem_prep, topper_notes"
            className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>

        {/* File Upload Dropzone */}
        <div className="space-y-2">
          <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300">
            Upload Study Document (PDF, PPT, DOCX, ZIP - Max 25 MB) <span className="text-rose-500">*</span>
          </label>

          <div
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-2xl p-6 text-center transition-all cursor-pointer ${
              isDragging
                ? 'border-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/30'
                : 'border-neutral-300 dark:border-neutral-700 bg-neutral-50/50 dark:bg-neutral-800/20 hover:border-neutral-400'
            }`}
            onClick={() => document.getElementById('file-upload-input')?.click()}
          >
            <input
              id="file-upload-input"
              type="file"
              accept=".pdf,.ppt,.pptx,.docx,.zip"
              onChange={handleFileInputChange}
              className="hidden"
            />

            {uploadedFile ? (
              <div className="flex items-center justify-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                  <FileCheck className="w-6 h-6" />
                </div>
                <div className="text-left">
                  <p className="text-xs font-semibold text-neutral-900 dark:text-neutral-100">
                    {uploadedFile.name}
                  </p>
                  <p className="text-[11px] text-neutral-500 font-mono">
                    {uploadedFile.size} · Verified {uploadedFile.extension.toUpperCase()}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setUploadedFile(null);
                  }}
                  className="p-1 text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : isUploading ? (
              <div className="space-y-2 max-w-xs mx-auto">
                <p className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                  Scanning & verifying document... {uploadProgress}%
                </p>
                <div className="w-full bg-neutral-200 dark:bg-neutral-700 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-indigo-600 h-full transition-all duration-150"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-1.5">
                <UploadCloud className="w-8 h-8 text-neutral-400 mx-auto" />
                <p className="text-xs font-semibold text-neutral-800 dark:text-neutral-200">
                  Drag and drop your study file here, or{' '}
                  <span className="text-indigo-600 dark:text-indigo-400 underline">browse files</span>
                </p>
                <p className="text-[11px] text-neutral-400">
                  Supported formats: PDF, PPT, PPTX, DOCX, ZIP · Maximum file size: 25 MB
                </p>
              </div>
            )}
          </div>

          {validationError && (
            <p className="text-xs text-rose-500 flex items-center gap-1 mt-1">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>{validationError}</span>
            </p>
          )}
        </div>

        {/* Status notice */}
        <div className="p-3.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800/40 text-xs text-neutral-600 dark:text-neutral-400 flex items-start gap-2.5">
          <ShieldAlert className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
          <div className="leading-relaxed">
            <span className="font-semibold text-neutral-900 dark:text-neutral-200">
              Academic Moderation Policy:
            </span>{' '}
            {user.role === 'admin'
              ? 'As a Faculty Admin, your uploaded material will be published directly to the directory.'
              : 'Materials submitted by students undergo peer/moderator review to ensure syllabus compliance and watermark integrity before public release.'}
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-2 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={() => navigateTo('home')}
            className="px-4 py-2 text-xs font-medium text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-6 py-2.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 rounded-lg shadow-sm transition-colors cursor-pointer"
          >
            Submit Material
          </button>
        </div>
      </form>
    </div>
  );
};
