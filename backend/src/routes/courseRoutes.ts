import express from 'express';
import mongoose from 'mongoose';
import Course from '../models/Course';
import { logger } from '../utils/logger';

const router = express.Router();

// Get all courses with IDs
router.get('/list', async (req, res) => {
  try {
    const courses = await Course.find().select('_id title price').sort({ created_at: -1 });
    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching courses', error });
  }
});

// Get all courses
router.get('/', async (req, res) => {
  try {
    const courses = await Course.find().sort({ created_at: -1 });
    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching courses', error });
  }
});

// Get single course
router.get('/:id', async (req, res) => {
    try {
      const { id } = req.params;
  
      // Validate MongoDB ObjectId
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ 
          message: 'Invalid course ID format',
          courseId: id 
        });
      }
  
      const course = await Course.findById(id);
      
      if (!course) {
        return res.status(404).json({ 
          message: 'Course not found',
          courseId: id 
        });
      }
  
      res.json(course);
    } catch (error) {
      logger.error('Error fetching course:', error);
      res.status(500).json({ 
        message: 'Error fetching course', 
        error: error instanceof Error ? error.message : 'Unknown error',
        courseId: req.params.id
      });
    }
  });
  
// Create course
router.post('/', async (req, res) => {
  try {
    
    // Validate required fields
    const requiredFields = ['title', 'description', 'price', 'duration_weeks', 'level', 'language', 'instructor'];
    for (const field of requiredFields) {
      if (!req.body[field]) {
        return res.status(400).json({ message: `Missing required field: ${field}` });
      }
    }

    // Validate instructor fields
    const requiredInstructorFields = ['name', 'title', 'bio', 'image'];
    for (const field of requiredInstructorFields) {
      if (!req.body.instructor[field]) {
        return res.status(400).json({ message: `Missing required instructor field: ${field}` });
      }
    }

    const course = new Course({
      ...req.body,
      price: Number(req.body.price),
      duration_weeks: Number(req.body.duration_weeks)
    });
    
    const savedCourse = await course.save();
    res.status(201).json(savedCourse);
  } catch (error) {
    logger.error('Create course error:', error);
    res.status(500).json({ 
      message: 'Error creating course',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Update course
router.put('/:id', async (req, res) => {
  try {
    const course = await Course.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    res.json(course);
  } catch (error) {
    res.status(500).json({ message: 'Error updating course', error });
  }
});

// Delete course
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Validate MongoDB ID format
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: 'Invalid course ID format' });
    }

    const deletedCourse = await Course.findByIdAndDelete(id);
    
    if (!deletedCourse) {
      return res.status(404).json({ message: 'Course not found' });
    }

    return res.status(200).json({ 
      success: true,
      message: 'Course deleted successfully',
      data: deletedCourse 
    });
  } catch (error) {
    logger.error('Delete error:', error);
    return res.status(500).json({ 
      message: 'Error deleting course',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

export default router;