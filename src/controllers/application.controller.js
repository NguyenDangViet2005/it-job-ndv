const applicationService = require("../services/application.service");

const getAll = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied. Admin only." });
    }
    const { pageNumber, pageSize } = req.query;
    const pNumber = parseInt(pageNumber) > 0 ? parseInt(pageNumber) : 1;
    const pSize = parseInt(pageSize) > 0 ? parseInt(pageSize) : 10;
    const result = await applicationService.getAll(pNumber, pSize);
    res.status(200).json(result);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching applications", error: error.message });
  }
};

const create = async (req, res) => {
  try {
    if (req.user.role !== "user") {
      return res.status(403).json({
        message: "Access denied. User only.",
      });
    }
    const userid = req.user.id;
    const { jobid, cvurl, coverletter } = req.body;

    if (!jobId) {
      return res.status(400).json({ message: "JobId is required" });
    }

    const result = await applicationService.create({
      userid,
      jobid,
      cvurl,
      coverletter,
    });

    res.status(201).json(result);
  } catch (error) {
    console.error("Application create error:", error);

    if (error.message === "Bạn đã ứng tuyển vào công việc này rồi") {
      return res.status(400).json({ message: error.message });
    }

    res.status(500).json({
      message: "Error creating application",
      error: error.message,
    });
  }
};

const getByUserId = async (req, res) => {
  try {
    const { userid } = req.params;
    const { pageNumber, pageSize } = req.query;
    const pNumber = parseInt(pageNumber) > 0 ? parseInt(pageNumber) : 1;
    const pSize = parseInt(pageSize) > 0 ? parseInt(pageSize) : 10;

    if (req.user.role === "user") {
      if (req.user.id != userid) {
        return res.status(403).json({ message: "Access denied" });
      }
    } else if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied. User only." });
    }
    const result = await applicationService.getByUserId(userid, pNumber, pSize);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching user applications",
      error: error.message,
    });
  }
};

const getByCompanyId = async (req, res) => {
  try {
    if (req.user.role !== "employer") {
      return res.status(403).json({ message: "Access denied. Employer only." });
    }
    const { companyid } = req.params;
    const { pageNumber, pageSize } = req.query;
    const pNumber = parseInt(pageNumber) > 0 ? parseInt(pageNumber) : 1;
    const pSize = parseInt(pageSize) > 0 ? parseInt(pageSize) : 10;
    const result = await applicationService.getByCompanyId(
      companyid,
      pNumber,
      pSize,
    );
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching company applications",
      error: error.message,
    });
  }
};

const update = async (req, res) => {
  try {
    if (req.user.role !== "employer") {
      return res.status(403).json({ message: "Access denied. Employer only." });
    }
    const { jobid, userid } = req.params;
    const updateData = req.body;
    const result = await applicationService.update(jobId, userid, updateData);
    if (!result) {
      return res.status(404).json({ message: "Application not found" });
    }
    res.status(200).json(result);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating application", error: error.message });
  }
};

const deleteApp = async (req, res) => {
  try {
    if (req.user.role !== "user") {
      return res.status(403).json({ message: "Access denied. User only." });
    }
    const { jobid, userid } = req.params;
    if (req.user.role === "user" && req.user.id != userid) {
      return res.status(403).json({
        message: "Access denied. You can only delete your own application.",
      });
    }
    const result = await applicationService.deleteApp(jobId, userid);
    if (!result) {
      return res.status(404).json({ message: "Không tìm thấy đơn ứng tuyển" });
    }
    res.status(204).send();
  } catch (error) {
    res.status(500).json({
      message: "Đã xảy ra lỗi khi xóa đơn ứng tuyển",
      error: error.message,
    });
  }
};

module.exports = {
  getAll,
  create,
  getByUserId,
  getByCompanyId,
  update,
  deleteApp,
};
