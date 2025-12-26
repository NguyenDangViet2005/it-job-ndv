// ============== INTERFACES ==============

export interface NavigationItem {
  href: string;
  icon: any;
  label: string;
  badge?: number;
}

export interface Candidate {
  id: number;
  name: string;
  email: string;
  phone: string;
  position: string;
  experience: string;
  skills: string[];
  status: string;
  dateApplied: string;
  rating: number;
  avatar: string;
  resume: string;
  notes: string;
}

export interface Job {
  id: number;
  title: string;
  department: string;
  location: string;
  salary: string;
  status: "open" | "draft" | "closed";
  applicants: number;
  datePosted: string;
  skills: string[];
}

export interface KPICardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  trend?: number;
  className?: string;
}

export interface PipelineStage {
  id: string;
  name: string;
  color: string;
}

export interface Comment {
  id: number;
  author: string;
  avatar: string;
  content: string;
  timestamp: string;
  likes: number;
}

export interface Post {
  id: number;
  author?: string;
  role?: string;
  avatar?: string;
  title?: string;
  content: string;
  image?: string;
  images?: string[];
  likes: number;
  comments: Comment[];
  shares?: number;
  timestamp?: string;
  liked?: boolean;
  showComments?: boolean;
  company?: string;
}

// ============== MOCK DATA FROM FAKE.DATA.TS ==============

export const followList = [
  { id: 1, name: "Tech Startup VN", logo: "/logo-company.jpg" },
  { id: 2, name: "Enterprise JSC", logo: "/logo-company.jpg" },
  { id: 3, name: "Nguyễn Văn C", logo: "/logo-company.jpg" },
  { id: 4, name: "Tech Startup VN", logo: "/logo-company.jpg" },
  { id: 5, name: "Enterprise JSC", logo: "/logo-company.jpg" },
  { id: 6, name: "Nguyễn Văn C", logo: "/logo-company.jpg" },
];

