const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { generateToken } = require("../authUtils");

const Schema = mongoose.Schema;

// User Schema
const UserSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ["admin", "user"],
    default: "user",
  },
});

// Debugging during registration
UserSchema.pre("save", function (next) {
  if (!this.isModified("password")) return next();

  bcrypt.hash(this.password, 10, (err, hashedPassword) => {
    if (err) return next(err);
    console.log("Hashed password:", hashedPassword); // Debug log
    this.password = hashedPassword;
    next();
  });
});

// Debugging during comparison
UserSchema.methods.comparePassword = async function (candidatePassword) {
  try {
    const result = await bcrypt.compare(candidatePassword, this.password);
    console.log("Password comparison result:", result); // Debug log
    return result;
  } catch (err) {
    throw new Error(err);
  }
};

// Method to generate JWT token
UserSchema.methods.generateAuthToken = function () {
  const token = generateToken(this._id); // Use the same function
  return token;
};

const User = mongoose.models.User || mongoose.model("User", UserSchema);

module.exports = User;
