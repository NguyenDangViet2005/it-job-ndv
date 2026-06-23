const { Province, Ward } = require("../models");
const {
  ProvinceResponse,
  WardResponse,
} = require("../dtos/LocationResponse.dto");

const getAllProvinces = async () => {
  try {
    const provinces = await Province.findAll({
      order: [["name", "ASC"]],
    });
    return provinces.map((p) => new ProvinceResponse(p));
  } catch (error) {
    throw error;
  }
};

const getWardsByProvinceId = async (provinceId) => {
  try {
    const wards = await Ward.findAll({
      where: { provinceid },
      order: [["name", "ASC"]],
    });
    return wards.map((w) => new WardResponse(w));
  } catch (error) {
    throw error;
  }
};

module.exports = {
  getAllProvinces,
  getWardsByProvinceId,
};
