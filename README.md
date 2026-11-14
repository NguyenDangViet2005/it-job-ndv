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

## Chạy local với Docker Compose

Mở Docker Desktop, rồi chạy các lệnh PowerShell sau ở thư mục gốc của repo. Chỉ tạo `.env.docker` ở lần đầu để giữ nguyên khóa JWT giữa các lần chạy.

```powershell
if (-not (Test-Path .env.docker)) {
  $random = [Security.Cryptography.RandomNumberGenerator]::Create()
  $lines = foreach ($key in 'JWT_ACCESS_SECRET', 'JWT_REFRESH_SECRET') {
    $bytes = New-Object byte[] 32
    $random.GetBytes($bytes)
    "$key=$([Convert]::ToBase64String($bytes))"
  }
  $random.Dispose()
  $lines | Set-Content .env.docker -Encoding ascii
}
docker compose up -d --build --remove-orphans
docker compose ps
```

- Web mở tại [http://localhost:3001](http://localhost:3001). API health ở [http://localhost:8081/api/health](http://localhost:8081/api/health).
- Compose chạy bốn service gồm `web`, `api`, `postgres` và `redis`. Khi khởi động, container `api` đợi PostgreSQL và Redis sẵn sàng, áp schema Prisma local rồi chạy NestJS. Database mới chỉ có schema, nên cần tạo hoặc nhập dữ liệu local để thấy danh sách việc làm.
- Compose dùng PostgreSQL 15 và volume `postgres15-data`. Volume `postgres-data` từ cấu hình PostgreSQL 17 trước đây được lưu riêng. Database 15 bắt đầu trống khi tạo volume mới.
- Image API của Compose dùng target `local` có Prisma CLI. Script khởi động chuẩn hóa biểu thức `CHECK` cho PostgreSQL 15 trong một bản sao contract. Target `runtime` mặc định chạy NestJS trực tiếp và cần database đã có schema.
- `--remove-orphans` dọn container `db-init` cũ nếu đã từng chạy cấu hình Compose trước đây.
- `NEXT_PUBLIC_BE_ENDPOINT` được đưa vào bundle khi build để browser gọi API. Server Next.js dùng `API_INTERNAL_URL=http://api:8081/api` để gọi qua mạng Compose. Cấu hình này dành cho máy local.
- Compose bật `COOKIE_ALLOW_LOCAL_HTTP` để kiểm thử refresh cookie qua HTTP. Cờ này chỉ áp dụng khi `CLIENT_URL` là `http://localhost` với cổng tùy chọn.
- Nếu trùng cổng, đặt `$env:WEB_PORT = "3002"` hoặc `$env:API_PORT = "8082"` rồi chạy lại `docker compose up -d --build`. Mở web bằng hostname `localhost` để khớp cấu hình API, CORS và cookie.
- Để dùng upload và OAuth, điền biến tùy chọn từ `.env.docker.example` vào `.env.docker` rồi chạy `docker compose up -d api`. Google dùng callback `/api/auth/callback/google` và Facebook dùng `/api/auth/facebook/callback` trên URL API đã đăng ký với từng nhà cung cấp.

```powershell
docker compose logs -f web api
docker compose down
```

`docker compose down` giữ volume PostgreSQL. Lần sau chạy lại bằng `docker compose up -d`, hoặc thêm `--build` khi có thay đổi source hay cấu hình build.

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
