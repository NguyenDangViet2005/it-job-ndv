const multer = require("multer");
const path = require("path");

// Configure storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname)
    );
  },
});

// File filter
const fileFilter = (req, file, cb) => {
  // Accept images, videos, and PDF files
  if (
    !file.originalname.match(
      /\.(jpg|jpeg|png|gif|mp4|avi|mov|mkv|pdf|doc|docx)$/i
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
    fileSize: 10 * 1024 * 1024, // 10MB for documents
  },
  fileFilter: fileFilter,
});

module.exports = upload;
