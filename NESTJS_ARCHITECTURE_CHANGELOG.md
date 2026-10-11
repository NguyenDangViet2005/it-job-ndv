# TÀI LIỆU CHUẨN HÓA KIẾN TRÚC VÀ REQUEST LIFECYCLE (NESTJS)

Tài liệu này tổng hợp toàn bộ các thay đổi kiến trúc, các file được tạo mới/cập nhật, cùng tác dụng chi tiết của từng thành phần nhằm chuẩn hóa ứng dụng Backend NestJS theo chuẩn Enterprise, chống triệt để lỗi Circular Dependency và tối ưu luồng xử lý Request.

---

## I. TỔNG QUAN VÒNG ĐỜI REQUEST LIFECYCLE (PIPELINE)

Mọi HTTP Request khi đi vào hệ thống Backend được thực thi tuần tự theo chu trình chuẩn:

```
[ Client Request ]
       │
       ▼
1. MIDDLEWARE
   ├── Helmet / CookieParser / Morgan (Express Global)
   ├── RequestIdMiddleware (Gán/Đọc X-Request-Id)
   └── RequestLoggerMiddleware (Log Method, URL, IP, User-Agent, Thời gian xử lý ms)
       │
       ▼
2. GUARDS
   ├── ThrottlerGuard (Giới hạn Rate-Limit chống DDoS)
   ├── JwtAuthGuard (Xác thực người dùng; bỏ qua nếu có @Public())
   └── RolesGuard (Phân quyền RBAC qua @Roles())
       │
       ▼
3. INTERCEPTOR (Pre-Controller)
   └── SecurityInterceptor (Kiểm tra an ninh: Anti-replay timestamp, Signature HMAC, Decryption hook)
       │
       ▼
4. PIPES
   └── ValidationPipe (Validate DTO, Transform kiểu dữ liệu, loại bỏ trường thừa - Whitelist)
       │
       ▼
5. CONTROLLER & SERVICE
   ├── Route Handler thực thi nghiệp vụ logic
   └── Tùy chọn gắn @ResponseMessage('...') để định nghĩa thông điệp phản hồi
       │
       ▼
6. INTERCEPTOR (Post-Controller)
   └── TransformInterceptor (Chuẩn hóa toàn bộ Response đầu ra thành định dạng JSON đồng nhất)
       │
       ▼
[ Client Response (2xx) ]

──────────────────────────────────────────────────────────
* KHI XẢY RA LỖI (EXCEPTION THROWN TẠI BẤT KỲ BƯỚC NÀO):
       │
       ▼
7. EXCEPTION FILTER
   └── AllExceptionsFilter (Bắt mọi ngoại lệ, chuẩn hóa Error JSON khớp 100% với định dạng đầu ra)
       │
       ▼
[ Client Error Response (4xx / 5xx) ]
```

---

## II. CHI TIẾT DANH SÁCH FILE ĐÃ TẠO MỚI & CẬP NHẬT

### 1. Nhóm Middlewares (`src/common/middlewares/`)

| File | Hành động | Tác dụng & Chi tiết kỹ thuật |
| :--- | :--- | :--- |
| `request-id.middleware.ts` | **Tạo mới** | Đọc header `x-request-id` từ Client hoặc tự động sinh mã UUID duy nhất (`crypto.randomUUID()`). Gán vào context `req.requestId` và header phản hồi `res.setHeader('x-request-id', ...)`. Giúp trace log xuyên suốt qua Middleware, Guard, Interceptor, Controller, Filter. |
| `request-logger.middleware.ts` | **Tạo mới** | Sử dụng NestJS `Logger` để ghi log chi tiết khi request hoàn tất: Method, URL, Status Code, thời gian phản hồi (`ms`), IP, User-Agent và Request ID. Phân loại mức log: `error` (>=500), `warn` (>=400), `log` (<400). |
| `index.ts` | **Tạo mới** | Barrel export gom nhóm các middlewares giúp import ngắn gọn và sạch sẽ. |

---

### 2. Nhóm Decorators (`src/common/decorators/`)

