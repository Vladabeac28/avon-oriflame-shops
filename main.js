// main.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-app.js";
import {
  getFirestore,
  collection,
  onSnapshot,
  query,
  orderBy
} from "https://www.gstatic.com/firebasejs/10.12.3/firebase-firestore.js";

// Конфіг Firebase (твій)
const firebaseConfig = {
  apiKey: "AIzaSyAunUHobKwdTn7_5z0sjLlv98LoPm2-Nnw",
  authDomain: "avon-oriflame-shops.firebaseapp.com",
  projectId: "avon-oriflame-shops",
  storageBucket: "avon-oriflame-shops.appspot.com",
  messagingSenderId: "1087017989196",
  appId: "1:1087017989196:web:79c0c3c20cf69f47bc70e9"
};

// Ініціалізація Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const productList = document.getElementById("productList");
const brandFilter = document.getElementById("brandFilter");
const minPriceInput = document.getElementById("minPrice");
const maxPriceInput = document.getElementById("maxPrice");
const applyFiltersBtn = document.getElementById("applyFilters");
const cartCountElem = document.getElementById("cartCount");

let products = [];

// Функція рендеру товарів
function renderProducts(filterBrand = '', minPrice = 0, maxPrice = Infinity) {
  productList.innerHTML = '';

  const filteredProducts = products.filter(p => 
    (!filterBrand || p.brand === filterBrand) &&
    p.price >= minPrice &&
    p.price <= maxPrice
  );

  if (filteredProducts.length === 0) {
    productList.innerHTML = "<p>Товари не знайдені.</p>";
    return;
  }

  filteredProducts.forEach(p => {
    const productDiv = document.createElement('div');
    productDiv.className = 'product';
    productDiv.innerHTML = `
      <img src="${p.imageUrl}" alt="${p.name}">
      <h3>${p.name}</h3>
      <p>${p.price} грн</p>
      <a href="product.html?id=${p.id}"><button>Деталі</button></a>
    `;
    productList.appendChild(productDiv);
  });

  updateCartCount();
}

// Функція оновлення лічильника кошика
function updateCartCount() {
  const cart = JSON.parse(localStorage.getItem('cart') || '[]');
  cartCountElem.textContent = cart.length;
}

// Обробка кліку по кнопці "Застосувати" фільтрів
applyFiltersBtn.addEventListener('click', () => {
  const brand = brandFilter.value;
  const minPrice = parseFloat(minPriceInput.value) || 0;
  const maxPrice = parseFloat(maxPriceInput.value) || Infinity;
  renderProducts(brand, minPrice, maxPrice);
});

// Підписка на колекцію products в Firestore
const productsRef = collection(db, "products");
const q = query(productsRef, orderBy("createdAt", "desc"));

onSnapshot(q, (snapshot) => {
  products = snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));

  // Автоматично оновлюємо відображення при оновленні даних
  const brand = brandFilter.value;
  const minPrice = parseFloat(minPriceInput.value) || 0;
  const maxPrice = parseFloat(maxPriceInput.value) || Infinity;
  renderProducts(brand, minPrice, maxPrice);
});

// Початкове оновлення лічильника кошика
updateCartCount();
