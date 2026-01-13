const { Province } = require("../models");

const getAllProvinces = async () => {
  try {
    const provinces = await Province.findAll({
      order: [["name", "ASC"]],
    });
    return provinces;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  getAllProvinces,
};
