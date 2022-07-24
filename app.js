const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const cors = require("cors");

const indexRouter = require("./routes/index");
const usersRouter = require("./routes/users");

const app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "/uploaded")));
app.use(cors());

app.use("/", indexRouter);
app.use("/users", usersRouter);

app.use("/api/v2/authen/", require("./routes/api_authen"));
app.use("/api/v2/employees/", require("./routes/api_employees"));
app.use("/api/v2/product/", require("./routes/api_product"));

module.exports = app;
