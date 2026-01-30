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
  cvUrl VARCHAR(255),

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
  hotline VARCHAR(20) NULL,
  companyEmail VARCHAR(100) NULL,
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
    salary NVARCHAR(100),
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

-- Bảng Connection (User kết nối với User)
CREATE TABLE Connection (
    id INT PRIMARY KEY IDENTITY(1,1),
    userId INT NOT NULL,
    connectedUserId INT NOT NULL,
    status VARCHAR(20) CHECK (status IN ('pending', 'accepted', 'rejected')) DEFAULT 'pending',
    createdAt DATETIME NOT NULL DEFAULT GETDATE(),
    updatedAt DATETIME NOT NULL DEFAULT GETDATE(),
    CONSTRAINT FK_Connection_User FOREIGN KEY (userId) REFERENCES [User](id) ON DELETE CASCADE,
    CONSTRAINT FK_Connection_ConnectedUser FOREIGN KEY (connectedUserId) REFERENCES [User](id) ON DELETE NO ACTION,
    CONSTRAINT UQ_Connection_Pair UNIQUE (userId, connectedUserId)
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


