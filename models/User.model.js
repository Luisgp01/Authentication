const mongoose = require('mongoose');
const bcrypt = require("bcrypt");

const EMAIL_PATTERN =
  /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
const PASSWORD_PATTERN = /^.{8,}$/i;
const SALT_ROUNDS = 10;

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: "name is required",
    minLength: [3, "name needs at least 3 chars"],
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    match: [EMAIL_PATTERN, "Email already in use man!"],
    unique: true,
  },
  password: {
    type: String,
    match: [PASSWORD_PATTERN, "password needs at least 8 characters man!"],
    required: "Password is required",
  },
  image: {
    type: String,
    default:
      "https://media.istockphoto.com/vectors/anonymous-gender-neutral-face-avatar-incognito-head-silhouette-stock-vector-id1305665241?b=1&k=20&m=1305665241&s=170667a&w=0&h=q1CXsGNkJdfbG3oHEtnnp2lXruwLwzzKLwO6DFUKurg=",
  },
  active: {
    type: Boolean,
    default: false,
  },
  activationToken: {
    type: String,
    default: () => {
      return (
        Math.random().toString(36).substring(7) +
        Math.random().toString(36).substring(7) +
        Math.random().toString(36).substring(7) +
        Math.random().toString(36).substring(7)
      );
    },
  },
});

userSchema.virtual("likes", {
  ref: "Like",
  localField: "_id",
  foreignField: "user",
  justOne: false,
});

/*userSchema.virtual("comments", {
  ref: "Comment",
  localField: "_id",
  foreignField: "user",
  justOne: false,
});*/

userSchema.pre("save", function (next) {
  const user = this;

  if (user.isModified("password")) {
    bcrypt
      .hash(user.password, SALT_ROUNDS)
      .then((hash) => {
        user.password = hash
        next()
      })
      .catch((err) => next(err))
  } else {
    next()
  }
})

userSchema.methods.checkPassword = function (password) {
  return bcrypt.compare(password, this.password)
}

const User = mongoose.model("User", userSchema)
module.exports = User