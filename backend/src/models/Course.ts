import mongoose from 'mongoose';

const courseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  duration_weeks: { type: Number, required: true },
  level: { type: String, required: true },
  language: { type: String, required: true },
  image: { type: String },
  instructor: {
    name: { type: String, required: true },
    title: { type: String, required: true },
    bio: { type: String, required: true },
    image: { type: String, required: true }
  },
  syllabus: {
    title: { type: String, required: true },
    fileUrl: { type: String, required: true }
  },
  timetable: {
    type: Map,
    of: String
  },
  created_at: { type: Date, default: Date.now }
});

export default mongoose.model('Course', courseSchema);