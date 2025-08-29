const mongoose = require('mongoose');

const savedJobSchema = new mongoose.Schema({
  job_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job',
    required: true
  },
  jobseeker_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  saved_at: {
    type: Date,
    default: Date.now
  }
});

// Ensure a jobseeker can only save a job once
savedJobSchema.index({ job_id: 1, jobseeker_id: 1 }, { unique: true });

module.exports = mongoose.model('SavedJob', savedJobSchema);
