document.addEventListener('DOMContentLoaded', () => {

loadskils();
async function loadskils() {
    const token = localStorage.getItem('token');
    const res = await fetch('/get-skills', {
    headers: {
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${token}`
}

  });
    const data = await res.json();
    console.log("Skills received from backend:", data);

 const tbody = document.querySelector("tbody");
  tbody.innerHTML = "";
    data.forEach(skill => {
      const row = document.createElement("tr");

      row.innerHTML = `

        <td class="table-data" >${skill.name}</td>
        <td class="table-data" >${skill.description}</td>

        <td class="table-data action-cell" id="modifybtn">

        <button class="edit-button" 
        data-id="${skill._id}" 
        data-name="${skill.name}" 
        data-description="${skill.description}">
      Edit
    </button>
        <button 
        class="delete-button"
        data-id="${skill._id}" 
        data-name="${skill.name}"  >Delete</button>

                </td>
      `;
      tbody.appendChild(row);
    });
  };

document.querySelector("tbody").addEventListener("click", function (e) {
   if (e.target.classList.contains("delete-button")) {
    const id = e.target.getAttribute("data-id");
    const name = e.target.getAttribute("data-name");

    deleteskill(id, name);
  }

});

async function deleteskill(id , name) {
     const token = localStorage.getItem('token');
    if(confirm(`Are you sure you want to delete ${name} skill`)){
  await fetch(`/skill-delete/${id}`, { method: "DELETE" ,
   headers: {
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${token}`
}

  });
  loadskils();
  };
}; 

    const addSkillButton = document.getElementById('add-skill-button');
    const editSkillsButton = document.getElementById('edit-skills-button'); 
    const skillManagementBox = document.getElementById('skill-management-box');
    const skillsTableContainer = document.querySelector('.skills-table-container');
    const skillTableBody = document.querySelector('.data-table tbody'); 
    const skillContextMenu = document.getElementById('skill-context-menu');
    const editSelectedSkillButton = document.getElementById('edit-selected-skill-button');
    const deleteSelectedSkillButton = document.getElementById('delete-selected-skill-button');

    const addSkillModal = document.getElementById('add-skill-modal');
    const closeSkillModalButton = document.getElementById('close-skill-modal-button');
    const submitSkillButton = document.getElementById('submit-skill-button');
    const skillNameInput = document.getElementById('skill-name-input');
    const skillDescriptionInput = document.getElementById('skill-description-input');

    let isEditingMode = false;

    function toggleEditingMode() {
        isEditingMode = !isEditingMode;
        skillsTableContainer.classList.toggle('editing', isEditingMode);
        editSkillsButton.classList.toggle('active-mode', isEditingMode); 

        if (isEditingMode) {
            editSkillsButton.textContent = 'Done';

        } else {
            editSkillsButton.textContent = 'Edit';
            hideContextMenu(); 

            document.querySelectorAll('.skill-checkbox').forEach(checkbox => {
                checkbox.checked = false;
            });
        }
    }

    function showContextMenu() {
        const rect = skillManagementBox.getBoundingClientRect();

        skillContextMenu.style.top = `${rect.top}px`;
        skillContextMenu.style.left = `${rect.right + 20}px`; 

        const menuWidth = skillContextMenu.offsetWidth;
        const viewportWidth = window.innerWidth;
        if (rect.right + menuWidth + 20 > viewportWidth) { 

            skillContextMenu.style.left = `${rect.left - menuWidth - 20}px`; 
        }

        skillContextMenu.classList.add('show');
    }

    function hideContextMenu() {
        skillContextMenu.classList.remove('show');
    }

    editSkillsButton.addEventListener('click', (event) => {
        event.stopPropagation(); 
        toggleEditingMode();

        if (isEditingMode && getSelectedSkillRows().length === 0) {
            hideContextMenu();
        }
    });
   document.getElementById('add-skill-button').addEventListener('click',()=>{
addskill(); 

   });

    function addskill(){

    addSkillButton.addEventListener('click', () => {
        addSkillModal.classList.add('show');
    });
    };

    closeSkillModalButton.addEventListener('click', () => {

        addSkillModal.classList.remove('show');
    });
const formskill = document.getElementById('skillform');

     let editEmployeeId = null;

        async function saveskill(){

        const name = skillNameInput.value;
        const description = skillDescriptionInput.value; 

        if (name && description) {
            console.log('New Skill Data:', {  name, description });

            const newRow = document.createElement('tr');
            newRow.classList.add('table-row'); 
            newRow.innerHTML = `

                <td class="table-data">${name}</td>
                <td class="table-data">${description}</td>
            `;
            skillTableBody.appendChild(newRow); 

            try {
       const token = localStorage.getItem("token");
      const res = await fetch(`/get-skills`, {
        method: "POST",
     headers: {
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${token}`
},
        body: JSON.stringify({ name, description }),
      });
      console.log("Fetch Response Status:", res.status);

      if (res.ok) { 
        alert("skill updated successfully");

                await loadskils(); 

      } else {
        alert("Failed to update skill"); 
      }
    } catch (err) {
      console.error("Update Error:", err);
      alert("Error updating skill");
    }
            addSkillModal.classList.remove('show'); 

            skillNameInput.value = '';
            skillDescriptionInput.value = '';
        } else {
            alert('Please fill in all fields.');
        }

     }

    function getSelectedSkillRows() {
        return Array.from(skillTableBody.querySelectorAll('.skill-checkbox:checked')).map(checkbox => checkbox.closest('tr'));
    }

    skillTableBody.addEventListener('change', (event) => {
        if (event.target.classList.contains('skill-checkbox')) {
            const selectedCount = getSelectedSkillRows().length;
            if (isEditingMode) { 
                if (selectedCount > 0) {
                    showContextMenu();
                } else {
                    hideContextMenu();
                }
            }
        }
    });

document.querySelector("tbody").addEventListener("click", function (e) {
  if (e.target.classList.contains("edit-button")) {
    const id = e.target.getAttribute("data-id");
    const name = e.target.getAttribute("data-name");
    const description = e.target.getAttribute("data-description");

    openEditPopup(id, name, description);
  }
});

function openEditPopup(id , name , description){
 

document.getElementById("editId").value = id; 
 editEmployeeId=id;
 document.querySelector(".modal-overlay").classList.add("show");
document.getElementById('skill-name-input').value=name;
document.getElementById('skill-description-input').value=description;
document.querySelector(".modal-title").innerHTML='Edit Skill';
}

document.getElementById("skillform").addEventListener("submit", async function (e) {
  e.preventDefault();

if (!editEmployeeId) {
    saveskill();
    return;
}

    const name = document.getElementById("skill-name-input").value.trim();
    const description = document.getElementById("skill-description-input").value.trim();
    const editId = document.getElementById("editId").value;
     const token = localStorage.getItem("token");
    if (!name.trim() || !description.trim()) {
        alert("All fields are required.");
        return;
    }

    try {
      let res;
        if (editEmployeeId) {

           res = await fetch(`/get-skills/${editEmployeeId}`, {
                method: "PUT",
                headers: {
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${token}`
},
                body: JSON.stringify({ name, description }),
            });
        }
         console.log("RESPONSE STATUS:", res.status);
          const result = await res.json();
          console.log("RESPONSE BODY:", result);

         if (res.ok || res.status === 200) {
        alert( editEmployeeId ? "Skill updated successfully!" : "Skill added successfully!");
         await loadskils();
            document.getElementById("skillform").reset();
            document.getElementById('skill-name-input').value="";
document.getElementById('skill-description-input').value="";
            document.querySelector(".modal-overlay").classList.remove("show");
            document.querySelector(".modal-title").innerHTML='Add New Skill';
            editEmployeeId = null;
            document.getElementById("editId").value = "";

        } else {
            alert("Failed to save skill");
        }
    } catch (err) {
        console.error("Error:", err);
        alert("An error occurred");
    }

});

    document.addEventListener('click', (event) => {
        if (!skillContextMenu.contains(event.target) && !editSkillsButton.contains(event.target)) {
            hideContextMenu();
        }
    });

    document.querySelectorAll('nav button').forEach(navButton => {
        navButton.addEventListener('click', (event) => {

            document.querySelectorAll('nav button').forEach(btn => {
                btn.classList.remove('active'); 
            });

            event.target.classList.add('active');

            const tabName = event.target.textContent;
            console.log(`Navigated to: ${tabName} (simulated).`);

        });
    });
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