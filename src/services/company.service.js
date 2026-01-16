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
        {
          model: Ward,
          include: [{ model: Province }],
        },
      ],
      offset,
      limit: pageSize,
      order: [["createdAt", "DESC"]],
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
      order: [["createdAt", "DESC"]],
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
      createdAt: new Date(),
      updatedAt: new Date(),
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
      updatedAt: new Date(),
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
    if (company.coverImage) {
      await cloudinaryService.deleteFile(company.coverImage);
    }

    // 1. Delete Applications (via Jobs)
    // Find job IDs
    const jobs = await Job.findAll({
      where: { companyId: id },
      attributes: ["id"],
    });
    const jobIds = jobs.map((j) => j.id);

    if (jobIds.length > 0) {
      await Application.destroy({ where: { jobId: jobIds } });
      await SkillJob.destroy({ where: { jobId: jobIds } });
      await Job.destroy({ where: { companyId: id } });
    }

    // 2. Delete Posts and their attachments
    const posts = await Post.findAll({
      where: { companyId: id },
      include: [{ model: Attachment, as: "Attachments" }],
    });

    for (const post of posts) {
      // Delete all attachments from Cloudinary
      if (post.Attachments && post.Attachments.length > 0) {
        for (const att of post.Attachments) {
          if (att.fileUrl) {
            await cloudinaryService.deleteFile(att.fileUrl);
          }
        }
      }
    }

    const postIds = posts.map((p) => p.id);
    if (postIds.length > 0) {
      await Interaction.destroy({ where: { postId: postIds } });
      await Attachment.destroy({ where: { postId: postIds } });
      await Post.destroy({ where: { companyId: id } });
    }

    // 3. Delete Follows
    await Follow.destroy({ where: { companyId: id } });

    // 4. Reviews
    await Review.destroy({ where: { companyId: id } });

    // 5. Members
    await CompanyMember.destroy({ where: { companyId: id } });

    // 6. Company
    await company.destroy();

    return true;
  } catch (error) {
    throw error;
  }
};

const getCompanyByUserId = async (userId) => {
  try {
    const company = await Company.findOne({
      include: [
        {
          model: CompanyMember,
          where: { userId: userId },
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

const uploadCompanyAvatar = async (companyId, file) => {
  try {
    const company = await Company.findByPk(companyId);
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

const uploadCompanyCover = async (companyId, file) => {
  try {
    const company = await Company.findByPk(companyId);
    if (!company) throw new Error("Company not found");

    // Delete old cover image from Cloudinary if exists
    if (company.coverImage) {
      await cloudinaryService.deleteFile(company.coverImage);
    }

    // Removed folder argument "company_covers" as requested
    const result = await cloudinaryService.uploadFile(file.path);

    company.coverImage = result.secure_url;
    await company.save();

    return company.coverImage;
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
