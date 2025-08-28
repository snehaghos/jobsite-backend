const express = require("express");
const {
  createJob,
  getAllJobs,
  getMyJobs,
  getJob,
  updateJob,
  deleteJob
} = require("../controllers/jobcontroller");

const { protect, authorize } = require("../middlewares/authmiddleware");

const router = express.Router();

router.post("/", protect, authorize("jobprovider"), createJob);


router.get("/myjobs", protect, authorize("jobprovider"), getMyJobs);
router.get("/", protect, getAllJobs); 

router.get("/:id", protect, getJob);
router.put("/:id", protect, authorize("jobprovider"), updateJob)
router.delete("/:id", protect, authorize("jobprovider"), deleteJob);

module.exports = router;
