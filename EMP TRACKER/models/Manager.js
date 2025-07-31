const mongoose = require('mongoose');




const managerSchema = new mongoose.Schema({
    name: String,
    useremail1: String,
    role: String,
    status: {
    type: String,
    default: "approved"
  },
   password: String,
    repassword: String,
    companyId: String
});
module.exports = mongoose.model("Manager",  managerSchema );