const express = require("express");
const path = require("path");
const app = express();
const port  = process.env.PORT || 5001;
const Employee=require("./models/Employee");
const Manager=require("./models/Manager");
const skills=require("./models/skills");
const Task=require("./models/Task");
const SkillRating = require("./models/SkillRating");
const Company = require("./models/Company");
require('dotenv').config();

const mongoose= require('mongoose');

mongoose.connect( process.env.URI, {
   // useNewUrlParser: true, 
  //  useUnifiedTopology: true 
})
.then(() => {  
    console.log("✅ MongoDB Connected Successfully For Company"); 
}) 
.catch((err) => {
    console.error("❌ MongoDB Connection Failed: FOR COMPANY", err.message);
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));



const generateCompanyId = () => {
    return 'CMP' + Math.floor(100000 + Math.random() * 900000);
};










//emp side 
//Get current employee email (simulate login)
app.get("/api/my-profile", verifyToken, async (req, res) => {
  try {
    const email = req.user.email; // ← Use `email`, not `useremail1`
    const employee = (await Employee.findOne({ useremail1: email })) ||(await Manager.findOne({ useremail1: email }));
    if (!employee) return res.status(404).json({ message: "Employee not found" });

    res.json({ useremail1: employee.useremail1, companyId: employee.companyId });
  } catch (err) {
    console.error("Error in /api/my-profile:", err);
    res.status(500).json({ message: "Server error" });
  }
});


//  Get all skills
app.get("/api/skills", verifyToken, async (req, res) => {
  try {
    const companyId = req.user.companyId; // JWT se milta hai
    const skills1 = await skills.find({ companyId }); //  Filter by companyId
    res.json(skills1);
  } catch (err) {
    console.error("Error fetching skills:", err);
    res.status(500).json({ message: "Server error fetching skills" });
  }
});


//  Rate a skill
app.post('/api/rate-skill', verifyToken, async (req, res) => {
  try {
    const companyId = req.user.companyId;
    const { employeeEmail, skillName, rating } = req.body;
    const newRating = new SkillRating({
      employeeEmail,
      skillName,
      rating,
      date: new Date(),
      companyId
    });
    await newRating.save();
    res.status(200).json({ message: "Skill rated successfully" });
  } catch (error) {
    console.error("Error rating skill:", error);
    res.status(500).json({ error: "Failed to rate skill" });
  }
});

