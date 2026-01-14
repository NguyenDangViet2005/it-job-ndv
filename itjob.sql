-- Tạo database
IF EXISTS (SELECT * FROM sys.databases WHERE name = N'ITJOB')
BEGIN
    USE master;
    ALTER DATABASE ITJOB SET SINGLE_USER WITH ROLLBACK IMMEDIATE;
    DROP DATABASE ITJOB;
END
GO

CREATE Database ITJOB
GO

USE ITJOB
GO
CREATE TABLE Provinces (
  id INT IDENTITY(1,1) PRIMARY KEY,
  name NVARCHAR(100) NOT NULL,

);

GO
CREATE TABLE Wards (
  id INT IDENTITY(1,1) PRIMARY KEY,
  provinceId INT NOT NULL,
  name NVARCHAR(100) NOT NULL,

  CONSTRAINT FK_Wards_Province
    FOREIGN KEY (provinceId) REFERENCES Provinces(id)
);


-- Bảng User
CREATE TABLE [User]  (
  id INT IDENTITY(1,1) PRIMARY KEY,
  fullName NVARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  phone VARCHAR(15),
  gender VARCHAR(10) CHECK (gender IN ('male','female','other')),
  dateOfBirth DATE,
  avatar VARCHAR(255),
  coverImage VARCHAR(255),
  CVurl VARCHAR(255),

  role VARCHAR(20) CHECK (role IN ('user', 'employer', 'admin')) DEFAULT 'user',

  refreshToken VARCHAR(500),
  createdAt DATETIME NOT NULL DEFAULT GETDATE(),
  updatedAt DATETIME NOT NULL DEFAULT GETDATE()
);


CREATE TABLE Company (
  id INT IDENTITY(1,1) PRIMARY KEY,
  name NVARCHAR(150) NOT NULL,
  avatar VARCHAR(255),
  coverImage VARCHAR(255),
  nationality NVARCHAR(100),
  website VARCHAR(255),
  description NTEXT,
  foundedYear INT,

  address NVARCHAR(255) NULL,  -- số nhà, đường, thôn...
  wardId INT NULL,                   -- chọn xã/phường là đủ

  createdByUserId INT NULL,
  createdAt DATETIME NOT NULL DEFAULT GETDATE(),
  updatedAt DATETIME NOT NULL DEFAULT GETDATE(),

  CONSTRAINT FK_Companies_CreatedBy
    FOREIGN KEY (createdByUserId) REFERENCES [User](id),

	CONSTRAINT FK_Companies_Location
    FOREIGN KEY (wardId) REFERENCES Wards(id)
);

CREATE TABLE CompanyMembers (
  companyId INT NOT NULL,
  userId INT NOT NULL,
  -- trạng thái membership
  status VARCHAR(20) NOT NULL DEFAULT 'active'
    CHECK (status IN ('pending','active','rejected')),

  joinedAt DATETIME NULL,
  createdAt DATETIME NOT NULL DEFAULT GETDATE(),

  PRIMARY KEY (companyId, userId),

  CONSTRAINT FK_CompanyMembers_Company
    FOREIGN KEY (companyId) REFERENCES Company(id),

  CONSTRAINT FK_CompanyMembers_User
    FOREIGN KEY (userId) REFERENCES [User](id),
);

-- Bảng Job
CREATE TABLE Job (
    id INT PRIMARY KEY IDENTITY(1,1),
    companyId INT NOT NULL,
    title NVARCHAR(150) NOT NULL,
    description NTEXT,
    type VARCHAR(20) CHECK (type IN ('full-time', 'part-time')),
    quantity INT DEFAULT 1,
    deadline DATE,
    status VARCHAR(20) CHECK (status IN ('open', 'closed')) DEFAULT 'open',
    createdAt DATETIME DEFAULT GETDATE(),
    updatedAt DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (companyId) REFERENCES Company(id) ON DELETE CASCADE
);
GO

-- Bảng Skill
CREATE TABLE Skill (
    id INT PRIMARY KEY IDENTITY(1,1),
    name NVARCHAR(100) NOT NULL UNIQUE,
    createdAt DATETIME DEFAULT GETDATE(),
    updatedAt DATETIME DEFAULT GETDATE()
);
GO

-- Bảng Skill_User (Many-to-Many giữa User và Skill)
CREATE TABLE Skill_User (
    skillId INT NOT NULL,
    userId INT NOT NULL,
    PRIMARY KEY (skillId, userId),
    FOREIGN KEY (skillId) REFERENCES Skill(id) ON DELETE CASCADE,
    FOREIGN KEY (userId) REFERENCES [User](id) ON DELETE CASCADE,
    createdAt DATETIME DEFAULT GETDATE(),
    updatedAt DATETIME DEFAULT GETDATE()
);
GO

