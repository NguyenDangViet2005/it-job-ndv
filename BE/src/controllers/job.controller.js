const jobService = require("../services/job.service");

const getAll = async (req, res) => {
  try {
    const { pageNumber, pageSize } = req.query;
    const pNumber = parseInt(pageNumber) > 0 ? parseInt(pageNumber) : 1;
    const pSize = parseInt(pageSize) > 0 ? parseInt(pageSize) : 10;

    const result = await jobService.getAll(pNumber, pSize);
    res.status(200).json(result);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching jobs", error: error.message });
  }
};

const getById = async (req, res) => {
  try {
    const { id } = req.params;
    const job = await jobService.getById(id);
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }
    res.status(200).json(job);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching job", error: error.message });
  }
};

const create = async (req, res) => {
  try {
    if (req.user.role !== "employer") {
      return res.status(403).json({ message: "Access denied. Employer only." });
    }

    const result = await jobService.create(req.user.id, req.body);
    res.status(201).json(result);
  } catch (error) {
    if (error.message === "User is not a member of any company") {
      return res.status(400).json({ message: error.message });
    }
    res
      .status(500)
      .json({ message: "Error creating job", error: error.message });
  }
};

const update = async (req, res) => {
  try {
    if (req.user.role !== "employer") {
      return res.status(403).json({ message: "Access denied. Employer only." });
    }
    const { id } = req.params;
    const result = await jobService.update(id, req.body);
    if (!result) {
      return res.status(404).json({ message: "Job not found" });
    }
    res.status(200).json(result);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating job", error: error.message });
  }
};

const deleteJob = async (req, res) => {
  try {
    if (req.user.role !== "employer" && req.user.role !== "admin") {
      return res
        .status(403)
        .json({ message: "Access denied. Employer or Admin only." });
    }
    const { id } = req.params;
    const result = await jobService.deleteJob(id);
    if (!result) {
      return res.status(404).json({ message: "Job not found" });
    }
    res.status(204).send();
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting job", error: error.message });
  }
};

const getJobsToday = async (req, res) => {
  try {
    const result = await jobService.getJobsToday();
    res.status(200).json(result);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching jobs today", error: error.message });
  }
};

const getJobsBySkill = async (req, res) => {
  try {
    const { skillid, pageNumber, pageSize } = req.query;
    if (!skillid) {
      return res.status(400).json({ message: "skillid is required" });
    }
    const pNumber = parseInt(pageNumber) > 0 ? parseInt(pageNumber) : 1;
    const pSize = parseInt(pageSize) > 0 ? parseInt(pageSize) : 10;
    const result = await jobService.getJobsBySkill(skillid, pNumber, pSize);
    res.status(200).json(result);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching jobs by skill", error: error.message });
  }
};

const getJobsByCompanyId = async (req, res) => {
  try {
    const { companyid, pageNumber, pageSize } = req.query;
    if (!companyid) {
      return res.status(400).json({ message: "companyid is required" });
    }
    const pNumber = parseInt(pageNumber) > 0 ? parseInt(pageNumber) : 1;
    const pSize = parseInt(pageSize) > 0 ? parseInt(pageSize) : 10;
    const result = await jobService.getJobsByCompanyId(
      companyid,
      pNumber,
      pSize,
      true, // onlyActive
    );
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching jobs by company",
      error: error.message,
    });
  }
};

const getJobsByUserId = async (req, res) => {
  try {
    if (req.user.role !== "employer") {
      return res.status(403).json({ message: "Access denied. Employer only." });
    }
    const { userid } = req.params;
    const { pageNumber, pageSize } = req.query;

    // Security check
    if (req.user.id != userid) {
      return res.status(403).json({ message: "Access denied." });
    }
    const pNumber = parseInt(pageNumber) > 0 ? parseInt(pageNumber) : 1;
    const pSize = parseInt(pageSize) > 0 ? parseInt(pageSize) : 10;
    const result = await jobService.getJobsByUserId(
      userid,
      pNumber,
      pSize,
      false, // onlyActive = false for employer dashboard
    );
    res.status(200).json(result);
  } catch (error) {
    if (error.message === "User not in any company") {
      return res.status(404).json({ message: error.message });
    }
    res
      .status(500)
      .json({ message: "Error fetching user jobs", error: error.message });
  }
};

module.exports = {
  getAll,
  getById,
  create,
  update,
  deleteJob,
  getJobsToday,
  getJobsBySkill,
  getJobsByCompanyId,
  getJobsByUserId,
};
