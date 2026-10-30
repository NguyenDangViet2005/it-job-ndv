<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Project setup

```bash
$ npm install
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Run tests

Backend dùng **Vitest**, không phải Jest. Các file `*.service.spec.ts` nằm cạnh
service trong 13 module: auth, application, job, user, company, post, connection,
blog, skill, follow, review, search và cloudinary.

```bash
# unit tests
$ npm run test

# chạy riêng một service (nên đọc FollowService trước)
$ npm test -- src/modules/follow/follow.service.spec.ts

# theo dõi test khi sửa code
$ npm run test:watch -- src/modules/skill/skill.service.spec.ts

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

### Cách đọc service unit test

- **Arrange:** `mockResolvedValue(...)` giả lập kết quả repository hoặc dịch vụ ngoài.
- **Act:** gọi method của service thật.
- **Assert:** dùng `expect(...)` kiểm tra kết quả/lỗi và tác dụng phụ. Ví dụ:
  bị từ chối quyền thì repository không được ghi dữ liệu.
- `beforeEach` reset mock và tạo service mới để các case độc lập.
- Dùng mapper thật; mock repository, JWT, bcrypt và Cloudinary SDK ở nơi cần.
  Không cần database hoặc tài khoản Cloudinary để chạy service unit test.
- `withTransaction` được mock để chạy callback. Các test này không chứng minh
  rollback, khóa hay constraint trên DB thật; cần integration test riêng cho chúng.
- Auth dùng fake timers và timestamp Temporal để kiểm tra hạn OAuth code và ranh
  giới grace period. Sau mỗi case đều dọn timer và khôi phục biến môi trường.

Nên đọc theo thứ tự: `follow.service.spec.ts` → `skill.service.spec.ts` →
`review.service.spec.ts` → `application.service.spec.ts` → `auth.service.spec.ts`.
Location và BlogCategory chưa có service unit test vì chủ yếu đọc/chuyển tiếp dữ liệu.

### Integration test với PostgreSQL thật

Integration test đặt cạnh code của từng module, chạy service, repository,
mapper và `withTransaction` thật, không mock database:

```text
src/modules/<module>/<module>.integration-spec.ts
src/prisma/db.integration-spec.ts
```

Phần cấu hình môi trường, fixture và cleanup dùng chung nằm trong
`test/integration/`. Hiện có 68 case trong 15 file, gồm 14 module truy cập
database và nhóm test database:

| Module | Case | Phạm vi chính |
| --- | ---: | --- |
| Auth | 10 | Bcrypt/JWT thật, đăng ký/đăng nhập, rotation/reuse, logout, HR, liên kết profile OAuth, claim session đồng thời |
| Application | 7 | CV, dữ liệu quan hệ, đơn trùng, tin đóng/hết hạn, quyền duyệt và hủy đơn |
| Blog | 4 | CRUD, quyền tác giả, lọc/phân trang, khóa ngoại danh mục |
| BlogCategory | 2 | Đọc danh mục, thứ tự, not found |
| Company | 4 | Tạo thành viên, địa chỉ, quyền cập nhật, xóa dữ liệu liên quan |
| Connection | 3 | Gửi/chấp nhận/từ chối/xóa, quyền, cấm tự kết nối, unique cặp hai chiều |
| Follow | 2 | Toggle và hai yêu cầu đồng thời qua SERIALIZABLE |
| Job | 4 | Lương/kỹ năng, quyền cập nhật, rollback liên kết lỗi, cascade |
| Location | 3 | Tỉnh/phường, lọc theo tỉnh, thứ tự, not found |
| Post | 5 | CRUD/quyền, bài công ty, like/comment, tác giả, attachment và dọn media |
| Review | 3 | CRUD/quyền, dữ liệu quan hệ, check số sao |
| Search | 3 | ILIKE và dữ liệu quan hệ, tin đóng/hết hạn, phân trang |
| Skill | 5 | CRUD, trùng tên, ILIKE/phân trang, chặn xóa kỹ năng đang dùng |
| User | 4 | Hồ sơ/quyền, kỹ năng, đổi mật khẩu và xóa session, đơn ứng tuyển |
| Database | 9 | Commit/rollback, transaction lồng nhau, async context, constraint/cascade, cleanup nhiều bản ghi |

Auth dùng `JwtService` và bcrypt thật với secret chỉ dành cho test. Profile
OAuth được truyền trực tiếp vào service; không gọi Google/Facebook. Với các
service phụ thuộc Cloudinary, chỉ thay phần upload/xóa media bằng stub; database,
repository, mapper và service vẫn chạy thật. Cloudinary không truy cập PostgreSQL,
nên giữ unit test riêng, chưa có test gọi API Cloudinary thật.

Thêm URL riêng vào `.env` (giữ `DATABASE_URL` hiện tại):

```dotenv
DATABASE_TEST_URL="postgresql://itjob:itjob_test_123@localhost:5433/it_job_test"
```

Database test phải nằm trên loopback (`localhost`, `127.0.0.1`, `::1`), có tên
chứa thành phần `test` như `it_job_test`, và khác đích `DATABASE_URL`.
Runner kiểm tra các điều kiện này trước khi import database client, rồi thay
`DATABASE_URL` trong tiến trình test. Không ghi lại `.env`, không fallback sang
production. Các guard có unit test riêng, không cần kết nối database.

