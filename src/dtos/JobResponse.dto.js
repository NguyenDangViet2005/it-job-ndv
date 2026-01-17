class JobCompanyResponse {
  constructor(company) {
    this.id = company.id;
    this.description = company.description;
    this.name = company.name;
    this.avatar = company.avatar;
    this.website = company.website;
    this.address = company.address;
    this.coverImage = company.coverImage;
    this.address = company.address || null;
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
    this.createdAt = job.createdAt;
    this.updatedAt = job.updatedAt;
    this.company = job.Company ? new JobCompanyResponse(job.Company) : null;
    this.skills = job.Skills
      ? job.Skills.map((skill) => new JobSkillResponse(skill))
      : [];
  }
}

module.exports = { JobResponse, JobCompanyResponse, JobSkillResponse };