-- Bảng Skill_Job (Many-to-Many giữa Job và Skill)
CREATE TABLE Skill_Job (
    skillId INT NOT NULL,
    jobId INT NOT NULL,
    PRIMARY KEY (skillId, jobId),
    FOREIGN KEY (skillId) REFERENCES Skill(id) ON DELETE CASCADE,
    FOREIGN KEY (jobId) REFERENCES Job(id) ON DELETE CASCADE,
    createdAt DATETIME DEFAULT GETDATE(),
    updatedAt DATETIME DEFAULT GETDATE()
);
GO

-- Bảng Post
CREATE TABLE Post (
    id INT PRIMARY KEY IDENTITY(1,1),
    userId INT NOT NULL,
    companyId INT,
    content NTEXT,
    createdAt DATETIME DEFAULT GETDATE(),
    updatedAt DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (userId) REFERENCES [User](id) ON DELETE CASCADE,
    FOREIGN KEY (companyId) REFERENCES Company(id) ON DELETE SET NULL
);
GO

-- Bảng Interaction
CREATE TABLE Interaction (
    id INT PRIMARY KEY IDENTITY(1,1),
    postId INT NOT NULL,
    userId INT NOT NULL,
    isLiked BIT DEFAULT 0,
    content NTEXT,
    createdAt DATETIME DEFAULT GETDATE(),
    updatedAt DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (postId) REFERENCES Post(id) ON DELETE CASCADE,
    FOREIGN KEY (userId) REFERENCES [User](id) ON DELETE NO ACTION
);
GO

-- Bảng Review
CREATE TABLE Review (
    id INT PRIMARY KEY IDENTITY(1,1),
    userId INT NOT NULL,
    companyId INT NOT NULL,
    rating INT CHECK (rating BETWEEN 1 AND 5),
    comment NTEXT,
    createdAt DATETIME DEFAULT GETDATE(),
    updatedAt DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (userId) REFERENCES [User](id) ON DELETE CASCADE,
    FOREIGN KEY (companyId) REFERENCES Company(id) ON DELETE NO ACTION
);
GO

-- Bảng Application
CREATE TABLE Application (
    jobId INT NOT NULL,
    userId INT NOT NULL,
    cvUrl VARCHAR(255),
    coverLetter NTEXT,
    status VARCHAR(20) CHECK (status IN ('pending', 'reviewed', 'accepted', 'rejected')) DEFAULT 'pending',
    createdAt DATETIME DEFAULT GETDATE(),
    updatedAt DATETIME DEFAULT GETDATE(),
    PRIMARY KEY (jobId, userId),
    FOREIGN KEY (jobId) REFERENCES Job(id) ON DELETE CASCADE,
    FOREIGN KEY (userId) REFERENCES [User](id) ON DELETE NO ACTION
);
GO

-- Bảng Follow (User theo dõi Company)
CREATE TABLE Follow (
    userId INT NOT NULL,
    companyId INT NOT NULL,
    createdAt DATETIME DEFAULT GETDATE(),
    updatedAt DATETIME DEFAULT GETDATE(),
    PRIMARY KEY (userId, companyId),
    FOREIGN KEY (userId) REFERENCES [User](id) ON DELETE NO ACTION,
    FOREIGN KEY (companyId) REFERENCES Company(id) ON DELETE NO ACTION
);
GO

-- Bảng BlogCategory
CREATE TABLE BlogCategory (
    id INT PRIMARY KEY IDENTITY(1,1),
    name NVARCHAR(100) NOT NULL UNIQUE,
    createdAt DATETIME DEFAULT GETDATE(),
    updatedAt DATETIME DEFAULT GETDATE()
);
GO

