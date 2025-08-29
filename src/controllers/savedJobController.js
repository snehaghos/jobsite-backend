const SavedJob = require('../models/savedJob');
const Job = require('../models/job');

// Save a job
exports.saveJob = async (req, res) => {
  try {
    const jobseeker_id = req.user._id;
    const job_id = req.params.id;

    // Check if job exists
    const job = await Job.findById(job_id);
    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }

    // Check if job is already saved
    const existingSavedJob = await SavedJob.findOne({
      job_id,
      jobseeker_id
    });

    if (existingSavedJob) {
      return res.status(400).json({
        success: false,
        message: 'Job is already saved'
      });
    }

    // Create new saved job entry
    const savedJob = new SavedJob({
      job_id,
      jobseeker_id
    });

    await savedJob.save();

    // Populate the saved job with job details
    await savedJob.populate({
      path: 'job_id',
      select: 'name description job_type address min_salary max_salary status provider_id',
      populate: {
        path: 'provider_id',
        select: 'name email'
      }
    });

    res.status(201).json({
      success: true,
      message: 'Job saved successfully',
      data: savedJob
    });

  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Job is already saved'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Remove a saved job
exports.removeSavedJob = async (req, res) => {
  try {
    const jobseeker_id = req.user._id;
    const job_id = req.params.id;

    const savedJob = await SavedJob.findOneAndDelete({
      job_id,
      jobseeker_id
    });

    if (!savedJob) {
      return res.status(404).json({
        success: false,
        message: 'Saved job not found'
      });
    }

    res.json({
      success: true,
      message: 'Job removed from saved jobs successfully'
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Get all saved jobs for the logged-in jobseeker
exports.getMySavedJobs = async (req, res) => {
  try {
    const jobseeker_id = req.user._id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const savedJobs = await SavedJob.find({ jobseeker_id })
      .populate({
        path: 'job_id',
        select: 'name description job_type address min_salary max_salary status provider_id created_at',
        populate: {
          path: 'provider_id',
          select: 'name email'
        }
      })
      .sort({ saved_at: -1 })
      .skip(skip)
      .limit(limit);

    const totalSavedJobs = await SavedJob.countDocuments({ jobseeker_id });

    res.json({
      success: true,
      data: {
        savedJobs,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(totalSavedJobs / limit),
          totalSavedJobs,
          hasNextPage: page < Math.ceil(totalSavedJobs / limit),
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
