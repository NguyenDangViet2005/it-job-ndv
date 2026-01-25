-- ========================================
-- INSERT DỮ LIỆU
-- ========================================
INSERT INTO Provinces (name)
VALUES
(N'TP. Hồ Chí Minh'),
(N'Hà Nội'),
(N'Đà Nẵng'),
(N'Cần Thơ'),
(N'Hải Phòng'),
(N'Bình Dương'),
(N'Đồng Nai'),
(N'Khánh Hòa'),
(N'Quảng Ninh'),
(N'Nghệ An');
GO
INSERT INTO Wards (provinceId, name)
SELECT id, N'Phường Bến Nghé' FROM Provinces WHERE name = N'TP. Hồ Chí Minh';

INSERT INTO Wards (provinceId, name)
SELECT id, N'Phường Cầu Giấy' FROM Provinces WHERE name = N'Hà Nội';

INSERT INTO Wards (provinceId, name)
SELECT id, N'Phường Hải Châu' FROM Provinces WHERE name = N'Đà Nẵng';

INSERT INTO Wards (provinceId, name)
SELECT id, N'Phường Ninh Kiều' FROM Provinces WHERE name = N'Cần Thơ';

INSERT INTO Wards (provinceId, name)
SELECT id, N'Phường Lê Chân' FROM Provinces WHERE name = N'Hải Phòng';

INSERT INTO Wards (provinceId, name)
SELECT id, N'Phường Phú Cường' FROM Provinces WHERE name = N'Bình Dương';

INSERT INTO Wards (provinceId, name)
SELECT id, N'Phường Tân Phong' FROM Provinces WHERE name = N'Đồng Nai';

INSERT INTO Wards (provinceId, name)
SELECT id, N'Phường Lộc Thọ' FROM Provinces WHERE name = N'Khánh Hòa';

INSERT INTO Wards (provinceId, name)
SELECT id, N'Phường Hồng Gai' FROM Provinces WHERE name = N'Quảng Ninh';

INSERT INTO Wards (provinceId, name)
SELECT id, N'Phường Vinh Tân' FROM Provinces WHERE name = N'Nghệ An';
GO

-- 1. INSERT USER (10 employer + 15 user = 25 bản ghi)
INSERT INTO [User]
(fullName, email, password, phone, gender, dateOfBirth, avatar, coverImage, cvUrl, role)
VALUES
-- EMPLOYERS (10)
(N'Nguyễn Minh Huy', 'hr.fpt@demo.com',    '$2a$12$XRcYOwPoThhwZlCGE1XPouOQCSQvHQQxTWQEtJd.WJ4wXPdGQoEk6', '0901000001', 'male',   '1999-04-12', 'https://i.pravatar.cc/150?img=11', 'https://picsum.photos/seed/u11/1200/400', 'https://drive.google.com/file/d/cv_nguyen_minh_huy.pdf', 'employer'),
(N'Trần Thảo Vy',    'hr.vng@demo.com',    '$2a$12$XRcYOwPoThhwZlCGE1XPouOQCSQvHQQxTWQEtJd.WJ4wXPdGQoEk6', '0901000002', 'female', '2000-08-21', 'https://i.pravatar.cc/150?img=12', 'https://picsum.photos/seed/u12/1200/400', 'https://drive.google.com/file/d/cv_tran_thao_vy.pdf', 'employer'),
(N'Lê Quốc Bảo',     'hr.tiki@demo.com',   '$2a$12$XRcYOwPoThhwZlCGE1XPouOQCSQvHQQxTWQEtJd.WJ4wXPdGQoEk6', '0901000003', 'male',   '1998-01-05', 'https://i.pravatar.cc/150?img=13', 'https://picsum.photos/seed/u13/1200/400', 'https://drive.google.com/file/d/cv_le_quoc_bao.pdf', 'employer'),
(N'Phạm Ngọc Anh',   'hr.momo@demo.com',   '$2a$12$XRcYOwPoThhwZlCGE1XPouOQCSQvHQQxTWQEtJd.WJ4wXPdGQoEk6', '0901000004', 'female', '1997-11-30', 'https://i.pravatar.cc/150?img=14', 'https://picsum.photos/seed/u14/1200/400', 'https://drive.google.com/file/d/cv_pham_ngoc_anh.pdf', 'employer'),
(N'Võ Hoàng Long',   'hr.base@demo.com',   '$2a$12$XRcYOwPoThhwZlCGE1XPouOQCSQvHQQxTWQEtJd.WJ4wXPdGQoEk6', '0901000005', 'male',   '1996-06-18', 'https://i.pravatar.cc/150?img=15', 'https://picsum.photos/seed/u15/1200/400', 'https://drive.google.com/file/d/cv_vo_hoang_long.pdf', 'employer'),
(N'Đặng Thu Trang',  'hr.grab@demo.com',   '$2a$12$XRcYOwPoThhwZlCGE1XPouOQCSQvHQQxTWQEtJd.WJ4wXPdGQoEk6', '0901000006', 'female', '1999-02-14', 'https://i.pravatar.cc/150?img=16', 'https://picsum.photos/seed/u16/1200/400', 'https://drive.google.com/file/d/cv_dang_thu_trang.pdf', 'employer'),
(N'Nguyễn Gia Hân',  'hr.shopee@demo.com', '$2a$12$XRcYOwPoThhwZlCGE1XPouOQCSQvHQQxTWQEtJd.WJ4wXPdGQoEk6', '0901000007', 'other',  '2001-09-09', 'https://i.pravatar.cc/150?img=17', 'https://picsum.photos/seed/u17/1200/400', 'https://drive.google.com/file/d/cv_nguyen_gia_han.pdf', 'employer'),
(N'Tạ Văn Sơn',      'hr.tcb@demo.com',    '$2a$12$XRcYOwPoThhwZlCGE1XPouOQCSQvHQQxTWQEtJd.WJ4wXPdGQoEk6', '0901000008', 'male',   '1995-12-02', 'https://i.pravatar.cc/150?img=18', 'https://picsum.photos/seed/u18/1200/400', 'https://drive.google.com/file/d/cv_ta_van_son.pdf', 'employer'),
(N'Bùi Mỹ Linh',     'hr.viettel@demo.com','$2a$12$XRcYOwPoThhwZlCGE1XPouOQCSQvHQQxTWQEtJd.WJ4wXPdGQoEk6', '0901000009', 'female', '1998-03-25', 'https://i.pravatar.cc/150?img=19', 'https://picsum.photos/seed/u19/1200/400', 'https://drive.google.com/file/d/cv_bui_my_linh.pdf', 'employer'),
(N'Admin System',    'admin@demo.com',     '$2a$12$XRcYOwPoThhwZlCGE1XPouOQCSQvHQQxTWQEtJd.WJ4wXPdGQoEk6','0901000010','male',   '1990-01-01', 'https://i.pravatar.cc/150?img=20', 'https://picsum.photos/seed/u20/1200/400', 'https://drive.google.com/file/d/cv_admin_system.pdf', 'admin'),

