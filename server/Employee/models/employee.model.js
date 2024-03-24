import mongoose, { mongo } from "mongoose";
import crypto from "crypto";

const EmployeeSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: "Name is required",
  },
  lastname: {
    type: String,
    trim: true,
    required: "Lastname is required",
  },
  email: {
    type: String,
    trim: true,
    unique: "Email already exist",
    match: [/.+\@.+..+/, "Please fill a valid email address"],
    required: "Email is required",
    validate: {
      validator: async function (value) {
        const employee = await mongoose
          .model("Employee")
          .findOne({ email: value });
        return !employee;
      },
      message: "Email address must be unique",
    },
  },
  role: {
    type: String,
    default: "employee",
  },
  created: {
    type: Date,
    default: Date.now,
  },
  updated: Date,
  hashed_password: {
    type: String,
    required: "Password is required",
  },
  salt: String,
});

EmployeeSchema.virtual("password")
  .set(function (password) {
    this._password = password;
    this.salt = this.makeSalt();
    this.hashed_password = this.encryptedPassword(password);
  })
  .get(function () {
    return this._password;
  });

EmployeeSchema.methods = {
  authenticate: function (plainText) {
    return this.encryptedPassword(plainText) === this.hashed_password;
  },
  encryptedPassword: function (password) {
    if (!password) return "";
    try {
      return crypto
        .createHmac("sha1", this.salt)
        .update(password)
        .digest("hex");
    } catch (err) {
      return "";
    }
  },
  makeSalt: function () {
    return Math.round(new Date().valueOf() * Math.random()) + "";
  },
};

EmployeeSchema.path("hashed_password").validate(function (v) {
  if (this._password && this._password.length < 6) {
    this.invalidate("password", "Password must be at least 6 characters.");
  }
  if (this.isNew && !this._password) {
    this.invalidate("password", "Password is required");
  }
}, null);

export default mongoose.model("Employee", EmployeeSchema);
