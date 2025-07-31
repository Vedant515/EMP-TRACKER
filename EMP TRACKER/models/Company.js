const mongoose= require('mongoose');

const CompanySchema = new mongoose.Schema({
  companyId: { type: String, required: true, unique: true },
  createdBy: { type: String, required: true } 
});
 
module.exports = mongoose.model("Company", CompanySchema);