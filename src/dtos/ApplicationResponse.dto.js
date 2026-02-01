class ApplicationResponse {
  constructor(data) {
    this.jobid = data.jobid;
    this.userid = data.userid;
    this.cvurl = data.cvurl;
    this.coverletter = data.coverletter;
    this.status = data.status;
    this.createdat = data.createdat;
    this.updatedat = data.updatedat;

    // Additional info from Job
    this.jobTitle = data.Job?.title || null;
    this.companyName = data.Job?.Company?.name || null;
    this.companyLogo = data.Job?.Company?.avatar || null;

    // Additional info from User
    this.userfullname = data.User?.fullname || null;
    this.userEmail = data.User?.email || null;
  }
}

module.exports = ApplicationResponse;
