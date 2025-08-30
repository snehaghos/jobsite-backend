const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Ensure uploads directory exists
const uploadDir = "uploads/";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    console.log("Multer destination called for file:", file.originalname);
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    console.log("Multer filename called for file:", file.originalname);
    const ext = path.extname(file.originalname);
    const filename = `${Date.now()}-${file.fieldname}${ext}`;
    console.log("Generated filename:", filename);
    cb(null, filename);
  }
});

const fileFilter = (req, file, cb) => {
  console.log("Multer file filter called for:", file.originalname, "Type:", file.mimetype);
  
  // Accept images only
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'), false);
  }
};

const upload = multer({ 
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

module.exports = upload;
