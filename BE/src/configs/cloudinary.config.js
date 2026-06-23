const cloudinary = require("cloudinary").v2;
const env = require("./env.config");

cloudinary.config({
  cloud_name: env.cloudinary.cloudName,
  api_key: env.cloudinary.apiKey,
  api_secret: env.cloudinary.apiSecret,
});

module.exports = cloudinary;
