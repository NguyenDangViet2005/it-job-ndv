const locationService = require("../services/location.service");

const getProvinces = async (req, res, next) => {
  try {
    const result = await locationService.getAllProvinces();
    res.status(200).json({
      success: true,
      message: "Lấy danh sách tỉnh/thành phố thành công",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProvinces,
};
