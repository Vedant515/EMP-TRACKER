let allRatings = [];

document.addEventListener("DOMContentLoaded", async () => {
  try {
      const token = localStorage.getItem('token');
    const res = await fetch("/api/all-skill-ratings" ,{
    headers: {

  'Authorization': `Bearer ${token}`
}

  });
    const data = await res.json();
    allRatings = data;

    populateSkillFilter(data);
    renderTable(data);
  } catch (err) {
    console.error("Error loading skill ratings:", err);
  }

  document.getElementById("skillFilter").addEventListener("change", applyFilters);
  document.getElementById("sortOption").addEventListener("change", applyFilters);
});

function populateSkillFilter(data) {
  const skillSet = new Set(data.map(item => item.skillName));
  const skillFilter = document.getElementById("skillFilter");

  skillSet.forEach(skill => {
    const option = document.createElement("option");
    option.value = skill;
    option.textContent = skill;
    skillFilter.appendChild(option);
  });
}

function applyFilters() {
  const skill = document.getElementById("skillFilter").value;
  const sort = document.getElementById("sortOption").value;

  let filtered = [...allRatings];

  if (skill) {
    filtered = filtered.filter(item => item.skillName === skill);
  }

  if (sort === "high") {
    filtered.sort((a, b) => b.rating - a.rating);
  } else if (sort === "low") {
    filtered.sort((a, b) => a.rating - b.rating);
  }

  renderTable(filtered);
}

function renderTable(data) {
  const tbody = document.getElementById("reportBody");
  tbody.innerHTML = "";

  if (data.length === 0) {
    tbody.innerHTML = "<tr><td colspan='6'>No data found.</td></tr>";
    return;
  }

  data.forEach((entry) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${entry.employeeName}</td>
      <td>${entry.employeeEmail}</td>
      <td>${entry.employeeRole}</td>
      <td>${entry.skillName}</td>
      <td>${entry.rating}</td>
      <td>${new Date(entry.date).toLocaleDateString()}</td> 
    `;
    tbody.appendChild(tr);
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