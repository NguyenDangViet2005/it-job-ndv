class JobCompanyResponse {
  constructor(company) {
    this.id = company.id;
    this.description = company.description;
    this.name = company.name;
    this.avatar = company.avatar;
    this.website = company.website;
    this.address = company.address;
    this.hotline = company.hotline;
    this.companyemail = company.companyemail;
    this.coverimage = company.coverimage;
    this.address = company.address || null;
    this.memberCount = company.CompanyMembers ? company.CompanyMembers.length : 0;
  }
}

class JobSkillResponse {
  constructor(skill) {
    this.id = skill.id;
    this.name = skill.name;
  }
}

class JobResponse {
  constructor(job) {
    this.id = job.id;
    this.title = job.title;
    this.description = job.description;
    this.type = job.type; // full-time, part-time, etc.
    this.status = job.status;
    this.quantity = job.quantity;
    this.deadline = job.deadline;
    this.salary = job.salary;
    this.createdat = job.createdat;
    this.updatedat = job.updatedat;
    this.company = job.Company ? new JobCompanyResponse(job.Company) : null;
    this.skills = job.Skills
      ? job.Skills.map((skill) => new JobSkillResponse(skill))
      : [];
    this.applicationCount = job.Applications ? job.Applications.length : 0;
  }
}

module.exports = { JobResponse, JobCompanyResponse, JobSkillResponse };
