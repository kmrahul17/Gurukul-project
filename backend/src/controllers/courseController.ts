import { Request, Response } from 'express';
import Course from '../models/Course';
import { logger } from '../utils/logger';

export const courseController = {
  async createCourse(req: Request, res: Response) {
    try {
      // Removed debug log: console.log('Received course data:', req.body);
      
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

      const courseData = {
        ...req.body,
        price: Number(req.body.price),
        duration_weeks: Number(req.body.duration_weeks)
      };

      const course = new Course(courseData);
      const savedCourse = await course.save();
      res.status(201).json(savedCourse);
    } catch (error) {
      // Use logger instead of console.error
      logger.error('Create course error:', error);
      res.status(500).json({ 
        message: 'Error creating course',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }
};