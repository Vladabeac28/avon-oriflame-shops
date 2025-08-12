// Знаходимо потрібні елементи DOM
const modal = document.getElementById("loginModal");
const loginBtn = document.getElementById("loginBtn");
const closeBtn = document.querySelector(".close");
const form = document.getElementById("loginForm");

// Відкриття модалки
loginBtn.onclick = () => {
    modal.style.display = "block";
};

// Закриття модалки по кліку на хрестик
closeBtn.onclick = () => {
    modal.style.display = "none";
};

// Закриття модалки при кліку поза нею
window.onclick = (event) => {
    if (event.target == modal) {
        modal.style.display = "none";
    }
};

// Обробка форми входу
form.onsubmit = (e) => {
    e.preventDefault();

    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();

    // Проста перевірка: якщо адміністратор — переходимо на admin.html
    if (username === "admin" && password === "admin123") {
        window.location.href = "admin.html";
    } else {
        alert("Вхід виконано для користувача: " + username);
        modal.style.display = "none";
    }
};