-- Bảng Blog
CREATE TABLE Blog (
    id INT PRIMARY KEY IDENTITY(1,1),
    userId INT NOT NULL,
    categoryId INT NOT NULL,
    title NVARCHAR(255) NOT NULL,
    excerpt NVARCHAR(500),
    content NTEXT NOT NULL,
    readTime NVARCHAR(20),
    image VARCHAR(255),
    createdAt DATETIME DEFAULT GETDATE(),
    updatedAt DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (userId) REFERENCES [User](id) ON DELETE CASCADE,
    FOREIGN KEY (categoryId) REFERENCES BlogCategory(id) ON DELETE CASCADE
);
GO
-- thêm bảng attached để một bài post có tải lên nhiều ảnh, comment có thể có nhiều ảnh video được gửi kèm
CREATE TABLE Attachment (
    id INT PRIMARY KEY IDENTITY(1,1),
    postId INT NULL,
    interactionId INT NULL,

    fileType VARCHAR(20) CHECK (fileType IN ('image', 'video', 'audio', 'file')),
    fileUrl VARCHAR(255) NOT NULL,

    CONSTRAINT CK_Attachment_Target CHECK (
        (postId IS NOT NULL AND interactionId IS NULL) OR
        (postId IS NULL AND interactionId IS NOT NULL)
    ),
    -- Chỉ để CASCADE cho Post
    FOREIGN KEY (postId) REFERENCES Post(id) ON DELETE CASCADE,

    -- Interaction thì KHÔNG CASCADE (mặc định là NO ACTION)
    FOREIGN KEY (interactionId) REFERENCES Interaction(id)
);
GO

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

