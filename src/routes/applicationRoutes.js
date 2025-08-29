const express = require("express");
const {
  getMyApplications,
  getApplicationById
} = require("../controllers/applicationController");

const { protect, authorize } = require("../middlewares/authmiddleware");

const router = express.Router();

// Application routes - for jobseekers only
router.get("/", protect, authorize("jobseeker"), getMyApplications);
router.get("/:id", protect, authorize("jobseeker"), getApplicationById);

module.exports = router;
