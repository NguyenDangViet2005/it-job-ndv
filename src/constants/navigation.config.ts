import { ROUTES } from "./routes"; 
import {
  LayoutDashboard,
  FileText,
  Briefcase,
  MessageSquare,
  Settings,
  BookOpen,
  Users,
  Building2,
  Newspaper,
  BarChart3,
  GraduationCap,
  TrendingUp,
  type LucideIcon,
} from "lucide-react";

// ============================================
// PUBLIC NAVIGATION (Header/Navbar)
// ============================================

export interface NavigationSubItem {
  title: string;
  href: string;
  description?: string;
}

export interface NavigationItem {
  title: string;
  href: string;
  items?: NavigationSubItem[];
}

export const navigationItems: NavigationItem[] = [
  {
    title: "Trang chủ",
    href: ROUTES.HOME,
  },
  {
    title: "Công việc",
    href: ROUTES.JOBS,
  },
  {
    title: "Cộng đồng",
    href: ROUTES.QA, // Đổi từ "#" sang route thực
    items: [
      {
        title: "Hỏi đáp",
        href: ROUTES.QA,
        description: "Đặt câu hỏi và nhận câu trả lời từ cộng đồng",
      },
      {
        title: "Chia sẻ kinh nghiệm",
        href: ROUTES.BLOGS,
        description: "Chia sẻ và học hỏi kinh nghiệm làm việc",
      },
    ],
  },
  {
    title: "Công ty",
    href: ROUTES.COMPANIES,
  },
];

// ============================================
// FEATURE CARDS (Homepage)
// ============================================

export interface FeatureCardItem {
  title: string;
  description: string;
  linkText: string;
  href: string;
  icon: LucideIcon;
  badge?: string;
}

export const featureCardItems: FeatureCardItem[] = [
  {
    title: "Việc làm IT",
    description: "Hàng nghìn cơ hội việc làm IT hấp dẫn",
    linkText: "Tìm việc ngay",
    href: ROUTES.JOBS,
    icon: Briefcase,
  },
  {
    title: "Top Công ty",
    description: "Khám phá các công ty IT hàng đầu Việt Nam",
    linkText: "Xem ngay",
    href: ROUTES.COMPANIES,
    icon: Building2,
    badge: "HOT",
  },
  {
    title: "Việc làm Fresher",
    description: "Đa dạng cơ hội việc làm IT cho Fresher",
    linkText: "Khám phá",
    href: ROUTES.JOBS,
    icon: GraduationCap,
  },
  {
    title: "Câu hỏi phỏng vấn",
    description: "Sẵn sàng cho buổi phỏng vấn của bạn",
    linkText: "Xem thêm",
    href: ROUTES.BLOGS,
    icon: MessageSquare,
  },
  {
    title: "Xu hướng IT",
    description: "Cập nhật xu hướng công nghệ và mức lương",
    linkText: "Tìm hiểu",
    href: ROUTES.QA,
    icon: TrendingUp,
  },
];

// ============================================
// SIDEBAR NAVIGATION
// ============================================

export interface SidebarItem {
  title: string;
  href: string;
  icon: LucideIcon;
  badge?: string | number;
  roles?: ("user" | "employer" | "admin")[]; // Roles that can see this item
}

// User Dashboard Sidebar
export const userSidebarItems: SidebarItem[] = [
  {
    title: "Tổng quan",
    href: ROUTES.USER_DASHBOARD,
    icon: LayoutDashboard,
    roles: ["user"],
  },
  {
    title: "Hồ sơ / CV",
    href: ROUTES.USER_RESUME,
    icon: FileText,
    roles: ["user"],
  },
  {
    title: "Việc đã ứng tuyển",
    href: ROUTES.USER_APPLIED_JOBS,
    icon: Briefcase,
    roles: ["user"],
  },
  {
    title: "Blog của tôi",
    href: ROUTES.USER_MY_BLOGS,
    icon: BookOpen,
    roles: ["user", "employer", "admin"],
  },
  {
    title: "Tin nhắn",
    href: ROUTES.USER_MESSAGES,
    icon: MessageSquare,
    roles: ["user"],
  },
  {
    title: "Cài đặt",
    href: ROUTES.USER_SETTINGS,
    icon: Settings,
    roles: ["user", "employer", "admin"],
  },
];

// HR Dashboard Sidebar
export const hrSidebarItems: SidebarItem[] = [
  {
    title: "Tổng quan",
    href: ROUTES.HR,
    icon: Building2,
  },
  {
    title: "Quản lý công việc",
    href: ROUTES.HR_JOBS,
    icon: Briefcase,
  },
  {
    title: "Ứng viên",
    href: ROUTES.HR_CANDIDATES,
    icon: Users,
  },
  {
    title: "Blog",
    href: ROUTES.HR_BLOG,
    icon: Newspaper,
  },
];

// Admin Dashboard Sidebar
export const adminSidebarItems: SidebarItem[] = [
  {
    title: "Tổng quan",
    href: ROUTES.ADMIN_DASHBOARD,
    icon: LayoutDashboard,
  },
  {
    title: "Người dùng",
    href: ROUTES.ADMIN_USERS,
    icon: Users,
  },
  {
    title: "Công ty",
    href: ROUTES.ADMIN_COMPANIES,
    icon: Building2,
  },
  {
    title: "Công việc",
    href: ROUTES.ADMIN_JOBS,
    icon: Briefcase,
  },
  {
    title: "Blog",
    href: ROUTES.ADMIN_BLOGS,
    icon: Newspaper,
  },
];

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Get sidebar items based on user role
 */
export const getSidebarItemsByRole = (
  role: "user" | "employer" | "admin",
): SidebarItem[] => {
  switch (role) {
    case "admin":
      return adminSidebarItems;
    case "employer":
      return hrSidebarItems;
    case "user":
    default:
      return userSidebarItems;
  }
};

/**
 * Filter sidebar items by user role
 */
export const filterSidebarItemsByRole = (
  items: SidebarItem[],
  role: "user" | "employer" | "admin",
): SidebarItem[] => {
  return items.filter((item) => {
    if (!item.roles) return true; // No role restriction
    return item.roles.includes(role);
  });
};