export const posts: Post[] = [
  {
    id: 1,
    author: "Người dùng hiện tại",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=User",
    content:
      "Vừa hoàn thành dự án React mới! Rất hào hứng với những gì mình đã học được 🚀",
    image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800",
    likes: 24,
    comments: [
      {
        id: 1,
        author: "Nguyễn Văn A",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix",
        content: "Chúc mừng bạn! Dự án trông rất tuyệt 👏",
        timestamp: "1 giờ trước",
        likes: 3,
      },
      {
        id: 2,
        author: "Trần Thị B",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka",
        content: "Bạn dùng framework gì vậy? Mình cũng đang học React",
        timestamp: "45 phút trước",
        likes: 1,
      },
      {
        id: 3,
        author: "Lê Văn C",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Max",
        content: "UI/UX nhìn rất đẹp, có thể share source code không bạn?",
        timestamp: "30 phút trước",
        likes: 5,
      },
    ],
    shares: 2,
    timestamp: "2 giờ trước",
    liked: false,
    showComments: false,
  },
  {
    id: 2,
    author: "Người dùng hiện tại",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=User",
    content: "Chia sẻ một số tips về TypeScript cho các bạn mới bắt đầu...",
    images: [
      "https://images.unsplash.com/photo-1542831371-29b0f74f9713?w=800",
      "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800",
      "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800",
      "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800",
      "https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=800",
    ],
    likes: 48,
    comments: [
      {
        id: 1,
        author: "Phạm Văn D",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=John",
        content: "Cảm ơn bạn, rất hữu ích!",
        timestamp: "5 giờ trước",
        likes: 8,
      },
      {
        id: 2,
        author: "Hoàng Thị E",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
        content: "Mình đã save lại để học, thanks nhé!",
        timestamp: "4 giờ trước",
        likes: 2,
      },
    ],
    shares: 8,
    timestamp: "1 ngày trước",
    liked: false,
    showComments: false,
  },
  {
    id: 1,
    author: "Nguyễn Văn A",
    role: "Frontend Developer",
    avatar:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRH87TKQrWcl19xly2VNs0CjBzy8eaKNM-ZpA&s",
    title: "Làm thế nào để trở thành Fresher Frontend?",
    content:
      "Mình muốn chia sẻ hành trình học ReactJS và Next.js để apply vào các công ty startup IT.",
    image: "/logo-company.jpg",
    likes: 12,
    comments: [
      {
        id: 1,
        author: "Lê Văn C",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Max",
        content: "Bài viết rất hữu ích! Cảm ơn bạn đã chia sẻ",
        timestamp: "2 giờ trước",
        likes: 3,
      },
      {
        id: 2,
        author: "Phạm Thị D",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka",
        content: "Mình cũng đang học ReactJS, có thể xin roadmap được không?",
        timestamp: "1 giờ trước",
        likes: 1,
      },
    ],
    company: "Tech Startup VN",
  },
  {
    id: 2,
    author: "Trần Thị B",
    role: "Backend Developer",
    avatar:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRH87TKQrWcl19xly2VNs0CjBzy8eaKNM-ZpA&s",
    title: "Tips phỏng vấn Backend (Java + Spring Boot)",
    content:
      "Để chuẩn bị tốt cho vòng phỏng vấn backend, bạn nên nắm chắc về OOP, database, REST API và cơ chế authentication.",
    image: "/logo-company.jpg",
    likes: 20,
    comments: [
      {
        id: 1,
        author: "Hoàng Văn E",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=John",
        content: "Kinh nghiệm rất quý báu! Thanks bạn nhé",
        timestamp: "3 giờ trước",
        likes: 5,
      },
    ],
    company: "Enterprise JSC",
  },
  {
    id: 3,
    author: "Nguyễn Văn A",
    role: "Frontend Developer",
    avatar:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRH87TKQrWcl19xly2VNs0CjBzy8eaKNM-ZpA&s",
    title: "Làm thế nào để trở thành Fresher Frontend?",
    content:
      "Mình muốn chia sẻ hành trình học ReactJS và Next.js để apply vào các công ty startup IT.",
    image: "/logo-company.jpg",
    likes: 12,
    comments: [
      {
        id: 1,
        author: "Lê Văn C",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Max",
        content: "Bài viết rất hữu ích! Cảm ơn bạn đã chia sẻ",
        timestamp: "2 giờ trước",
        likes: 3,
      },
    ],
    company: "Tech Startup VN",
  },
  {
    id: 4,
    author: "Trần Thị B",
    role: "Backend Developer",
    avatar:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRH87TKQrWcl19xly2VNs0CjBzy8eaKNM-ZpA&s",
    title: "Tips phỏng vấn Backend (Java + Spring Boot)",
    content:
      "Để chuẩn bị tốt cho vòng phỏng vấn backend, bạn nên nắm chắc về OOP, database, REST API và cơ chế authentication.",
    image: "/logo-company.jpg",
    likes: 20,
    comments: [
      {
        id: 1,
        author: "Hoàng Văn E",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=John",
        content: "Kinh nghiệm rất quý báu! Thanks bạn nhé",
        timestamp: "3 giờ trước",
        likes: 5,
      },
    ],
    company: "Enterprise JSC",
  },
  {
    id: 5,
    author: "Nguyễn Văn A",
    role: "Frontend Developer",
    avatar:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRH87TKQrWcl19xly2VNs0CjBzy8eaKNM-ZpA&s",
    title: "Làm thế nào để trở thành Fresher Frontend?",
    content:
      "Mình muốn chia sẻ hành trình học ReactJS và Next.js để apply vào các công ty startup IT.",
    image: "/logo-company.jpg",
    likes: 12,
    comments: [
      {
        id: 1,
        author: "Lê Văn C",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Max",
        content: "Bài viết rất hữu ích! Cảm ơn bạn đã chia sẻ",
        timestamp: "2 giờ trước",
        likes: 3,
      },
    ],
    company: "Tech Startup VN",
  },
  {
    id: 6,
    author: "Trần Thị B",
    role: "Backend Developer",
    avatar:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRH87TKQrWcl19xly2VNs0CjBzy8eaKNM-ZpA&s",
    title: "Tips phỏng vấn Backend (Java + Spring Boot)",
    content:
      "Để chuẩn bị tốt cho vòng phỏng vấn backend, bạn nên nắm chắc về OOP, database, REST API và cơ chế authentication.",
    image: "/logo-company.jpg",
    likes: 20,
    comments: [
      {
        id: 1,
        author: "Hoàng Văn E",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=John",
        content: "Kinh nghiệm rất quý báu! Thanks bạn nhé",
        timestamp: "3 giờ trước",
        likes: 5,
      },
    ],
    company: "Enterprise JSC",
  },
];

