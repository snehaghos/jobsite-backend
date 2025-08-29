const express = require("express");
const {
  createJob,
  getAllJobs,
  getMyJobs,
  getJob,
  updateJob,
  deleteJob
} = require("../controllers/jobcontroller");

const {
  applyForJob
} = require("../controllers/applicationController");

const {
  saveJob,
  removeSavedJob
} = require("../controllers/savedJobController");

const { protect, authorize } = require("../middlewares/authmiddleware");

const router = express.Router();

router.post("/", protect, authorize("jobprovider"), createJob);

// Job application routes - for jobseekers
router.post("/:id/apply", protect, authorize("jobseeker"), applyForJob);

// Saved jobs routes - for jobseekers
router.post("/:id/save", protect, authorize("jobseeker"), saveJob);
router.delete("/:id/save", protect, authorize("jobseeker"), removeSavedJob);

router.get("/myjobs", protect, authorize("jobprovider"), getMyJobs);
router.get("/", protect, getAllJobs); 

router.get("/:id", protect, getJob);
router.put("/:id", protect, authorize("jobprovider"), updateJob)
router.delete("/:id", protect, authorize("jobprovider"), deleteJob);

module.exports = router;
