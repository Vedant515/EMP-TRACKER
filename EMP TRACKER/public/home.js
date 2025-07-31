document.addEventListener('DOMContentLoaded', () => {
    const logoutButton = document.getElementById('logout-button');

    logoutButton.addEventListener('click', () => {
        console.log('Admin logged out (simulated).');

    });

    document.querySelectorAll('.cards-section .card-button').forEach(button => {
        button.addEventListener('click', (event) => {
            const cardTitle = event.target.closest('.card').querySelector('.card-title').textContent;
            console.log(`Navigating to ${cardTitle} management (simulated).`);

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