export const companyPosts = [
  {
    id: 1,
    company: "VNG Corporation",
    companyLogo: "/logo-company.jpg",
    title: "Chia sẻ về cách tối ưu microservices trong hệ thống lớn",
    author: "Nguyễn Văn A",
    date: "25/08/2025",
  },
  {
    id: 2,
    company: "FPT Software",
    companyLogo: "/logo-company.jpg",
    title: "Kinh nghiệm triển khai CI/CD với GitLab",
    author: "Trần Thị B",
    date: "24/08/2025",
  },
  {
    id: 3,
    company: "VNG Corporation",
    companyLogo: "/logo-company.jpg",
    title: "Chia sẻ về cách tối ưu microservices trong hệ thống lớn",
    author: "Nguyễn Văn A",
    date: "25/08/2025",
  },
  {
    id: 4,
    company: "FPT Software",
    companyLogo: "/logo-company.jpg",
    title: "Kinh nghiệm triển khai CI/CD với GitLab",
    author: "Trần Thị B",
    date: "24/08/2025",
  },
];

export const jobToday = [
  {
    company: "SUPERCENT VIETNAM",
    logo: "https://salt-2.topdev.vn/OWJqrk-PC_p6Bdjrm80orWhLwa432_hPbIwt2gcSj5o/rs:fit/w:100/h:70/el:1/g:ce/ext:webp/aHR0cHM6Ly9hc3NldHMudG9wZGV2LnZuL2ltYWdlcy8yMDI1LzA4LzE0L1RvcERldi1Mb2dvLUpPWUJJVEA4eC0xNzU1MTYwNzgzLnBuZw",
    position: "Video Editor (Game)",
    skills: ["Unity", "Game"],  
  },
  {
    company: "ZEDER VIỆT NAM",
    logo: "https://salt-2.topdev.vn/rbOgLV9dRG3rtX3X31Z03Oxu_M6su9TJ5HXl9fEsHYo/rs:fit/w:100/h:70/el:1/g:ce/ext:webp/aHR0cHM6Ly9hc3NldHMudG9wZGV2LnZuL2ltYWdlcy8yMDI1LzA4LzA1L1RvcERldi0xMzk0YjhjNmZjYTdmM2I1MTRiZGRhYTRkZGRiYzViOC0xNzU0MzY1NDQyLnBuZw",
    position: "Automation & AI System Lead",
    skills: ["JavaScript", "Python", "AI"],
  },
  {
    company: "BIN CORPORATION GROUP VIỆT NAM",
    logo: "https://salt-2.topdev.vn/RW_2-Xvdb3lgpxi6ItXb0q2ctD89UOkURuvL_M5NrGg/rs:fit/w:100/h:70/el:1/g:ce/ext:webp/aHR0cHM6Ly9hc3NldHMudG9wZGV2LnZuL2ltYWdlcy8yMDI1LzA3LzA4L1RvcERldi1SMEVVSXlHRUNGSGF4SUVDLTE3NTE5NjEwOTIucG5n",
    position: "Software Project Manager",
    skills: ["Project Manager", "Software", "AI"],
  },
  {
    company: "SUPERCENT VIETNAM",
    logo: "https://salt-2.topdev.vn/OWJqrk-PC_p6Bdjrm80orWhLwa432_hPbIwt2gcSj5o/rs:fit/w:100/h:70/el:1/g:ce/ext:webp/aHR0cHM6Ly9hc3NldHMudG9wZGV2LnZuL2ltYWdlcy8yMDI1LzA4LzE0L1RvcERldi1Mb2dvLUpPWUJJVEA4eC0xNzU1MTYwNzgzLnBuZw",
    position: "Video Editor (Game)",
    skills: ["Unity", "Game"],
  },
  {
    company: "ZEDER VIỆT NAM",
    logo: "https://salt-2.topdev.vn/rbOgLV9dRG3rtX3X31Z03Oxu_M6su9TJ5HXl9fEsHYo/rs:fit/w:100/h:70/el:1/g:ce/ext:webp/aHR0cHM6Ly9hc3NldHMudG9wZGV2LnZuL2ltYWdlcy8yMDI1LzA4LzA1L1RvcERldi0xMzk0YjhjNmZjYTdmM2I1MTRiZGRhYTRkZGRiYzViOC0xNzU0MzY1NDQyLnBuZw",
    position: "Automation & AI System Lead",
    skills: ["JavaScript", "Python", "AI"],
  },
  {
    company: "BIN CORPORATION GROUP VIỆT NAM",
    logo: "https://salt-2.topdev.vn/RW_2-Xvdb3lgpxi6ItXb0q2ctD89UOkURuvL_M5NrGg/rs:fit/w:100/h:70/el:1/g:ce/ext:webp/aHR0cHM6Ly9hc3NldHMudG9wZGV2LnZuL2ltYWdlcy8yMDI1LzA3LzA4L1RvcERldi1SMEVVSXlHRUNGSGF4SUVDLTE3NTE5NjEwOTIucG5n",
    position: "Software Project Manager",
    skills: ["Project Manager", "Software", "AI"],
  },
];

