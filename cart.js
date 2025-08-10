document.addEventListener('DOMContentLoaded', () => {
  const cartItemsDiv = document.getElementById('cartItems');
  const totalPriceP = document.getElementById('totalPrice');
  const orderButton = document.getElementById('orderButton');

  let cart = JSON.parse(localStorage.getItem('cart') || '[]');

  // Об’єкт для збереження вибраних товарів (за замовчуванням всі вибрані)
  let selectedItems = {};

  // Групування товарів за id і кількістю
  function getItemCounts() {
    const counts = {};
    cart.forEach(id => {
      counts[id] = (counts[id] || 0) + 1;
    });
    return counts;
  }

  function renderCart() {
    cartItemsDiv.innerHTML = '';

    if(cart.length === 0) {
      cartItemsDiv.innerHTML = '<p>Ваш кошик порожній.</p>';
      totalPriceP.textContent = '';
      orderButton.href = '#';
      orderButton.style.pointerEvents = 'none';
      orderButton.style.opacity = '0.5';
      return;
    }

    const itemCounts = getItemCounts();

    // Якщо selectedItems пустий — за замовчуванням вибираємо всі
    if (Object.keys(selectedItems).length === 0) {
      Object.keys(itemCounts).forEach(id => selectedItems[id] = true);
    }

    let total = 0;

    Object.entries(itemCounts).forEach(([id, count]) => {
      const product = products.find(p => p.id === Number(id));
      if(product) {
        const isChecked = selectedItems[id] !== false;

        // Контейнер товару
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

        // Фото
        const img = document.createElement('img');
        img.src = product.image;
        img.alt = product.name;
        img.style.width = '60px';
        img.style.height = '60px';
        img.style.objectFit = 'cover';
        img.style.borderRadius = '5px';
        img.style.marginRight = '10px';

        // Назва і кількість (в одному блоці)
        const infoDiv = document.createElement('div');
        infoDiv.style.flexGrow = '1';

        const nameP = document.createElement('p');
        nameP.textContent = product.name;
        nameP.style.margin = '0 0 4px 0';
        nameP.style.fontWeight = 'bold';

        const qtyP = document.createElement('p');
        qtyP.textContent = `Кількість: ${count}`;
        qtyP.style.margin = '0';
        qtyP.style.color = '#555';
        qtyP.style.fontSize = '0.9em';

        infoDiv.appendChild(nameP);
        infoDiv.appendChild(qtyP);

        itemDiv.appendChild(checkbox);
        itemDiv.appendChild(img);
        itemDiv.appendChild(infoDiv);

        cartItemsDiv.appendChild(itemDiv);

        if(isChecked) {
          total += product.price * count;
        }
      }
    });

    totalPriceP.textContent = `Всього: ${total} грн`;

    // Формуємо текст замовлення тільки з вибраних
    const orderText = Object.entries(selectedItems)
      .filter(([id, checked]) => checked)
      .map(([id]) => {
        const product = products.find(p => p.id === Number(id));
        const count = itemCounts[id] || 0;
        return product ? `${product.name} - ${count} шт.` : '';
      }).join(', ');

    if (total === 0) {
      orderButton.href = '#';
      orderButton.style.pointerEvents = 'none';
      orderButton.style.opacity = '0.5';
    } else {
      const telegramLink = `https://t.me/avon_oriflame_shops_bot?text=${encodeURIComponent('Я хочу замовити: ' + orderText + '. Всього: ' + total + ' грн.')}`;
      orderButton.href = telegramLink;
      orderButton.style.pointerEvents = 'auto';
      orderButton.style.opacity = '1';
    }
  }

  function updateTotal() {
    renderCart();
  }

  renderCart();
});
