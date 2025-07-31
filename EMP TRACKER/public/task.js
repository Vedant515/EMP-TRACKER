let currentCompanyId = null;
let currentUserEmail = null;

document.addEventListener('DOMContentLoaded', async () => {
  await loadMyProfile();
   if (!currentCompanyId) {
    console.error("Company ID not loaded. Stopping.");
    return;
  }
    await fetchCompletedEmployees();
   await fetchAssignedTasks();

    document.getElementById('assign-task-button').addEventListener('click', assignTask);
});

async function loadMyProfile() {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("JWT token missing!");
      return;
    }

    const res = await fetch("/api/my-profile", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    if (!res.ok) {
      const error = await res.text();
      console.error("Profile fetch failed:", error);
      return;
    }

    const data = await res.json();

    currentUser = data.useremail1;
    currentCompanyId = data.companyId;

    console.log("User:", currentUser);
    console.log("Company ID:", currentCompanyId);
  } catch (err) {
    console.error("Failed to load profile:", err);
  }
}

async function fetchCompletedEmployees() {
    try {
        const token = localStorage.getItem("token");
        console.log("JWT Token:", localStorage.getItem('token'));

         const res = await fetch("/api/employees", {
    method: "GET",
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

        const data = await res.json();
         console.log("Fetched employees:", data);
        const select = document.getElementById('select-employee');

        const assignSelect = document.getElementById('select-employee');
const editSelect = document.getElementById('edit-select-employee');

assignSelect.innerHTML = `<option value="">-- Select Employee --</option>`;
editSelect.innerHTML = `<option value="">-- Select Employee --</option>`;

data.forEach(emp => {
    const option1 = document.createElement('option');
    option1.value = emp.useremail1;
    option1.textContent = emp.name;
    assignSelect.appendChild(option1);

    const option2 = document.createElement('option');
    option2.value = emp.useremail1;
    option2.textContent = emp.name;
    editSelect.appendChild(option2);
});

    } catch (err) {
        console.error('Error loading employees:', err);
    }
}

async function assignTask() {
    const taskName = document.getElementById('task-name').value.trim();
    const assignedTo = document.getElementById('select-employee').value;
    const startDate = document.getElementById('start-date').value;
    const endDate = document.getElementById('end-date').value;
console.log("Selected AssignedTo:", document.getElementById("select-employee").value);
console.log("Assigned to:", assignedTo); 

const el = document.getElementById('select-employee');
if (!el) {
  console.error("Select element not found!");
} else {
  console.log("Selected value:", el.value);
  console.log("Options:", [...el.options].map(o => ({ value: o.value, text: o.text })));
}

    if (!taskName || !assignedTo || !startDate || !endDate) {
        alert('Please fill all fields');
        return;
    }

    const newTask = {
        taskName,
        assignedTo, 
        startDate,
        endDate,
        status: 'pending',
        companyId: currentCompanyId
    };

    try {
       const token = localStorage.getItem('token');
        const res = await fetch('/api/tasks', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                 'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(newTask)
        });

        if (res.ok) {
            alert('Task assigned successfully!');
            fetchAssignedTasks(); 
        } else {
            alert('Failed to assign task');
        }
    } catch (err) {
        console.error('Assign error:', err);
    }
}

function formatDateOnly(dateStr) {
    const date = new Date(dateStr);
    return date.toISOString().split('T')[0];
}

async function fetchAssignedTasks() {
    try {
      const token = localStorage.getItem('token');
       const res = await fetch(`/api/tasks?companyId=${currentCompanyId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
      if (!res.ok) {
      const errorText = await res.text();
      throw new Error("Failed to fetch tasks: " + errorText);
    }

        const tasks = await res.json();
        const tableBody = document.getElementById('assigned-tasks-table-body');

        tableBody.innerHTML = ''; 

        tasks.forEach(task => {
            const row = document.createElement('tr');
            row.className = 'table-row';

            row.innerHTML = `
                <td class="table-data">${task.taskName}</td>
                <td class="table-data">${task.assignedTo}</td>
                <td class="table-data">${formatDateOnly(task.startDate)}</td>
                <td class="table-data">${formatDateOnly(task.endDate)}</td>
                <td class="table-data">${task.status}</td>
                <td class="table-data action-cell">
                                 <button class="edit-button" class="table-data"
                                 data-id="${task._id}" 
                                 data-taskname="${task.taskName}"
                                 data-assignto="${task.assignedTo}"
                                 data-stdate="${formatDateOnly(task.startDate)}"
                                 data-enddate="${formatDateOnly(task.endDate)}"

                                 >
                                   Edit
                                  </button>
                                          <button 
                                          class="delete-button" class="table-data"
                                          data-id="${task._id}" 
                                          data-name="${task.taskName}">Delete</button>                
                            </td>
                                    `;

            tableBody.appendChild(row);
        });

    } catch (err) {
        console.error('Error loading tasks:', err);
    }
}

document.querySelector("tbody").addEventListener("click", function (e) {
  if (e.target.classList.contains("edit-button")) {
    const id = e.target.getAttribute("data-id");
    const name = e.target.getAttribute("data-taskname");
    const assignto = e.target.getAttribute("data-assignto");
    const stdate= e.target.getAttribute("data-stdate");
    const enddate = e.target.getAttribute("data-enddate");

    openEditPopup(id, name, assignto , stdate, enddate);
  }
});
 let editEmployeeId=null;
function openEditPopup(id , name , assignto, stdate , enddate) {


document.getElementById("editId").value = id; 
 editEmployeeId=id;
 document.querySelector(".modal-overlay").classList.add("show");
document.getElementById('edit-task-name').value=name;
document.getElementById('edit-select-employee').value=assignto;
document.getElementById('edit-start-date').value=stdate;
document.getElementById('edit-end-date').value=enddate;

}

document.getElementById("taskform").addEventListener("submit", async function (e) {
  e.preventDefault();

  if (!editEmployeeId) {
    alert("An error occurred. Please try again.");
    return;
  }

  const taskName = document.getElementById("edit-task-name").value.trim();
  const assignedTo = document.getElementById("edit-select-employee").value.trim();
  const startDate = document.getElementById("edit-start-date").value.trim();
  const endDate = document.getElementById("edit-end-date").value.trim();

  if (!taskName || !assignedTo || !startDate || !endDate) {
    alert("All fields are required.");
    return;
  }

  try {
     const token = localStorage.getItem('token');
    const res = await fetch(`/edit-task/${editEmployeeId}`, {
      method: "PUT",
      headers: { 
        'Content-Type': 'application/json',
  'Authorization': `Bearer ${token}`
 },
      body: JSON.stringify({ taskName, assignedTo, startDate, endDate }),
    });

    const result = await res.json();
    console.log("RESPONSE:", result);

    if (res.ok) {
      alert("Task updated successfully!");
      await fetchAssignedTasks();
      document.getElementById("taskform").reset();
      document.querySelector(".modal-overlay").classList.remove("show");
      editEmployeeId = null;
      document.getElementById("editId").value = "";
    } else {
      alert("Failed to save task.");
    }
  } catch (err) {
    console.error("Error:", err);
    alert("An error occurred while updating task.");
  }
});

document.querySelector("tbody").addEventListener("click", function (e) {
   if (e.target.classList.contains("delete-button")) {
    const id = e.target.getAttribute("data-id");
    const name = e.target.getAttribute("data-name");

    deleteskill(id, name);
  }

});

async function deleteskill(id , name) {
    if(confirm(`Are you sure to delete ${name} task`)){
       const token = localStorage.getItem("token");
  await fetch(`/api/tasks/${id}`, { method: "DELETE" 
    ,  headers: {
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${token}`
}
  });
await fetchAssignedTasks();
  };
}; 

document.getElementById('close-edit-task-modal-button').addEventListener('click',()=>{
  document.querySelector(".modal-overlay").classList.remove("show");
});

document.addEventListener("DOMContentLoaded", () => {
  const user = JSON.parse(localStorage.getItem("user"));
  if (user && user.name) {
    const usernameElement = document.getElementById("navbar-username");
    if (usernameElement) {
      usernameElement.textContent = user.name;
    }
  }
});
document.getElementById("logoutBtn").addEventListener("click", () => {

  localStorage.removeItem("token");

  localStorage.removeItem("userEmail");

  window.location.href = "/login.html";
});