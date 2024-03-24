import mongoose, { mongo } from "mongoose";
import crypto from "crypto";

const ClientSchema = new mongoose.Schema({
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
        const user = await mongoose.model("Client").findOne({ email: value });
        return !user;
      },
      message: "Email address must be unique",
    },
  },
  role: {
    type: String,
    default: "Client",
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

ClientSchema.virtual("password")
  .set(function (password) {
    this._password = password;
    this.salt = this.makeSalt();
    this.hashed_password = this.encryptedPassword(password);
  })
  .get(function () {
    return this._password;
  });

ClientSchema.methods = {
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

ClientSchema.path("hashed_password").validate(function (v) {
  if (this._password && this._password.length < 6) {
    this.invalidate("password", "Password must be at least 6 characters.");
  }
  if (this.isNew && !this._password) {
    this.invalidate("password", "Password is required");
  }
}, null);

export default mongoose.model("Client", ClientSchema);
