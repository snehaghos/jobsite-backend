const express = require("express");
const {
  getMyApplications,
  getApplicationById,
  applyForJob,
  getAppliedJobIds
} = require("../controllers/applicationController");

const { protect, authorize } = require("../middlewares/authmiddleware");

const router = express.Router();

// Application routes - for jobseekers only
router.get("/", protect, authorize("jobseeker"), getMyApplications);
router.get("/applied-jobs", protect, authorize("jobseeker"), getAppliedJobIds);
router.get("/:id", protect, authorize("jobseeker"), getApplicationById);
router.post("/:id", protect, authorize("jobseeker"), applyForJob);

module.exports = router;
