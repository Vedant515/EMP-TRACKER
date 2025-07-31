const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  taskName: String,
  assignedTo: String, // employee id or email
  startDate: Date,
  endDate: Date,
  status: {
    type: String,
    default: 'Pending', // or 'Completed'
  },
  companyId: String
});

module.exports = mongoose.model('Task', taskSchema);
