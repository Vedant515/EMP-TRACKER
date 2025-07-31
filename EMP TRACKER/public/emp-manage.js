function showMessage(message, type = 'success') {
    const msgBox = document.getElementById('messageBox');
    msgBox.textContent = message;
    msgBox.className = 'message-box show';
    if (type === 'error') {
        msgBox.classList.add('error');
    } else if (type === 'info') {
        msgBox.style.backgroundColor = '#2196F3';
    } else {
        msgBox.style.backgroundColor = '#4CAF50'; 
    }
    setTimeout(() => {
        msgBox.classList.remove('show');
    }, 3000);
}

document.addEventListener('DOMContentLoaded',loadEmployees);

  async function loadEmployees() {
   const token = localStorage.getItem("token");
  const res = await fetch('/api/only-employees', {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
    const data = await res.json();
   console.log("Fetched employees:", data);

 const tbody = document.querySelector("tbody");
  tbody.innerHTML = "";
    data.forEach(emp => {
      const row = document.createElement("tr");

      row.innerHTML = `
        <td class="table-data" class="cur-name">${emp.name}</td>
        <td class="table-data" class="cur-email">${emp.useremail1}</td>
        <td class="table-data" class="cur-role">${emp.role}</td>
        <td class="table-data employee-status" class="cur-status">${emp.status || 'pending'}</td>

        <td class"table-data">
        <button class="babar1" onclick="openEditPopup('${emp._id}', '${emp.name}', '${emp.useremail1}', '${emp.role}', '${emp.status}')" >Edit</button>
        <button class="babar1" onclick="deleteEmployee('${emp._id}')" >Delete</button>
        </td>

      `;
      tbody.appendChild(row);
    });
  };

async function deleteEmployee(id) {
   const token = localStorage.getItem("token");
 if(confirm(`Are you sure you want to delete Employee`)){
  await fetch(`/delete/${id}`, { method: "DELETE" , 
     headers: {
    "Authorization": `Bearer ${token}`
  }
  });
  loadEmployees();
}
}

function openEditPopup(id, name, email, role, status) {
  editEmployeeId = id;
  document.getElementById("editId").value = id;
  document.getElementById("editName").value = name;
  document.getElementById("editEmail").value = email;
  document.getElementById("editRole").value = role;
  document.getElementById("editStatus").value = status;
  document.getElementById("editFormContainer").classList.remove("hidden");
} 

function closeEditPopup() {
  document.getElementById("editFormContainer").classList.add("hidden");
}

document.getElementById('cancle-btn').addEventListener('click', () => {
  document.getElementById('editFormContainer').classList.add('hidden');
   editEmployeeId = null;
});

let editEmployeeId = null;

document.getElementById("editForm").addEventListener("submit", async function (e) {
  e.preventDefault();

  const name = document.getElementById("editName").value.trim();
  const email = document.getElementById("editEmail").value.trim(); 
  const role = document.getElementById("editRole").value.trim();
  const status = document.getElementById("editStatus").value.trim();

  if (!name || !email || !role || !status) {
    alert("All fields are required.");
    return;
  }

  if (editEmployeeId) {
    try {
       const token = localStorage.getItem("token");
      const res = await fetch(`/get-employees/${editEmployeeId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",

    "Authorization": `Bearer ${token}`

        },
        body: JSON.stringify({ name, email, role ,status }),
      });

      if (res.ok) { 
        alert("Employee updated successfully");
        editEmployeeId = null;
        document.getElementById("editForm").reset();
         loadEmployees(); 
      } else {
        alert("Failed to update employee");
      }
    } catch (err) {
      console.error("Update Error:", err);
      alert("Error updating employee");
    }
  }
});

loadEmployees();

    const employeeTableBody = document.getElementById('employee-table-body');

    let currentContextMenuButton = null;
    let currentRowToEdit = null;
    let currentEmpemail = null;

    function hideContextMenu() {
        if (employeeContextMenu) {
            employeeContextMenu.classList.remove('show');

            employeeContextMenu.style.top = '';
            employeeContextMenu.style.left = '';
        }
        currentContextMenuButton = null;
    }

    document.addEventListener('click', (event) => {
        if (employeeContextMenu && !employeeContextMenu.contains(event.target) && !event.target.closest('.three-dots-button')) {
            hideContextMenu();
        }
    });

    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            showMessage('Logged out (simulated).', 'info');
        });
    }

lala();
async function lala(){

 const token = localStorage.getItem("token");

const res = await fetch("/api/employees", {
  method: "GET",
  headers: {
    "Authorization": `Bearer ${token}`
  }
});

}
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