-- REGULAR USERS (15)
(N'Nguyễn Đăng Việt', 'viet.nguyen@demo.com', '$2a$12$XRcYOwPoThhwZlCGE1XPouOQCSQvHQQxTWQEtJd.WJ4wXPdGQoEk6', '0902000001', 'male',   '2001-05-15', 'https://i.pravatar.cc/150?img=21', 'https://picsum.photos/seed/u21/1200/400', 'https://drive.google.com/file/d/cv_viet.pdf', 'user'),
(N'Lê Thị Mai Anh',  'maianh.le@demo.com',   '$2a$12$XRcYOwPoThhwZlCGE1XPouOQCSQvHQQxTWQEtJd.WJ4wXPdGQoEk6', '0902000002', 'female', '2000-03-22', 'https://i.pravatar.cc/150?img=22', 'https://picsum.photos/seed/u22/1200/400', 'https://drive.google.com/file/d/cv_maianh.pdf', 'user'),
(N'Trần Văn Khoa',   'khoa.tran@demo.com',   '$2a$12$XRcYOwPoThhwZlCGE1XPouOQCSQvHQQxTWQEtJd.WJ4wXPdGQoEk6', '0902000003', 'male',   '1999-11-08', 'https://i.pravatar.cc/150?img=23', 'https://picsum.photos/seed/u23/1200/400', 'https://drive.google.com/file/d/cv_khoa.pdf', 'user'),
(N'Phạm Thị Hương',  'huong.pham@demo.com',  '$2a$12$XRcYOwPoThhwZlCGE1XPouOQCSQvHQQxTWQEtJd.WJ4wXPdGQoEk6', '0902000004', 'female', '2001-07-19', 'https://i.pravatar.cc/150?img=24', 'https://picsum.photos/seed/u24/1200/400', 'https://drive.google.com/file/d/cv_huong.pdf', 'user'),
(N'Hoàng Minh Tuấn', 'tuan.hoang@demo.com',  '$2a$12$XRcYOwPoThhwZlCGE1XPouOQCSQvHQQxTWQEtJd.WJ4wXPdGQoEk6', '0902000005', 'male',   '1998-09-30', 'https://i.pravatar.cc/150?img=25', 'https://picsum.photos/seed/u25/1200/400', 'https://drive.google.com/file/d/cv_tuan.pdf', 'user'),
(N'Đỗ Thị Lan',      'lan.do@demo.com',      '$2a$12$XRcYOwPoThhwZlCGE1XPouOQCSQvHQQxTWQEtJd.WJ4wXPdGQoEk6', '0902000006', 'female', '2000-12-05', 'https://i.pravatar.cc/150?img=26', 'https://picsum.photos/seed/u26/1200/400', 'https://drive.google.com/file/d/cv_lan.pdf', 'user'),
(N'Vũ Quang Hải',    'hai.vu@demo.com',      '$2a$12$XRcYOwPoThhwZlCGE1XPouOQCSQvHQQxTWQEtJd.WJ4wXPdGQoEk6', '0902000007', 'male',   '1999-04-17', 'https://i.pravatar.cc/150?img=27', 'https://picsum.photos/seed/u27/1200/400', 'https://drive.google.com/file/d/cv_hai.pdf', 'user'),
(N'Ngô Thị Thanh',   'thanh.ngo@demo.com',   '$2a$12$XRcYOwPoThhwZlCGE1XPouOQCSQvHQQxTWQEtJd.WJ4wXPdGQoEk6', '0902000008', 'female', '2001-02-28', 'https://i.pravatar.cc/150?img=28', 'https://picsum.photos/seed/u28/1200/400', 'https://drive.google.com/file/d/cv_thanh.pdf', 'user'),
(N'Bùi Văn Nam',     'nam.bui@demo.com',     '$2a$12$XRcYOwPoThhwZlCGE1XPouOQCSQvHQQxTWQEtJd.WJ4wXPdGQoEk6', '0902000009', 'male',   '2000-06-11', 'https://i.pravatar.cc/150?img=29', 'https://picsum.photos/seed/u29/1200/400', 'https://drive.google.com/file/d/cv_nam.pdf', 'user'),
(N'Lý Thị Phương',   'phuong.ly@demo.com',   '$2a$12$XRcYOwPoThhwZlCGE1XPouOQCSQvHQQxTWQEtJd.WJ4wXPdGQoEk6', '0902000010', 'female', '1999-08-24', 'https://i.pravatar.cc/150?img=30', 'https://picsum.photos/seed/u30/1200/400', 'https://drive.google.com/file/d/cv_phuong.pdf', 'user'),
(N'Đinh Văn Đức',    'duc.dinh@demo.com',    '$2a$12$XRcYOwPoThhwZlCGE1XPouOQCSQvHQQxTWQEtJd.WJ4wXPdGQoEk6', '0902000011', 'male',   '2001-01-13', 'https://i.pravatar.cc/150?img=31', 'https://picsum.photos/seed/u31/1200/400', 'https://drive.google.com/file/d/cv_duc.pdf', 'user'),
(N'Cao Thị Ngọc',    'ngoc.cao@demo.com',    '$2a$12$XRcYOwPoThhwZlCGE1XPouOQCSQvHQQxTWQEtJd.WJ4wXPdGQoEk6', '0902000012', 'female', '2000-10-07', 'https://i.pravatar.cc/150?img=32', 'https://picsum.photos/seed/u32/1200/400', 'https://drive.google.com/file/d/cv_ngoc.pdf', 'user'),
(N'Phan Văn Thắng',  'thang.phan@demo.com',  '$2a$12$XRcYOwPoThhwZlCGE1XPouOQCSQvHQQxTWQEtJd.WJ4wXPdGQoEk6', '0902000013', 'male',   '1999-05-20', 'https://i.pravatar.cc/150?img=33', 'https://picsum.photos/seed/u33/1200/400', 'https://drive.google.com/file/d/cv_thang.pdf', 'user'),
(N'Dương Thị Hà',    'ha.duong@demo.com',    '$2a$12$XRcYOwPoThhwZlCGE1XPouOQCSQvHQQxTWQEtJd.WJ4wXPdGQoEk6', '0902000014', 'female', '2001-09-16', 'https://i.pravatar.cc/150?img=34', 'https://picsum.photos/seed/u34/1200/400', 'https://drive.google.com/file/d/cv_ha.pdf', 'user'),
(N'Mai Văn Hùng',    'hung.mai@demo.com',    '$2a$12$XRcYOwPoThhwZlCGE1XPouOQCSQvHQQxTWQEtJd.WJ4wXPdGQoEk6', '0902000015', 'male',   '2000-04-03', 'https://i.pravatar.cc/150?img=35', 'https://picsum.photos/seed/u35/1200/400', 'https://drive.google.com/file/d/cv_hung.pdf', 'user');
GO


-- 2. INSERT COMPANY (10 bản ghi)
-- INSERT COMPANY (10 bản ghi) - đúng schema Company bạn gửi
INSERT INTO Company
(name, avatar, coverImage, nationality, website, description, foundedYear, address, wardId, createdByUserId)
VALUES
(N'FPT Software',
 'https://res.cloudinary.com/duc6z828y/image/upload/v1767520136/FPT_Software_qswf1z.webp',
 'https://res.cloudinary.com/duc6z828y/image/upload/v1767520085/fpt-cover_bfgwxc.jpg',
 N'Việt Nam',
 'https://fptsoftware.com',
 N'Công ty phần mềm hàng đầu Việt Nam, chuyên cung cấp dịch vụ công nghệ thông tin và giải pháp chuyển đổi số.',
 1999,
 N'Tòa nhà FPT, Quận 9',
 1, 1),

(N'VNG Corporation',
 'https://res.cloudinary.com/duc6z828y/image/upload/v1767520136/vng_corporation_tqdlgu.png',
 'https://res.cloudinary.com/duc6z828y/image/upload/v1767520086/vng-cover_yvdecw.jpg',
 N'Việt Nam',
 'https://vng.com.vn',
 N'Tập đoàn công nghệ internet hàng đầu Việt Nam với các sản phẩm như Zalo, ZaloPay, 123Go.',
 2004,
 N'Z06 Đường số 13, Quận 9',
 1, 2),

(N'Tiki Corporation',
 'https://res.cloudinary.com/duc6z828y/image/upload/v1767520136/tiki-logo-4_dfmqjc.jpg',
 'https://res.cloudinary.com/duc6z828y/image/upload/v1767520085/tiki-cover_tra5ji.jpg',
 N'Việt Nam',
 'https://tiki.vn',
 N'Sàn thương mại điện tử lớn nhất Việt Nam, cung cấp dịch vụ mua sắm trực tuyến đa dạng.',
 2010,
 N'52 Út Tịch, Quận Tân Bình',
 1, 3),

(N'Momo Technology',
 'https://res.cloudinary.com/duc6z828y/image/upload/v1767520135/MoMo-Logo_gr4p3n.png',
 'https://res.cloudinary.com/duc6z828y/image/upload/v1767520085/momo-cover_jxawsj.jpg',
 N'Việt Nam',
 'https://momo.vn',
 N'Ví điện tử và nền tảng thanh toán di động hàng đầu tại Việt Nam.',
 2007,
 N'Lầu 6, Tòa nhà Phú Mỹ Hưng, Quận 7',
 1, 4),

(N'Base.vn',
 'https://res.cloudinary.com/duc6z828y/image/upload/v1767520134/base_rmmald.png',
 'https://res.cloudinary.com/duc6z828y/image/upload/v1767520084/base-cover_k6kups.jpg',
 N'Việt Nam',
 'https://base.vn',
 N'Công ty công nghệ chuyên phát triển ứng dụng mobile và web cho doanh nghiệp.',
 2012,
 N'194 Golden Building, Quận 3',
 1, 5),

(N'GrabTech Vietnam',
 'https://res.cloudinary.com/duc6z828y/image/upload/v1767520133/logo-grab_ge2uz4.jpg',
 'https://res.cloudinary.com/duc6z828y/image/upload/v1767520084/grab-cover_skes8o.jpg',
 N'Singapore',
 'https://grab.com',
 N'Nền tảng siêu ứng dụng hàng đầu Đông Nam Á về gọi xe, giao hàng và thanh toán.',
 2012,
 N'Tòa nhà Viettel, Quận 10',
 1, 6),

