const JobSeeker = require("../models/jobseeker");
// const Application = require("../models/applicationModel");


// GET my jobseeker profile
exports.getProfile = async (req, res) => {
  try {
    const profile = await JobSeeker.findOne({ user_id: req.user._id }).populate("user_id", "name email");

    if (!profile) {
      return res.status(200).json({
        success: true,
        data: {
          name: req.user.name,
          email: req.user.email,
          contact_no: "",
          first_name: "",
          middle_name: "",
          last_name: "",
          resume_path: "",
          resume_link: "",
          address: "",
          skills: "",
          image: "",
          country: "",
          secondary_experience: "",
          highersecondary_experience: "",
          cgpa: "",
          experience_year: "",
          additional_link: "",
          availability: "",
          dob: ""
        }
      });
    }

    const user = profile.user_id || {};
    res.json({
      success: true,
      data: {
        name: user.name || "",
        email: user.email || "",
        ...profile.toObject()
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

// UPDATE / CREATE jobseeker profile
exports.updateProfile = async (req, res) => {
  try {
    const updateData = {
      contact_no: req.body.contact_no,
      first_name: req.body.first_name,
      middle_name: req.body.middle_name,
      last_name: req.body.last_name,
      resume_path: req.body.resume_path,
      resume_link: req.body.resume_link,
      address: req.body.address,
      skills: req.body.skills,
      country: req.body.country,
      secondary_experience: req.body.secondary_experience,
      highersecondary_experience: req.body.highersecondary_experience,
      cgpa: req.body.cgpa,
      experience_year: req.body.experience_year,
      additional_link: req.body.additional_link,
      availability: req.body.availability,
      dob: req.body.dob
    };

    if (req.file) updateData.image = `/uploads/${req.file.filename}`;

    let profile = await JobSeeker.findOne({ user_id: req.user._id });

    if (profile) {
      await JobSeeker.updateOne({ user_id: req.user._id }, updateData);
      profile = await JobSeeker.findOne({ user_id: req.user._id });
    } else {
      updateData.user_id = req.user._id;
      profile = await JobSeeker.create(updateData);
    }

    res.json({
      success: true,
      message: "Profile updated successfully",
      data: profile
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};
