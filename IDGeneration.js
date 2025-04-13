// backend/models/IDGeneration.js
const mongoose = require('mongoose');

const IDGenerationSchema = new mongoose.Schema({
  userType: { type: String, required: true }, 
  name: { type: String, required: true },
  id: { type: String, required: true, unique: true }, 
  status: { type: Boolean, default: true }, 
});

module.exports = mongoose.model('uesrs_idsgenarates', IDGenerationSchema);

  