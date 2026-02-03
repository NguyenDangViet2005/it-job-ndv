class CompanyResponse {
  constructor(company) {
    this.id = company.id;
    this.name = company.name;
    this.avatar = company.avatar;
    this.coverimage = company.coverimage;
    this.nationality = company.nationality;
    this.website = company.website;
    this.description = company.description;
    this.foundedyear = company.foundedyear;
    this.address = company.address;
    this.hotline = company.hotline;
    this.companyemail = company.companyemail;
    this.wardid = company.wardid;

    // Relational data
    this.wardname = company.Ward ? company.Ward.name : null;
    this.provincename =
      company.Ward && company.Ward.Province ? company.Ward.Province.name : null;

    // Follows data
    if (company.Follows) {
      this.follows = company.Follows.map((follow) => ({
        userid: follow.userid,
        companyid: follow.companyid,
        createdat: follow.createdat,
        updatedat: follow.updatedat,
      }));
    }

    // Company Members data
    if (company.CompanyMembers) {
      this.members = company.CompanyMembers;
      this.membersCount = company.CompanyMembers.length;
    }

    // Jobs data
    if (company.Jobs) {
      this.jobs = company.Jobs.map((job) => ({
        id: job.id,
        companyid: job.companyid,
        title: job.title,
        description: job.description,
        type: job.type,
        quantity: job.quantity,
        deadline: job.deadline,
        salary: job.salary,
        status: job.status,
        createdat: job.createdat,
        updatedat: job.updatedat,
      }));
    }

    // Posts data
    if (company.Posts) {
      this.posts = company.Posts.map((post) => ({
        id: post.id,
        userid: post.userid,
        companyid: post.companyid,
        content: post.content,
        createdat: post.createdat,
        updatedat: post.updatedat,
      }));
    }

    // Reviews data
    if (company.Reviews) {
      this.reviews = company.Reviews.map((review) => ({
        id: review.id,
        userid: review.userid,
        companyid: review.companyid,
        rating: review.rating,
        comment: review.comment,
        createdat: review.createdat,
        updatedat: review.updatedat,
      }));
    }

    this.createdbyuserid = company.createdbyuserid;
    this.createdat = company.createdat;
    this.updatedat = company.updatedat;
  }
}

module.exports = CompanyResponse;
