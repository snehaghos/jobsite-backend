const Job = require("../models/job");

exports.createJob = async (req, res) => {
  try {
    const userId = req.user._id; 
    const {
      name,
      description,
      job_type,
      address,
      requirement,
      min_salary,
      max_salary,
      status = 'open'
    } = req.body;

    // Validation
    if (!name || !description || !job_type || !address || !requirement || !min_salary || !max_salary) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required'
      });
    }

    const job = new Job({
      provider_id: userId,
      name,
      description,
      job_type,
      address,
      requirement,
      min_salary,
      max_salary,
      status
    });

    await job.save();

    res.status(201).json({
      success: true,
      message: 'Job created successfully',
      data: job
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Get All Provider Jobs
// exports.getJobs = async (req, res) => {
//   try {
//     const userId = req.user._id;
//     const { status, job_type, page = 1, limit = 10 } = req.query;

//     const filter = { provider_id: userId };
//     if (status) filter.status = status;
//     if (job_type) filter.job_type = job_type;

//     const skip = (page - 1) * limit;

//     const jobs = await Job.find(filter)
//       .skip(skip)
//       .limit(parseInt(limit))
//       .sort({ created_at: -1 });

//     const total = await Job.countDocuments(filter);

//     // Get application counts for each job
//     // const jobsWithCounts = await Promise.all(
//     //   jobs.map(async (job) => {
//     //     const applicationsCount = await Application.countDocuments({ job_id: job._id });
//     //     return {
//     //       ...job.toObject(),
//     //       applications_count: applicationsCount
//     //     };
//     //   })
//     // );

//     res.json({
//       success: true,
//       data: {
//         // jobs: jobsWithCounts,
//         pagination: {
//           current_page: parseInt(page),
//           total_pages: Math.ceil(total / limit),
//           total_jobs: total,
//           per_page: parseInt(limit)
//         }
//       }
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: 'Server error',
//       error: error.message
//     });
//   }
// };


exports.getJobs = async (req, res) => {
  try {
    const userId = req.user._id;

    const jobs = await Job.find({ provider_id: userId }).sort({ created_at: -1 });

    res.json({
      success: true,
      data: jobs
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
};


// Job Controller

// 1. Provider’s Jobs
exports.getMyJobs = async (req, res) => {
  try {
    const userId = req.user._id;
    const jobs = await Job.find({ provider_id: userId }).sort({ created_at: -1 });

    res.json({
      success: true,
      data: jobs
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
};

// All Jobs (for seekers&adsmin too)
exports.getAllJobs = async (req, res) => {
  try {
    const jobs = await Job.find().populate("provider_id", "name email"); 
    res.json({
      success: true,
      data: jobs
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
};



// Get Specific Job
exports.getJob = async (req, res) => {
  try {
  const userId = req.user._id;
    const jobId = req.params.id;

    const job = await Job.findOne({ _id: jobId, provider_id: userId });
    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }

    // const applicationsCount = await Application.countDocuments({ job_id: jobId });

    res.json({
      success: true,
      data: {
        ...job.toObject(),
     
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Update Job
exports.updateJob = async (req, res) => {
  try {
  const userId = req.user._id;
    const jobId = req.params.id;
    const updateData = req.body;


    const job=await Job.findOneAndUpdate(
      { _id: jobId, provider_id: userId },
      updateData,
      { new: true });

      if(!job) {
        return res.status(404).json({
          success: false,
          message: 'Job not found'
        });
      }
    // const job = await Job.findOneAndUpdate(
    //   { _id: jobId, provider_id: userId },
    //   updateData,
    //   { new: true }
    // );

    // if (!job) {
    //   return res.status(404).json({
    //     success: false,
    //     message: 'Job not found'
    //   });
    // }

    res.json({
      success: true,
      message: 'Job updated successfully',
      data: job
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Delete Job
exports.deleteJob = async (req, res) => {
  try {
  const userId = req.user._id;
    const jobId = req.params.id;

    const job = await Job.findOneAndDelete({ _id: jobId, provider_id: userId });
    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }

    //  the models don't exist (wll use for future reference )
    // await Application.deleteMany({ job_id: jobId });
    // await ShortlistedCandidate.deleteMany({ job_id: jobId });

    res.json({
      success: true,
      message: 'Job deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

