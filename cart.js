document.addEventListener('DOMContentLoaded', () => {
  const cartItemsDiv = document.getElementById('cartItems');
  const totalPriceP = document.getElementById('totalPrice');  // Елемент для відображення суми
  const orderButton = document.getElementById('orderButton'); // Кнопка "Замовити"

  const confirmModal = document.getElementById('confirmModal');
  const confirmDeleteBtn = document.getElementById('confirmDelete');
  const cancelDeleteBtn = document.getElementById('cancelDelete');

  let cart = JSON.parse(localStorage.getItem('cart') || '[]');
  let selectedItems = {};
  let quantities = {};

  let itemToDeleteId = null; // Для збереження id товару, який плануємо видалити

  // Підрахунок кількості кожного товару в масиві cart
  function getItemCounts() {
    const counts = {};
    cart.forEach(id => {
      counts[id] = (counts[id] || 0) + 1;
    });
    return counts;
  }

  // Ініціалізація кількостей на основі кошика, якщо ще не задано
  function initQuantities() {
    const counts = getItemCounts();
    Object.keys(counts).forEach(id => {
      if (!quantities[id]) {
        quantities[id] = counts[id];
      }
    });
  }

  // Оновлення локального сховища на основі об'єкта quantities
  function saveCartFromQuantities() {
    let newCart = [];
    Object.entries(quantities).forEach(([id, qty]) => {
      for (let i = 0; i < qty; i++) {
        newCart.push(parseInt(id));
      }
    });
    cart = newCart;
    localStorage.setItem('cart', JSON.stringify(cart));
  }

  // Функція рендерингу кошика
  function renderCart() {
    cartItemsDiv.innerHTML = '';

    if(cart.length === 0) {
      cartItemsDiv.innerHTML = '<p>Ваш кошик порожній.</p>';
      if (totalPriceP) totalPriceP.textContent = '';
      if (orderButton) {
        orderButton.href = '#';
        orderButton.style.pointerEvents = 'none';
        orderButton.style.opacity = '0.5';
      }
      return;
    }

    initQuantities();

    if (Object.keys(selectedItems).length === 0) {
      Object.keys(quantities).forEach(id => selectedItems[id] = true);
    }

    let total = 0;

    Object.entries(quantities).forEach(([id, qty]) => {
      const product = products.find(p => p.id === Number(id));
      if(product) {
        const isChecked = selectedItems[id] !== false;

        const itemDiv = document.createElement('div');
        itemDiv.className = 'cart-item';
        itemDiv.style.display = 'flex';
        itemDiv.style.alignItems = 'center';
        itemDiv.style.borderBottom = '1px solid #ddd';
        itemDiv.style.padding = '8px 0';

        // Чекбокс
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = isChecked;
        checkbox.style.marginRight = '10px';
        checkbox.addEventListener('change', () => {
          selectedItems[id] = checkbox.checked;
          updateTotal();
        });

        // Фото товару
        const img = document.createElement('img');
        img.src = product.image;
        img.alt = product.name;
        img.style.width = '120px';
