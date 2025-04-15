import mongoose from 'mongoose';

const resumeSchema = new mongoose.Schema({
  userId: { type: String, required: false },  // Optional, for user-specific history
  resumeText: { type: String, required: true },
  analysis: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const Resume = mongoose.model('Resume', resumeSchema);

export default Resume;
