// backend/routes/routestudentReg.js
const express = require('express');
const router = express.Router();
const StudentReg = require('../models/modelStudentReg');
const IDGeneration = require('../models/IDGeneration'); 
const bcrypt = require('bcrypt');

router.post('/register', async (req, res) => {
    try {
        const { fullname, email, phone, password, studentId } = req.body;

        const existingStudent = await StudentReg.findOne({ studentId });
        if (existingStudent) {
            return res.status(409).json({ error: "Student ID already registered" });
        }

        const validStudent = await IDGeneration.findOne({ id: studentId, userType: 'student' });
        if (!validStudent) {
            return res.status(400).json({ error: "Invalid Student ID" });
        }
        
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newAccount = new StudentReg({ fullname, email, phone, password: hashedPassword, studentId });
        await newAccount.save();

        res.status(201).json({ message: "Account created successfully" });
    } catch (error) {
        console.error("Error creating account:", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

router.post('/login', async (req, res) => {
    try {
        const { studentId, password } = req.body;
        const student = await StudentReg.findOne({ studentId });
        if (!student) {
            return res.status(400).json({ error: "Invalid Student ID (or) Password." });
        }
        const isMatch = await bcrypt.compare(password, student.password);
        if (!isMatch) {
            return res.status(400).json({ error: "Invalid Student ID ((or)) Password." });
        }
        res.status(200).json({ message: "Login successful" });
    } catch (error) {
        console.error("Login error:", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

router.get('/check-registered/:studentId', async (req, res) => {
    try {
        const { studentId } = req.params;
        const student = await StudentReg.findOne({ studentId });

        if (student) {
            return res.json({ isRegistered: true });
        } else {
            return res.json({ isRegistered: false });
        }
    } catch (error) {
        console.error("Error checking registration status:", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
});


module.exports = router;
