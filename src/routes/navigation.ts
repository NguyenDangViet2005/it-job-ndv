import Routes from "./index";

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
    href: Routes.home,
  },
  {
    title: "Công việc",
    href: Routes.jobs,
  },
  {
    title: "Cộng đồng",
    href: "#",
    items: [
      {
        title: "Hỏi đáp",
        href: Routes.qa,
        description: "Đặt câu hỏi và nhận câu trả lời từ cộng đồng",
      },
      {
        title: "Chia sẻ kinh nghiệm",
        href: Routes.blog,
        description: "Chia sẻ và học hỏi kinh nghiệm làm việc",
      },
    ],
  },
  {
    title: "Công ty",
    href: Routes.companies,
  },
];
