import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  StudyMaterial,
  Subject,
  Review,
  UserProfile,
  BranchId,
  MaterialType,
} from '../types';
import {
  INITIAL_MATERIALS,
  INITIAL_SUBJECTS,
  INITIAL_REVIEWS,
  DEFAULT_USER,
  ADMIN_USER,
  BRANCHES,
} from '../data/mockData';
import { triggerMaterialDownload } from '../utils/fileDownloader';

export type AppView =
  | 'home'
  | 'browse'
  | 'subject-detail'
  | 'material-detail'
  | 'upload'
  | 'vault'
  | 'admin';

export interface FilterState {
  searchQuery: string;
  branchId: BranchId | 'all';
  year: number | 'all';
  semester: number | 'all';
  subjectId: string | 'all';
  unit: number | 'all';
  materialType: MaterialType | 'all';
  sortBy: 'popular' | 'recent' | 'rating' | 'downloads';
}

interface ToastMessage {
  id: string;
  title: string;
  message: string;
  type: 'success' | 'info' | 'warning' | 'error';
}

interface AppContextType {
  // Navigation & View
  currentView: AppView;
  selectedSubjectId: string | null;
  selectedMaterialId: string | null;
  navigateTo: (view: AppView, payload?: { subjectId?: string; materialId?: string }) => void;

  // Theme
  isDark: boolean;
  toggleTheme: () => void;

  // Filter State
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  resetFilters: () => void;
  quickFilterBranch: (branchId: BranchId) => void;
  quickFilterSubject: (subjectId: string) => void;

  // Data
  materials: StudyMaterial[];
  subjects: Subject[];
  reviews: Review[];
  user: UserProfile;

  // User Actions
  switchRole: (role: 'student' | 'admin') => void;
  toggleBookmark: (materialId: string) => void;
  isBookmarked: (materialId: string) => boolean;
  downloadMaterial: (material: StudyMaterial) => Promise<void>;
  addReview: (materialId: string, rating: number, comment: string) => void;
  submitUpload: (data: Omit<StudyMaterial, 'id' | 'uploadDate' | 'downloadsCount' | 'viewsCount' | 'rating' | 'reviewsCount' | 'status'>) => void;

  // Admin Actions
  approveMaterial: (materialId: string) => void;
  rejectMaterial: (materialId: string, reason: string) => void;
  deleteMaterial: (materialId: string) => void;
  toggleFeatured: (materialId: string) => void;
  addNewSubject: (subject: Omit<Subject, 'id' | 'materialsCount'>) => void;

  // Notifications
  toasts: ToastMessage[];
  dismissToast: (id: string) => void;
  showToast: (title: string, message: string, type?: 'success' | 'info' | 'warning' | 'error') => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Theme state
  const [isDark, setIsDark] = useState<boolean>(() => {
    const saved = localStorage.getItem('studyvault_theme');
    if (saved !== null) return saved === 'dark';
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('studyvault_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('studyvault_theme', 'light');
    }
  }, [isDark]);

  const toggleTheme = () => setIsDark((prev) => !prev);

  // View state
  const [currentView, setCurrentView] = useState<AppView>('home');
  const [selectedSubjectId, setSelectedSubjectId] = useState<string | null>(null);
  const [selectedMaterialId, setSelectedMaterialId] = useState<string | null>(null);

  // Persistent Materials
  const [materials, setMaterials] = useState<StudyMaterial[]>(() => {
    const saved = localStorage.getItem('studyvault_materials');
    return saved ? JSON.parse(saved) : INITIAL_MATERIALS;
  });

  useEffect(() => {
    localStorage.setItem('studyvault_materials', JSON.stringify(materials));
  }, [materials]);

  // Persistent Subjects
  const [subjects, setSubjects] = useState<Subject[]>(() => {
    const saved = localStorage.getItem('studyvault_subjects');
    return saved ? JSON.parse(saved) : INITIAL_SUBJECTS;
  });

  useEffect(() => {
    localStorage.setItem('studyvault_subjects', JSON.stringify(subjects));
  }, [subjects]);

  // Persistent Reviews
  const [reviews, setReviews] = useState<Review[]>(() => {
    const saved = localStorage.getItem('studyvault_reviews');
    return saved ? JSON.parse(saved) : INITIAL_REVIEWS;
  });

