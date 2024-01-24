const express = require("express");
const env = require("dotenv").config();
const bodyParser = require("body-parser");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const router = require("./routers/index.routes");
const errorHandler = require("./middleware/error.handler");
const { checkToken } = require("./middleware/check.user.auth");

const app = express();

app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  cors({
    origin: "http://localhost:3000/",
    credentials: true,
  })
);
require("./config/db")();
app.use("/api/v1", checkToken, router);
app.use(errorHandler.handler);

app.listen(process.env.PORT || 5000, function () {
  console.log("Server listening on", process.env.PORT);
});
