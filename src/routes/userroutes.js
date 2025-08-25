const express = require("express");
const { getallusers ,getuserbyid,getProvidersOnly,getJobSeekersOnly,getAllJobs,getProviderById,getJobById} = require("../controllers/usercontroller");
const { protect, authorize } = require("../middlewares/authmiddleware");


const router = express.Router();

router.get("/allusers", protect, authorize("admin"), getallusers);
router.get("/user/:id", protect, authorize("admin"), getuserbyid);
router.get("/providers", protect, authorize("admin"), getProvidersOnly);
router.get("/provider/:id", protect, authorize("admin"), getProviderById);
router.get("/jobseekers", protect, authorize("admin"), getJobSeekersOnly);
router.get("/alljobs", protect, authorize("admin"), getAllJobs);
router.get("/job/:id", protect, authorize("admin"), getJobById);

module.exports = router;
