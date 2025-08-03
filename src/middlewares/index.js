const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

function appMiddleware(app){
    app.use(cors());
    app.use(express.json());
    app.use(cookieParser());
}

module.exports = appMiddleware;