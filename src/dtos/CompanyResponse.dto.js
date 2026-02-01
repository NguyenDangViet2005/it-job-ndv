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
    this.wardName = company.Ward ? company.Ward.name : null;
    this.provinceName =
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

    this.createdbyuserid = company.createdbyuserid;
    this.createdat = company.createdat;
    this.updatedat = company.updatedat;
  }
}

module.exports = CompanyResponse;
