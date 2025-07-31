const mongoose = require('mongoose');


 
const employeeSchema = new mongoose.Schema({
   name: String,
   description: String,
   companyId: String
   
}); 
module.exports = mongoose.model("skills", employeeSchema);