(N'Shopee Vietnam',
 'https://res.cloudinary.com/duc6z828y/image/upload/v1767520133/logo-shopee_cffdtr.png',
 'https://res.cloudinary.com/duc6z828y/image/upload/v1767520085/shoppe-cover_sbsabt.jpg',
 N'Singapore',
 'https://shopee.vn',
 N'Sàn thương mại điện tử di động hàng đầu khu vực Đông Nam Á và Đài Loan.',
 2015,
 N'Tòa nhà Viettel, Quận 10',
 1, 7),

(N'TechComBank',
 'https://res.cloudinary.com/duc6z828y/image/upload/v1767520086/Techcombank_logo_meenqi.png',
 'https://res.cloudinary.com/duc6z828y/image/upload/v1767520085/techcombank-cover_znkhl6.jpg',
 N'Việt Nam',
 'https://techcombank.com.vn',
 N'Ngân hàng thương mại cổ phần công nghệ và truyền thông Việt Nam.',
 1993,
 N'191 Bà Triệu, Quận Hai Bà Trưng',
 2, 8),

(N'Viettel Solutions',
 'https://res.cloudinary.com/duc6z828y/image/upload/v1767520086/Viettel_Solutions_earyjf.webp',
 'https://res.cloudinary.com/duc6z828y/image/upload/v1767520085/viettel-cover_iudscs.jpg',
 N'Việt Nam',
 'https://viettelsolutions.vn',
 N'Đơn vị cung cấp giải pháp và dịch vụ CNTT toàn diện của Tập đoàn Viettel.',
 2008,
 N'285 Cách Mạng Tháng 8, Quận 10',
 1, 9),

(N'VinTech City',
 'https://res.cloudinary.com/duc6z828y/image/upload/v1767520086/vintech_ou6dnn.png',
 'https://res.cloudinary.com/duc6z828y/image/upload/v1767520084/vintech-cover_h7b4y4.webp',
 N'Việt Nam',
 'https://vingroup.net',
 N'Công ty công nghệ thuộc Tập đoán Vingroup, phát triển giải pháp công nghệ thông minh.',
 2018,
 N'Vinhomes Ocean Park, Gia Lâm',
 2, 10);
GO

-- 2.1 INSERT COMPANYMEMBERS (liên kết user employer với company tương ứng)
INSERT INTO CompanyMembers (companyId, userId, status, joinedAt)
VALUES 
(1, 1, 'active', '2020-01-15 09:00:00'), -- Nguyễn Minh Huy (hr.fpt) -> FPT Software
(2, 2, 'active', '2020-03-20 10:30:00'), -- Trần Thảo Vy (hr.vng) -> VNG Corporation
(3, 3, 'active', '2019-06-10 08:45:00'), -- Lê Quốc Bảo (hr.tiki) -> Tiki Corporation
(4, 4, 'active', '2021-02-01 09:15:00'), -- Phạm Ngọc Anh (hr.momo) -> Momo Technology
(5, 5, 'active', '2020-09-15 11:00:00'), -- Võ Hoàng Long (hr.base) -> Base.vn
(6, 6, 'active', '2021-05-10 08:30:00'), -- Đặng Thu Trang (hr.grab) -> GrabTech Vietnam
(7, 7, 'active', '2022-01-20 10:00:00'), -- Nguyễn Gia Hân (hr.shopee) -> Shopee Vietnam
(8, 8, 'active', '2019-11-05 09:45:00'), -- Tạ Văn Sơn (hr.tcb) -> TechComBank
(9, 9, 'active', '2020-07-12 08:00:00'); -- Bùi Mỹ Linh (hr.viettel) -> Viettel Solutions
GO

-- 3. INSERT JOB (10 bản ghi)
INSERT INTO Job (companyId, title, description, type, quantity, deadline, salary, status)
VALUES 
(1, N'Senior Frontend Developer (ReactJS)', N'Phát triển ứng dụng web với ReactJS, NextJS. Yêu cầu 3+ năm kinh nghiệm, thành thạo TypeScript, Redux.', 'full-time', 2, '2026-02-20', N'25 - 35 triệu', 'open'),
(2, N'Backend Developer (Java Spring Boot)', N'Xây dựng API RESTful với Spring Boot, MySQL. Yêu cầu 2+ năm kinh nghiệm Java, hiểu biết về Microservices.', 'full-time', 3, '2026-03-30', N'20 - 30 triệu', 'open'),
(3, N'DevOps Engineer', N'Quản lý hạ tầng AWS/Azure, CI/CD pipeline. Yêu cầu kinh nghiệm Docker, Kubernetes, Jenkins.', 'full-time', 1, '2026-02-15', N'Thỏa thuận', 'open'),
(4, N'Mobile Developer (Flutter)', N'Phát triển ứng dụng di động đa nền tảng với Flutter. Yêu cầu 1+ năm kinh nghiệm Flutter/Dart.', 'full-time', 2, '2026-04-25', N'15 - 25 triệu', 'open'),
(5, N'UI/UX Designer', N'Thiết kế giao diện ứng dụng web/mobile. Thành thạo Figma, Adobe XD, hiểu biết về Design System.', 'full-time', 1, '2025-12-10', N'12 - 20 triệu', 'open'),
(6, N'Data Analyst', N'Phân tích dữ liệu kinh doanh, xây dựng dashboard. Yêu cầu SQL, Python, Power BI/Tableau.', 'full-time', 2, '2026-02-20', N'18 - 28 triệu', 'open'),
(7, N'QA/Tester (Manual & Automation)', N'Kiểm thử phần mềm thủ công và tự động. Yêu cầu kinh nghiệm Selenium, API Testing.', 'part-time', 3, '2026-04-05', N'10 - 15 triệu', 'open'),
(8, N'Business Analyst', N'Phân tích yêu cầu nghiệp vụ, viết tài liệu đặc tả. Yêu cầu kỹ năng giao tiếp tốt, hiểu quy trình phát triển phần mềm.', 'full-time', 1, '2026-03-28', N'22 - 32 triệu', 'open'),
(9, N'AI Engineer (Machine Learning)', N'Phát triển mô hình Machine Learning/Deep Learning. Yêu cầu Python, TensorFlow/PyTorch, kinh nghiệm NLP/Computer Vision.', 'full-time', 1, '2026-02-10', N'30 - 50 triệu', 'open'),
(10, N'Product Manager', N'Quản lý sản phẩm công nghệ từ ý tưởng đến triển khai. Yêu cầu 3+ năm kinh nghiệm, tư duy sản phẩm tốt.', 'full-time', 1, '2026-03-01', N'40 - 60 triệu', 'closed');
GO

-- 4. INSERT SKILL (10 bản ghi)
INSERT INTO Skill (name)
VALUES 
(N'ReactJS'),
(N'Java Spring Boot'),
(N'Python'),
(N'Docker'),
(N'AWS'),
(N'Flutter'),
(N'Figma'),
(N'SQL'),
(N'Machine Learning'),
(N'Agile/Scrum');
GO

-- 5. INSERT SKILL_USER (10 bản ghi)
INSERT INTO Skill_User (skillId, userId)
VALUES 
(1, 1), -- An: ReactJS
(2, 2), -- Bình: Java
(3, 4), -- Dung: Python
(4, 5), -- Em: Docker
(5, 3), -- Cường: AWS
(6, 8), -- Hoa: Flutter
(7, 9), -- Inh: Figma
(8, 10), -- Kim: SQL
(9, 1), -- An: Machine Learning
(10, 2); -- Bình: Agile
GO

-- 6. INSERT SKILL_JOB (10 bản ghi)
INSERT INTO Skill_Job (skillId, jobId)
VALUES 
(1, 1), -- Job 1: ReactJS
(2, 2), -- Job 2: Java
(4, 3), -- Job 3: Docker
(5, 3), -- Job 3: AWS
(6, 4), -- Job 4: Flutter
(7, 5), -- Job 5: Figma
(8, 6), -- Job 6: SQL
(3, 6), -- Job 6: Python
(9, 9), -- Job 9: ML
(10, 8); -- Job 8: Agile
GO
-- 7. INSERT POST (30+ bản ghi - Q&A style posts)
INSERT INTO Post (userId, companyId, content)
VALUES 
-- Company posts (từ HR)
(3, 1, N'Chúng tôi đang tuyển dụng Senior Frontend Developer với mức lương hấp dẫn! #hiring #reactjs'),
(6, 4, N'Workshop về Flutter Development sẽ được tổ chức vào tuần tới. Đăng ký ngay! #flutter #workshop'),
(2, 2, N'Chia sẻ kinh nghiệm về microservices architecture với Spring Boot #java #backend'),
(10, 8, N'TechComBank tuyển dụng Data Analyst. Hồ sơ đã mở! #recruitment #data'),
(9, 6, N'Grab Vietnam đang mở rộng team Engineering. Apply ngay! #grab #jobs'),

