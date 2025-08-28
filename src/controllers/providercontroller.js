const JobProvider = require("../models/provider");
const Job = require("../models/job")
exports.getAllProviders = async (req, res) => {
  try {
    const providers = await JobProvider.find().populate("user_id", "name email");

    const providersWithJobs = await Promise.all(
      providers.map(async (provider) => {
        const jobsCount = await Job.countDocuments({ provider_id: provider.user_id._id });
        return {
          ...provider.toObject(),
          jobs_count: jobsCount
        };
      })
    );

    res.json({
      success: true,
      data: providersWithJobs
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
};

exports.getProfile = async (req, res) => {
  try {
    const profile = await JobProvider.findOne({ user_id: req.user._id })
      .populate("user_id", "name email");

    if (!profile) {
      return res.status(200).json({
        success: true,
        data: {
          name: req.user.name,
          email: req.user.email,
          contact_no: "",
          industry: "",
          address: "",
          description: "",
          logo: "",
          website_link: "",
          country: "",
          establishment: "",
          jobs_count: 0,
          jobs: []
        }
      });
    }

    const user = profile.user_id || {};

    const jobs = await Job.find({ provider_id: req.user._id });
    const jobsCount = jobs.length;

    res.json({
      success: true,
      data: {
        name: user.name || "",
        email: user.email || "",
        contact_no: profile.contact_no,
        industry: profile.industry,
        address: profile.address,
        description: profile.description,
        logo: profile.logo,
        website_link: profile.website_link,
        country: profile.country,
        establishment: profile.establishment,
        jobs_count: jobsCount      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const updateData = {
      contact_no: req.body.contact_no,
      industry: req.body.industry,
      address: req.body.address,
      description: req.body.description,
      website_link: req.body.website_link,
      country: req.body.country,
      establishment: req.body.establishment,
    };

    if (req.file) updateData.logo = `/uploads/${req.file.filename}`;

    let profile = await JobProvider.findOne({ user_id: req.user._id });

    if (profile) {
      await JobProvider.updateOne({ user_id: req.user._id }, updateData);
      profile = await JobProvider.findOne({ user_id: req.user._id });
    } else {
      updateData.user_id = req.user._id;
      profile = await JobProvider.create(updateData);
    }

    res.json({
      success: true,
      message: "Profile updated successfully",
      data: profile
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
};
