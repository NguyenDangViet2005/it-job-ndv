# IT Job Platform - Nền Tảng Tuyển Dụng Công Nghệ Hàng Đầu

[![Live Demo](https://img.shields.io/badge/Demo-Live%20Website-brightgreen?style=for-the-badge&logo=vercel)](https://it-job-ndv.vercel.app)
[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-blue?style=for-the-badge&logo=react)](https://react.dev/)
[![NestJS](https://img.shields.io/badge/NestJS-12-red?style=for-the-badge&logo=nestjs)](https://nestjs.com/)
[![Prisma](https://img.shields.io/badge/Prisma-8-indigo?style=for-the-badge&logo=prisma)](https://www.prisma.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Neon-336791?style=for-the-badge&logo=postgresql)](https://neon.tech/)

![IT Job Platform Banner](docs/images/banner.png)

Hệ sinh thái tuyển dụng và kết nối việc làm ngành Công nghệ Thông tin (IT) tại Việt Nam. Dự án được xây dựng theo mô hình Monorepo hiện đại với Frontend tối ưu bằng **Next.js 16 (App Router) & React 19**, kết hợp Backend kiến trúc doanh nghiệp chuẩn mực bằng **NestJS 12**, **Prisma ORM 8** và cơ sở dữ liệu **PostgreSQL (Neon Serverless)**.

---

## 🌐 Trải Nghiệm Trực Tuyến

- **Production URL:** [https://it-job-ndv.vercel.app](https://it-job-ndv.vercel.app)
- **Trang chủ & Tìm việc:** [https://it-job-ndv.vercel.app/trang-chu](https://it-job-ndv.vercel.app/trang-chu)

---

## 📁 Cấu Trúc Dự Án (Monorepo)

```text
IT-JOB/
├── be-nestjs/                 # Backend API kiến trúc Enterprise (NestJS 12, Prisma 8, PostgreSQL)
│   ├── src/
│   │   ├── common/            # Pipeline chuẩn: Decorators, Guards, Interceptors, Filters, Middlewares
│   │   ├── modules/           # Domain Modules: Auth, Users, Jobs, Companies, Blogs, Roles, Cloudinary...
│   │   ├── database/          # Prisma Service & Database Connection
│   │   └── main.ts            # Entrypoint Backend cấu hình CORS, Helmet, Cookie, ValidationPipe
│   ├── migrations/            # Lịch sử Schema Database Migrations
│   └── prisma.config.ts       # Cấu hình Prisma ORM 8 & Contract Engine
│
├── FE/                        # Frontend Next.js 16 App Router & React 19
│   ├── public/                # Static assets, fonts, icons, illustrations
│   └── src/
│       ├── app/               # App Router: (auth), (protected), (public), layout, globals
│       ├── components/        # UI Primitives (Radix/Shadcn), Features, Forms, Layouts
│       ├── contexts/          # Auth Provider (Deduplicated Token Refresh), Theme Provider
│       ├── hooks/             # Custom React Hooks
│       ├── lib/               # Cấu hình API Client, Interceptors, Tiện ích xử lý dữ liệu
│       └── types/             # Định nghĩa Type TypeScript đồng bộ API DTO
│
└── docs/                      # Tài liệu dự án và hình ảnh minh họa
    └── images/                # Banner và Screenshots thực tế của nền tảng
```

---

## 🏗️ Công Nghệ Sử Dụng (Tech Stack)

### Frontend (`FE/`)
- **Core Framework:** [Next.js 16](https://nextjs.org/) (App Router, Turbopack)
- **Thư viện UI:** [React 19](https://react.dev/)
- **Ngôn ngữ:** TypeScript 5+
- **Styling:** Tailwind CSS v4 & Tailwind Merge
- **Hiệu ứng & Animation:** Motion (Framer Motion v12), GSAP, Lenis Smooth Scroll, Lottie Web, Typed.js
- **Component Primitives:** Radix UI (Shadcn/ui design tokens)
- **Quản lý Form & Validation:** React Hook Form & Zod
- **Trực quan hóa Dữ liệu:** Recharts
- **Bảo mật & Markdown:** React Markdown v10 kết hợp `rehype-sanitize` (chống XSS), `rehype-highlight`, `remark-gfm`
- **Giao diện & Theme:** `next-themes` (Chuyển đổi Light/Dark mode mượt mà)

### Backend (`be-nestjs/`)
- **Core Framework:** [NestJS 12](https://nestjs.com/) (Module-based, Dependency Injection)
- **Database & ORM:** [Prisma ORM 8](https://www.prisma.io/) (`@prisma/orm-postgres` contract-based) & PostgreSQL (Neon Serverless)
- **Xác thực & Bảo mật:**
  - JWT Authentication với Passport JWT, Google OAuth 2.0, Facebook OAuth
  - **Token Family Rotation:** Cơ chế xoay vòng Refresh Token nâng cao, phát hiện Token Reuse, Grace Period 15 giây
  - **Mã hóa một chiều SHA-256:** Refresh Token được băm bảo mật trước khi lưu trữ vào bảng `SessionLogins`
  - Access Token chỉ lưu trong Memory trên Client, Refresh Token bảo vệ qua HttpOnly Cookie
  - Rate Limiting chống Brute-force & DDoS bằng `@nestjs/throttler`
  - HTTP Header Security với `helmet`
- **Xử lý File & Media:** Multer kết hợp Cloudinary SDK (Kiểm soát chặt chẽ MIME type, dung lượng file và xử lý tệp SVG an toàn)
- **Kiến trúc Pipeline:**
  - `RequestIdMiddleware`: Gán mã trace `x-request-id` xuyên suốt vòng đời request
  - `RequestLoggerMiddleware`: Ghi log chi tiết thời gian phản hồi, IP, User-Agent
  - `JwtAuthGuard` & `RolesGuard`: Xác thực tập trung với decorator `@Public()` và phân quyền RBAC qua `@Roles()`
  - `TransformInterceptor`: Tự động unwrap và chuẩn hóa format JSON phản hồi đồng nhất
  - `AllExceptionsFilter`: Bắt và định dạng chuẩn mọi ngoại lệ trả về cho Client
- **Kiểm thử:** Vitest (Unit Tests & E2E Tests), Oxlint

---

## ⚡ Các Tính Năng Nổi Bật

1. **Phân quyền Đa Vai Trò (Multi-Role RBAC):**
   - **Ứng viên (Candidate):** Quản lý hồ sơ cá nhân, tạo và tải lên CV trực tuyến, tìm kiếm và ứng tuyển việc làm, theo dõi lịch sử ứng tuyển.
   - **Nhà tuyển dụng (HR / Company):** Quản lý trang thông tin doanh nghiệp, đăng tin tuyển dụng, sàng lọc và phê duyệt hồ sơ ứng viên theo quy trình chuyên nghiệp.
   - **Quản trị viên (Admin):** Kiểm duyệt tin tuyển dụng, quản lý tài khoản người dùng, xem báo cáo và số liệu thống kê toàn sàn.

2. **Tìm Kiếm Việc Làm Thông Minh:**
   - Bộ lọc chi tiết theo kỹ năng (ReactJS, NodeJS, Python, Java...), cấp bậc (Intern, Fresher, Junior, Senior, Lead), khoảng lương, hình thức làm việc (Remote, On-site, Hybrid) và địa điểm.
   - Gợi ý từ khóa HOT và tìm kiếm tức thì.

3. **Cơ Chế Xác Thực & Session Nâng Cao:**
   - Hỗ trợ đăng nhập mật khẩu truyền thống và Single Sign-On (Google, Facebook).
   - Cơ chế xoay vòng gia đình Refresh Token (Family Token Rotation): Nếu phát hiện token cũ đã bị sử dụng lại (Reuse Detection), toàn bộ các phiên trong Family đó sẽ bị thu hồi ngay lập tức để bảo vệ tài khoản người dùng.
   - Phía Frontend loại trừ hoàn toàn tình trạng gọi trùng lặp API Refresh Token khi người dùng F5 / reload nhiều tab.

4. **Bảo Mật Toàn Diện (Security Hardened):**
   - Loại bỏ nguy cơ tấn công XSS thông qua bộ lọc HTML `rehype-sanitize`.
   - Giới hạn MIME Type, dung lượng upload tệp CV (PDF/DOCX) và ảnh đại diện; tệp vector SVG được phân loại xử lý thô riêng biệt để ngăn mã thực thi độc hại.
   - Kiểm soát chính xác CORS Origin hỗ trợ cả localhost lẫn các domain production trên Vercel.

5. **Giao Diện Hiện Đại & Tối Ưu:**
   - Hỗ trợ Dark Mode / Light Mode hoàn chỉnh.
   - Thiết kế chuẩn Responsive cho cả Mobile, Tablet và Desktop.

---

## 📊 Kiến Trúc Vòng Đời Request (Backend Pipeline)

```mermaid
graph TD
    Client[Client Request] --> MW[Middlewares: Helmet, CookieParser, RequestId, Logger]
    MW --> Throttler[ThrottlerGuard: Rate Limit DDoS]
    Throttler --> AuthGuard[JwtAuthGuard: Check @Public & Token]
    AuthGuard --> RolesGuard[RolesGuard: RBAC @Roles]
    RolesGuard --> SecInterceptor[SecurityInterceptor: Anti-replay & HMAC]
    SecInterceptor --> Pipe[ValidationPipe: Whitelist DTO Transform]
    Pipe --> Controller[Controller & Service Handler]
    Controller --> Transform[TransformInterceptor: Format Response]
    Transform --> Success[Response: { success, statusCode, message, data, requestId }]

    Pipe -.->|Lỗi Validation| ExceptionFilter[AllExceptionsFilter]
    Controller -.->|Lỗi Nghiệp Vụ| ExceptionFilter
    ExceptionFilter --> Error[Response: { success: false, statusCode, message, requestId }]
```

---

## 🛠️ Hướng Dẫn Cài Đặt Dưới Local

### Yêu Cầu Tiên Quyết
- **Node.js** phiên bản 20+ hoặc 22+ (khuyến nghị).
- Cơ sở dữ liệu **PostgreSQL** (có thể sử dụng tài khoản miễn phí trên [Neon.tech](https://neon.tech) hoặc PostgreSQL local).
- Tài khoản **Cloudinary** (dành cho tính năng upload ảnh và CV).

---

### 1. Cài Đặt Backend (`be-nestjs`)

1. Di chuyển vào thư mục backend:
   ```bash
   cd be-nestjs
   ```

2. Cài đặt các gói phụ thuộc:
   ```bash
   npm install
   ```

3. Tạo file cấu hình môi trường `.env` dựa theo mẫu:
   ```env
   # Cấu hình Server
   PORT=8081
   CLIENT_URL=http://localhost:3000

   # Cơ sở dữ liệu PostgreSQL (Neon)
   DATABASE_URL="postgresql://user:password@ep-example.ap-southeast-1.aws.neon.tech/it_job_db?sslmode=require"

   # JWT Tokens
   JWT_ACCESS_SECRET=your_jwt_access_secret_key_minimum_32_chars
   JWT_REFRESH_SECRET=your_jwt_refresh_secret_key_minimum_32_chars
   JWT_ACCESS_EXPIRES_IN=15m
   JWT_REFRESH_EXPIRES_IN=7d

   # Cloudinary Media Storage
   CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   CLOUDINARY_CLOUD_FOLDER=it_job_platform

   # Rate Limit
   THROTTLE_TTL=60000
   THROTTLE_LIMIT=100
   ```

4. Đồng bộ Schema Prisma với Cơ sở dữ liệu:
   ```bash
   npx prisma db pull
   ```

5. Khởi chạy server ở chế độ Development (tự động reload khi code thay đổi):
   ```bash
   npm run start:dev
   ```
   Backend API sẽ hoạt động tại: `http://localhost:8081`

---

### 2. Cài Đặt Frontend (`FE`)

1. Mở một terminal mới và di chuyển vào thư mục frontend:
   ```bash
   cd FE
   ```

2. Cài đặt các gói phụ thuộc:
   ```bash
   npm install
   ```

3. Tạo file cấu hình `.env` cho Frontend:
   ```env
   NEXT_PUBLIC_BE_ENDPOINT=http://localhost:8081/api
   ```

4. Khởi chạy ứng dụng Frontend với Turbopack:
   ```bash
   npm run dev
   ```
   Truy cập giao diện web tại: [http://localhost:3000](http://localhost:3000)

---

## 🧪 Kiểm Thử & Kiểm Tra Mã Nguồn (Testing & Linting)

### Backend
```bash
cd be-nestjs

# Chạy Unit Tests với Vitest
npm run test

# Chạy E2E Tests
npm run test:e2e

# Kiểm tra chất lượng code với Oxlint
npm run lint

# Build kiểm tra kiểu dữ liệu TypeScript
npm run build
```

### Frontend
```bash
cd FE

# Kiểm tra cú pháp và kiểu dữ liệu
npx tsc --noEmit

# Chạy ESLint
npm run lint

# Tạo bản build production
npm run build
```

---

## 📄 Bản Quyền & Giấy Phép (License)

Dự án được phát triển phục vụ mục đích học tập và xây dựng sản phẩm chất lượng cao. Bản quyền thuộc về tác giả.
