// backend/routes/idGenerationRoutes.js

const express = require('express');
const router = express.Router();
const IDGeneration = require('../models/IDGeneration');

async function generateUserID(userType) {
    const prefix = userType === 'student' ? 'ST' : 'CT';
    const lastUser = await IDGeneration.findOne({ userType }).sort({ id: -1 });
    console.log("Last User:", lastUser); 
    const lastID = lastUser ? parseInt(lastUser.id.split('-')[1], 10) : 10000;
    const newID = `${prefix}-${lastID + 1}`;
    console.log("Generated ID:", newID); 
    return newID;
} 

router.post('/', async (req, res) => {
    try {
      const { userType, name } = req.body;
      console.log("Request Received:", { userType, name }); 
  
      if (!userType || !name) {
        return res.status(400).json({ error: 'UserType and Name are required.' });
      }
  
      const newId = await generateUserID(userType);
      console.log("Generated ID:", newId); 
  
      const newUser = new IDGeneration({ userType, name, id: newId });
      await newUser.save();
      console.log("New User Saved:", newUser); 
  
      res.status(201).json({ id: newId });
    } catch (error) {
      console.error("Error creating ID:", error.message); 
      res.status(500).json({ error: error.message });
    }
});
  
router.get('/get-ids', async (req, res) => {
    try {
      const users = await IDGeneration.find();
  
      const clients = users.filter((user) => user.userType === 'client');
      const students = users.filter((user) => user.userType === 'student');
  
      res.json({ clients, students });
    } catch (error) {
      console.error('Error fetching users:', error.message);
      res.status(500).json({ error: error.message });
    }
});
  
router.put('/status/:id', async (req, res) => {
  try {
    const user = await IDGeneration.findOne({ id: req.params.id });
    if (!user) return res.status(404).json({ error: "User not found" });

    user.status = !user.status;
    await user.save();
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const result = await IDGeneration.deleteOne({ id: req.params.id });
    if (result.deletedCount === 0) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json({ message: "Deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/verify-id/:id', async (req, res) => {
  try {
      const { id } = req.params;

      const student = await IDGeneration.findOne({ id, userType: 'student' });

      if (student) {
        return res.status(200).json({ isValid: true, message: "ID is valid." });
      } else {
        return res.status(404).json({ isValid: false, message: "ID is invalid." });
      }
  } catch (error) {
      console.error("Error verifying ID:", error.message);
      res.status(500).json({ error: "Internal Server Error." });
  }
});

module.exports = router;

