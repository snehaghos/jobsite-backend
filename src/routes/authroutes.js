const express = require("express");
const { register, login, logout } = require("../controllers/authcontroller.js");
const { protect } = require("../middlewares/authmiddleware.js");
const { authorizeRoles } = require("../middlewares/rolemiddleware.js");
const jwt = require("jsonwebtoken");
const User = require("../models/user.js");
const { generateAccessToken } = require("../utils/generateToken.js");

const router = express.Router();



router.post("/refresh-token", async (req, res) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) return res.status(401).json({ message: "No refresh token" });

  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET_REFRESH);
    const user = await User.findById(decoded.id);
    if (!user) return res.status(401).json({ message: "Invalid user" });

    const newAccessToken = generateAccessToken(user);
    res.status(200).json({ accessToken: newAccessToken });

  } catch (err) {
    return res.status(403).json({ message: "Invalid or expired refresh token" });
  }
});


router.post("/register", register);
router.post("/login", login);
router.get("/logout", logout);

//  protected route
// router.get("/admin", protect, authorizeRoles("admin"), (req, res) => {
//   res.json({ message: "Welcome Admin!" });
// });

// router.get("/jobseeker", protect, authorizeRoles("jobseeker"), (req, res) => {
//   res.json({ message: "Welcome Jobseeker!" });
// });

// router.get("/jobprovider", protect, authorizeRoles("jobprovider"), (req, res) => {
//   res.json({ message: "Welcome Jobprovider!" });
// });

module.exports = router;
