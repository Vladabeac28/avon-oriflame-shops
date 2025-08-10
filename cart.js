document.addEventListener('DOMContentLoaded', () => {
  const cartItemsDiv = document.getElementById('cartItems');
  const totalPriceP = document.getElementById('totalPrice');
  const orderButton = document.getElementById('orderButton');

  // Масив із усіма товарами у кошику (з локального сховища)
  let cart = JSON.parse(localStorage.getItem('cart') || '[]');

  // Об’єкт з вибраними товарами (галочки)
  let selectedItems = {};

  // Об’єкт для зберігання кількості кожного товару
  let quantities = {};

  // Підрахунок товарів та їх кількості в кошику
  function getItemCounts() {
    const counts = {};
    cart.forEach(id => {
      counts[id] = (counts[id] || 0) + 1;
    });
    return counts;
  }

  // Ініціалізація quantities на основі кошика, якщо пусто - створюємо
  function initQuantities() {
    const counts = getItemCounts();
    Object.keys(counts).forEach(id => {
      if (!quantities[id]) {
        quantities[id] = counts[id];
      }
    });
  }

  function saveCartFromQuantities() {
    // Оновлюємо масив cart згідно quantities
    let newCart = [];
    Object.entries(quantities).forEach(([id, qty]) => {
      for (let i = 0; i < qty; i++) {
        newCart.push(parseInt(id));
      }
    });
    cart = newCart;
    localStorage.setItem('cart', JSON.stringify(cart));
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

    initQuantities();

    // Якщо selectedItems пустий — вибираємо всі за замовчуванням
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

        // Фото
        const img = document.createElement('img');
        img.src = product.image;
        img.alt = product.name;
        img.style.width = '60px';
        img.style.height = '60px';
        img.style.objectFit = 'cover';
        img.style.borderRadius = '5px';
        img.style.marginRight = '10px';

        // Інформація (назва + input для кількості)
        const infoDiv = document.createElement('div');
        infoDiv.style.flexGrow = '1';

        const nameP = document.createElement('p');
        nameP.textContent = product.name;
        nameP.style.margin = '0 0 4px 0';
        nameP.style.fontWeight = 'bold';

        // Поле вводу кількості
        const qtyInput = document.createElement('input');
        qtyInput.type = 'number';
        qtyInput.min = '1';
        qtyInput.value = qty;
        qtyInput.style.width = '60px';
        qtyInput.style.marginTop = '4px';
        qtyInput.addEventListener('change', () => {
          let val = parseInt(qtyInput.value);
          if (isNaN(val) || val < 1) val = 1;
          qtyInput.value = val;
          quantities[id] = val;
          saveCartFromQuantities();
          updateTotal();
        });

        infoDiv.appendChild(nameP);
        infoDiv.appendChild(qtyInput);

        itemDiv.appendChild(checkbox);
        itemDiv.appendChild(img);
        itemDiv.appendChild(infoDiv);

        cartItemsDiv.appendChild(itemDiv);

        if(isChecked) {
          total += product.price * qty;
        }
      }
    });

    totalPriceP.textContent = `Всього: ${total} грн`;

    // Формуємо текст замовлення тільки з вибраних
    const orderText = Object.entries(selectedItems)
      .filter(([id, checked]) => checked)
      .map(([id]) => {
        const product = products.find(p => p.id === Number(id));
        const qty = quantities[id] || 0;
        return product ? `${product.name} - ${qty} шт.` : '';
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

