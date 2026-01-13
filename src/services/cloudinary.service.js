const cloudinary = require("cloudinary").v2;
const fs = require("fs");
const env = require("../configs/env.config");
require("../configs/cloudinary.config");

const uploadImage = async (filePath) => {
  try {
    if (!filePath) {
      throw new Error("File path is required");
    }
    // Use only root folder from env
    const targetFolder = env.cloudinary.cloudFolder;

    const result = await cloudinary.uploader.upload(filePath, {
      folder: targetFolder,
      use_filename: true,
      unique_filename: true,
      resource_type: "auto",
      transformation: [{ quality: "auto", fetch_format: "auto" }],
    });

    fs.unlinkSync(filePath);

    return result;
  } catch (error) {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
    throw error;
  }
};

const deleteImage = async (publicId) => {
  try {
    if (!publicId) return false;

    const result = await cloudinary.uploader.destroy(publicId);
    return result.result === "ok";
  } catch (error) {
    throw error;
  }
};

const uploadVideo = async (filePath) => {
  try {
    if (!filePath) {
      throw new Error("File path is required for video");
    }
    const targetFolder = env.cloudinary.cloudFolder;

    const result = await cloudinary.uploader.upload(filePath, {
      folder: targetFolder,
      use_filename: true,
      unique_filename: true,
      resource_type: "video",
    });

    try {
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    } catch (fsError) {
      console.warn("Failed to delete local video file:", fsError.message);
    }

    return result;
  } catch (error) {
    try {
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    } catch (fsError) {}
    throw error;
  }
};

const deleteVideo = async (publicId) => {
  try {
    if (!publicId) return false;

    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: "video",
    });
    return result.result === "ok";
  } catch (error) {
    throw error;
  }
};

const getPublicIdFromUrl = (url) => {
  if (!url) return null;
  try {
    const splitUrl = url.split("/");
    const lastPart = splitUrl[splitUrl.length - 1];
    const fileName = lastPart.split(".")[0];

    const regex = /\/upload\/(?:v\d+\/)?(.+)\.[^.]+$/;
    const match = url.match(regex);
    if (match && match[1]) {
      return match[1];
    }
    return null;
  } catch (error) {
    return null;
  }
};

module.exports = {
  uploadImage,
  deleteImage,
  uploadVideo,
  deleteVideo,
  getPublicIdFromUrl,
};
