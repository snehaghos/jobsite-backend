const express = require("express");
const { getProfile, updateProfile } = require("../controllers/providercontroller");
const { protect, authorize } = require("../middlewares/authmiddleware");
const upload = require("../middlewares/multer");

const router = express.Router();

router.get("/profile", protect, authorize("jobprovider"), getProfile);
router.put("/profile", protect, authorize("jobprovider"), upload.single("logo"), updateProfile);

module.exports = router;
