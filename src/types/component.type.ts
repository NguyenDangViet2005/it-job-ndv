import type { FullPostResponse, JobResponse } from "./api.type";
import type { Company } from "./models/company.type";
import type { UserResponse } from "./api.type";

// ============ QA/Post Components ============
export interface MainContentProps {
  posts: FullPostResponse[];
  loading: boolean;
  onLikePost: (postid: number) => void;
  onToggleComments: (postid: number) => void;
  onAddComment: (postid: number, content: string, attachments?: File[]) => void;
  onEditComment?: (
    postid: number,
    commentId: number,
    content: string,
    attachments?: File[],
  ) => void;
  onDeleteComment?: (postid: number, commentId: number) => void;
  onLoadMoreComments?: (postid: number) => Promise<void>;
  loadingCommentsForPost?: number | null;
  currentUserAvatar?: string;
  currentUserName?: string;
  currentUserId?: number;
}

export interface PostListProps {
  posts: FullPostResponse[];
  loading: boolean;
  currentUserAvatar?: string;
  currentUserName?: string;
  currentUserId?: number;
  onLikePost: (postid: number) => void;
  onToggleComments: (postid: number) => void;
  onAddComment: (postid: number, content: string, attachments?: File[]) => void;
  onEditComment?: (
    postid: number,
    commentId: number,
    content: string,
    attachments?: File[],
  ) => void;
  onDeleteComment?: (postid: number, commentId: number) => void;
  onLoadMoreComments?: (postid: number) => Promise<void>;
  loadingCommentsForPost?: number | null;
  onEditPost: (postid: number) => void;
  onDeletePost: (postid: number) => void;
}

// ============ Job Components ============
export interface JobListSectionProps {
  jobs: JobResponse[];
  loading: boolean;
  onJobClick: (jobid: number) => void;
}

export interface JobFilterToolbarProps {
  skills: Array<{ id: number; name: string }>;
  selectedSkill: number | null;
  onSkillChange: (skillid: number | null) => void;
}

export interface JobFilterSidebarProps {
  skills: Array<{ id: number; name: string }>;
  selectedSkill: number | null;
  onSkillChange: (skillid: number | null) => void;
  onClose: () => void;
}

export interface JobRequirementsProps {
  requirements?: {
    technical: string[];
    soft: string[];
    experience: string[];
    education: string[];
  };
}

export interface JobDescriptionProps {
  description?: {
    overview: string;
    responsibilities: string[];
    requirements: string[];
  };
}

export interface JobBenefitsProps {
  benefits?: {
    salary: string[];
    welfare: string[];
    development: string[];
    environment: string[];
  };
}

export interface CompanyListSectionProps {
  selectedCompanyId: number | null;
  onCompanyChange: (companyid: number | null) => void;
}

export interface JobHeaderProps {
  job: {
    id?: number;
    title?: string;
    type?: string;
    salary?: string;
    deadline?: string;
    status?: string;
  };
}

export interface CompanyInfoProps {
  jobid?: number;
  jobTitle?: string;
  company?: Company;
}

// ============ Common Components ============
export interface HeroSectionProps {
  height?: number;
}

export interface SectionTitleProps {
  title: string;
  subtitle?: string;
}

export interface NavigationLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
}

export interface UserDropdownProps {
  user: UserResponse | null;
  onLogout: () => void;
}

export interface MobileMenuProps {
  isLoggedIn: boolean;
  user: UserResponse | null;
  onLogout: () => void;
}

// ============ Layout Components ============
export interface QAPageLayoutProps {
  children: React.ReactNode;
  blogs: any[];
  suggestedCompanies: Company[];
  followedCompanyIds: number[];
  connections: any[];
}

// ============ Table Components ============
export interface Column<T> {
  key: keyof T;
  header: string;
  render?: (value: any, row: T) => React.ReactNode;
}

export interface ActionItem {
  key: string;
  label: string;
  onClick: (row: any) => void;
}

export interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  actions?: ActionItem[];
  searchable?: boolean;
  searchPlaceholder?: string;
}

// ============ Admin Components ============
export interface StatCardProps {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

export interface Activity {
  id: number;
  type: "user" | "job" | "post" | "system" | "comment" | "application";
  title: string;
  description: string;
  timestamp: string;
  user?: {
    name: string;
    avatar?: string;
  };
}
