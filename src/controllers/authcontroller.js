const User = require("../models/user.js");
const {generateAccessToken, generateRefreshToken} = require("../utils/generateToken.js");

exports.register = async (req, res) => {
  const { name, email, password, role } = req.body;

  const userExists = await User.findOne({ email });
  if (userExists) return res.status(400).json({ message: "Email already exists" });

  const user = await User.create({ name, email, password, role });

  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  
  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production', 
    sameSite: "strict",
    path: "/",
    maxAge: 7 * 24 * 60 * 60 * 1000 
  };

  res.cookie("refreshToken", refreshToken, cookieOptions);

  res.status(201).json({
    message: "User registered",
    user: { name, email, role },
    accessToken
  });
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user || !(await user.comparePassword(password))) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  
  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production', 
    sameSite: "strict",
    path: "/",
    maxAge: 7 * 24 * 60 * 60 * 1000 
  };

  res.cookie("accessToken", accessToken, cookieOptions);
  res.cookie("refreshToken", refreshToken, cookieOptions);

  res.status(200).json({
    message: "Login successful",
    accessToken,
    user: { name: user.name, email: user.email, role: user.role }
  });
};

exports.logout = (req, res) => {
  
  const clearCookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production', 
    sameSite: "strict",
    path: "/",
  };

  res.clearCookie("refreshToken", clearCookieOptions);
  res.clearCookie("accessToken", clearCookieOptions);

  res.clearCookie("refreshToken", {
    secure: process.env.NODE_ENV === 'production',
    sameSite: "strict",
    path: "/",
  });
  res.clearCookie("accessToken", {
    secure: process.env.NODE_ENV === 'production',
    sameSite: "strict",
    path: "/",
  });

  return res.status(200).json({ message: "Logged out successfully" });
};