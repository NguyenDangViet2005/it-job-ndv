USE ITJOB;
GO

IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_Post_CreatedAt' AND object_id = OBJECT_ID('Post'))
BEGIN
    CREATE INDEX IX_Post_CreatedAt ON Post(createdAt DESC);
END

IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_Post_UserId_CreatedAt' AND object_id = OBJECT_ID('Post'))
BEGIN
    CREATE INDEX IX_Post_UserId_CreatedAt ON Post(userId, createdAt DESC);
END

IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_Post_CompanyId_CreatedAt' AND object_id = OBJECT_ID('Post'))
BEGIN
    CREATE INDEX IX_Post_CompanyId_CreatedAt ON Post(companyId, createdAt DESC);
END

IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_Interaction_PostId_UserId_IsLiked' AND object_id = OBJECT_ID('Interaction'))
BEGIN
    CREATE INDEX IX_Interaction_PostId_UserId_IsLiked ON Interaction(postId, userId, isLiked);
END

IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_Interaction_PostId' AND object_id = OBJECT_ID('Interaction'))
BEGIN
    CREATE INDEX IX_Interaction_PostId ON Interaction(postId);
END

IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_Job_Status_Deadline' AND object_id = OBJECT_ID('Job'))
BEGIN
    CREATE INDEX IX_Job_Status_Deadline ON Job(status, deadline DESC);
END

IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_Job_CompanyId' AND object_id = OBJECT_ID('Job'))
BEGIN
    CREATE INDEX IX_Job_CompanyId ON Job(companyId);
END

IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_Job_CreatedAt' AND object_id = OBJECT_ID('Job'))
BEGIN
    CREATE INDEX IX_Job_CreatedAt ON Job(createdAt DESC);
END

IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'UX_Application_JobId_UserId' AND object_id = OBJECT_ID('Application'))
BEGIN
    CREATE UNIQUE INDEX UX_Application_JobId_UserId ON Application(jobId, userId);
END

IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_Application_JobId_Status' AND object_id = OBJECT_ID('Application'))
BEGIN
    CREATE INDEX IX_Application_JobId_Status ON Application(jobId, status);
END

IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_Application_UserId' AND object_id = OBJECT_ID('Application'))
BEGIN
    CREATE INDEX IX_Application_UserId ON Application(userId);
END

IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_Blog_CategoryId_CreatedAt' AND object_id = OBJECT_ID('Blog'))
BEGIN
    CREATE INDEX IX_Blog_CategoryId_CreatedAt ON Blog(categoryId, createdAt DESC);
END

IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_SkillJob_JobId' AND object_id = OBJECT_ID('Skill_Job'))
BEGIN
    CREATE INDEX IX_SkillJob_JobId ON Skill_Job(jobId);
END

IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_SkillJob_SkillId' AND object_id = OBJECT_ID('Skill_Job'))
BEGIN
    CREATE INDEX IX_SkillJob_SkillId ON Skill_Job(skillId);
END

IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_SkillUser_UserId' AND object_id = OBJECT_ID('Skill_User'))
BEGIN
    CREATE INDEX IX_SkillUser_UserId ON Skill_User(userId);
END

IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_Review_CompanyId' AND object_id = OBJECT_ID('Review'))
BEGIN
    CREATE INDEX IX_Review_CompanyId ON Review(companyId);
END

IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_Attachment_PostId' AND object_id = OBJECT_ID('Attachment'))
BEGIN
    CREATE INDEX IX_Attachment_PostId ON Attachment(postId);
END

IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_Attachment_InteractionId' AND object_id = OBJECT_ID('Attachment'))
BEGIN
    CREATE INDEX IX_Attachment_InteractionId ON Attachment(interactionId);
END
