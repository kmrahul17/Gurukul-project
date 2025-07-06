import mongoose, { Document, Schema } from 'mongoose';

export interface IReview extends Document {
  userId: mongoose.Types.ObjectId;
  courseId: string;
  rating: number;
  comment: string;
  createdAt: Date;
  updatedAt: Date;
  user?: {
    name: string;
    email: string;
  };
}

const reviewSchema = new Schema<IReview>({
  userId: { 
    type: Schema.Types.ObjectId, 
    ref: 'User',
    required: true 
  },
  courseId: { type: String, required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Add compound index to prevent duplicate reviews
reviewSchema.index({ userId: 1, courseId: 1 }, { unique: true });

export default mongoose.model<IReview>('Review', reviewSchema); 