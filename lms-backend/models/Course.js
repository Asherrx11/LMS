const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  instructor: {
    name: String,
    bio: String,
    contact: String
  },
  syllabus: [{
    week: Number,
    topic: String,
    materialsUrl: String
  }],
  videoUrl: String
});

const Course = mongoose.model('Course', courseSchema);

module.exports = Course;
