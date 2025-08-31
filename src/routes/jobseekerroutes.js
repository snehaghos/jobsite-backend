const express = require("express");
const {

  getProfile,
  updateProfile
} = require("../controllers/jobseekercontroller");
const { protect, authorize } = require("../middlewares/authmiddleware");
const upload = require("../middlewares/multer");

const router = express.Router();

// For Admin or public (optional)
// router.get("/", protect, authorize("admin"), getAllJobSeekers);

// Jobseeker self profile
router.get("/me", protect, authorize("jobseeker"), getProfile);
router.put("/me", protect, authorize("jobseeker"), upload.single("image"), updateProfile);
module.exports = router;