| File | Hành động | Tác dụng & Chi tiết kỹ thuật |
| :--- | :--- | :--- |
| `public.decorator.ts` | **Tạo mới** | Cung cấp decorator `@Public()`. Đánh dấu các route không yêu cầu JWT Authentication (như Login, Register, Public Jobs...). Khi áp dụng `JwtAuthGuard`, guard sẽ đọc metadata này qua `Reflector` để cho phép truy cập mà không chặn lại. |
| `response-message.decorator.ts` | **Tạo mới** | Cung cấp decorator `@ResponseMessage('Thông điệp')`. Cho phép Controller chỉ cần trả về dữ liệu thuần (`data`), Interceptor đầu ra sẽ tự động lấy thông điệp từ decorator này để gán vào response mà không cần bọc thủ công. |
| `skip-transform.decorator.ts` | **Tạo mới** | Cung cấp decorator `@SkipTransform()`. Bỏ qua cơ chế bọc chuẩn hóa response của `TransformInterceptor` đối với các trường hợp đặc biệt như: xuất file, streaming binary, OAuth redirect, hoặc webhook của bên thứ ba. |
| `security-check.decorator.ts` | **Tạo mới** | Cung cấp decorator `@SecurityCheck(options)`. Cấu hình yêu cầu an ninh nâng cao cho Pre-Controller Interceptor (bắt buộc chữ ký HMAC, giới hạn độ lệch thời gian chống replay attack, yêu cầu giải mã payload...). |
| `index.ts` | **Tạo mới** | Barrel export chuẩn toàn bộ decorators trong thư mục `src/common/decorators/`. |

---

### 3. Nhóm Interceptors (`src/common/interceptors/`)

| File | Hành động | Tác dụng & Chi tiết kỹ thuật |
| :--- | :--- | :--- |
| `security.interceptor.ts` | **Tạo mới** | **Pre-Controller Interceptor**: Chạy trước khi request vào Pipe và Controller Handler.<br/>- Đọc metadata `@SecurityCheck()` qua `Reflector`.<br/>- Kiểm tra header `x-timestamp` chống Replay Attack (`validateTimestamp`).<br/>- Cung cấp sẵn các hooks mở rộng: `validateSignature` (HMAC/Chữ ký số), `decryptPayload` (giải mã end-to-end), `customSecurityHooks`. |
| `transform.interceptor.ts` | **Tạo mới** | **Post-Controller Interceptor**: Chạy sau khi Controller hoàn tất để chuẩn hóa dữ liệu trả về.<br/>- Cấu trúc chuẩn: `{ success, statusCode, message, data, requestId, timestamp, path }`.<br/>- **Xử lý Unwrap thông minh**: Tự động nhận diện nếu controller cũ đã trả về `{ message, data }` hoặc `{ success, data }` để bóc tách, tránh lỗi lồng nhau (`data: { data: ... }`).<br/>- Tự động bỏ qua nếu phát hiện `response.headersSent` (OAuth redirects) hoặc có `@SkipTransform()`. |
| `transform.interceptor.spec.ts` | **Tạo mới** | Bộ Unit Test hoàn chỉnh cho `TransformInterceptor` chạy với Vitest, kiểm tra việc chuẩn hóa dữ liệu và bóc tách unwrap tự động. |
| `index.ts` | **Tạo mới** | Barrel export cho toàn bộ interceptors. |

---

### 4. Nhóm Guards & Filters (`src/common/guards/`, `src/common/filters/`)

| File | Hành động | Tác dụng & Chi tiết kỹ thuật |
| :--- | :--- | :--- |
| `jwt-auth.guard.ts` | **Cập nhật** | Tích hợp `Reflector` để kiểm tra decorator `@Public()`. Nếu route hoặc controller có `@Public()`, guard trả về `true` ngay lập tức, không bắt buộc bearer token. |
| `guards/index.ts` | **Tạo mới** | Barrel export cho các Guards (`jwt-auth`, `roles`, `google-auth`, `facebook-auth`). |
| `all-exceptions.filter.ts` | **Cập nhật** | - Bổ sung `requestId` vào Error Response để khớp với log trace.<br/>- Sử dụng `request.originalUrl` chuẩn xác.<br/>- Cấu trúc Error Response được đồng bộ hoàn toàn với cấu trúc Success Response của `TransformInterceptor`. |