  useEffect(() => {
    localStorage.setItem('studyvault_reviews', JSON.stringify(reviews));
  }, [reviews]);

  // Persistent User
  const [user, setUser] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('studyvault_user');
    return saved ? JSON.parse(saved) : DEFAULT_USER;
  });

  useEffect(() => {
    localStorage.setItem('studyvault_user', JSON.stringify(user));
  }, [user]);

  // Toast notifications
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = (title: string, message: string, type: 'success' | 'info' | 'warning' | 'error' = 'info') => {
    const id = Date.now().toString() + Math.random().toString().slice(2, 6);
    setToasts((prev) => [...prev, { id, title, message, type }]);
    setTimeout(() => {
      dismissToast(id);
    }, 4500);
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Filters state
  const initialFilters: FilterState = {
    searchQuery: '',
    branchId: 'all',
    year: 'all',
    semester: 'all',
    subjectId: 'all',
    unit: 'all',
    materialType: 'all',
    sortBy: 'popular',
  };

  const [filters, setFilters] = useState<FilterState>(initialFilters);

  const resetFilters = () => {
    setFilters(initialFilters);
  };

  const quickFilterBranch = (branchId: BranchId) => {
    setFilters((prev) => ({
      ...prev,
      branchId,
      year: 'all',
      semester: 'all',
      subjectId: 'all',
      unit: 'all',
    }));
    setCurrentView('browse');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const quickFilterSubject = (subjectId: string) => {
    const subj = subjects.find((s) => s.id === subjectId);
    setFilters((prev) => ({
      ...prev,
      subjectId,
      branchId: subj ? subj.branchId : prev.branchId,
      semester: subj ? subj.semester : prev.semester,
      unit: 'all',
    }));
    setCurrentView('browse');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateTo = (view: AppView, payload?: { subjectId?: string; materialId?: string }) => {
    if (payload?.subjectId !== undefined) {
      setSelectedSubjectId(payload.subjectId);
    }
    if (payload?.materialId !== undefined) {
      setSelectedMaterialId(payload.materialId);
    }
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const switchRole = (role: 'student' | 'admin') => {
    if (role === 'admin') {
      setUser(ADMIN_USER);
      showToast('Admin Mode Active', 'You now have full moderation and catalog administration privileges.', 'info');
    } else {
      setUser(DEFAULT_USER);
      showToast('Student Mode Active', 'Switched to Vikram Aditya (CSE 3rd Year).', 'info');
    }
  };

  const toggleBookmark = (materialId: string) => {
    const isSaved = user.bookmarks.includes(materialId);
    const updatedBookmarks = isSaved
      ? user.bookmarks.filter((id) => id !== materialId)
      : [...user.bookmarks, materialId];

    setUser((prev) => ({
      ...prev,
      bookmarks: updatedBookmarks,
    }));

    if (isSaved) {
      showToast('Removed from Vault', 'Item removed from your saved bookmarks.', 'info');
    } else {
      showToast('Saved to My Vault', 'Material bookmarked for quick offline study.', 'success');
    }
  };

  const isBookmarked = (materialId: string) => user.bookmarks.includes(materialId);

  const downloadMaterial = async (material: StudyMaterial) => {
    try {
      // 1. Trigger actual clean file download
      await triggerMaterialDownload(material);

      // 2. Increment download count in state
      setMaterials((prev) =>
        prev.map((m) =>
          m.id === material.id ? { ...m, downloadsCount: m.downloadsCount + 1 } : m
        )
      );

      // 3. Add to user download history
      const now = new Date();
      const timestamp = now.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });

      const newHistoryItem = {
        id: 'dl-' + Date.now(),
        materialId: material.id,
        title: material.title,
        subjectName: material.subjectName,
        branchId: material.branchId,
        fileSize: material.fileSize,
        downloadedAt: timestamp,
      };

      setUser((prev) => ({
        ...prev,
        downloads: [newHistoryItem, ...prev.downloads.filter((d) => d.materialId !== material.id)],
      }));

      showToast('Download Completed', `${material.fileName} saved to your device.`, 'success');
    } catch {
      showToast('Download Error', 'Could not complete download file stream.', 'error');
    }
  };

  const addReview = (materialId: string, rating: number, comment: string) => {
    const newRev: Review = {
      id: 'rev-' + Date.now(),
      materialId,
      authorName: user.name,
      authorAvatar: user.avatar,
      branch: BRANCHES.find((b) => b.id === user.branchId)?.code || 'CSE',
      semester: user.semester,
      rating,
      comment,
      createdAt: 'Just now',
    };

    setReviews((prev) => [newRev, ...prev]);

    // Recalculate rating on material
    setMaterials((prev) =>
      prev.map((m) => {
        if (m.id === materialId) {
          const totalRating = m.rating * m.reviewsCount + rating;
          const newCount = m.reviewsCount + 1;
          const newAvg = parseFloat((totalRating / newCount).toFixed(2));
          return {
            ...m,
            rating: newAvg,
            reviewsCount: newCount,
          };
        }
        return m;
      })
    );

    showToast('Review Published', 'Thank you for sharing peer feedback!', 'success');
  };

  const submitUpload = (
    data: Omit<
      StudyMaterial,
      'id' | 'uploadDate' | 'downloadsCount' | 'viewsCount' | 'rating' | 'reviewsCount' | 'status'
    >
  ) => {
    const isPrivileged = user.role === 'admin';
    const newId = 'mat-' + Date.now();
    const today = new Date().toISOString().split('T')[0];

    const newMaterial: StudyMaterial = {
      ...data,
      id: newId,
      uploadDate: today,
      downloadsCount: 0,
      viewsCount: 1,
      rating: 5.0,
      reviewsCount: 1,
      status: isPrivileged ? 'approved' : 'pending',
    };

    setMaterials((prev) => [newMaterial, ...prev]);

    if (isPrivileged) {
      showToast(
        'Material Published',
        'Your study notes are immediately live in the directory.',
        'success'
      );
    } else {
      showToast(
        'Upload Submitted for Review',
        'Your material has been queued for faculty/admin approval.',
        'info'
      );
    }

    navigateTo('vault');
  };

  const approveMaterial = (materialId: string) => {
    setMaterials((prev) =>
      prev.map((m) => (m.id === materialId ? { ...m, status: 'approved' } : m))
    );
    showToast('Material Approved', 'Study material is now visible to all students.', 'success');
  };

  const rejectMaterial = (materialId: string, reason: string) => {
    setMaterials((prev) =>
      prev.map((m) =>
        m.id === materialId ? { ...m, status: 'rejected', rejectionReason: reason } : m
      )
    );
    showToast('Material Rejected', 'Status updated with feedback reason.', 'info');
  };

  const deleteMaterial = (materialId: string) => {
    setMaterials((prev) => prev.filter((m) => m.id !== materialId));
    showToast('Material Deleted', 'The material was permanently removed.', 'warning');
  };

  const toggleFeatured = (materialId: string) => {
    setMaterials((prev) =>
      prev.map((m) => (m.id === materialId ? { ...m, isFeatured: !m.isFeatured } : m))
    );
    showToast('Updated Featured Status', 'Homepage showcase status updated.', 'info');
  };

  const addNewSubject = (subjectData: Omit<Subject, 'id' | 'materialsCount'>) => {
    const newSubj: Subject = {
      ...subjectData,
      id: 'sub-' + Date.now(),
      materialsCount: 0,
    };
    setSubjects((prev) => [...prev, newSubj]);
    showToast('Subject Added', `${newSubj.name} (${newSubj.code}) is now active.`, 'success');
  };

  return (
    <AppContext.Provider
      value={{
        currentView,
        selectedSubjectId,
        selectedMaterialId,
        navigateTo,
        isDark,
        toggleTheme,
        filters,
        setFilters,
        resetFilters,
        quickFilterBranch,
        quickFilterSubject,
        materials,
        subjects,
        reviews,
        user,
        switchRole,
        toggleBookmark,
        isBookmarked,
        downloadMaterial,
        addReview,
        submitUpload,
        approveMaterial,
        rejectMaterial,
        deleteMaterial,
        toggleFeatured,
        addNewSubject,
        toasts,
        dismissToast,
        showToast,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
