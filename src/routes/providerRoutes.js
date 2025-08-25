const express = require("express");
const { getProfile, updateProfile,getAllProviders } = require("../controllers/providercontroller");
const { protect, authorize } = require("../middlewares/authmiddleware");
const upload = require("../middlewares/multer");

const router = express.Router();

router.get("/profile", protect, authorize("jobprovider"), getProfile);
router.put("/updateprofile", protect, authorize("jobprovider"), upload.single("logo"), updateProfile);
router.get("/allproviders", getAllProviders);

module.exports = router;
