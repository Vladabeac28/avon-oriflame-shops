
function renderProducts(filterBrand = '', minPrice = 0, maxPrice = Infinity) {
    const productList = document.getElementById('productList');
    productList.innerHTML = '';
    products
        .filter(p => (!filterBrand || p.brand === filterBrand) && p.price >= minPrice && p.price <= maxPrice)
        .forEach(p => {
            const productDiv = document.createElement('div');
            productDiv.className = 'product';
            productDiv.innerHTML = `
                <img src="${p.image}" alt="${p.name}">
                <h3>${p.name}</h3>
                <p>${p.price} грн</p>
                <a href="product.html?id=${p.id}"><button>Деталі</button></a>
            `;
            productList.appendChild(productDiv);
        });
    updateCartCount();
}

function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    document.getElementById('cartCount').textContent = cart.length;
}

document.getElementById('applyFilters').addEventListener('click', () => {
    const brand = document.getElementById('brandFilter').value;
    const minPrice = parseFloat(document.getElementById('minPrice').value) || 0;
    const maxPrice = parseFloat(document.getElementById('maxPrice').value) || Infinity;
    renderProducts(brand, minPrice, maxPrice);
});

renderProducts();
