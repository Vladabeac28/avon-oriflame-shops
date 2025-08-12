document.addEventListener('DOMContentLoaded', () => {
  const cartItemsDiv = document.getElementById('cartItems');
  const totalPriceP = document.getElementById('totalPrice');
  const orderButton = document.getElementById('orderButton');

  const confirmModal = document.getElementById('confirmModal');
  const confirmDeleteBtn = document.getElementById('confirmDelete');
  const cancelDeleteBtn = document.getElementById('cancelDelete');

  let cart = JSON.parse(localStorage.getItem('cart') || '[]');
  let quantities = {};
  let selectedItems = {};
  let itemToDelete = null;

  function getItemCounts() {
    const counts = {};
    cart.forEach(id => {
      counts[id] = (counts[id] || 0) + 1;
    });
    return counts;
  }

  function initQuantities() {
    const counts = getItemCounts();
    Object.keys(counts).forEach(id => {
      if (!quantities[id]) {
        quantities[id] = counts[id];
      }
    });
  }

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

        // Чекбокс
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = isChecked;
        checkbox.addEventListener('change', () => {
          selectedItems[id] = checkbox.checked;
          updateTotal();
        });

        // Фото товару
        const img = document.createElement('img');
        img.src = product.image;
        img.alt = product.name;

        // Деталі товару
        const infoDiv = document.createElement('div');
        infoDiv.style.flexGrow = '1';

        const nameP = document.createElement('p');
        nameP.textContent = product.name;

        // Поле для кількості
        const qtyInput = document.createElement('input');
        qtyInput.type = 'number';
        qtyInput.min = '1';
        qtyInput.value = qty;
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

        // Кнопка видалення
        const removeBtn = document.createElement('button');
        removeBtn.className = 'remove-btn';
        removeBtn.textContent = '🗑️';
        removeBtn.addEventListener('click', () => {
          itemToDelete = id;
          confirmModal.classList.remove('hidden');
        });

        itemDiv.appendChild(checkbox);
        itemDiv.appendChild(img);
        itemDiv.appendChild(infoDiv);
        itemDiv.appendChild(removeBtn);

        cartItemsDiv.appendChild(itemDiv);

        if(isChecked) {
          total += product.price * qty;
        }
      }
    });

    totalPriceP.textContent = `Всього: ${total} грн`;

    if (total === 0) {
      orderButton.href = '#';
      orderButton.style.pointerEvents = 'none';
      orderButton.style.opacity = '0.5';
    } else {
      const orderText = Object.entries(selectedItems)
        .filter(([_, checked]) => checked)
        .map(([id]) => {
          const product = products.find(p => p.id === Number(id));
          const qty = quantities[id] || 0;
          return product ? `${product.name} - ${qty} шт.` : '';
        }).join(', ');

      const telegramLink = `https://t.me/avon_oriflame_shops_bot?text=${encodeURIComponent('Я хочу замовити: ' + orderText + '. Всього: ' + total + ' грн.')}`;
      orderButton.href = telegramLink;
      orderButton.style.pointerEvents = 'auto';
      orderButton.style.opacity = '1';
    }
  }

  function updateTotal() {
    renderCart();
  }

  confirmDeleteBtn.addEventListener('click', () => {
    if(itemToDelete !== null) {
      delete quantities[itemToDelete];
      saveCartFromQuantities();
      itemToDelete = null;
      confirmModal.classList.add('hidden');
      renderCart();
    }
  });

  cancelDeleteBtn.addEventListener('click', () => {
    itemToDelete = null;
    confirmModal.classList.add('hidden');
  });

  renderCart();
});