-- 1. INSERT USER (10 bản ghi)
INSERT INTO [User]
(fullName, email, password, phone, gender, dateOfBirth, avatar, coverImage, CVurl, role)
VALUES
(N'Nguyễn Minh Huy', 'hr.fpt@demo.com',    '$2a$12$XRcYOwPoThhwZlCGE1XPouOQCSQvHQQxTWQEtJd.WJ4wXPdGQoEk6', '0901000001', 'male',   '1999-04-12', 'https://i.pravatar.cc/150?img=11', 'https://picsum.photos/seed/u11/1200/400', 'https://drive.google.com/file/d/cv_nguyen_minh_huy.pdf', 'employer'),
(N'Trần Thảo Vy',    'hr.vng@demo.com',    '$2a$12$XRcYOwPoThhwZlCGE1XPouOQCSQvHQQxTWQEtJd.WJ4wXPdGQoEk6', '0901000002', 'female', '2000-08-21', 'https://i.pravatar.cc/150?img=12', 'https://picsum.photos/seed/u12/1200/400', 'https://drive.google.com/file/d/cv_tran_thao_vy.pdf', 'employer'),
(N'Lê Quốc Bảo',     'hr.tiki@demo.com',   '$2a$12$XRcYOwPoThhwZlCGE1XPouOQCSQvHQQxTWQEtJd.WJ4wXPdGQoEk6', '0901000003', 'male',   '1998-01-05', 'https://i.pravatar.cc/150?img=13', 'https://picsum.photos/seed/u13/1200/400', 'https://drive.google.com/file/d/cv_le_quoc_bao.pdf', 'employer'),
(N'Phạm Ngọc Anh',   'hr.momo@demo.com',   '$2a$12$XRcYOwPoThhwZlCGE1XPouOQCSQvHQQxTWQEtJd.WJ4wXPdGQoEk6', '0901000004', 'female', '1997-11-30', 'https://i.pravatar.cc/150?img=14', 'https://picsum.photos/seed/u14/1200/400', 'https://drive.google.com/file/d/cv_pham_ngoc_anh.pdf', 'employer'),
(N'Võ Hoàng Long',   'hr.base@demo.com',   '$2a$12$XRcYOwPoThhwZlCGE1XPouOQCSQvHQQxTWQEtJd.WJ4wXPdGQoEk6', '0901000005', 'male',   '1996-06-18', 'https://i.pravatar.cc/150?img=15', 'https://picsum.photos/seed/u15/1200/400', 'https://drive.google.com/file/d/cv_vo_hoang_long.pdf', 'employer'),
(N'Đặng Thu Trang',  'hr.grab@demo.com',   '$2a$12$XRcYOwPoThhwZlCGE1XPouOQCSQvHQQxTWQEtJd.WJ4wXPdGQoEk6', '0901000006', 'female', '1999-02-14', 'https://i.pravatar.cc/150?img=16', 'https://picsum.photos/seed/u16/1200/400', 'https://drive.google.com/file/d/cv_dang_thu_trang.pdf', 'employer'),
(N'Nguyễn Gia Hân',  'hr.shopee@demo.com', '$2a$12$XRcYOwPoThhwZlCGE1XPouOQCSQvHQQxTWQEtJd.WJ4wXPdGQoEk6', '0901000007', 'other',  '2001-09-09', 'https://i.pravatar.cc/150?img=17', 'https://picsum.photos/seed/u17/1200/400', 'https://drive.google.com/file/d/cv_nguyen_gia_han.pdf', 'employer'),
(N'Tạ Văn Sơn',      'hr.tcb@demo.com',    '$2a$12$XRcYOwPoThhwZlCGE1XPouOQCSQvHQQxTWQEtJd.WJ4wXPdGQoEk6', '0901000008', 'male',   '1995-12-02', 'https://i.pravatar.cc/150?img=18', 'https://picsum.photos/seed/u18/1200/400', 'https://drive.google.com/file/d/cv_ta_van_son.pdf', 'employer'),
(N'Bùi Mỹ Linh',     'hr.viettel@demo.com','$2a$12$XRcYOwPoThhwZlCGE1XPouOQCSQvHQQxTWQEtJd.WJ4wXPdGQoEk6', '0901000009', 'female', '1998-03-25', 'https://i.pravatar.cc/150?img=19', 'https://picsum.photos/seed/u19/1200/400', 'https://drive.google.com/file/d/cv_bui_my_linh.pdf', 'employer'),
(N'Admin System',    'admin@demo.com',     '$2a$12$XRcYOwPoThhwZlCGE1XPouOQCSQvHQQxTWQEtJd.WJ4wXPdGQoEk6','0901000010','male',   '1990-01-01', 'https://i.pravatar.cc/150?img=20', 'https://picsum.photos/seed/u20/1200/400', 'https://drive.google.com/file/d/cv_admin_system.pdf', 'admin');
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
INSERT INTO Job (companyId, title, description, type, quantity, deadline, status)
VALUES 
(1, N'Senior Frontend Developer (ReactJS)', N'Phát triển ứng dụng web với ReactJS, NextJS. Yêu cầu 3+ năm kinh nghiệm, thành thạo TypeScript, Redux.', 'full-time', 2, '2025-12-31', 'open'),
(2, N'Backend Developer (Java Spring Boot)', N'Xây dựng API RESTful với Spring Boot, MySQL. Yêu cầu 2+ năm kinh nghiệm Java, hiểu biết về Microservices.', 'full-time', 3, '2025-11-30', 'open'),
(3, N'DevOps Engineer', N'Quản lý hạ tầng AWS/Azure, CI/CD pipeline. Yêu cầu kinh nghiệm Docker, Kubernetes, Jenkins.', 'full-time', 1, '2025-12-15', 'open'),
(4, N'Mobile Developer (Flutter)', N'Phát triển ứng dụng di động đa nền tảng với Flutter. Yêu cầu 1+ năm kinh nghiệm Flutter/Dart.', 'full-time', 2, '2025-11-25', 'open'),
(5, N'UI/UX Designer', N'Thiết kế giao diện ứng dụng web/mobile. Thành thạo Figma, Adobe XD, hiểu biết về Design System.', 'full-time', 1, '2025-12-10', 'open'),
(6, N'Data Analyst', N'Phân tích dữ liệu kinh doanh, xây dựng dashboard. Yêu cầu SQL, Python, Power BI/Tableau.', 'full-time', 2, '2025-11-20', 'open'),
(7, N'QA/Tester (Manual & Automation)', N'Kiểm thử phần mềm thủ công và tự động. Yêu cầu kinh nghiệm Selenium, API Testing.', 'part-time', 3, '2025-12-05', 'open'),
(8, N'Business Analyst', N'Phân tích yêu cầu nghiệp vụ, viết tài liệu đặc tả. Yêu cầu kỹ năng giao tiếp tốt, hiểu quy trình phát triển phần mềm.', 'full-time', 1, '2025-11-28', 'open'),
(9, N'AI Engineer (Machine Learning)', N'Phát triển mô hình Machine Learning/Deep Learning. Yêu cầu Python, TensorFlow/PyTorch, kinh nghiệm NLP/Computer Vision.', 'full-time', 1, '2025-12-20', 'open'),
(10, N'Product Manager', N'Quản lý sản phẩm công nghệ từ ý tưởng đến triển khai. Yêu cầu 3+ năm kinh nghiệm, tư duy sản phẩm tốt.', 'full-time', 1, '2025-12-01', 'closed');
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
-- 7. INSERT POST (10 bản ghi)
INSERT INTO Post (userId, companyId, content)
VALUES 
(3, 1, N'Chúng tôi đang tuyển dụng Senior Frontend Developer với mức lương hấp dẫn! #hiring #reactjs'),
(6, 4, N'Workshop về Flutter Development sẽ được tổ chức vào tuần tới. Đăng ký ngay! #flutter #workshop'),
(1, NULL, N'Vừa hoàn thành dự án e-commerce với ReactJS và NextJS. Rất hài lòng với kết quả! #project'),
(2, 2, N'Chia sẻ kinh nghiệm về microservices architecture với Spring Boot #java #backend'),
(4, NULL, N'Tìm kiếm cơ hội làm việc tại các công ty công nghệ tại TP.HCM #jobseeking'),
(10, 8, N'TechComBank tuyển dụng Data Analyst. Hồ sơ đã mở! #recruitment #data'),
(5, NULL, N'Có ai có kinh nghiệm với Docker Swarm không? Cần tư vấn cho dự án #docker #devops'),
(8, NULL, N'Portfolio UI/UX Design của mình đây, mọi người góp ý nhé! #design #uiux'),
(9, 6, N'Grab Vietnam đang mở rộng team Engineering. Apply ngay! #grab #jobs'),
(7, NULL, N'Thông báo: Hệ thống sẽ bảo trì vào 23h tối nay #announcement #admin');
GO


