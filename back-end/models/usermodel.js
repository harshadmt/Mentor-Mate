const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  fullName:{ type: String, required: true },
  email:{ type: String, required: true, unique: true },
  password:{ type: String, required: true },
  role: { type: String, enum: ["student", "mentor", "admin"], required: true },
  bio:{ type: String },
  profilePicture: { type: String }
});

module.exports = mongoose.model("User", userSchema);