---

### 5. Quản lý Vòng đời Database / Prisma (`src/prisma/`)

| File | Hành động | Tác dụng & Chi tiết kỹ thuật |
| :--- | :--- | :--- |
| `prisma.service.ts` | **Tạo mới** | Service quản lý kết nối cơ sở dữ liệu tích hợp vào NestJS IoC Container.<br/>- `onModuleInit`: Tự động kết nối DB khi ứng dụng khởi động và log trạng thái.<br/>- `onModuleDestroy`: Tự động đóng kết nối cơ sở dữ liệu an toàn khi ứng dụng shutdown (Graceful Shutdown).<br/>- Xuất `db` và `orm` tương thích 100% với code hiện tại. |
| `prisma.module.ts` | **Tạo mới** | Module `@Global()` xuất `PrismaService`. Giúp các module khác có thể inject `PrismaService` bất cứ đâu mà không cần khai báo lại imports nhiều lần. |

---

### 6. Cấu hình Ứng dụng Trung tâm (`src/app.module.ts`)

| File | Hành động | Tác dụng & Chi tiết kỹ thuật |
| :--- | :--- | :--- |
| `app.module.ts` | **Cập nhật** | - Khai báo `PrismaModule` ở tầng Core Modules.<br/>- Đăng ký `SecurityInterceptor` qua provider `APP_INTERCEPTOR` (chạy trước controller).<br/>- Đăng ký `TransformInterceptor` qua provider `APP_INTERCEPTOR` (chạy sau controller).<br/>- Implement `NestModule` với phương thức `configure(consumer: MiddlewareConsumer)` để gắn `RequestIdMiddleware` và `RequestLoggerMiddleware` cho toàn bộ các routes (`*`). |

---

## III. CHUẨN ĐỊNH DẠNG RESPONSE TRẢ VỀ CHO CLIENT

### 1. Phản hồi thành công (Success Response - 2xx)

Toàn bộ API thành công sẽ được `TransformInterceptor` tự động bao bọc theo cấu trúc:

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Lấy thông tin người dùng thành công",
  "data": {
    "id": 1,
    "email": "user@example.com",
    "fullname": "Nguyễn Văn A"
  },
  "requestId": "2e8fd81b-5684-4ce9-8664-89c20173bc5b",
  "timestamp": "2026-10-11T14:15:30.123Z",
  "path": "/api/user/1"
}
```

### 2. Phản hồi lỗi (Error Response - 4xx / 5xx)

Mọi ngoại lệ (Validation error, Unauthorized, Forbidden, Internal Server Error) sẽ được `AllExceptionsFilter` bắt và định dạng đồng nhất:

```json
{
  "success": false,
  "statusCode": 400,
  "message": "Email không đúng định dạng, Mật khẩu phải có tối thiểu 6 ký tự",
  "error": "Bad Request",
  "requestId": "2e8fd81b-5684-4ce9-8664-89c20173bc5b",
  "timestamp": "2026-10-11T14:15:30.456Z",
  "path": "/api/auth/register"
}
```

---

## IV. KIẾN TRÚC DEPENDENCY & QUY TẮC CHỐNG CIRCULAR DEPENDENCY

Để ứng dụng Backend mở rộng an toàn mà không bao giờ gặp lỗi vòng lặp phụ thuộc (Circular Dependency):

### 1. Mô hình phân cấp 3 tầng (Layered Module Architecture)

```
        ┌────────────────────────────────────────────────────────┐
        │                 CORE / INFRASTRUCTURE                  │
        │   PrismaModule (Global), CloudinaryModule (Global)    │
        └───────────────────────────┬────────────────────────────┘
                                    │ (chỉ cung cấp xuống dưới)
                                    ▼
        ┌────────────────────────────────────────────────────────┐
        │                     COMMON LAYER                       │
        │ Middlewares, Guards, Interceptors, Filters, Decorators │
        └───────────────────────────┬────────────────────────────┘
                                    │ (độc lập, không import feature)
                                    ▼
        ┌────────────────────────────────────────────────────────┐
        │                    FEATURE MODULES                     │
        │  AuthModule, UserModule, JobModule, CompanyModule...   │
        └────────────────────────────────────────────────────────┘
