export type BranchId = 'cse' | 'cyber' | 'aids' | 'ece' | 'it';

export interface Branch {
  id: BranchId;
  name: string;
  code: string;
  description: string;
  semesterCount: number;
  iconName: string;
  accentColor: string;
}

export type MaterialType =
  | 'lecture_notes'
  | 'handwritten_notes'
  | 'ppt'
  | 'pyq'
  | 'lab_manual'
  | 'important_questions'
  | 'formula_sheet';

export interface NotePage {
  pageNumber: number;
  title: string;
  summary: string;
  content: string[];
  keyPoints?: string[];
  examTip?: string;
  codeSnippet?: {
    language: string;
    code: string;
  };
  tableData?: {
    headers: string[];
    rows: string[][];
  };
}

export interface Review {
  id: string;
  materialId: string;
  authorName: string;
  authorAvatar: string;
  branch: string;
  semester: number;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface StudyMaterial {
  id: string;
  title: string;
  description: string;
  subjectId: string;
  subjectName: string;
  subjectCode: string;
  branchId: BranchId;
  branchName: string;
  year: number; // 1, 2, 3, 4
  semester: number; // 1 to 8
  unit: number | 'all'; // 1, 2, 3, 4, 5 or 'all'
  unitTitle?: string;
  materialType: MaterialType;
  fileName: string;
  fileSize: string;
  fileExtension: 'pdf' | 'pptx' | 'docx' | 'zip';
  pageCount: number;
  uploaderName: string;
  uploaderRole: string;
  uploaderAvatar?: string;
  uploaderId: string;
  uploadDate: string;
  downloadsCount: number;
  viewsCount: number;
  rating: number;
  reviewsCount: number;
  tags: string[];
  status: 'approved' | 'pending' | 'rejected';
  rejectionReason?: string;
  isFeatured?: boolean;
  pages: NotePage[];
}

export interface Subject {
  id: string;
  code: string;
  name: string;
  branchId: BranchId;
  semester: number;
  year: number;
  unitsCount: number;
  description: string;
  materialsCount: number;
}

export interface DownloadHistoryItem {
  id: string;
  materialId: string;
  title: string;
  subjectName: string;
  branchId: BranchId;
  fileSize: string;
  downloadedAt: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'admin';
  branchId: BranchId;
  year: number;
  semester: number;
  avatar: string;
  bookmarks: string[]; // Material IDs
  downloads: DownloadHistoryItem[];
  joinedDate: string;
}
