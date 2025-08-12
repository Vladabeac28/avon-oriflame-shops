// auth.js

const modal = document.getElementById("loginModal");
const loginBtn = document.getElementById("loginBtn");
const closeBtn = document.querySelector(".close");
const form = document.getElementById("loginForm");

if (loginBtn && modal && closeBtn && form) {
    loginBtn.onclick = () => {
        modal.style.display = "block";
    };

    closeBtn.onclick = () => {
        modal.style.display = "none";
    };

    window.onclick = (event) => {
        if (event.target === modal) {
            modal.style.display = "none";
        }
    };

    form.onsubmit = (e) => {
        e.preventDefault();

        const username = document.getElementById("username").value.trim();
        const password = document.getElementById("password").value.trim();

        if (username === "admin" && password === "admin123") {
            window.location.href = "admin.html";
        } else {
            alert("Вхід виконано для користувача: " + username);
            modal.style.display = "none";
        }
    };
}