```bash
# Chỉ cần khi database mới/chưa có schema hoặc cần đồng bộ contract:
# dùng Prisma 8 db update với contract đã emit của dự án.
npm run test:integration:prepare

# Chạy integration test (container PostgreSQL test phải đang chạy).
npm run test:integration

# Chạy riêng integration test của một module.
npm run test:integration -- src/modules/skill/skill.integration-spec.ts
npm run test:integration -- src/modules/auth/auth.integration-spec.ts

# Chạy riêng nhóm transaction/constraint.
npm run test:integration -- -t "Real PostgreSQL"
```

Lệnh prepare không reset database và không tự đồng ý thay đổi phá hủy dữ liệu;
nếu Prisma yêu cầu consent thì lệnh sẽ thất bại để bạn kiểm tra schema.
Test dùng fixture có UUID riêng, dọn đúng các bản ghi do nó tạo sau mỗi case,
không truncate bảng hoặc reset sequence. Nếu dừng cưỡng bức tiến trình, fixture
của lần chạy đó có thể còn lại trong database test. Pool được đóng sau khi chạy.

`npm test` tiếp tục chạy unit test; `npm run test:integration` là lệnh riêng.
Đây là integration test ở tầng service/repository, chưa kiểm tra HTTP/JWT guard
hay các dịch vụ bên ngoài như Cloudinary/OAuth.

Nếu runner gặp lỗi `EPERM` khi ghi thư mục tạm trên Windows sandbox, chạy trong
thư mục `be-nestjs` bằng PowerShell (chỉ đổi biến môi trường của phiên hiện tại):

```powershell
New-Item -ItemType Directory -Force node_modules/.test-tmp | Out-Null
$env:TEMP = Join-Path (Get-Location) 'node_modules/.test-tmp'
$env:TMP = $env:TEMP
npm test
```

## Deployment

When you're ready to deploy your NestJS application to production, there are some key steps you can take to ensure it runs as efficiently as possible. Check out the [deployment documentation](https://docs.nestjs.com/deployment) for more information.

If you are looking for a cloud-based platform to deploy your NestJS application, check out [Mau](https://mau.nestjs.com), our official platform for deploying NestJS applications on AWS. Mau makes deployment straightforward and fast, requiring just a few simple steps:

```bash
$ npm install -g @nestjs/mau
$ mau deploy
```

With Mau, you can deploy your application in just a few clicks, allowing you to focus on building features rather than managing infrastructure.

## Observability

In production applications, observability is essential for understanding how your system behaves, detecting issues early, and maintaining reliable performance.

[NestJS Observe](https://observe.nestjs.com) automatically instruments your NestJS application, giving you deep visibility into your system with minimal setup:

- **Distributed tracing:** Follow requests across services and understand how they flow through your system.
- **Waterfall analysis:** Visualize request execution and identify slow operations, bottlenecks, and unexpected delays.
- **Performance analysis:** Analyze application performance in real time and quickly pinpoint areas that need optimization.
- **Metrics:** Track key application and infrastructure metrics to understand system health and performance trends.
- **Logging:** Centralize and correlate logs with traces and other telemetry to make debugging easier.
- **Error tracking:** Detect errors quickly and investigate their root causes with the surrounding context.
- **SLA monitoring:** Track service-level objectives and identify when your application is approaching or exceeding defined thresholds.
- **Alarms and alerts:** Set up alerts for critical errors, performance degradation, SLA violations, and other anomalies so your team can react quickly.

This project is already instrumented. Create a free account at [observe.nestjs.com](https://observe.nestjs.com), add an application, and paste the generated app key and secret into the `ObserveModule.forRoot()` call in `src/app.module.ts`.

The free plan needs no payment details and covers 300,000 events a month. You can also browse the [live demo](https://www.observe-demo.nestjs.com/dashboard) first - the whole dashboard over a busy service's data, with nothing to install.

## Resources

Check out a few resources that may come in handy when working with NestJS:

- Visit the [NestJS Documentation](https://docs.nestjs.com) to learn more about the framework.
- For questions and support, please visit our [Discord channel](https://discord.gg/G7Qnnhy).
- To dive deeper and get more hands-on experience, check out our official video [courses](https://courses.nestjs.com/).
- Deploy your application to AWS with the help of [NestJS Mau](https://mau.nestjs.com) in just a few clicks.
- Auto-instrument your application with [NestJS Observe](https://observe.nestjs.com). Distributed tracing, metrics, and logging made easy. Error tracking and performance monitoring for your NestJS applications.
- Visualize your application graph and interact with the NestJS application in real-time using [NestJS Devtools](https://devtools.nestjs.com).
- Need help with your project (part-time to full-time)? Check out our official [enterprise support](https://enterprise.nestjs.com).
- To stay in the loop and get updates, follow us on [X](https://x.com/nestframework) and [LinkedIn](https://linkedin.com/company/nestjs).
- Looking for a job, or have a job to offer? Check out our official [Jobs board](https://jobs.nestjs.com).

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://twitter.com/kammysliwiec)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).