-- User posts (Q&A, sharing, discussion)
(11, NULL, N'Mình mới học xong ReactJS cơ bản, giờ nên học Next.js hay Redux trước các bác? #reactjs #advice'),
(12, NULL, N'Có ai đã từng làm việc remote cho công ty nước ngoài chưa? Chia sẻ kinh nghiệm với mình nhé! #remote #experience'),
(13, NULL, N'Vừa pass phỏng vấn vòng 1 tại FPT Software! Cảm ơn mọi người đã support 🎉 #interview #success'),
(14, NULL, N'Mình đang tìm hiểu về Docker và Kubernetes. Có tài liệu nào hay để học không các bạn? #docker #kubernetes #learning'),
(15, NULL, N'Fresher nên chọn công ty outsourcing hay product để bắt đầu sự nghiệp? Mọi người góp ý giúp mình! #career #fresher'),
(16, NULL, N'Chia sẻ portfolio website mình vừa làm xong. Mọi người feedback giúp mình nhé! https://myportfolio.dev #portfolio #feedback'),
(17, NULL, N'Có ai biết cách optimize performance cho React app không? App mình đang bị lag khi render nhiều data #reactjs #performance'),
(18, NULL, N'Mình đang học TypeScript, có nên áp dụng ngay vào dự án React không các bác? #typescript #reactjs'),
(19, NULL, N'Vừa hoàn thành khóa học AWS Solutions Architect! Cảm giác tuyệt vời 🚀 #aws #certification'),
(20, NULL, N'Có ai có kinh nghiệm với GraphQL không? So với REST API thì ưu nhược điểm thế nào? #graphql #api'),
(21, NULL, N'Mình đang chuẩn bị phỏng vấn vị trí Backend Developer. Các bạn có tips gì không? #interview #backend'),
(22, NULL, N'Vừa deploy dự án đầu tiên lên Vercel thành công! Cảm ơn cộng đồng đã giúp đỡ 💪 #deployment #vercel'),
(23, NULL, N'Làm thế nào để cân bằng giữa học công nghệ mới và làm dự án thực tế? #learning #worklife'),
(24, NULL, N'Có nên học nhiều ngôn ngữ lập trình hay chuyên sâu vào 1-2 ngôn ngữ? #programming #career'),
(25, NULL, N'Mình đang tìm teammate để làm dự án side project về e-commerce. Ai quan tâm inbox mình nhé! #sideproject #team'),
(1, NULL, N'Vừa hoàn thành dự án e-commerce với ReactJS và NextJS. Rất hài lòng với kết quả! #project'),
(4, NULL, N'Tìm kiếm cơ hội làm việc tại các công ty công nghệ tại TP.HCM #jobseeking'),
(5, NULL, N'Có ai có kinh nghiệm với Docker Swarm không? Cần tư vấn cho dự án #docker #devops'),
(8, NULL, N'Portfolio UI/UX Design của mình đây, mọi người góp ý nhé! #design #uiux'),
(7, NULL, N'Thông báo: Hệ thống sẽ bảo trì vào 23h tối nay #announcement #admin'),
(11, NULL, N'Sáng nay mình đã fix được bug đau đầu 3 ngày! Cảm giác như được giải thoát 😅 #debugging #developer'),
(12, NULL, N'Có ai đang làm việc với MongoDB không? Mình cần tư vấn về indexing và performance #mongodb #database'),
(13, NULL, N'Vừa tham gia hackathon đầu tiên trong đời. Trải nghiệm thật tuyệt vời! #hackathon #coding'),
(14, NULL, N'Mình đang học về Clean Code. Có cuốn sách nào các bạn recommend không? #cleancode #bestpractices'),
(15, NULL, N'Làm thế nào để improve soft skills khi làm developer? #softskills #career'),
(16, NULL, N'Có ai đã thử GitHub Copilot chưa? Nó có thực sự hữu ích không? #ai #github #copilot'),
(17, NULL, N'Mình đang tìm hiểu về CI/CD. Jenkins hay GitLab CI tốt hơn cho beginner? #cicd #devops'),
(18, NULL, N'Vừa nhận offer từ 2 công ty, đang phân vân không biết chọn cái nào. Các bạn có thể tư vấn không? #career #offer'),
(19, NULL, N'Chia sẻ một số tips để pass technical interview: Practice algorithms, understand system design, be confident! #interview #tips'),
(20, NULL, N'Có nên học Vue.js khi đã biết React không các bác? #vuejs #reactjs #frontend'),
(21, NULL, N'Mình vừa tạo một Chrome Extension đầu tiên! Ai muốn test thử không? #chromeextension #javascript'),
(22, NULL, N'Làm sao để negotiate lương hiệu quả khi nhận offer? Mình hơi ngại đàm phán 😅 #salary #negotiation'),
(23, NULL, N'Có ai đang làm freelance developer không? Thu nhập có ổn định không? #freelance #developer'),
(24, NULL, N'Vừa upgrade lên Senior Developer sau 3 năm! Cảm ơn mọi người đã support trên con đường này 🙏 #career #milestone'),
(25, NULL, N'Mình đang tìm hiểu về Microservices. Khi nào thì nên áp dụng architecture này? #microservices #architecture');
GO


-- 8. INSERT INTERACTION (50+ bản ghi - likes và comments tương tác)
INSERT INTO Interaction (postId, userId, isLiked, content)
VALUES 
-- Post 1 interactions (Company hiring post)
(1, 11, 1, NULL), 
(1, 2, 0, N'Mức lương bao nhiêu vậy ạ?'),
(1, 12, 0, N'Yêu cầu bao nhiêu năm kinh nghiệm vậy anh?'),
(1, 13, 1, NULL),

-- Post 2 interactions (Flutter workshop)
(2, 14, 1, NULL),
(2, 15, 0, N'Workshop này có phí không ạ?'),
(2, 16, 0, N'Địa điểm tổ chức ở đâu vậy?'),

-- Post 3 interactions (Microservices)
(3, 17, 1, NULL),
(3, 18, 0, N'Anh có thể share source code example không ạ?'),

-- Post 6 interactions (ReactJS learning path)
(6, 12, 0, N'Mình nghĩ nên học Redux trước, sau đó mới Next.js. Redux giúp bạn hiểu state management tốt hơn!'),
(6, 13, 0, N'Next.js đi bạn ơi, nó đang hot và có nhiều tính năng hay. Redux thì học sau cũng được.'),
(6, 14, 1, NULL),
(6, 15, 0, N'Tùy vào dự án bạn làm. Nếu cần SSR thì Next.js, còn state phức tạp thì Redux.'),

-- Post 7 interactions (Remote work)
(7, 11, 0, N'Mình đang làm remote cho công ty Singapore. Thu nhập ổn nhưng cần English tốt nhé!'),
(7, 16, 1, NULL),
(7, 17, 0, N'Bạn tìm việc remote trên platform nào vậy? Upwork hay Toptal?'),
(7, 18, 0, N'Remote thì phải tự giác cao, không có ai nhắc nhở đâu bạn ơi 😅'),

-- Post 8 interactions (Interview success)
(8, 12, 1, NULL),
(8, 14, 0, N'Chúc mừng bạn! Vòng 2 họ hỏi gì vậy?'),
(8, 19, 1, NULL),
(8, 20, 0, N'Xin chúc mừng! Bạn chuẩn bị như thế nào cho phỏng vấn vậy?'),

-- Post 9 interactions (Docker & Kubernetes)
(9, 11, 0, N'Bạn nên xem khóa học của Mumshad Mannambeth trên Udemy, rất chi tiết!'),
(9, 21, 1, NULL),
(9, 22, 0, N'Documentation chính thức của Docker và K8s là tốt nhất. Còn có thể xem TechWorld with Nana trên YouTube.'),

-- Post 10 interactions (Career choice)
(10, 13, 0, N'Outsourcing để học nhiều tech stack, product để hiểu business. Tùy bạn muốn gì!'),
(10, 23, 0, N'Mình recommend product company. Bạn sẽ có ownership và hiểu rõ sản phẩm hơn.'),
(10, 24, 1, NULL),
(10, 25, 0, N'Fresher thì nên vào outsourcing trước, học được nhiều thứ nhanh hơn.'),

