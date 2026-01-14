class ApplicationResponse {
  constructor(data) {
    this.jobId = data.jobId;
    this.userId = data.userId;
    this.cvUrl = data.cvUrl;
    this.coverLetter = data.coverLetter;
    this.status = data.status;
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;

    // Additional info from Job
    this.jobTitle = data.Job?.title || null;
    this.companyName = data.Job?.Company?.name || null;
    this.companyLogo = data.Job?.Company?.avatar || null;

    // Additional info from User
    this.userFullName = data.User?.fullName || null;
    this.userEmail = data.User?.email || null;
  }
}

module.exports = ApplicationResponse;
