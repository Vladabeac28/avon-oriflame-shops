document.addEventListener('DOMContentLoaded', () => {
  const cartItemsDiv = document.getElementById('cartItems');
  const totalPriceP = document.getElementById('totalPrice');
  const orderButton = document.getElementById('orderButton');

  let cart = JSON.parse(localStorage.getItem('cart') || '[]');

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

    const itemCounts = {};
    cart.forEach(id => {
      itemCounts[id] = (itemCounts[id] || 0) + 1;
    });

    let total = 0;
    Object.entries(itemCounts).forEach(([id, count]) => {
      const product = products.find(p => p.id === Number(id));
      if(product) {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'product';
        itemDiv.innerHTML = `
          <h4>${product.name} (${count} шт.)</h4>
          <p>${product.price} грн × ${count} = ${product.price * count} грн</p>
          <button class="remove-btn" data-id="${product.id}">Видалити</button>
        `;
        cartItemsDiv.appendChild(itemDiv);
        total += product.price * count;
      }
    });

    totalPriceP.textContent = `Всього: ${total} грн`;

    const orderText = Object.entries(itemCounts)
      .map(([id, count]) => {
        const product = products.find(p => p.id === Number(id));
        return product ? `${product.name} - ${count} шт.` : '';
      }).join(', ');

    const telegramLink = `https://t.me/avon_oriflame_shops_bot?text=${encodeURIComponent('Я хочу замовити: ' + orderText + '. Всього: ' + total + ' грн.')}`;

    orderButton.href = telegramLink;
    orderButton.style.pointerEvents = 'auto';
    orderButton.style.opacity = '1';

    // Додаємо події видалення товарів
    document.querySelectorAll('.remove-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const idToRemove = Number(btn.dataset.id);
        cart = cart.filter(itemId => itemId !== idToRemove);
        localStorage.setItem('cart', JSON.stringify(cart));
        renderCart();
      });
    });
  }

  renderCart();
});

