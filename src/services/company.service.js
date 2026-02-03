const {
  Company,
  Job,
  Post,
  Review,
  Follow,
  CompanyMember,
  Application,
  SkillJob,
  Interaction,
  Attachment,
  Ward,
  Province,
} = require("../models");
const cloudinaryService = require("../services/cloudinary.service");
const CompanyResponse = require("../dtos/CompanyResponse.dto");
const CompanyLogoResponse = require("../dtos/CompanyLogoResponse.dto");

const getCompanies = async (pageNumber = 1, pageSize = 10) => {
  try {
    const offset = (pageNumber - 1) * pageSize;
    const { count, rows } = await Company.findAndCountAll({
      include: [
        { model: Job, attributes: ["id"] },
        { model: Post },
        { model: Review },
        { model: Follow },
        { model: CompanyMember},
        {
          model: Ward,
          include: [{ model: Province }],
        },
      ],
      offset,
      limit: pageSize,
      order: [["createdat", "DESC"]],
      distinct: true,
    });
    return {
      data: rows.map((comp) => new CompanyResponse(comp)),
      totalItems: count,
      pageNumber,
      totalPages: Math.ceil(count / pageSize),
      pageSize,
    };
  } catch (error) {
    throw error;
  }
};

const getCompanyLogos = async (pageNumber = 1, pageSize = 10) => {
  try {
    const offset = (pageNumber - 1) * pageSize;
    const { count, rows } = await Company.findAndCountAll({
      attributes: ["id", "name", "avatar"],
      offset,
      limit: pageSize,
      order: [["createdat", "DESC"]],
    });
    return {
      data: rows.map((comp) => new CompanyLogoResponse(comp)),
      totalItems: count,
      pageNumber,
      pageSize,
    };
  } catch (error) {
    throw error;
  }
};

const getCompanyById = async (id) => {
  try {
    const company = await Company.findByPk(id, {
      include: [
        { model: Job },
        { model: Post },
        { model: Review },
        { model: Follow },
        { model: CompanyMember },
      ],
    });
    return company ? new CompanyResponse(company) : null;
  } catch (error) {
    throw error;
  }
};

const createCompany = async (companyData) => {
  try {
    const newCompany = await Company.create({
      ...companyData,
      createdat: new Date(),
      updatedat: new Date(),
    });
    return new CompanyResponse(newCompany);
  } catch (error) {
    throw error;
  }
};

const updateCompany = async (id, updateData) => {
  try {
    const company = await Company.findByPk(id);
    if (!company) throw new Error("Company not found");

    await company.update({
      ...updateData,
      updatedat: new Date(),
    });
    return new CompanyResponse(company);
  } catch (error) {
    throw error;
  }
};

const deleteCompany = async (id) => {
  try {
    const company = await Company.findByPk(id);
    if (!company) return false;

    // Delete company avatar and cover from Cloudinary
    if (company.avatar) {
      await cloudinaryService.deleteFile(company.avatar);
    }
    if (company.coverimage) {
      await cloudinaryService.deleteFile(company.coverimage);
    }

    // 1. Delete Applications (via Jobs)
    // Find job IDs
    const jobs = await Job.findAll({
      where: { companyid: id },
      attributes: ["id"],
    });
    const jobids = jobs.map((j) => j.id);

    if (jobIds.length > 0) {
      await Application.destroy({ where: { jobid: jobids } });
      await SkillJob.destroy({ where: { jobid: jobids } });
      await Job.destroy({ where: { companyid: id } });
    }

    // 2. Delete Posts and their attachments
    const posts = await Post.findAll({
      where: { companyid: id },
      include: [{ model: Attachment, as: "Attachments" }],
    });

    for (const post of posts) {
      // Delete all attachments from Cloudinary
      if (post.Attachments && post.Attachments.length > 0) {
        for (const att of post.Attachments) {
          if (att.fileurl) {
            await cloudinaryService.deleteFile(att.fileurl);
          }
        }
      }
    }

    const postids = posts.map((p) => p.id);
    if (postIds.length > 0) {
      await Interaction.destroy({ where: { postid: postids } });
      await Attachment.destroy({ where: { postid: postids } });
      await Post.destroy({ where: { companyid: id } });
    }

    // 3. Delete Follows
    await Follow.destroy({ where: { companyid: id } });

    // 4. Reviews
    await Review.destroy({ where: { companyid: id } });

    // 5. Members
    await CompanyMember.destroy({ where: { companyid: id } });

    // 6. Company
    await company.destroy();

    return true;
  } catch (error) {
    throw error;
  }
};

const getCompanyByUserId = async (userid) => {
  try {
    const company = await Company.findOne({
      include: [
        {
          model: CompanyMember,
          where: { userid: userid },
          required: true,
        },
        { model: Job },
        { model: Post },
        { model: Review },
        { model: Follow },
      ],
    });
    return company;
  } catch (error) {
    throw error;
  }
};

const uploadCompanyAvatar = async (companyid, file) => {
  try {
    const company = await Company.findByPk(companyid);
    if (!company) throw new Error("Company not found");

    // Delete old avatar from Cloudinary if exists
    if (company.avatar) {
      await cloudinaryService.deleteFile(company.avatar);
    }

    // Removed folder argument "company_avatars" as requested
    const result = await cloudinaryService.uploadFile(file.path);

    company.avatar = result.secure_url;
    await company.save();

    return company.avatar;
  } catch (error) {
    throw error;
  }
};

const uploadCompanyCover = async (companyid, file) => {
  try {
    const company = await Company.findByPk(companyid);
    if (!company) throw new Error("Company not found");

    // Delete old cover image from Cloudinary if exists
    if (company.coverimage) {
      await cloudinaryService.deleteFile(company.coverimage);
    }

    // Removed folder argument "company_covers" as requested
    const result = await cloudinaryService.uploadFile(file.path);

    company.coverimage = result.secure_url;
    await company.save();

    return company.coverimage;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  getCompanies,
  getCompanyLogos,
  getCompanyById,
  createCompany,
  updateCompany,
  deleteCompany,
  getCompanyByUserId,
  uploadCompanyAvatar,
  uploadCompanyCover,
};
