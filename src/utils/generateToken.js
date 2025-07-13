
const jwt= require("jsonwebtoken");

exports.generateAccessToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET_ACCESS,
    { expiresIn: process.env.JWT_ACCESS_EXPIRE }
  );
};

exports.generateRefreshToken = (user) => {
  return jwt.sign(
    { id: user._id },
    process.env.JWT_SECRET_REFRESH,
    { expiresIn: process.env.JWT_REFRESH_EXPIRE }
  );
};
