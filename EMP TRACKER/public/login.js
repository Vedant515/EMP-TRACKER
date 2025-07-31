const container = document.getElementById('container');
const togglepanel = document.getElementById('toggle-panel');
const registerBtn = document.getElementById('register');
const registerBtn1 = document.getElementById('register1');
const loginBtn = document.getElementById('login');
const loginBtn2 = document.getElementById('login1');

registerBtn.addEventListener('click', () => {
    container.classList.add("active");
});

loginBtn.addEventListener('click', () => {
    container.classList.remove("active");
});

registerBtn1.addEventListener('click', () => {
    container.classList.add("active"); 
    togglepanel.classList.remove("toggle-right");
});

loginBtn2.addEventListener('click', () => {
    container.classList.remove("active");
});

