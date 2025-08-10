
const cartItemsDiv = document.getElementById('cartItems');
const totalPriceP = document.getElementById('totalPrice');
let cart = JSON.parse(localStorage.getItem('cart') || '[]');

function renderCart() {
    cartItemsDiv.innerHTML = '';
    let total = 0;
    cart.forEach(id => {
        const product = products.find(p => p.id === id);
        if (product) {
            const itemDiv = document.createElement('div');
            itemDiv.className = 'product';
            itemDiv.innerHTML = `<h4>${product.name}</h4><p>${product.price} грн</p>`;
            cartItemsDiv.appendChild(itemDiv);
            total += product.price;
        }
    });
    totalPriceP.textContent = `Всього: ${total} грн`;
    document.getElementById('orderButton').href = `https://t.me/avon_oriflame_shops_bot?text=Я%20хочу%20замовити:%20${encodeURIComponent(cart.map(id => {
        const p = products.find(pr => pr.id === id);
        return p ? p.name + ' - ' + p.price + ' грн' : '';
    }).join(', '))}%20Всього:%20${total}%20грн`;
}

renderCart();
