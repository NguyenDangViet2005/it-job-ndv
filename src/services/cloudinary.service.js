const cloudinary = require("cloudinary").v2;
const fs = require("fs");
const env = require("../configs/env.config");
require("../configs/cloudinary.config");

const getResourceTypeFromPath = (filePath) => {
  const ext = filePath.toLowerCase().split(".").pop();
  const videoExtensions = ["mp4", "avi", "mov", "mkv", "webm", "flv"];
  if (videoExtensions.includes(ext)) return "video";
  const documentExtensions = [
    "pdf",
    "doc",
    "docx",
    "xls",
    "xlsx",
    "ppt",
    "pptx",
    "txt",
  ];
  if (documentExtensions.includes(ext)) return "raw";

  return "image";
};

const getResourceTypeFromUrl = (url) => {
  if (!url) return "image";

  const ext = url.toLowerCase().split(".").pop().split("?")[0]; // Remove query params

  const videoExtensions = ["mp4", "avi", "mov", "mkv", "webm", "flv"];
  if (videoExtensions.includes(ext)) return "video";

  const documentExtensions = [
    "pdf",
    "doc",
    "docx",
    "xls",
    "xlsx",
    "ppt",
    "pptx",
    "txt",
  ];
  if (documentExtensions.includes(ext)) return "raw";

  return "image";
};
const getPublicIdFromUrl = (url) => {
  if (!url) return null;
  try {
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

const uploadFile = async (filePath) => {
  try {
    if (!filePath) {
      throw new Error("File path is required");
    }

    const targetFolder = env.cloudinary.cloudFolder;
    const resourceType = getResourceTypeFromPath(filePath);

    const uploadOptions = {
      folder: targetFolder,
      use_filename: true,
      unique_filename: true,
      resource_type: resourceType,
    };

    if (resourceType === "image") {
      uploadOptions.transformation = [
        { quality: "auto", fetch_format: "auto" },
      ];
    }

    const result = await cloudinary.uploader.upload(filePath, uploadOptions);

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    return result;
  } catch (error) {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
    throw error;
  }
};

const deleteFile = async (url) => {
  try {
    if (!url) return false;

    const publicId = getPublicIdFromUrl(url);
    if (!publicId) return false;

    const resourceType = getResourceTypeFromUrl(url);

    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: resourceType,
    });

    return result.result === "ok";
  } catch (error) {
    console.error("Error deleting file from Cloudinary:", error);
    return false;
  }
};

module.exports = {
  uploadFile,
  deleteFile,
  getPublicIdFromUrl,
  getResourceTypeFromUrl,
};
