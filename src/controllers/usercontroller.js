const Job = require("../models/job");
const User = require("../models/user");

exports.getallusers = async (req, res) => {
  const users = await User.find()
  res.json({
    success: true,
    data: users
    });
};

exports.getuserbyid = async (req, res) => {
  const user = await User.findById(req.params.id)
  res.json({
    success: true,
    data: user
    });
  };

exports.getProvidersOnly = async (req, res) => {
  const providers = await User.find({ role: "jobprovider" });
  res.json({
    success: true,
    data: providers
  });
}


exports.getProviderById = async (req, res) => {
  const provider = await User.findById(req.params.id);  
  if (!provider || provider.role !== "jobprovider") {
    return res.status(404).json({ success: false, message: "Provider not found" });
  }
  res.json({
    success: true,
    data: provider
  });

}

exports.getJobSeekersOnly = async (req, res) => {
  const jobseekers = await User.find({ role: "jobseeker" });
  res.json({
    success: true,
    data: jobseekers
  });
}

exports.getAllJobs = async (req, res) => {
  const jobs = await Job.find().populate("provider_id", "name email");
  res.json({
    success: true,
    data: jobs
  }); 
}

exports.getJobById = async (req, res) => {
  const job = await Job.findById(req.params.id).populate("provider_id", "name email");
  if (!job) {
    return res.status(404).json({ success: false, message: "Job not found" });
  }
  res.json({
    success: true,
    data: job
  });
} 

