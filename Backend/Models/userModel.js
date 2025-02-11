const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phoneNumber: { 
        type: String, 
        required: true, 
        match: /^[0-9]{10}$/ // Simple regex for phone validation, can be adjusted based on the format you need
    },
    password: { type: String, required: true },
    role: { 
        type: String, 
        enum: ['Admin', 'Mentor'], 
        required: true 
    },
    assignedCourses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }],
    profilePic: { type: String }
}, { timestamps: true });

const User = mongoose.model('User', userSchema);
module.exports = { User };
