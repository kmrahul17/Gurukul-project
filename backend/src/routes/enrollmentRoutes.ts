import express from 'express';
import { authenticateToken } from '../middleware/auth';
import { getEnrollments, createEnrollment, updateEnrollment } from '../controllers/enrollmentController';
import { Enrollment } from '../models/Enrollment';
import Course from '../models/Course';
import User from '../models/User';

const router = express.Router();

// Get all enrollments - no authentication required
router.get('/', async (req, res) => {
  try {
    const enrollments = await Enrollment.find()
      .populate('courseId', 'title description image price duration_weeks level')
      .populate('userId', 'email')
      .sort({ enrolledAt: -1 });

    // Transform the data to include all necessary fields
    const transformedEnrollments = enrollments.map(enrollment => {
      const course = enrollment.courseId as any;
      const user = enrollment.userId as any;
      return {
        _id: enrollment._id,
        userId: enrollment.userId,
        email: user?.email || enrollment.email,
        courseId: enrollment.courseId,
        course: course ? {
          title: course.title,
          description: course.description,
          image: course.image,
          price: course.price,
          duration_weeks: course.duration_weeks,
          level: course.level
        } : null,
        courseName: course?.title || enrollment.courseName,
        price: course?.price || enrollment.price,
        enrolledAt: enrollment.enrolledAt,
        status: enrollment.status
      };
    });

    res.json(transformedEnrollments);
  } catch (error) {
    res.status(500).json({ 
      message: 'Error fetching enrollments', 
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Apply authentication middleware to protected routes
router.use(authenticateToken);

// Get current user's enrollments
router.get('/my-courses', async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    const enrollments = await Enrollment.find({ userId })
      .populate('courseId', 'title description image price duration_weeks level')
      .sort({ enrolledAt: -1 });

    // Transform the data to include all necessary fields
    const transformedEnrollments = enrollments.map(enrollment => {
      const course = enrollment.courseId as any;
      return {
        _id: enrollment._id,
        userId: enrollment.userId,
        courseId: enrollment.courseId,
        course: course ? {
          title: course.title,
          description: course.description,
          image: course.image,
          price: course.price,
          duration_weeks: course.duration_weeks,
          level: course.level
        } : null,
        courseName: course?.title || enrollment.courseName,
        price: course?.price || enrollment.price,
        enrolledAt: enrollment.enrolledAt,
        status: enrollment.status
      };
    });

    res.json(transformedEnrollments);
  } catch (error) {
    res.status(500).json({ 
      message: 'Error fetching user enrollments', 
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Get user's enrollments
router.get('/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const enrollments = await Enrollment.find({ userId })
      .populate('courseId', 'title description image price duration_weeks level')
      .populate('userId', 'email')
      .sort({ enrolledAt: -1 });

    // Transform the data to include all necessary fields
    const transformedEnrollments = enrollments.map(enrollment => {
      const course = enrollment.courseId as any;
      const user = enrollment.userId as any;
      return {
        _id: enrollment._id,
        userId: enrollment.userId,
        email: user?.email || enrollment.email,
        courseId: enrollment.courseId,
        course: course ? {
          title: course.title,
          description: course.description,
          image: course.image,
          price: course.price,
          duration_weeks: course.duration_weeks,
          level: course.level
        } : null,
        courseName: course?.title || enrollment.courseName,
        price: course?.price || enrollment.price,
        enrolledAt: enrollment.enrolledAt,
        status: enrollment.status
      };
    });

    res.json(transformedEnrollments);
  } catch (error) {
    console.error('Error fetching enrollments:', error);
    res.status(500).json({ 
      message: 'Failed to fetch enrollments',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Create enrollment
router.post('/', async (req, res) => {
  try {
    const { userId, courseId, courseName } = req.body;

    // Validate required fields
    if (!userId || !courseId || !courseName) {
      return res.status(400).json({ 
        message: 'Missing required fields',
        required: ['userId', 'courseId', 'courseName']
      });
    }

    // Get user data
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check for existing enrollment
    const existingEnrollment = await Enrollment.findOne({
      userId: userId.toString(),
      courseId
    });

    if (existingEnrollment) {
      return res.status(200).json({
        message: 'Already enrolled in this course',
        enrollment: existingEnrollment
      });
    }

    // Get course data
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Create new enrollment
    const enrollment = new Enrollment({
      userId: userId.toString(),
      courseId,
      email: user.email,
      courseName,
      course: {
        image: course.image,
        description: course.description,
        duration_weeks: course.duration_weeks,
        level: course.level,
        title: course.title,
        price: course.price
      },
      status: 'active'
    });
    
    await enrollment.save();

    res.status(201).json({
      message: 'Successfully enrolled',
      enrollment
    });

  } catch (error) {
    console.error('Enrollment error:', error);
    res.status(500).json({ 
      message: 'Failed to create enrollment',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Update enrollment status
router.patch('/:id', updateEnrollment);

export default router;