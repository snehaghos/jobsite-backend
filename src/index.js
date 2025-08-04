const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const connectDB = require("./config/db.js");
const authRoutes = require("./routes/authroutes.js");
const providerRoutes = require("./routes/providerRoutes");

const jobRoutes = require("./routes/jobRoutes");
// const { default: appMiddleware } = require("./middlewares/index.js");

dotenv.config();
connectDB();

const app = express();
app.use(cors({ origin: true, credentials: true }));
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "http://localhost:3000");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
    res.header("Access-Control-Allow-Credentials", "true");
    next();
});

app.use(cors({
  origin: 'http://localhost:3000', // your Next.js frontend URL
  credentials: true // if using cookies
}));

// app.use(appMiddleware);
app.use(express.json());
app.use(cookieParser());


                      
app.use("/api/auth", authRoutes);


app.use("/api/providers", providerRoutes);


app.use("/api/jobs", jobRoutes);



const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
