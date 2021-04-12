const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");

//handle validation errors
const handleErrors = (err) => {
  const errors = {fName: "", username: "", password: ""};

  if (err.message === "Please Enter Your Name") {
    errors.fName = "Please Enter Your Name";
    return errors;
  }

  if (err.message === "Please Choose Your Username") {
    errors.username = "Please Choose Your Username";
    return errors;
  }

  if (err.message === "Username must be five characters at least") {
    errors.username = "Username must be five characters at least";
    return errors;
  }

  if (err.message === "Please Enter a password") {
    errors.password = "Please Enter a password";
    return errors;
  }

  if (err.message === "Password must be Six characters at least") {
    errors.password = "Password must be Six characters at least";
    return errors;
  }

  if (err.message === "Incorrect Password") {
    errors.password = "Incorrect Password or Username";
  }

  if (err.message === "Incorrect Username") {
    errors.password = "Incorrect Password or Username";
  }
  //duplicate error(to handle Unique properties)
  if (err.code === 11000) {
    errors.username = '"Username Taken"';
    return errors;
  }

  //print validation errors
  if (err.message.includes("user validation failed")) {
    Object.values(err.errors).forEach(({properties}) => {
      errors[properties.path] = properties.message;
    });
  }

  return errors;
};

//define token age to be three days day * hours * minutes * seconds 🙂
const maxAge = 3 * 24 * 60 * 60;

const createToken = (id) => {
  return jwt.sign({id}, process.env.JWT_SECRET, {expiresIn: maxAge});
};

module.exports.register = async (req, res) => {
  //take things from req.body 😁

  const {fName, username, password} = req.body;

  //try to save user
  try {
    const user = await User.create({fName, username, password});
    console.log(user);
    // res.status(201).json({msg: "User created "});

    req.flash("success", "Registration Successful, Please Login");
    res.redirect("/users/login");
  } catch (err) {
    const errors = handleErrors(err);

    if (errors.username) {
      req.flash("error", errors.username);
    }
    if (errors.fName) {
      req.flash("error", errors.fName);
    }
    if (errors.password) {
      req.flash("error", errors.password);
    }

    res.redirect("/users/register");
  }
};

module.exports.login = async (req, res) => {
  //take things from req.body again 🙄

  const {username, password} = req.body;

  try {
    // the login function is coming from the static method in the model, if you interested
    const user = await User.login(username, password);
    const token = createToken(user._id);
    res.cookie("jwt", token, {httpOnly: true, maxAge: maxAge * 1000});
    req.flash("success", "Login Successful");
    res.redirect("/");
  } catch (err) {
    const errors = handleErrors(err);
    if (errors.username) {
      req.flash("error", errors.username);
    }

    if (errors.password) {
      req.flash("error", errors.password);
    }

    res.redirect("/users/login");
  }
};

module.exports.logout = (req, res) => {
  res.cookie("jwt", "", {maxAge: 1});
  req.flash("success", "Logged out");
  res.redirect("/users/login");
};
