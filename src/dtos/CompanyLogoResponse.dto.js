class CompanyLogoResponse {
  constructor(company) {
    this.id = company.id;
    this.name = company.name;
    this.avatar = company.avatar;
  }
}

module.exports = CompanyLogoResponse;
