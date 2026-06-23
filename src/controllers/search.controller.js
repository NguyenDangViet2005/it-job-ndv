const searchService = require("../services/search.service");

const search = async (req, res, next) => {
  try {
    const keyword = (req.query.keyword || "").trim();
    if (!keyword) {
      return res
        .status(400)
        .json({ success: false, message: "Keyword is required" });
    }

    const result = await searchService.search(keyword);
    res.status(200).json({
      success: true,
      message: "Tìm kiếm thành công",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  search,
};
