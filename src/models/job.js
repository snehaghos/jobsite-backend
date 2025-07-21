const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  provider_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  job_type: {
    type: String,
    required: true,
    trim: true
  },
  address: {
    type: String,
    required: true,
    trim: true
  },
  requirement: {
    type: String,
    required: true,
    trim: true
  },
  min_salary: {
    type: Number,
    required: true,
    min: 0
  },
  max_salary: {
    type: Number,
    required: true,
    min: 0
  },
  status: {
    type: String,
    enum: ['open', 'closed', 'filled'],
    default: 'open'
  },
  created_at: {
    type: Date,
    default: Date.now
  },
  updated_at: {
    type: Date,
    default: Date.now
  }
});

jobSchema.pre('save', function(next) {
  this.updated_at = Date.now();
  next();
});

jobSchema.pre('save', function(next) {
  if (this.max_salary < this.min_salary) {
    next(new Error('Maximum salary must be greater than minimum salary'));
  }
  next();
});

module.exports = mongoose.model('Job', jobSchema);