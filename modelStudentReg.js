// backend/models/modelstudentReg.js
const mongoose = require('mongoose');

const StudentRegistrationSchema = new mongoose.Schema({
    fullname: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    password: { type: String, required: true },
    studentId: { type: String, required: true, unique: true }
});

module.exports = mongoose.model('Student_Reg', StudentRegistrationSchema);
