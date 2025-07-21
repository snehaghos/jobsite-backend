const mongoose = require('mongoose');

const providerSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  contact_no: {
    type: String,
    trim: true
  },
  industry: {
    type: String,
    trim: true
  },
  address: {
    type: String,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  logo: {
    type: String,
    trim: true
  },
  country: {
    type: String,
    trim: true
  },
  establishment: {
    type: String,
    trim: true
  },
  website_link: {
    type: String,
    trim: true
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

providerSchema.pre('save', function(next) {
  this.updated_at = Date.now();
  next();
});

module.exports = mongoose.model('JobProvider', providerSchema);