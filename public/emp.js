let useremail1 = "";
const token = localStorage.getItem("token");
document.addEventListener("DOMContentLoaded", async () => {

await getCurrentEmployee();
  await loadSkills();
  await loadRatedSkills();
  await loadTasks();
  initStars();
  await loadSkillProgressGraph();
});
async function getCurrentEmployee() {

  console.log(token);

  const res = await fetch("/api/my-profile", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await res.json();
  console.log("Current user:", data.useremail1);
  useremail1 = data.useremail1;
}

async function loadSkills() {
  try {
    const res = await fetch("/api/skills", {
  headers: { 
    Authorization: `Bearer ${token}`, 
  },
});

    const skills = await res.json();
    const select = document.getElementById("skillSelect");
    select.innerHTML = '<option value="">Select a skill</option>';
    skills.forEach(skill => {
      const opt = document.createElement("option");
      opt.value = skill.name; 
      opt.textContent = skill.name;
      select.appendChild(opt);
    });
  } catch (err) {
    console.error("Failed to load skills:", err);
  }
}

let selectedRating = 0;

function initStars() {
  const container = document.getElementById("starRating");
  container.innerHTML = "";
  for (let i = 1; i <= 5; i++) {
    const star = document.createElement("span");
    star.textContent = "★";
    star.className = "star";
    star.dataset.value = i;
    star.onclick = () => setRating(i);
    container.appendChild(star);
  }
}

function setRating(value) {
  selectedRating = value;
  document.querySelectorAll(".star").forEach(star => {
    star.style.color = star.dataset.value <= value ? "gold" : "white";
  });
}

async function rateSkill() {
  const skillName = document.getElementById("skillSelect").value;
  if (!skillName || selectedRating === 0) {
    return alert("Please select a skill and rating.");
  }

  try {
    const res = await fetch("/api/rate-skill", {

      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}`, },
      body: JSON.stringify({

employeeEmail: useremail1,
        skillName, 
        rating: selectedRating
      })
    });
  console.log({
employeeEmail: useremail1, skillName, rating: selectedRating });
console.log("Response status:", res.status);
const resText = await res.text();
console.log("Response text:", resText);

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || "Rating failed.");
    }

    await loadRatedSkills(); 
    alert("Skill rated successfully!");

  } catch (err) {
    console.error("Error rating skill:", err);
    alert("Error rating skill.");
  }
}

async function loadRatedSkills() {
  try {

    const res = await fetch(`/api/employee-skill-history?email=${useremail1}`, {
  headers: {
    Authorization: `Bearer ${token}`,
  },
});
    const data = await res.json();
    const tbody = document.querySelector("#ratedSkillsTable tbody");
    tbody.innerHTML = "";
    data.forEach(r => {
      const row = `<tr><td>${r.skillName}</td><td>${r.rating}</td><td>${new Date(r.date).toLocaleDateString()}</td></tr>`;
      tbody.innerHTML += row;
    });
  } catch (err) {
    console.error("Failed to load rated skills:", err);
  }
}

async function loadTasks() {
  try {
    const res = await fetch(`/api/my-tasks?email=${useremail1}`, {
  headers: {
    Authorization: `Bearer ${token}`,
  },
});
    const tasks = await res.json();
    const tbody = document.querySelector("#taskTable tbody");
    tbody.innerHTML = "";
    tasks.forEach(task => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${task.taskName}</td>
        <td>${new Date(task.startDate).toLocaleDateString()}</td>
        <td>${new Date(task.endDate).toLocaleDateString()}</td>
        <td>
          <select onchange="updateTaskStatus('${task._id}', this.value)">
            <option value="Pending" ${task.status === "Pending" ? "selected" : ""}>Pending</option>
            <option value="Completed" ${task.status === "Completed" ? "selected" : ""}>Completed</option>
          </select>
        </td>
      `;
      tbody.appendChild(row);
    });
  } catch (err) {
    console.error("Failed to load tasks:", err);
  }
}

async function updateTaskStatus(taskId, status) {
  try {
    const res = await fetch(`/api/update-task-status/${taskId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" , Authorization: `Bearer ${token}`,},
      body: JSON.stringify({ status })
    });

    if (!res.ok) {
      throw new Error("Status update failed");
    }

    alert("Task status updated!");
  } catch (err) {
    console.error("Error updating task status:", err);
    alert("Error updating task.");
  }
}
let skillChart; 

async function loadSkillProgressGraph() {
  if (!useremail1) return;

  try {
    const res = await fetch(`/api/employee-skill-history?email=${useremail1}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await res.json();

    const skillMap = {};

    data.forEach(entry => {
      const skill = entry.skillName;
      const date = new Date(entry.date).toLocaleDateString();
      if (!skillMap[skill]) skillMap[skill] = {};
      skillMap[skill][date] = entry.rating;
    });

    const labelsSet = new Set();
    Object.values(skillMap).forEach(dateMap => {
      Object.keys(dateMap).forEach(date => labelsSet.add(date));
    });
    const labels = Array.from(labelsSet).sort();

    const datasets = Object.entries(skillMap).map(([skill, dateMap]) => {
      return {
        label: skill,
        data: labels.map(label => dateMap[label] || 0),
        fill: false,
        borderColor: getRandomColor(),
        tension: 0.3,
        pointRadius: 5,
        pointHoverRadius: 7,
      };
    });

    const ctx = document.getElementById("skillProgressChart").getContext("2d");

    if (skillChart) skillChart.destroy();

    skillChart = new Chart(ctx, {
      type: "line",
      data: {
        labels,
        datasets
      },
      options: {
        responsive: true,
        plugins: {
          title: {
            display: true,
            text: "Skill Progress Over Time",
            font: {
              size: 18
            }
          },
          legend: {
            position: "bottom"
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            max: 5,
             ticks: {
              stepSize: 1
            },
            title: {
              display: true,
              text: "Rating"
            }
          },
          x: {
            title: {
              display: true,
              text: "Date"
            }
          }
        }
      }
    });

  } catch (err) {
    console.error("Error loading skill graph:", err);
  }
}

function getRandomColor() {
  return `hsl(${Math.floor(Math.random() * 360)}, 70%, 50%)`;
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
document.getElementById("logout-button").addEventListener("click", () => {

  localStorage.removeItem("token");

  localStorage.removeItem("useremail1");

  window.location.href = "/login.html";
});