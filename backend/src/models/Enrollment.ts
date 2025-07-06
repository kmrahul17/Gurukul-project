import mongoose from 'mongoose';

const enrollmentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  email: {
    type: String,
    required: true
  },
  courseName: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  course: {
    title: String,
    description: String,
    image: String,
    duration_weeks: Number,
    level: String,
    price: Number
  },
  status: {
    type: String,
    enum: ['active', 'completed', 'cancelled'],
    default: 'active'
  },
  enrolledAt: {
    type: Date,
    default: Date.now
  },
  completedAt: {
    type: Date
  },
  progress: {
    type: Number,
    default: 0
  }
});

// Add indexes for faster queries
enrollmentSchema.index({ userId: 1 });
enrollmentSchema.index({ courseId: 1 });
enrollmentSchema.index({ status: 1 });

export const Enrollment = mongoose.model('Enrollment', enrollmentSchema);