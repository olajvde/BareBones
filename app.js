var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const session = require("express-session");
const dotenv = require("dotenv");
const flash = require("connect-flash");
const mongoose = require("mongoose");
const {checkUser} = require("./middleware/auth");
dotenv.config();

const URI = process.env.URI;
mongoose.connect(URI, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
  useCreateIndex: true,
});
const db = mongoose.connection;

db.on("error", (error) => console.log(error));
db.once("open", () => console.log("Database Connected"));

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
const postRouter = require("./routes/posts");

var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(
  session({
    secret: "Connet key",
    resave: false,
    saveUninitialized: false,
  })
);
app.use(flash());
app.use((req, res, next) => {
  res.locals.success_messages = req.flash("success");
  res.locals.error_messages = req.flash("error");

  next();
});

app.use("/", checkUser, indexRouter);
app.use("/users", checkUser, usersRouter);
app.use("/posts", postRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
