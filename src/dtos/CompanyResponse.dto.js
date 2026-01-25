class CompanyResponse {
  constructor(company) {
    this.id = company.id;
    this.name = company.name;
    this.avatar = company.avatar;
    this.coverImage = company.coverImage;
    this.nationality = company.nationality;
    this.website = company.website;
    this.description = company.description;
    this.foundedYear = company.foundedYear;
    this.address = company.address;
    this.wardId = company.wardId;

    // Relational data
    this.wardName = company.Ward ? company.Ward.name : null;
    this.provinceName =
      company.Ward && company.Ward.Province ? company.Ward.Province.name : null;

    // Follows data
    if (company.Follows) {
      this.follows = company.Follows.map((follow) => ({
        userId: follow.userId,
        companyId: follow.companyId,
        createdAt: follow.createdAt,
        updatedAt: follow.updatedAt,
      }));
    }

    this.createdByUserId = company.createdByUserId;
    this.createdAt = company.createdAt;
    this.updatedAt = company.updatedAt;
  }
}

module.exports = CompanyResponse;
