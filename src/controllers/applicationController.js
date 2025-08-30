const Application = require('../models/application');
const Job = require('../models/job');
const User = require('../models/user');

// Apply for a job
exports.applyForJob = async (req, res) => {
  try {
    const jobseeker_id = req.user._id;
    const job_id = req.params.id;
    const { cover_letter, resume_url } = req.body;

    // Check if job exists and is open
    const job = await Job.findById(job_id);
    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }

    if (job.status !== 'open') {
      return res.status(400).json({
        success: false,
        message: 'Job is no longer accepting applications'
      });
    }

    // Check if user has already applied for this job
    const existingApplication = await Application.findOne({
      job_id,
      jobseeker_id
    });

    if (existingApplication) {
      return res.status(400).json({
        success: false,
        message: 'You have already applied for this job'
      });
    }

    // Create new application
    const application = new Application({
      job_id,
      jobseeker_id,
      cover_letter,
      resume_url
    });

    await application.save();

    // Populate the application with job and jobseeker details
    await application.populate([
      { path: 'job_id', select: 'name description job_type address min_salary max_salary' },
      { path: 'jobseeker_id', select: 'name email' }
    ]);

    res.status(201).json({
      success: true,
      message: 'Application submitted successfully',
      data: application
    });

  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'You have already applied for this job'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Get all applications for the logged-in jobseeker
exports.getMyApplications = async (req, res) => {
  try {
    const jobseeker_id = req.user._id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const applications = await Application.find({ jobseeker_id })
      .populate({
        path: 'job_id',
        select: 'name description job_type address min_salary max_salary status provider_id',
        populate: {
          path: 'provider_id',
          select: 'name email'
        }
      })
      .sort({ applied_at: -1 })
      .skip(skip)
      .limit(limit);

    const totalApplications = await Application.countDocuments({ jobseeker_id });

    res.json({
      success: true,
      data: {
        applications,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(totalApplications / limit),
          totalApplications,
          hasNextPage: page < Math.ceil(totalApplications / limit),
          hasPrevPage: page > 1
        }
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

// Get a specific application by ID
exports.getApplicationById = async (req, res) => {
  try {
    const jobseeker_id = req.user._id;
    const application_id = req.params.id;

    const application = await Application.findOne({
      _id: application_id,
      jobseeker_id
    }).populate([
      {
        path: 'job_id',
        select: 'name description job_type address requirement min_salary max_salary status provider_id',
        populate: {
          path: 'provider_id',
          select: 'name email'
        }
      },
      { path: 'jobseeker_id', select: 'name email' }
    ]);

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }

    res.json({
      success: true,
      data: application
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Get job IDs that the user has already applied for
exports.getAppliedJobIds = async (req, res) => {
  try {
    const jobseeker_id = req.user._id;

    const applications = await Application.find({ jobseeker_id }).select('job_id');
    const appliedJobIds = applications.map(app => app.job_id.toString());

    res.json({
      success: true,
      data: appliedJobIds
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};
