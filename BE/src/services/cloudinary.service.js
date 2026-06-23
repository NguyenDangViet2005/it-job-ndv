const cloudinary = require("cloudinary").v2;
const env = require("../configs/env.config");
require("../configs/cloudinary.config");

const getResourceTypeFromFile = (file) => {
  const mimetype = file.mimetype || "";

  if (mimetype.startsWith("video/")) return "video";
  if (mimetype.startsWith("image/")) return "image";

  // Check by filename extension
  const filename = file.originalname || "";
  const ext = filename.toLowerCase().split(".").pop();

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
    const resourceType = getResourceTypeFromUrl(url);
    if (resourceType === "raw") {
      const regex = /\/upload\/(?:v\d+\/)?(.+)$/;
      const match = url.match(regex);
      return match ? match[1] : null;
    }
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

const uploadFile = async (file) => {
  try {
    if (!file || !file.buffer) {
      throw new Error("File buffer is required");
    }

    const targetFolder = env.cloudinary.cloudFolder;
    const resourceType = getResourceTypeFromFile(file);

    const uploadOptions = {
      folder: targetFolder,
      resource_type: resourceType,
    };

    if (resourceType === "raw" && file.originalname) {
      const randomString = Math.random().toString(36).substring(2, 10);
      const ext = file.originalname.toLowerCase().split(".").pop();
      uploadOptions.public_id = `${randomString}_${Date.now()}.${ext}`;
    }

    if (resourceType === "image") {
      uploadOptions.transformation = [
        { quality: "auto", fetch_format: "auto" },
      ];
    }

    // Upload from buffer using upload_stream
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        uploadOptions,
        (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(result);
          }
        }
      );

      // Write buffer to stream
      uploadStream.end(file.buffer);
    });
  } catch (error) {
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
