const express = require("express");
const dotenv = require("dotenv");
// const cors = require("cors");
const cookieParser = require("cookie-parser");
const connectDB = require("./config/db.js");
const authRoutes = require("./routes/authroutes.js");
const providerRoutes = require("./routes/providerRoutes");
const jobRoutes = require("./routes/jobRoutes");
const userRoutes = require("./routes/userroutes");

dotenv.config();
connectDB();

const app = express();

const allowedOrigins = [
"http://localhost:3000",
  "https://jobsite-api.wishalpha.com",
];

app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});

app.use(express.json());
app.use(cookieParser());

app.use("/health", (req, res) => {
  res.send("hi there");
});

app.use("/api/auth", authRoutes);
app.use("/api/admin", userRoutes);
app.use("/api/providers", providerRoutes);
app.use("/api/jobs", jobRoutes);

const PORT = process.env.PORT || 6008;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
