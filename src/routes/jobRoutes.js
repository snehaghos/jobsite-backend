const express = require("express");
const {
  createJob,
  getJobs,
  getJob,
  updateJob,
  deleteJob
} = require("../controllers/jobcontroller");

const { protect, authorize } = require("../middlewares/authmiddleware");

const router = express.Router();

router.post("/", protect, authorize("jobprovider"), createJob);
router.get("/", protect, authorize("jobprovider"), getJobs);
router.get("/:id", protect, authorize("jobprovider"), getJob);
router.put("/:id", protect, authorize("jobprovider"), updateJob);
router.delete("/:id", protect, authorize("jobprovider"), deleteJob);

module.exports = router;
