const express = require("express");
const {
  getMySavedJobs,
  saveJob,
  removeSavedJob
} = require("../controllers/savedJobController");

const { protect, authorize } = require("../middlewares/authmiddleware");

const router = express.Router();

// Saved jobs routes - for jobseekers only
router.get("/", protect, authorize("jobseeker"), getMySavedJobs);
router.post("/:id/save", protect, authorize("jobseeker"), saveJob);
router.delete("/:id/save", protect, authorize("jobseeker"), removeSavedJob);

module.exports = router;
