
const urlParams = new URLSearchParams(window.location.search);
const productId = parseInt(urlParams.get('id'));
const product = products.find(p => p.id === productId);

function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    document.getElementById('cartCount').textContent = cart.length;
}

if (product) {
    document.getElementById('productDetails').innerHTML = `
        <div class="product">
            <img src="${product.image}" alt="${product.name}">
            <h2>${product.name}</h2>
            <p><strong>${product.price} грн</strong></p>
            <p>${product.description}</p>
            <button onclick="addToCart(${product.id})">Додати в кошик</button>
        </div>
    `;
}
updateCartCount();

function addToCart(id) {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    cart.push(id);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    alert('Товар додано в кошик!');
}
