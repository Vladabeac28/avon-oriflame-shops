document.addEventListener('DOMContentLoaded', () => {
    const cartItemsContainer = document.getElementById('cart-items');
    const totalPriceElement = document.getElementById('total-price');

    // Отримуємо кошик з localStorage
    function getCart() {
        return JSON.parse(localStorage.getItem('cart')) || [];
    }

    // Зберігаємо кошик у localStorage
    function saveCart(cart) {
        localStorage.setItem('cart', JSON.stringify(cart));
    }

    // Оновлює HTML відображення кошика
    function renderCart() {
        const cart = getCart();
        cartItemsContainer.innerHTML = '';

        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<p>Кошик порожній</p>';
            totalPriceElement.textContent = '0 грн';
            return;
        }

        let total = 0;

        cart.forEach((item, index) => {
            const cartItem = document.createElement('div');
            cartItem.classList.add('cart-item');

            // Зображення
            const img = document.createElement('img');
            img.src = item.image;
            img.alt = item.name;
            img.style.width = '120px';
            cartItem.appendChild(img);

            // Інформація про товар
            const info = document.createElement('div');
            info.classList.add('cart-item-info');

            const name = document.createElement('h3');
            name.textContent = item.name;
            info.appendChild(name);

            const price = document.createElement('p');
            price.textContent = `${item.price} грн`;
            info.appendChild(price);

            // Поле для кількості
            const quantityLabel = document.createElement('label');
            quantityLabel.textContent = 'Кількість: ';
            const quantityInput = document.createElement('input');
            quantityInput.type = 'number';
            quantityInput.min = 1;
            quantityInput.value = item.quantity;
            quantityInput.addEventListener('change', () => {
                item.quantity = parseInt(quantityInput.value) || 1;
                saveCart(cart);
                renderCart();
            });
            quantityLabel.appendChild(quantityInput);
            info.appendChild(quantityLabel);

            cartItem.appendChild(info);

            // Кнопка видалення
            const removeBtn = document.createElement('button');
            removeBtn.textContent = 'Видалити';
            removeBtn.addEventListener('click', () => {
                cart.splice(index, 1);
                saveCart(cart);
                renderCart();
            });
            cartItem.appendChild(removeBtn);

            cartItemsContainer.appendChild(cartItem);

            total += item.price * item.quantity;
        });

        totalPriceElement.textContent = `${total} грн`;
    }

    renderCart();
});