// HR Dashboard Mock Data
export const hrStats = {
  openJobs: 12,
  newCandidates: 8,
  todayInterviews: 3,
  totalApplications: 245,
};

export const hrJobs = [
  {
    id: 1,
    title: "Senior Full Stack Developer",
    department: "Engineering",
    location: "Remote",
    salary: "$80k - $120k",
    status: "open" as const,
    applicants: 24,
    datePosted: "2025-01-20",
    skills: ["React", "Node.js", "TypeScript"],
  },
  {
    id: 2,
    title: "Product Designer (UI/UX)",
    department: "Design",
    location: "Ho Chi Minh City",
    salary: "$60k - $90k",
    status: "draft" as const,
    applicants: 0,
    datePosted: "2025-01-25",
    skills: ["Figma", "Sketch", "Prototyping"],
  },
  {
    id: 3,
    title: "DevOps Engineer",
    department: "Engineering",
    location: "Hybrid",
    salary: "$70k - $100k",
    status: "closed" as const,
    applicants: 18,
    datePosted: "2025-01-15",
    skills: ["AWS", "Docker", "Kubernetes"],
  },
];

export const hrCandidates = [
  {
    id: 1,
    name: "Nguyen Van A",
    email: "nguyenvana@email.com",
    phone: "+84 912 345 678",
    position: "Senior Full Stack Developer",
    experience: "5 years",
    skills: ["React", "Node.js", "MongoDB"],
    status: "phone_screen",
    dateApplied: "2025-01-22",
    rating: 4.5,
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    resume: "resume-nguyen-van-a.pdf",
    notes: "Strong technical background, good communication skills",
  },
  {
    id: 2,
    name: "Tran Thi B",
    email: "tranthib@email.com",
    phone: "+84 913 456 789",
    position: "Product Designer",
    experience: "3 years",
    skills: ["Figma", "Adobe XD", "User Research"],
    status: "applied",
    dateApplied: "2025-01-21",
    rating: 4.2,
    avatar:
      "https://images.unsplash.com/photo-1494790108755-2616b612b766?w=150&h=150&fit=crop&crop=face",
    resume: "resume-tran-thi-b.pdf",
    notes: "Great portfolio, needs more enterprise experience",
  },
];

export const hrPipelineStages = [
  { id: "applied", name: "Applied", color: "bg-blue-500" },
  { id: "phone_screen", name: "Phone Screen", color: "bg-yellow-500" },
  { id: "technical", name: "Technical", color: "bg-purple-500" },
  { id: "onsite", name: "Onsite", color: "bg-orange-500" },
  { id: "offer", name: "Offer", color: "bg-green-500" },
  { id: "hired", name: "Hired", color: "bg-emerald-600" },
  { id: "rejected", name: "Rejected", color: "bg-red-500" },
];

export const hrActivities = [
  {
    id: 1,
    type: "new_application",
    message:
      "New application from Nguyen Van A for Senior Full Stack Developer",
    timestamp: "2025-01-26T09:30:00Z",
    user: "Nguyen Van A",
  },
  {
    id: 2,
    type: "interview_scheduled",
    message: "Interview scheduled with Tran Thi B for tomorrow 2:00 PM",
    timestamp: "2025-01-26T08:15:00Z",
    user: "Tran Thi B",
  },
  {
    id: 3,
    type: "job_posted",
    message: "New job posted: DevOps Engineer",
    timestamp: "2025-01-25T16:45:00Z",
    user: "HR Team",
  },
];

export const hrTeamMembers = [
  {
    id: 1,
    name: "Le Van C",
    email: "levanc@company.com",
    role: "HR Manager",
    avatar:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    status: "active",
  },
  {
    id: 2,
    name: "Pham Thi D",
    email: "phamthid@company.com",
    role: "Recruiter",
    avatar:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
    status: "active",
  },
];