-- Post 11 interactions (Portfolio feedback)
(11, 12, 1, NULL),
(11, 14, 0, N'Portfolio đẹp đấy! Nhưng mình thấy loading hơi lâu, bạn nên optimize images.'),
(11, 16, 0, N'Design rất clean! Bạn làm bằng React à?'),

-- Post 12 interactions (React performance)
(12, 11, 0, N'Bạn thử dùng React.memo và useMemo để tránh re-render không cần thiết xem.'),
(12, 17, 0, N'Virtualization với react-window hoặc react-virtualized sẽ giúp render list lớn nhanh hơn nhiều!'),
(12, 19, 1, NULL),

-- Post 13 interactions (TypeScript)
(13, 20, 0, N'Nên áp dụng luôn! TypeScript giúp catch bugs sớm và code dễ maintain hơn.'),
(13, 21, 1, NULL),
(13, 22, 0, N'Ban đầu sẽ hơi khó nhưng sau quen rồi thì không thể thiếu TypeScript được 😄'),

-- Post 14 interactions (AWS certification)
(14, 11, 1, NULL),
(14, 23, 0, N'Chúc mừng bạn! Bạn học trong bao lâu vậy?'),
(14, 24, 1, NULL),

-- Post 15 interactions (GraphQL)
(15, 12, 0, N'GraphQL giúp fetch đúng data cần thiết, tránh over-fetching. Nhưng setup phức tạp hơn REST.'),
(15, 25, 0, N'Mình thích GraphQL vì có type safety và documentation tự động. Nhưng caching hơi khó.'),
(15, 13, 1, NULL),

-- Post 16 interactions (Backend interview)
(16, 14, 0, N'Ôn lại data structures, algorithms, và system design. Quan trọng nhất là tự tin!'),
(16, 15, 1, NULL),
(16, 16, 0, N'Chuẩn bị câu hỏi về database optimization, API design, và security nhé bạn.'),

-- Post 17 interactions (Vercel deployment)
(17, 17, 1, NULL),
(17, 18, 0, N'Vercel deploy rất dễ và nhanh đúng không! Chúc mừng bạn 🎉'),

-- Post 21 interactions (Debugging success)
(21, 12, 0, N'Cảm giác đó không gì sánh được 😂 Chúc mừng bạn!'),
(21, 19, 1, NULL),
(21, 20, 0, N'Bug gì mà khó vậy bạn? Chia sẻ đi để mọi người học hỏi.'),

-- Post 22 interactions (MongoDB)
(22, 11, 0, N'Indexing rất quan trọng! Bạn nên index các field thường query. Dùng explain() để check performance.'),
(22, 21, 1, NULL),
(22, 23, 0, N'Compound index sẽ giúp query nhanh hơn nhiều. Nhưng đừng index quá nhiều field nhé!'),

-- Post 25 interactions (Side project)
(25, 13, 0, N'Mình có thể join được không? Mình biết React và Node.js.'),
(25, 14, 1, NULL),
(25, 22, 0, N'Dự án này dùng tech stack gì vậy bạn?'),

-- Post 28 interactions (Chrome Extension)
(28, 15, 0, N'Wow cool! Extension làm gì vậy bạn?'),
(28, 16, 1, NULL),
(28, 24, 0, N'Mình muốn test thử! Bạn share link đi.'),

-- Post 30 interactions (Freelance)
(30, 17, 0, N'Mình đang freelance được 1 năm. Thu nhập không ổn định lắm nhưng được tự do thời gian.'),
(30, 18, 1, NULL),
(30, 25, 0, N'Freelance thì phải có portfolio tốt và network rộng mới dễ tìm client.'),

-- Additional random interactions
(4, 19, 1, NULL),
(5, 20, 1, NULL),
(18, 21, 1, NULL),
(19, 22, 1, NULL),
(20, 23, 1, NULL),
(23, 24, 1, NULL),
(24, 25, 1, NULL),
(26, 11, 1, NULL),
(27, 12, 1, NULL),
(29, 13, 1, NULL);
GO

-- 9. INSERT ATTACHMENT (một vài ví dụ)
INSERT INTO Attachment (postId, interactionId, fileType, fileUrl)
VALUES
-- Post 1 có 2 ảnh
(1, NULL, 'image', 'https://res.cloudinary.com/duc6z828y/image/upload/v1769009189/FPT-Software_-Tuyen-dung_vp73sh.jpg'),
(1, NULL, 'image', 'https://res.cloudinary.com/duc6z828y/image/upload/v1769009187/InternBA_kwofht.jpg'),

-- Post 2 có 1 ảnh
(2, NULL, 'image', 'https://res.cloudinary.com/duc6z828y/image/upload/v1769009184/momo-amazone-s3-api-251107150758-638981248788827255_rqn1um.jpg')

GO


-- 9. INSERT REVIEW (10 bản ghi)
INSERT INTO Review (userId, companyId, rating, comment)
VALUES 
(1, 1, 5, N'Môi trường làm việc chuyên nghiệp, đồng nghiệp thân thiện. Rất hài lòng!'),
(2, 2, 4, N'Văn phòng đẹp, trang thiết bị hiện đại. Chế độ đãi ngộ tốt.'),
(4, 3, 5, N'Team Tiki rất năng động và sáng tạo. Học hỏi được nhiều điều.'),
(5, 4, 3, N'Lương ổn nhưng áp lực công việc khá cao, cần cân bằng work-life balance.'),
(8, 5, 4, N'Công ty có nhiều dự án thú vị, cơ hội phát triển sự nghiệp tốt.'),
(1, 6, 5, N'Grab có văn hóa doanh nghiệp tốt, môi trường làm việc năng động.'),
(9, 7, 4, N'Shopee có nhiều benefit tốt, nhưng yêu cầu công việc khá cao.'),
(10, 8, 5, N'TechComBank đầu tư mạnh vào công nghệ, môi trường học tập liên tục.'),
(2, 9, 3, N'Viettel Solutions có nhiều dự án lớn nhưng quy trình hơi cứng nhắc.'),
(4, 1, 4, N'FPT Software là lựa chọn tốt cho fresher, có chương trình đào tạo bài bản.');
GO

-- 10. INSERT APPLICATION (10 bản ghi)
INSERT INTO Application (jobId, userId, cvUrl, coverLetter, status)
VALUES 
(1, 1, 'https://static.topcv.vn/cms/mau-cv-thuc-tap-sinh686f81fc37db5.jpg', N'Tôi có 4 năm kinh nghiệm với ReactJS và đã tham gia nhiều dự án lớn. Mong được đóng góp cho công ty.', 'reviewed'),
(2, 2, 'https://static.topcv.vn/cms/mau-cv-tuyen-dung-nhan-su685224216fb5d.jpg', N'Tôi thành thạo Java Spring Boot và có kinh nghiệm xây dựng hệ thống microservices.', 'accepted'),
(3, 5, 'https://cdn1.vieclam24h.vn/images/assets/img/072-blue-simple-professional.jpg', N'Có 2 năm kinh nghiệm DevOps, thành thạo Docker, Kubernetes và AWS.', 'pending'),
(4, 8, 'https://asd.mediacdn.vn/adt/tuyendungvccorp/mau-cv-nhan-vien-tuyen-dung_53b6d4dc-2445-4465-b07e-6ebe0d08f8c4.png', N'Đã phát triển 5+ ứng dụng Flutter trên App Store và Google Play.', 'reviewed'),
(5, 9, 'https://www.topcv.vn/cv/snapshot/template-cv/mau-cv-tieu-chuan-_BgoGAAMJAl4HAANQUgIDBFEMBQ5SAFJQV1ENDQd2e5.webp?t=1753327595', N'Designer với 3 năm kinh nghiệm, portfolio tại: behance.net/inhtruong', 'accepted'),
(6, 10,'https://cv.timviec.com.vn/images/detail/thumb_v2/mau_77.jpg?v=2', N'Có nền tảng SQL và Python mạnh, đã làm nhiều dự án phân tích dữ liệu.', 'pending'),
(7, 4, 'https://marketplace.canva.com/EAGEEoFO7iE/1/0/1131w/canva-m%C3%A0u-%C4%91en-v%C3%A0-tr%E1%BA%AFng-t%E1%BB%91i-gi%E1%BA%A3n-s%C6%A1-y%E1%BA%BFu-l%C3%BD-l%E1%BB%8Bch-PQxzeV9wixU.jpg', N'Kinh nghiệm testing 2 năm, thành thạo Selenium và API Testing.', 'rejected'),
(8, 1, 'https://anthaiautoparts.com/wp-content/uploads/2024/07/mau-cv-xin-viec-hanh-chinh-nhan-su-moi-1.jpg', N'Có background kỹ thuật và kinh nghiệm phân tích nghiệp vụ trong lĩnh vực fintech.', 'pending'),
(9, 2, 'https://www.meinvoice.vn/wp-content/uploads/2022/09/mau-cv-ke-toan-tong-hop-1-1.jpg', N'Thạc sĩ AI, có 2 năm nghiên cứu về NLP và Computer Vision.', 'reviewed'),
(1, 4, 'https://images.cakeresume.com/images/04536154-96c9-4724-849b-6c77d98d0c49.png', N'Fresher nhưng có nền tảng ReactJS vững, học hỏi nhanh.', 'pending');
GO