-- 8. INSERT INTERACTION (10 bản ghi)
INSERT INTO Interaction (postId, userId, isLiked, content)
VALUES 
(1, 1, 1, NULL), -- An like post 1
(1, 2, 0, N'Mức lương bao nhiêu vậy ạ?'), -- Bình comment post 1
(2, 5, 1, NULL), -- Em like post 2
(3, 4, 1, NULL), -- Dung like post 3
(3, 2, 0, N'Dự án này làm bao lâu vậy bạn?'), -- Bình comment post 3
(4, 8, 1, NULL), -- Hoa like post 4
(5, 3, 0, N'Bạn có thể gửi CV qua email tuyển dụng của công ty FPT nhé!'), -- Cường reply post 5
(7, 10, 0, N'Mình recommend sử dụng Kubernetes thay vì Docker Swarm'), -- Kim comment post 7
(8, 9, 1, NULL), -- Inh like post 8
(9, 1, 1, NULL); -- An like post 9
GO

-- 9. INSERT ATTACHMENT (một vài ví dụ)
INSERT INTO Attachment (postId, interactionId, fileType, fileUrl)
VALUES
-- Post 1 có 2 ảnh
(1, NULL, 'image', '/uploads/posts/1/post1-img1.jpg'),
(1, NULL, 'image', '/uploads/posts/1/post1-img2.jpg'),

-- Post 2 có 1 ảnh
(2, NULL, 'image', '/uploads/posts/2/post2-banner.png'),

-- Comment (Interaction) id = 2 có 1 ảnh đính kèm
(NULL, 2, 'image', '/uploads/comments/2/comment2-img1.jpg'),

-- Comment (Interaction) id = 8 có một video kèm thumbnail
(NULL, 8, 'video', '/uploads/comments/8/comment8-video1.mp4');
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
(1, 1, 'https://drive.google.com/cv/an_nguyen_cv.pdf', N'Tôi có 4 năm kinh nghiệm với ReactJS và đã tham gia nhiều dự án lớn. Mong được đóng góp cho công ty.', 'reviewed'),
(2, 2, 'https://drive.google.com/cv/binh_tran_cv.pdf', N'Tôi thành thạo Java Spring Boot và có kinh nghiệm xây dựng hệ thống microservices.', 'accepted'),
(3, 5, 'https://drive.google.com/cv/em_hoang_cv.pdf', N'Có 2 năm kinh nghiệm DevOps, thành thạo Docker, Kubernetes và AWS.', 'pending'),
(4, 8, 'https://drive.google.com/cv/hoa_bui_cv.pdf', N'Đã phát triển 5+ ứng dụng Flutter trên App Store và Google Play.', 'reviewed'),
(5, 9, 'https://drive.google.com/cv/inh_truong_cv.pdf', N'Designer với 3 năm kinh nghiệm, portfolio tại: behance.net/inhtruong', 'accepted'),
(6, 10, 'https://drive.google.com/cv/kim_ngo_cv.pdf', N'Có nền tảng SQL và Python mạnh, đã làm nhiều dự án phân tích dữ liệu.', 'pending'),
(7, 4, 'https://drive.google.com/cv/dung_pham_cv.pdf', N'Kinh nghiệm testing 2 năm, thành thạo Selenium và API Testing.', 'rejected'),
(8, 1, 'https://drive.google.com/cv/an_nguyen_ba.pdf', N'Có background kỹ thuật và kinh nghiệm phân tích nghiệp vụ trong lĩnh vực fintech.', 'pending'),
(9, 2, 'https://drive.google.com/cv/binh_tran_ai.pdf', N'Thạc sĩ AI, có 2 năm nghiên cứu về NLP và Computer Vision.', 'reviewed'),
(1, 4, 'https://drive.google.com/cv/dung_pham_fe.pdf', N'Fresher nhưng có nền tảng ReactJS vững, học hỏi nhanh.', 'pending');
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

PRINT 'Database ITJOB created successfully with all tables and sample data!'
GO
