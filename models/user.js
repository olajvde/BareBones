const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    fName: {
      type: String,
      required: [true, "Please Enter Your Name"],
    },
    username: {
      type: String,
      required: [true, "Please Choose Your Username"],
      unique: [true, "Username Taken"],
      minlength: [5, "Username must be five characters at least"],
    },
    password: {
      type: String,
      required: [true, "Please Enter a password"],
      minlength: [6, "Password must be Six characters at least"],
    },
    ROLE: {
      type: String,
      default: "Basic",
    },
  },
  {
    timestamps: true,
  }
);

//hash password 🙄
userSchema.pre("save", async function (next) {
  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

//static method to login user
userSchema.statics.login = async function (username, password) {
  const user = await this.findOne({username});
  if (user) {
    const auth = await bcrypt.compare(password, user.password);

    if (auth) {
      return user;
    }
    throw Error("Incorrect Password");
  }
  throw Error("Incorrect Username");
};

const User = mongoose.model("user", userSchema);

module.exports = User;
