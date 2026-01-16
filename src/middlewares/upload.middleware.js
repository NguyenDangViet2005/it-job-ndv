const multer = require("multer");

// Use memory storage instead of disk storage
const storage = multer.memoryStorage();

// File filter
const fileFilter = (req, file, cb) => {
  // Accept images, videos, and PDF files
  if (
    !file.originalname.match(
      /\.(jpg|jpeg|png|gif|mp4|avi|mov|mkv|webm|pdf|doc|docx|txt|xls|xlsx|ppt|pptx)$/i
    )
  ) {
    return cb(
      new Error("Only image, video, and document files are allowed!"),
      false
    );
  }
  cb(null, true);
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 100 * 1024 * 1024, // 100MB for videos
  },
  fileFilter: fileFilter,
});

module.exports = upload;
