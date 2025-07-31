// models/SkillRating.js
const mongoose = require('mongoose');

const skillRatingSchema = new mongoose.Schema({
  
employeeEmail: String, 
  skillName: String,
  rating: Number,
  date: {
    type: Date,
    default: Date.now
  },
  companyId: String
});

module.exports = mongoose.model('SkillRating', skillRatingSchema);
