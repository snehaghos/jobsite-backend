const express = require("express");
const {
  getMySavedJobs
} = require("../controllers/savedJobController");

const { protect, authorize } = require("../middlewares/authmiddleware");

const router = express.Router();

// Saved jobs routes - for jobseekers only
router.get("/", protect, authorize("jobseeker"), getMySavedJobs);

module.exports = router;
