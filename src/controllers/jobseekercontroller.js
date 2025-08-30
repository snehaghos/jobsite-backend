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
    console.log("=== UPDATE PROFILE REQUEST ===");
    console.log("Request body:", req.body);
    console.log("Request file:", req.file);
    console.log("User ID:", req.user?._id);
    
    // Only include defined values to avoid validation errors
    const updateData = {};
    
    // Helper function to add field only if it has a value
    const addFieldIfValid = (fieldName, value) => {
      if (value !== undefined && value !== null && value !== '') {
        updateData[fieldName] = value;
      }
    };
    
    // Add all fields conditionally
    addFieldIfValid('contact_no', req.body.contact_no);
    addFieldIfValid('first_name', req.body.first_name);
    addFieldIfValid('middle_name', req.body.middle_name);
    addFieldIfValid('last_name', req.body.last_name);
    addFieldIfValid('resume_path', req.body.resume_path);
    addFieldIfValid('resume_link', req.body.resume_link);
    addFieldIfValid('address', req.body.address);
    addFieldIfValid('skills', req.body.skills);
    addFieldIfValid('country', req.body.country);
    addFieldIfValid('secondary_experience', req.body.secondary_experience);
    addFieldIfValid('highersecondary_experience', req.body.highersecondary_experience);
    addFieldIfValid('cgpa', req.body.cgpa);
    addFieldIfValid('experience_year', req.body.experience_year);
    addFieldIfValid('additional_link', req.body.additional_link);
    addFieldIfValid('availability', req.body.availability);
    addFieldIfValid('dob', req.body.dob);

    if (req.file) {
      updateData.image = `/uploads/${req.file.filename}`;
      console.log("Image file processed:", updateData.image);
    }

    console.log("Update data prepared:", updateData);

    let profile = await JobSeeker.findOne({ user_id: req.user._id });
    console.log("Existing profile found:", !!profile);

    if (profile) {
      // Update existing profile
      await JobSeeker.updateOne({ user_id: req.user._id }, { $set: updateData });
      profile = await JobSeeker.findOne({ user_id: req.user._id });
      console.log("Profile updated");
    } else {
      // Create new profile - user_id is required
      updateData.user_id = req.user._id;
      profile = await JobSeeker.create(updateData);
      console.log("Profile created");
    }

    console.log("Final profile:", profile);

    const response = {
      success: true,
      message: "Profile updated successfully",
      data: profile
    };
    
    console.log("Sending response:", response);
    res.json(response);
  } catch (error) {
    console.error("Error in updateProfile:", error);
    res.status(500).json({ 
      success: false, 
      message: "Server error", 
      error: error.message 
    });
  }
};

// GENERATE RESUME based on profile
exports.generateResume = async (req, res) => {
  try {
    console.log("=== GENERATE RESUME REQUEST ===");
    console.log("User ID:", req.user?._id);
    
    // Get the jobseeker profile
    const profile = await JobSeeker.findOne({ user_id: req.user._id }).populate("user_id", "name email");

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: "Profile not found. Please create your profile first."
      });
    }

    // Check if profile has minimum required data
    const requiredFields = ['contact_no', 'first_name', 'last_name', 'address', 'skills'];
    const missingFields = requiredFields.filter(field => !profile[field] || profile[field].trim() === '');
    
    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Please complete your profile. Missing: ${missingFields.join(', ')}`
      });
    }

    // For now, return a simple text-based resume
    // In a real application, you might use a PDF generator like puppeteer or pdfkit
    const user = profile.user_id || {};
    
    const resumeContent = `
RESUME
======

Personal Information:
--------------------
Name: ${profile.first_name} ${profile.middle_name ? profile.middle_name + ' ' : ''}${profile.last_name}
Email: ${user.email}
Phone: ${profile.contact_no}
Address: ${profile.address}
${profile.country ? `Country: ${profile.country}` : ''}
${profile.dob ? `Date of Birth: ${new Date(profile.dob).toLocaleDateString()}` : ''}

Skills:
-------
${profile.skills}

Education:
----------
${profile.secondary_experience ? `Secondary Education: ${profile.secondary_experience}` : ''}
${profile.highersecondary_experience ? `Higher Secondary Education: ${profile.highersecondary_experience}` : ''}
${profile.cgpa ? `CGPA: ${profile.cgpa}` : ''}

Experience:
-----------
${profile.experience_year ? `Experience: ${profile.experience_year}` : 'No experience specified'}

Additional Information:
----------------------
${profile.availability ? `Availability: ${profile.availability}` : ''}
${profile.additional_link ? `Portfolio/Link: ${profile.additional_link}` : ''}

Generated on: ${new Date().toLocaleDateString()}
    `;

    // In a real implementation, you would:
    // 1. Generate a PDF using a library like puppeteer
    // 2. Save it to a file
    // 3. Return the file URL
    
    // For now, we'll return the text content and a placeholder URL
    console.log("Resume generated successfully for user:", req.user._id);
    
    res.json({
      success: true,
      message: "Resume generated successfully",
      data: {
        resume_url: `data:text/plain;charset=utf-8,${encodeURIComponent(resumeContent)}`,
        content: resumeContent
      }
    });

  } catch (error) {
    console.error("Error generating resume:", error);
    res.status(500).json({ 
      success: false, 
      message: "Server error while generating resume", 
      error: error.message 
    });
  }
};
