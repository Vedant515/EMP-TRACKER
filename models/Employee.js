const mongoose = require('mongoose');



const employeeSchema = new mongoose.Schema({
    name: String,
    useremail1: String,
     role: {
    type: String,
    enum: ["employee", "admin"],
    default: "employee"
  },
    status: {
    type: String,
    default: "pending"
  },
   password: String,
    repassword: String,
    companyId: String
});
module.exports = mongoose.model("Employee", employeeSchema);