const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  userType: { type: String, enum: ['worker', 'contractor'], required: true },
  skills: [String],
  rating: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

const jobSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  contractor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  location: String,
  pay: String,
  duration: String,
  startDate: Date,
  isFeatured: { type: Boolean, default: false },
  featuredUntil: Date,
  applications: [{
    worker: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    status: { 
      type: String, 
      enum: ['pending', 'reviewed', 'interviewing', 'hired', 'rejected'], 
      default: 'pending' 
    },
    appliedAt: { type: Date, default: Date.now },
    notes: String,
    attachments: [{
      path: String,
      version: { type: Number, default: 1 },
      uploadedAt: { type: Date, default: Date.now },
      isCurrent: { type: Boolean, default: true }
    }]
  }],
  createdAt: { type: Date, default: Date.now }
});

const messageSchema = new mongoose.Schema({
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  receiver: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  text: { type: String, required: true },
  read: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);
const Job = mongoose.model('Job', jobSchema);
const Message = mongoose.model('Message', messageSchema);

module.exports = { User, Job, Message };