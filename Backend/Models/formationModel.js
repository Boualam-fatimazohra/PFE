const mongoose = require('mongoose');

const CourseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  type: { type: String, required: true },
  mentors: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  tags: [{ type: String }],
});

const Course = mongoose.model('Course', CourseSchema);

module.exports = Course;