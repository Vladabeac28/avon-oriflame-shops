// Знаходимо потрібні елементи DOM
const modal = document.getElementById("loginModal");
const loginBtn = document.getElementById("loginBtn");
const closeBtn = document.querySelector(".close");
const form = document.getElementById("loginForm");

// Відкриття модалки для входу в аккаунт
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
let itemToDelete = null;

document.addEventListener('click', function(event) {
  // Клік по кнопці видалення
  if (event.target.classList.contains('remove-btn')) {
    itemToDelete = event.target.closest('.cart-item');
    if (itemToDelete) {
      // Відкрити модальне вікно
      document.getElementById('confirmModal').classList.remove('hidden');
    }
  }
});

// Підтвердити видалення
document.getElementById('confirmDelete').addEventListener('click', function() {
  if (itemToDelete) {
    itemToDelete.remove();
    itemToDelete = null;
    updateCartSummary(); // Функція оновлення підсумку (реалізуй її)
    document.getElementById('confirmModal').classList.add('hidden');
  }
});

// Відмінити видалення
document.getElementById('cancelDelete').addEventListener('click', function() {
  itemToDelete = null;
  document.getElementById('confirmModal').classList.add('hidden');
});

function updateCartSummary() {
  // Логіка підрахунку загальної суми і оновлення #cartTotal
  // Реалізуй відповідно до своєї структури кошика
}