-- 11. INSERT FOLLOW (10 bản ghi)
INSERT INTO Follow (userId, companyId)
VALUES 
(1, 1), -- An follow FPT
(2, 2), -- Bình follow VNG
(4, 3), -- Dung follow Tiki
(5, 4), -- Em follow Momo
(8, 5), -- Hoa follow Base
(9, 6), -- Inh follow Grab
(10, 7), -- Kim follow Shopee
(1, 8), -- An follow TechComBank
(2, 9), -- Bình follow Viettel
(4, 1); -- Dung follow FPT
GO

-- 11.1 INSERT CONNECTION (20 bản ghi - User connections)
INSERT INTO Connection (userId, connectedUserId, status)
VALUES 
-- Accepted connections
(11, 12, 'accepted'), -- Nguyễn Đăng Việt <-> Lê Thị Mai Anh
(11, 13, 'accepted'), -- Nguyễn Đăng Việt <-> Trần Văn Khoa
(12, 14, 'accepted'), -- Lê Thị Mai Anh <-> Phạm Thị Hương
(13, 15, 'accepted'), -- Trần Văn Khoa <-> Hoàng Minh Tuấn
(14, 16, 'accepted'), -- Phạm Thị Hương <-> Đỗ Thị Lan
(15, 17, 'accepted'), -- Hoàng Minh Tuấn <-> Vũ Quang Hải
(16, 18, 'accepted'), -- Đỗ Thị Lan <-> Ngô Thị Thanh
(17, 19, 'accepted'), -- Vũ Quang Hải <-> Bùi Văn Nam
(18, 20, 'accepted'), -- Ngô Thị Thanh <-> Lý Thị Phương
(19, 21, 'accepted'), -- Bùi Văn Nam <-> Đinh Văn Đức
(20, 22, 'accepted'), -- Lý Thị Phương <-> Cao Thị Ngọc
(21, 23, 'accepted'), -- Đinh Văn Đức <-> Phan Văn Thắng
(22, 24, 'accepted'), -- Cao Thị Ngọc <-> Dương Thị Hà
(23, 25, 'accepted'), -- Phan Văn Thắng <-> Mai Văn Hùng

-- Pending connections (waiting for acceptance)
(11, 15, 'pending'),  -- Nguyễn Đăng Việt -> Hoàng Minh Tuấn
(12, 16, 'pending'),  -- Lê Thị Mai Anh -> Đỗ Thị Lan
(13, 17, 'pending'),  -- Trần Văn Khoa -> Vũ Quang Hải
(14, 18, 'pending'),  -- Phạm Thị Hương -> Ngô Thị Thanh

-- Rejected connections
(15, 20, 'rejected'), -- Hoàng Minh Tuấn -> Lý Thị Phương (rejected)
(16, 21, 'rejected'); -- Đỗ Thị Lan -> Đinh Văn Đức (rejected)
GO

-- 12. INSERT BLOGCATEGORY (4 bản ghi)
INSERT INTO BlogCategory (name)
VALUES 
(N'Phỏng vấn'),
(N'Học tập'),
(N'Tìm việc'),
(N'Nghề nghiệp');
GO

-- 13. INSERT BLOG (6 bản ghi)
INSERT INTO Blog (userId, categoryId, title, excerpt, content, readTime, image)
VALUES 
(1, 1, N'Kinh nghiệm phỏng vấn vị trí Frontend Developer', 
N'Chia sẻ những câu hỏi thường gặp và cách chuẩn bị tốt nhất cho buổi phỏng vấn Frontend Developer tại các công ty công nghệ hàng đầu.',
N'## Giới thiệu

Phỏng vấn vị trí Frontend Developer là một quá trình đầy thách thức nhưng cũng rất thú vị. Trong bài viết này, tôi sẽ chia sẻ những kinh nghiệm của mình sau nhiều lần phỏng vấn tại các công ty công nghệ.

## Chuẩn bị trước phỏng vấn

### 1. Kiến thức nền tảng
Đảm bảo bạn nắm vững các kiến thức cơ bản:
- HTML5 semantic tags và accessibility
- CSS3, Flexbox, Grid Layout
- JavaScript ES6+ (Promise, async/await, destructuring, spread operator)
- DOM manipulation và Event handling

### 2. Framework và thư viện
Với React.js (framework phổ biến nhất):
- Component lifecycle và hooks (useState, useEffect, useContext, useMemo, useCallback)
- State management (Redux, Zustand, hoặc Context API)
- React Router cho navigation
- Performance optimization techniques

### 3. Công cụ và môi trường
- Git và GitHub/GitLab
- Package managers (npm, yarn, pnpm)
- Build tools (Webpack, Vite)
- Testing frameworks (Jest, React Testing Library)

## Các câu hỏi thường gặp

### Câu hỏi kỹ thuật

**1. Sự khác biệt giữa var, let và const?**

```javascript
// var: function-scoped, có hoisting
var x = 1;

// let: block-scoped, không hoisting
let y = 2;

// const: block-scoped, không thể reassign
const z = 3;
```

**2. Giải thích về closure trong JavaScript**

Closure là một function có thể truy cập vào biến của outer function ngay cả khi outer function đã return.

```javascript
function outer() {
  const message = "Hello";
  
  function inner() {
    console.log(message); // Truy cập được biến message
  }
  
  return inner;
}

const myFunc = outer();
myFunc(); // "Hello"
```

**3. Virtual DOM là gì và tại sao React sử dụng nó?**

Virtual DOM là một representation của DOM thật trong memory. React sử dụng nó để:
- So sánh (diffing) giữa virtual DOM cũ và mới
- Chỉ update những phần thay đổi trên DOM thật
- Tăng performance đáng kể

### Câu hỏi về dự án

Chuẩn bị kỹ về các dự án bạn đã làm:
- Mô tả tổng quan về dự án
- Vai trò và trách nhiệm của bạn
- Công nghệ sử dụng và lý do chọn chúng
- Challenges và cách bạn giải quyết
- Kết quả đạt được

## Tips quan trọng

### 1. Coding test
- Đọc kỹ đề bài trước khi code
- Hỏi clarifying questions nếu không rõ
- Giải thích approach trước khi implement
- Viết code clean, có comments
- Test với các edge cases

### 2. Soft skills
- Giao tiếp rõ ràng, tự tin
- Thể hiện sự nhiệt tình với công việc
- Hỏi câu hỏi thông minh về công ty/team
- Thành thật về những gì bạn chưa biết

### 3. Sau phỏng vấn
- Gửi thank you email trong vòng 24h
- Follow up nếu không nhận được phản hồi sau 1 tuần
- Học hỏi từ những câu hỏi bạn chưa trả lời được

## Kết luận

Phỏng vấn Frontend Developer đòi hỏi sự chuẩn bị kỹ lưỡng về cả kiến thức kỹ thuật lẫn soft skills. Đừng quá lo lắng nếu không pass, mỗi lần phỏng vấn là một cơ hội học hỏi quý giá.

Chúc các bạn thành công!',
N'5 phút đọc', 
'https://res.cloudinary.com/duc6z828y/image/upload/v1767520714/kinh-nghiem-phong-van-front-end-cac-cau-hoi-thuong-gap-khi-phong-van_bbjwt9.jpg'),

