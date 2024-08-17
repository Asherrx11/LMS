const express = require('express');
const Course = require('../models/Course');
const authenticateToken = require('../middleware/authMiddleware.js'); // Ensure this path is correct
const router = express.Router();

// GET all courses without filtering by grade
router.get('/', authenticateToken, async (req, res) => {
  try {
    const courses = await Course.find();
    res.json(courses);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET a single course by ID
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    res.json(course);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST a new course (assuming only admin or instructors can post new courses)
router.post('/', authenticateToken, async (req, res) => {
  if (req.user.role !== 'instructor' && req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Insufficient permissions' });
  }

  const course = new Course({
    title: req.body.title,
    description: req.body.description,
    instructor: req.body.instructor,
    syllabus: req.body.syllabus,
    videoUrl: req.body.videoUrl,
    grade: req.body.grade // Grade is included, but not used for filtering
  });

  try {
    const newCourse = await course.save();
    res.status(201).json(newCourse);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// UPDATE a course by ID
router.patch('/:id', authenticateToken, async (req, res) => {
  if (req.user.role !== 'instructor' && req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Insufficient permissions' });
  }

  try {
    const course = await Course.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    res.json(course);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE a course
router.delete('/:id', authenticateToken, async (req, res) => {
  if (req.user.role !== 'instructor' && req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Insufficient permissions' });
  }

  try {
    const course = await Course.findByIdAndDelete(req.params.id);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    res.json({ message: 'Course deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
