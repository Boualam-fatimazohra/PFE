const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    firstName: { type: String },
    lastName: { type: String },
    email: { type: String, required: true, unique: true },
    phoneNumber: { type: String },
    password: { type: String, required: true },
    role: { type: String, enum: ['Admin', 'Mentor'], required: true },
    assignedCourses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }],
    profilePic: { type: String }
});

const User = mongoose.model('User', userSchema);
module.exports = {User};