//  Get skill rating history by email
app.get("/api/employee-skill-history", verifyToken, async (req, res) => {
  const email = req.query.email;
  console.log("Fetching skill history for:", email); 

  try {
    const skills = await SkillRating.find({ employeeEmail: email }).sort({ date: -1 });
    res.json(skills);
  } catch (error) {
    console.error("Error fetching skill history:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});


//  Get tasks assigned to this employee
app.get("/api/my-tasks", verifyToken, async (req, res) => {
  const email = req.query.email;
  console.log("Fetching tasks for:", email);

  try {
    const tasks = await Task.find({ assignedTo: email });
    console.log("Found tasks:", tasks);
    res.json(tasks);
  } catch (error) {
    console.error("Error fetching tasks:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

//  Update task status
app.put("/api/update-task-status/:id", async (req, res) => {
  const { status } = req.body;
  const updated = await Task.findByIdAndUpdate(req.params.id, { status }, { new: true });
  if (!updated) return res.status(404).json({ error: "Task not found" });
  res.json({ message: "Status updated", task: updated });
});


//TASK section
//delete task
app.delete("/api/tasks/:id",verifyToken, async (req, res) => {
  await Task.findByIdAndDelete(req.params.id);
  res.json({ success: true });
});
//edit task
app.put("/edit-task/:id",verifyToken, async (req, res) => {
  console.log("PUT request received");
console.log("ID:", req.params.id);
console.log("Body:", req.body);

  const { taskName, assignedTo, startDate, endDate  } = req.body;
const companyId = req.user.companyId;
  try {
    const updated = await Task.findOneAndUpdate(
     {_id: req.params.id,companyId},
      { taskName, assignedTo, startDate, endDate },
      { new: true }
    );

    res.status(200).json(updated);
  } catch (err) {
    res.status(500).json({ message: "Update failed", error: err.message });
  }
});



//  Assign Task

app.get("/api/employees", verifyToken, async (req, res) => {
  try {
  

    // Find current employee by email
    


    //  Fetch other employees from same company
    const employees = await Employee.find({
      role: "employee",
      status: "approved",
      companyId: req.user.companyId
    });

    res.json(employees);
  } catch (error) {
    console.error("Error fetching employees:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


//  Assign a new task
app.post("/api/tasks", verifyToken,async (req, res) => {
  try {
    const{ taskName, assignedTo, startDate, endDate, status , companyId } = req.body;
     const newTask = new Task({
      taskName,
      assignedTo,  // Make sure this gets value from frontend
      startDate,
      endDate,
      status,
      companyId
    });
     await newTask.save();
    res.status(201).json({ message: "Task assigned successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to assign task" });
  }
});

// Get all tasks
app.get("/api/tasks",verifyToken,async (req, res) => {
    try {
    const companyId = req.user.companyId;
    const tasks = await Task.find({ companyId });
    res.json(tasks);
  } catch (error) {
    console.error("Error fetching tasks:", error);
    res.status(500).json({ message: "Error fetching tasks" });
  }
});

//delete skills 
app.delete("/skill-delete/:id" ,verifyToken, async (req, res) => {
  const deleted = await skills.findOneAndDelete({
      _id: req.params.id,
      companyId: req.user.companyId,
    });
     if (!deleted)
      return res.status(404).json({ message: "Skill not found or unauthorized" });
    
    res.status(200).json({ message: "Skill deleted" });

});

// edit skils
app.put("/get-skills/:id",verifyToken, async (req, res) => {
  console.log("PUT request received");
console.log("ID:", req.params.id);
console.log("Body:", req.body);
 
  try {
    const updated = await skills.findByIdAndUpdate(
      req.params.id,
      {
        name: req.body.name,
        description: req.body.description,
      },
      { new: true }
    );

    if (!updated)
      return res.status(404).json({ message: "Skill not found or unauthorized" });
    res.status(200).json(updated);
  } catch (error) {
    console.error("Update error:", error);
    res.status(500).json({ message: "Failed to update skills" });
  }
});



// skills
app.get("/get-skills",verifyToken, async (req, res) => {
  try {
    
    const skill2= await skills.find({companyId: req.user.companyId});
    res.json(skill2);
  } catch (err) {
    res.status(500).json({ error: "DB Error" });
  } 
});
app.post("/get-skills",verifyToken, async (req, res) => {
   let {name, description}=req.body;
   
   let skill=await skills.findOne({name});
    if(skill){ return res.status(508).send("Skill is already present");}
 let skill1= await skills.create({
      
name, description ,companyId: req.user.companyId
    });
    await skill1.save();
    if(skill1){console.log("data post done")};
  res.status(200).json({ message: "Skill added successfully" });

});








app.get("/get-employees", async (req, res) => {
  try {
    const all = await Employee.find({ companyId: req.user.companyId,
  role: "employee"});
    res.json(all);
  } catch (err) {
    res.status(500).json({ error: "DB Error" });
  } 
});
// Delete employee
// Delete employee
app.delete("/delete/:id", async (req, res) => {
  await Employee.findByIdAndDelete(req.params.id);
  res.json({ success: true });
});

// Update employee
app.put("/get-employees/:id", async (req, res) => {
  console.log("PUT request received");
console.log("ID:", req.params.id);
console.log("Body:", req.body);

  try {
    const updated = await Employee.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    if (!updated) {
      return res.status(404).json({ message: "Employee not found" });
    }

    res.status(200).json(updated);
  } catch (error) {
    console.error("Update error:", error);
    res.status(500).json({ message: "Failed to update employee" });
  }
});

app.get("/employees", async (req, res) => {
   
    res.sendFile(path.join(__dirname, "public", "emp-manage.html"));
  
});




app.use(express.static(path.join(__dirname, "public")));


app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "login.html"));
});
 app.get("/api/login", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "home.html"));
}); 


app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});





const usermodel = require("./models/user");
const cookieParser = require("cookie-parser");
const bcrypt=require('bcrypt');
const jwt=require("jsonwebtoken");





app.use(cookieParser());


app.post('/employees',async(req , res)=>{
  try{
    let {useremail1,password,repassword ,name,role,status, companyId}=req.body;
    console.log(req.body); 
    if (!companyId) return res.status(400).json({ error: "Company ID is required" });


 if (role === "admin") {
      const companyExists = await Company.findOne({ companyId });

      if (companyExists) {
        return res.status(400).json({ message: "Company ID already exists" });
      }


      await Company.create({ companyId, createdBy: useremail1 });
    }


    if (role === "employee") {
      const company = await Company.findOne({ companyId });
      if (!company) {
        return res.status(400).json({ message: "Invalid Company ID" });
      }
    }



  

    let user=await Employee.findOne({useremail1});
    if(user){ return res.status(500).send("User Already Register");}


    if(password!=repassword){
        res.status(600).send("Pass is not match jhatu");
    }

    bcrypt.genSalt(10,(err,salt)=>{
bcrypt.hash(password,salt,async(err,hash)=>{
  if (role === "employee"){
    let user = await Employee.create({
      
useremail1,
name,
 role: "employee",
 status: status || "pending" ,
   companyId,
password: hash
    });
  }else if (role === "admin"){
 let admins = await Manager.create({
      
useremail1,
name,
 role: "admin", 
 status: "approved" ,
   companyId,
password: hash
    });
  }

  const token = jwt.sign({ useremail1, companyId }, "secretkey");
  res.status(200).json({ message: "Registered successfully", token, name, useremail1, role });

});
    });
  }catch(err){
    console.error("Signup Error:", err);
    res.status(500).json({ error: "Something went wrong" });
  }
 
});

app.post("/login", async (req, res) => {
  const { useremail1, password ,companyId} = req.body;

  try {
    const user = (await Employee.findOne({ useremail1 }) ) || (await Manager.findOne({ useremail1 }));

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ userId: user._id, email: user.useremail1 ,  companyId: user.companyId}, "secretkey", {
      expiresIn: "1d"
    });

    res.status(200).json({ token, user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});
function authMiddleware(req, res, next) {
  const authHeader = req.headers['authorization'];
  if (!authHeader) return res.status(401).json({ error: "No token provided" });

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, "secretkey"); 
    req.useremail1 = decoded.useremail1;
    req.companyId = decoded.companyId;
    next();
  } catch (err) {
    return res.status(403).json({ error: "Invalid token" });
  }
}
// edit sectio
function verifyToken(req, res, next) {
  const authHeader = req.headers["authorization"];

  if (!authHeader) return res.status(403).json({ error: "No token provided" });

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, "secretkey");
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ error: "Invalid token" });
  }
}






// Example route
app.get('/api/only-employees',verifyToken, async (req, res) => {
  try {
   
console.log("Filtered companyId:", req.user.companyId);

    const employees = await Employee.find({
      role: 'employee',
      
      companyId: req.user.companyId  // ✅ company wise filter
    }).select('name useremail1 role status'); 
    res.json(employees);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch employees' });
  }
});



// server.js or wherever your routes are

// server.js ya jo bhi tera main file hai
app.get("/api/all-skill-ratings",verifyToken, async (req, res) => {
  try {
    const ratings = await SkillRating.find({companyId:req.user.companyId}); // if needed, filter by companyId here

    const allData = [];

    for (const rating of ratings) {
      const emp = await Employee.findOne({ useremail1: rating.employeeEmail });

      if (emp) {
        allData.push({
          employeeName: emp.name,
          employeeEmail: emp.useremail1,
          employeeRole: emp.role,
          skillName: rating.skillName,
          rating: rating.rating,
          date: rating.date,
        });
      }
    }

    res.json(allData);
  } catch (err) {
    console.error("Error fetching skill ratings with employee info:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

