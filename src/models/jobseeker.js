const mongoose = require("mongoose");

const jobSeekerSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
  contact_no: { type: String, required: true, unique: true },
  first_name: { type: String, required: true },
  middle_name: { type: String },
  last_name: { type: String, required: true },
  resume_path: { type: String }, // Made optional - users can save profile without resume
  resume_link: { type: String }, // Made optional - users can save profile without resume  
  address: { type: String, required: true },
  skills: { type: String },
  image: { type: String },
  country: { type: String },
  secondary_experience: { type: String },
  highersecondary_experience: { type: String },
  cgpa: { type: String },
  experience_year: { type: String },
  additional_link: { type: String },
  availability: { type: String }, // Added missing field
  dob: { type: Date },
}, { timestamps: true });

module.exports = mongoose.model("JobSeeker", jobSeekerSchema);
