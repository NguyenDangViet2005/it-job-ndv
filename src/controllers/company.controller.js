const companyService = require("../services/company.service");

const getCompanies = async (req, res) => {
  try {
    const { pageNumber, pageSize } = req.query;
    const pNumber = parseInt(pageNumber) > 0 ? parseInt(pageNumber) : 1;
    const pSize = parseInt(pageSize) > 0 ? parseInt(pageSize) : 10;

    const result = await companyService.getCompanies(pNumber, pSize);
    res.status(200).json(result);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching companies", error: error.message });
  }
};

const getCompanyLogos = async (req, res) => {
  try {
    const { pageNumber, pageSize } = req.query;
    const pNumber = parseInt(pageNumber) > 0 ? parseInt(pageNumber) : 1;
    const pSize = parseInt(pageSize) > 0 ? parseInt(pageSize) : 10;

    const result = await companyService.getCompanyLogos(pNumber, pSize);
    res.status(200).json(result);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching company logos", error: error.message });
  }
};

const getCompanyById = async (req, res) => {
  try {
    const { id } = req.params;
    const company = await companyService.getCompanyById(id);
    if (!company) {
      return res.status(404).json({ message: "Company not found" });
    }
    res.status(200).json(company);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching company", error: error.message });
  }
};

const createCompany = async (req, res) => {
  try {
    if (req.user.role !== "employer") {
      return res.status(403).json({ message: "Access denied. Employer only." });
    }

    const newCompany = await companyService.createCompany(req.body);
    res.status(201).json(newCompany);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating company", error: error.message });
  }
};

const updateCompany = async (req, res) => {
  try {
    if (req.user.role !== "employer") {
      return res.status(403).json({ message: "Access denied. Employer only." });
    }

    const { id } = req.params;
    const updatedCompany = await companyService.updateCompany(id, req.body);
    res.status(200).json(updatedCompany);
  } catch (error) {
    if (error.message === "Company not found") {
      return res.status(404).json({ message: error.message });
    }
    res
      .status(500)
      .json({ message: "Error updating company", error: error.message });
  }
};

const deleteCompany = async (req, res) => {
  try {
    if (req.user.role !== "employer" && req.user.role !== "admin") {
      return res
        .status(403)
        .json({ message: "Access denied. Employer or Admin only." });
    }

    const { id } = req.params;
    const result = await companyService.deleteCompany(id);
    if (!result) {
      return res.status(404).json({ message: "Company not found" });
    }
    res.status(204).send();
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting company", error: error.message });
  }
};

const getMyCompany = async (req, res) => {
  try {
    if (req.user.role !== "employer") {
      return res.status(403).json({ message: "Access denied. Employer only." });
    }

    const userid = req.user.id;
    const company = await companyService.getCompanyByUserId(userid);

    if (!company) {
      return res
        .status(404)
        .json({ message: "Bạn chưa được liên kết với công ty nào" });
    }

    res.status(200).json(company);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching my company", error: error.message });
  }
};

const uploadAvatar = async (req, res) => {
  try {
    if (req.user.role !== "employer") {
      return res.status(403).json({ message: "Access denied. Employer only." });
    }

    if (!req.file) {
      return res.status(400).json({ message: "Vui lòng chọn file ảnh" });
    }

    const userid = req.user.id;
    const company = await companyService.getCompanyByUserId(userid);

    if (!company) {
      return res
        .status(404)
        .json({ message: "Bạn chưa được liên kết với công ty nào" });
    }

    const avatarUrl = await companyService.uploadCompanyAvatar(
      company.id,
      req.file,
    );
    res
      .status(200)
      .json({ avatarUrl, message: "Upload ảnh đại diện thành công" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error uploading avatar", error: error.message });
  }
};

const uploadCover = async (req, res) => {
  try {
    if (req.user.role !== "employer") {
      return res.status(403).json({ message: "Access denied. Employer only." });
    }

    if (!req.file) {
      return res.status(400).json({ message: "Vui lòng chọn file ảnh" });
    }

    const userid = req.user.id;
    const company = await companyService.getCompanyByUserId(userid);

    if (!company) {
      return res
        .status(404)
        .json({ message: "Bạn chưa được liên kết với công ty nào" });
    }

    const coverUrl = await companyService.uploadCompanyCover(
      company.id,
      req.file,
    );
    res
      .status(200)
      .json({ avatarUrl: coverUrl, message: "Upload ảnh bìa thành công" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error uploading cover", error: error.message });
  }
};

module.exports = {
  getCompanies,
  getCompanyLogos,
  getCompanyById,
  createCompany,
  updateCompany,
  deleteCompany,
  getMyCompany,
  uploadAvatar,
  uploadCover,
};
