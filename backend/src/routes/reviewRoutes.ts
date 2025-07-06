import express from 'express';
import { authenticateToken } from '../middleware/auth';
import Review from '../models/Review';
import mongoose from 'mongoose';

const router = express.Router();

// Get reviews for a course - no authentication required
router.get('/course/:courseId', async (req, res) => {
  try {
    const reviews = await Review.find({ courseId: req.params.courseId })
      .populate({
        path: 'userId',
        select: 'name email',
        model: 'User'
      })
      .sort({ createdAt: -1 });
    res.json(reviews);
  } catch (error) {
    console.error('Error fetching reviews:', error);
    res.status(500).json({ message: 'Error fetching reviews' });
  }
});

// Apply authentication middleware to protected routes
router.use(authenticateToken);

// Create a review
router.post('/', async (req, res) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    const { courseId, rating, comment } = req.body;

    // Validate required fields
    if (!courseId || !rating || !comment) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Validate rating range
    if (rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Rating must be between 1 and 5' });
    }

    // Convert userId to ObjectId
    const userId = new mongoose.Types.ObjectId(req.user.id);

    // Check if user has already reviewed this course
    const existingReview = await Review.findOne({ 
      userId,
      courseId 
    });
    
    if (existingReview) {
      return res.status(400).json({ message: 'You have already reviewed this course' });
    }

    const newReview = new Review({
      userId,
      courseId,
      rating,
      comment
    });

    await newReview.save();
    
    const populatedReview = await Review.findById(newReview._id)
      .populate({
        path: 'userId',
        select: 'name email',
        model: 'User'
      });
    
    res.status(201).json(populatedReview);
  } catch (error) {
    console.error('Error creating review:', error);
    if (error instanceof mongoose.Error.ValidationError) {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: 'Error creating review' });
  }
});

// Update a review
router.put('/:reviewId', async (req, res) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    const { rating, comment } = req.body;

    // Validate required fields
    if (!rating || !comment) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Validate rating range
    if (rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Rating must be between 1 and 5' });
    }

    const userId = new mongoose.Types.ObjectId(req.user.id);
    const review = await Review.findById(req.params.reviewId);

    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    if (!review.userId.equals(userId)) {
      return res.status(403).json({ message: 'Not authorized to update this review' });
    }

    const updatedReview = await Review.findByIdAndUpdate(
      req.params.reviewId,
      { 
        rating: req.body.rating, 
        comment: req.body.comment,
        updatedAt: new Date()
      },
      { new: true }
    ).populate({
      path: 'userId',
      select: 'name email',
      model: 'User'
    });

    res.json(updatedReview);
  } catch (error) {
    console.error('Error updating review:', error);
    if (error instanceof mongoose.Error.ValidationError) {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: 'Error updating review' });
  }
});

// Delete a review
router.delete('/:reviewId', async (req, res) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    const userId = new mongoose.Types.ObjectId(req.user.id);
    const review = await Review.findById(req.params.reviewId);

    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    if (!review.userId.equals(userId)) {
      return res.status(403).json({ message: 'Not authorized to delete this review' });
    }

    await Review.findByIdAndDelete(req.params.reviewId);
    res.json({ message: 'Review deleted successfully' });
  } catch (error) {
    console.error('Error deleting review:', error);
    res.status(500).json({ message: 'Error deleting review' });
  }
});

export default router;