(2, 2, N'Lộ trình học React.js từ cơ bản đến nâng cao',
N'Hướng dẫn chi tiết về cách học React.js hiệu quả, từ những kiến thức nền tảng đến các kỹ thuật nâng cao và best practices.',
N'## Giới thiệu về React.js

React.js là một thư viện JavaScript mạnh mẽ để xây dựng user interfaces. Được phát triển bởi Facebook, React đã trở thành một trong những công nghệ phổ biến nhất trong phát triển web hiện đại.

## Giai đoạn 1: Nền tảng (2-3 tuần)

### JavaScript cơ bản
Trước khi học React, bạn cần nắm vững:
- Variables, data types, operators
- Functions và arrow functions
- Arrays và array methods (map, filter, reduce)
- Objects và destructuring
- ES6+ features
- Promises và async/await

### HTML & CSS
- HTML5 semantic elements
- CSS Flexbox và Grid
- Responsive design
- CSS preprocessors (Sass/SCSS - optional)

## Giai đoạn 2: React cơ bản (3-4 tuần)

### Khái niệm cốt lõi

**1. Components**

```jsx
// Function Component
function Welcome({ name }) {
  return <h1>Hello, {name}!</h1>;
}

// Sử dụng
<Welcome name="John" />
```

**2. JSX**
JSX là syntax extension cho JavaScript, cho phép viết HTML-like code trong JavaScript.

**3. Props**
Props là cách truyền data từ parent component xuống child component.

**4. State**

```jsx
import { useState } from ''react'';

function Counter() {
  const [count, setCount] = useState(0);
  
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>
        Increment
      </button>
    </div>
  );
}
```

### React Hooks cơ bản
- **useState**: Quản lý state trong functional components
- **useEffect**: Side effects (API calls, subscriptions, etc.)
- **useContext**: Truy cập Context API

## Giai đoạn 3: React nâng cao (4-6 tuần)

### Advanced Hooks

**1. useMemo**
Memoize expensive calculations:

```jsx
const expensiveValue = useMemo(() => {
  return computeExpensiveValue(a, b);
}, [a, b]);
```

**2. useCallback**
Memoize functions:

```jsx
const handleClick = useCallback(() => {
  doSomething(a, b);
}, [a, b]);
```

**3. useRef**
Access DOM elements hoặc persist values:

```jsx
const inputRef = useRef(null);

const focusInput = () => {
  inputRef.current.focus();
};
```

### State Management

**Context API**

```jsx
const ThemeContext = createContext(''light'');

function App() {
  return (
    <ThemeContext.Provider value="dark">
      <Toolbar />
    </ThemeContext.Provider>
  );
}
```

**Redux hoặc Zustand**
Cho ứng dụng lớn với state phức tạp.

### React Router

```jsx
import { BrowserRouter, Routes, Route } from ''react-router-dom'';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </BrowserRouter>
  );
}
```

## Giai đoạn 4: Ecosystem & Tools (3-4 tuần)

### Build Tools
- **Vite**: Fast build tool
- **Create React App**: Official starter
- **Next.js**: React framework với SSR

### Testing

```jsx
import { render, screen } from ''@testing-library/react'';

test(''renders welcome message'', () => {
  render(<Welcome name="John" />);
  expect(screen.getByText(''Hello, John!'')).toBeInTheDocument();
});
```

### Performance Optimization
- Code splitting với React.lazy
- Memoization với React.memo
- Virtualization cho long lists
- Image optimization

## Giai đoạn 5: Thực hành (Liên tục)

### Dự án thực tế
1. **Todo App**: CRUD operations, local storage
2. **Weather App**: API integration, async operations
3. **E-commerce**: Complex state, routing, authentication
4. **Social Media Clone**: Real-time updates, file uploads

### Best Practices
- Component composition
- Custom hooks
- Error boundaries
- Accessibility (a11y)
- TypeScript integration

## Resources học tập

### Documentation
- React Official Docs (react.dev)
- MDN Web Docs

### Courses
- FreeCodeCamp
- Scrimba React Course
- Udemy courses

### Practice
- Frontend Mentor
- CodePen
- GitHub projects

## Kết luận

Học React.js là một hành trình dài nhưng đáng giá. Hãy kiên nhẫn, thực hành nhiều và đừng ngại thử nghiệm. Mỗi dự án bạn làm sẽ giúp bạn hiểu sâu hơn về React.

Happy coding! 🚀',
N'8 phút đọc',
'https://res.cloudinary.com/duc6z828y/image/upload/v1767520714/Hoc_React_JS_1_71337ff420_ga7ham.png'),

(1, 3, N'Cách viết CV thu hút nhà tuyển dụng IT',
N'Những tips và tricks để tạo một CV ấn tượng, nổi bật trong hàng nghìn hồ sơ ứng tuyển vào các công ty IT.',
N'## Tại sao CV quan trọng?

CV là ấn tượng đầu tiên của bạn với nhà tuyển dụng. Một CV tốt có thể giúp bạn vượt qua vòng screening và được mời phỏng vấn.

## Cấu trúc CV chuẩn

### 1. Thông tin cá nhân
- Họ tên đầy đủ
- Số điện thoại
- Email (professional)
- LinkedIn profile
- GitHub profile (quan trọng!)
- Portfolio website (nếu có)

**Lưu ý**: Không cần thêm ảnh, địa chỉ chi tiết, tình trạng hôn nhân.

### 2. Summary/Objective (2-3 dòng)

Ví dụ tốt:
> "Frontend Developer với 3 năm kinh nghiệm xây dựng web applications sử dụng React.js và TypeScript. Đam mê tạo ra user experiences mượt mà và accessible. Tìm kiếm cơ hội đóng góp vào team phát triển sản phẩm innovative."

Ví dụ không tốt:
> "Tôi là một developer chăm chỉ, có khả năng học hỏi nhanh và làm việc nhóm tốt."

### 3. Technical Skills

Chia thành categories rõ ràng:

**Languages**: JavaScript, TypeScript, Python, Java
**Frontend**: React.js, Next.js, Vue.js, HTML5, CSS3, Tailwind CSS
**Backend**: Node.js, Express, NestJS, RESTful APIs
**Database**: MongoDB, PostgreSQL, MySQL, Redis
**Tools**: Git, Docker, AWS, CI/CD, Jest, Webpack

**Lưu ý**: Chỉ list những skills bạn thực sự biết và sẵn sàng bị hỏi.

### 4. Work Experience

Format chuẩn:

**Position Title** | Company Name | Duration
- Achievement 1 với metrics cụ thể
- Achievement 2 với impact
- Technologies used: React, Node.js, MongoDB

Ví dụ:

**Senior Frontend Developer** | ABC Tech | 01/2022 - Present
- Phát triển và maintain 5+ web applications phục vụ 100K+ users
- Cải thiện page load time 40% thông qua code splitting và lazy loading
- Mentor 3 junior developers và conduct code reviews
- Tech stack: React, TypeScript, Next.js, Tailwind CSS, GraphQL

**Tips**:
- Bắt đầu với action verbs (Developed, Implemented, Optimized)
- Quantify achievements (số liệu cụ thể)
- Focus vào impact, không chỉ responsibilities
- Sắp xếp theo thứ tự thời gian ngược (mới nhất trước)

### 5. Projects

Nếu bạn là fresher hoặc có ít kinh nghiệm:

**E-commerce Platform** | [GitHub](link) | [Live Demo](link)
- Full-stack web app với React, Node.js, MongoDB
- Features: Authentication, shopping cart, payment integration, admin dashboard
- Implemented responsive design và optimized for mobile
- 500+ lines of test coverage với Jest

**Lưu ý**: 
- Luôn có link GitHub và live demo
- Mô tả features và technologies
- Highlight challenges và solutions

### 6. Education

**Bachelor of Computer Science** | University Name | 2018 - 2022
- GPA: 3.5/4.0 (optional, chỉ ghi nếu tốt)
- Relevant coursework: Data Structures, Algorithms, Web Development

### 7. Certifications (Optional)
- AWS Certified Developer - Associate
- Meta Frontend Developer Professional Certificate
- freeCodeCamp Responsive Web Design

## Những điều NÊN làm

✅ Customize CV cho từng vị trí apply
✅ Sử dụng keywords từ job description
✅ Keep it concise (1-2 pages)
✅ Use clean, professional format
✅ Proofread kỹ (no typos!)
✅ Save as PDF
✅ File name: FirstName_LastName_Position.pdf

## Những điều KHÔNG NÊN làm

❌ Dùng template quá fancy, nhiều màu sắc
❌ Viết quá dài dòng
❌ Copy-paste job description
❌ Nói dối về skills/experience
❌ Sử dụng email không professional (vd: cutegirl123@...)
❌ Quên update thông tin liên lạc

## ATS-Friendly CV

Nhiều công ty dùng ATS (Applicant Tracking System) để scan CV:
- Sử dụng standard section headings
- Tránh tables, columns, headers/footers phức tạp
- Dùng standard fonts (Arial, Calibri, Times New Roman)
- Include keywords từ job description
- Save as .docx hoặc .pdf

## Tools hữu ích

- **Canva**: Templates đẹp, dễ customize
- **Overleaf**: LaTeX templates (professional)
- **Resume.io**: ATS-friendly templates
- **Grammarly**: Check grammar và spelling

## Checklist trước khi gửi

- [ ] Thông tin liên lạc chính xác
- [ ] Không có lỗi chính tả
- [ ] Format nhất quán
- [ ] Links hoạt động (GitHub, LinkedIn, portfolio)
- [ ] Tailored cho vị trí apply
- [ ] File PDF, tên file professional
- [ ] Đã review bởi người khác

## Kết luận

Một CV tốt là chìa khóa mở cửa cho cơ hội phỏng vấn. Đầu tư thời gian để tạo một CV professional, clear và impressive sẽ tăng đáng kể cơ hội được nhà tuyển dụng chú ý.

Good luck! 💼',
N'6 phút đọc',
'https://res.cloudinary.com/duc6z828y/image/upload/v1767520711/trinh-bay-cv_qncwno.jpg'),

