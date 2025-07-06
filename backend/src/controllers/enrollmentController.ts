import { Request, Response } from 'express';
import { Enrollment } from '../models/Enrollment';

export const getEnrollments = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    const enrollments = await Enrollment.find({ userId })
      .populate('courseId', 'title description image price')
      .sort({ enrolledAt: -1 });

    res.json(enrollments);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch enrollments' });
  }
};

export const createEnrollment = async (req: Request, res: Response) => {
  try {
    const { courseId } = req.body;
    const userId = req.user?.id;

    if (!courseId || !userId) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Check if already enrolled
    const existingEnrollment = await Enrollment.findOne({ userId, courseId });
    if (existingEnrollment) {
      return res.status(400).json({ error: 'Already enrolled in this course' });
    }

    const enrollment = new Enrollment({
      userId,
      courseId,
      status: 'active',
      enrolledAt: new Date()
    });

    await enrollment.save();

    res.status(201).json(enrollment);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create enrollment' });
  }
};

export const updateEnrollment = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const userId = req.user?.id;

    if (!status || !['active', 'completed', 'cancelled'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const enrollment = await Enrollment.findOne({ _id: id, userId });
    if (!enrollment) {
      return res.status(404).json({ error: 'Enrollment not found' });
    }

    enrollment.status = status;
    if (status === 'completed') {
      enrollment.completedAt = new Date();
    }

    await enrollment.save();

    res.json(enrollment);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update enrollment' });
  }
}; 