```

### 2. Ba quy tắc vàng chống Circular Dependency

1. **Phụ thuộc 1 chiều (Unidirectional Dependency)**:
   - Feature Modules chỉ import các module nằm ở mức thấp hơn.
   - Nếu `AuthModule` cần `UserModule` để tra cứu thông tin tài khoản, `UserModule` không được import ngược lại `AuthModule`.
2. **Giao tiếp liên module bằng Sự kiện (Event-Driven với EventEmitter2)**:
   - Khi `UserModule` xoá một người dùng và cần dọn dẹp các hồ sơ ứng tuyển, bài đăng, công ty:
     - **Không nên**: `UserModule` inject `JobService`, `CompanyService`, `ApplicationService`.
     - **Nên làm**: `UserModule` phát ra sự kiện `this.eventEmitter.emit('user.deleted', { userId })`. Các service khác chỉ cần dùng `@OnEvent('user.deleted')` để tự xử lý. Điều này triệt tiêu hoàn toàn sự phụ thuộc trực tiếp.
3. **Giải pháp cứu cánh khi bắt buộc phụ thuộc hai chiều: `forwardRef()`**:
   - Trong trường hợp 2 module bắt buộc phải dùng lẫn nhau:
     ```typescript
     // Trong Module:
     @Module({
       imports: [forwardRef(() => UserModule)],
     })

     // Trong Constructor Service:
     constructor(
       @Inject(forwardRef(() => UserService))
       private readonly userService: UserService,
     ) {}
     ```

---

## V. HƯỚNG DẪN SỬ DỤNG CHO LẬP TRÌNH VIÊN

### 1. Viết Controller với Response chuẩn

Nhờ có `TransformInterceptor`, bạn không cần phải tự gõ `{ success: true, message: '...', data: ... }` nữa:

```typescript
import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { ResponseMessage } from '~/common/decorators/index.js';
import { UserService } from './user.service.js';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get(':id')
  @ResponseMessage('Lấy chi tiết người dùng thành công')
  async getUser(@Param('id', ParseIntPipe) id: number) {
    // Chỉ cần trả về dữ liệu nghiệp vụ thuần
    return this.userService.getUserById(id);
  }
}
```

### 2. Khai báo Route Public không cần token

```typescript
import { Controller, Get } from '@nestjs/common';
import { Public } from '~/common/decorators/index.js';

@Controller('jobs')
export class JobController {
  @Get('public-list')
  @Public() // Bỏ qua kiểm tra JWT của JwtAuthGuard
  getPublicJobs() {
    return this.jobService.getFeaturedJobs();
  }
}
```

### 3. Áp dụng kiểm tra bảo mật (Pre-Controller Security)

```typescript
import { Controller, Post, Body } from '@nestjs/common';
import { SecurityCheck } from '~/common/decorators/index.js';

@Controller('sensitive')
export class SensitiveController {
  @Post('transfer')
  @SecurityCheck({
    maxTimestampDiffMs: 300000, // Chống replay attack quá 5 phút
    requireSignature: true,      // Yêu cầu chữ ký x-signature
  })
  handleSensitiveOperation(@Body() dto: any) {
    return { status: 'processed' };
  }
}
```

---

## VI. KẾT QUẢ KIỂM THỬ HỆ THỐNG
- **Kiểm tra Circular Dependency**: `npx madge --circular --extensions ts src` -> `√ No circular dependency found!`
- **Biên dịch SWC (`npm run build`)**: 143 files biên dịch thành công, 0 lỗi cú pháp.
- **Unit Test (`npm run test`)**: 100% test cases pass.