(4, 4, N'Kinh nghiệm làm việc tại công ty outsourcing',
N'Chia sẻ trải nghiệm thực tế về môi trường làm việc, cơ hội phát triển và những điều cần lưu ý khi làm việc tại công ty outsourcing.',
N'## Giới thiệu

Công ty outsourcing là lựa chọn phổ biến cho nhiều developer, đặc biệt là fresher. Trong bài viết này, tôi sẽ chia sẻ kinh nghiệm 2 năm làm việc tại một công ty outsourcing lớn.

## Ưu điểm

### 1. Học hỏi nhiều công nghệ
- Tiếp xúc với nhiều dự án khác nhau
- Làm việc với diverse tech stacks
- Cơ hội thử nghiệm technologies mới

### 2. Môi trường năng động
- Team size linh hoạt
- Quy trình agile/scrum
- Collaboration với clients quốc tế

### 3. Career growth
- Clear career path
- Training programs
- Certifications support

## Nhược điểm

### 1. Áp lực deadline
- Tight schedules
- Overtime có thể nhiều
- Client requirements thay đổi

### 2. Thiếu ownership
- Không tham gia product decisions
- Focus vào implementation
- Limited creative freedom

## Tips để thành công

### 1. Communication skills
- English proficiency
- Clear documentation
- Regular updates

### 2. Technical excellence
- Code quality
- Best practices
- Continuous learning

### 3. Time management
- Prioritization
- Estimation accuracy
- Work-life balance

## Kết luận

Outsourcing là môi trường tốt để phát triển kỹ năng technical và professional. Hãy tận dụng cơ hội học hỏi và xây dựng foundation vững chắc cho career.',
N'7 phút đọc',
'https://res.cloudinary.com/duc6z828y/image/upload/v1767520713/kinh-nghiem-lam-viec-cong-ty-outsource_jnn7xk.jpg'),

(5, 1, N'Top 10 câu hỏi phỏng vấn JavaScript thường gặp',
N'Tổng hợp những câu hỏi JavaScript phổ biến nhất trong các buổi phỏng vấn kèm theo câu trả lời chi tiết và giải thích.',
N'## Giới thiệu

JavaScript là ngôn ngữ cốt lõi trong web development. Dưới đây là 10 câu hỏi phổ biến nhất bạn sẽ gặp trong phỏng vấn.

## 1. Hoisting là gì?

Hoisting là cơ chế JavaScript đưa declarations lên đầu scope trước khi code execution.

```javascript
console.log(x); // undefined
var x = 5;

// Tương đương với:
var x;
console.log(x);
x = 5;
```

## 2. Closure

Closure cho phép function truy cập variables từ outer scope.

```javascript
function makeCounter() {
  let count = 0;
  return function() {
    return ++count;
  };
}

const counter = makeCounter();
console.log(counter()); // 1
console.log(counter()); // 2
```

## 3. Event Loop

Event loop xử lý asynchronous operations trong JavaScript.

```javascript
console.log(''1'');
setTimeout(() => console.log(''2''), 0);
console.log(''3'');
// Output: 1, 3, 2
```

## 4. Promise vs Async/Await

```javascript
// Promise
fetch(url)
  .then(response => response.json())
  .then(data => console.log(data));

// Async/Await
async function getData() {
  const response = await fetch(url);
  const data = await response.json();
  console.log(data);
}
```

## 5. this keyword

```javascript
const obj = {
  name: ''John'',
  greet: function() {
    console.log(this.name);
  }
};

obj.greet(); // ''John''
```

## 6. Arrow Functions vs Regular Functions

```javascript
// Regular function
function regular() {
  console.log(this);
}

// Arrow function
const arrow = () => {
  console.log(this);
};
```

## 7. Spread Operator

```javascript
const arr1 = [1, 2, 3];
const arr2 = [...arr1, 4, 5];
console.log(arr2); // [1, 2, 3, 4, 5]
```

## 8. Destructuring

```javascript
const user = { name: ''John'', age: 30 };
const { name, age } = user;

const arr = [1, 2, 3];
const [first, second] = arr;
```

## 9. Map vs ForEach

```javascript
// map returns new array
const doubled = [1, 2, 3].map(x => x * 2);

// forEach doesn''t return
[1, 2, 3].forEach(x => console.log(x));
```

## 10. == vs ===

```javascript
console.log(5 == ''5'');  // true (type coercion)
console.log(5 === ''5''); // false (strict equality)
```

## Kết luận

Nắm vững những concepts này sẽ giúp bạn tự tin hơn trong phỏng vấn JavaScript. Practice thường xuyên để hiểu sâu hơn!',
N'10 phút đọc',
'https://res.cloudinary.com/duc6z828y/image/upload/v1767520712/phong-van-js_fa1y7q.png'),

(10, 4, N'Làm thế nào để thương lượng lương hiệu quả',
N'Hướng dẫn cách chuẩn bị và thương lượng mức lương phù hợp với năng lực và kinh nghiệm của bạn trong ngành IT.',
N'## Tại sao cần thương lượng lương?

Salary negotiation là kỹ năng quan trọng giúp bạn nhận được compensation xứng đáng với value bạn mang lại.

## Chuẩn bị trước khi thương lượng

### 1. Research market rate
- Glassdoor, LinkedIn Salary
- ITviec, TopDev salary reports
- Network với professionals

### 2. Biết giá trị của bạn
- Years of experience
- Technical skills
- Past achievements
- Education & certifications

### 3. Xác định salary range
- Minimum acceptable
- Target salary
- Ideal salary

## Timing

### Khi nào nên negotiate?

✅ Sau khi nhận offer
✅ Performance review
✅ Khi có competing offers
✅ Sau khi hoàn thành major project

❌ Trong first interview
❌ Trước khi prove value
❌ Khi company có financial issues

## Strategies

### 1. Let them make first offer

Employer: "What''s your expected salary?"
You: "I''d like to learn more about the role and responsibilities first. What''s the budget for this position?"

### 2. Give a range

"Based on my research and experience, I''m looking for something in the range of $X to $Y."

### 3. Emphasize value

"Given my 5 years of React experience and track record of delivering projects 20% faster, I believe $X is appropriate."

### 4. Consider total compensation

- Base salary
- Bonuses
- Stock options
- Benefits (insurance, PTO)
- Remote work flexibility
- Learning budget

## Common mistakes

❌ Accepting first offer immediately
❌ Lying about current salary
❌ Being too aggressive
❌ Not having data to back up request
❌ Focusing only on money

## Sample scripts

### Negotiating higher salary

"Thank you for the offer. I''m excited about the opportunity. Based on my experience with React and Node.js, and the market rate for this role, I was hoping for something closer to $X. Is there flexibility in the budget?"

### Asking for time

"I appreciate the offer. Could I have a few days to review the details and get back to you?"

### Declining politely

"Thank you for the offer. After careful consideration, I''ve decided to pursue another opportunity that aligns better with my career goals."

## Red flags

🚩 Company refuses to discuss salary
🚩 Offer significantly below market rate
🚩 No room for negotiation at all
🚩 Pressure to accept immediately

## Tips for success

✅ Be confident but respectful
✅ Have data to support your ask
✅ Be willing to walk away
✅ Consider non-salary benefits
✅ Get everything in writing
✅ Maintain positive relationship

## Kết luận

Salary negotiation là normal part của hiring process. Đừng ngại negotiate - worst case là họ nói không, best case là bạn nhận được better compensation.

Remember: Companies expect candidates to negotiate. Nếu bạn không hỏi, câu trả lời luôn là không!

Good luck! 💰',
N'5 phút đọc',
'https://res.cloudinary.com/duc6z828y/image/upload/v1767520717/thuong-luong-la-gi-thumb_phbjjw.jpg');
GO
