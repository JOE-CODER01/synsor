import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";

const app = initializeApp({
  apiKey: "AIzaSyCqa4koTFTNxV2aps89jTRpH2EPF8GoLzE",
  authDomain: "synsor-83edc.firebaseapp.com",
  projectId: "synsor-83edc",
  databaseURL: "https://synsor-83edc-default-rtdb.firebaseio.com",
  storageBucket: "synsor-83edc.firebasestorage.app",
  messagingSenderId: "185298581474",
  appId: "1:185298581474:web:8d8988ac96474fd8c6ebbb"
});

const db = getDatabase(app);
let allProducts = [];
let currentCategory = 'all';

function renderProducts() {
  const grid = document.getElementById('product-grid');
  const filtered = currentCategory === 'all'
    ? allProducts
    : allProducts.filter(p => p.category === currentCategory);

  if (filtered.length === 0) {
    grid.innerHTML = '<div class="loading">No products yet. Check back soon.</div>';
    return;
  }

  grid.innerHTML = filtered.map(p => `
    <div class="product-card">
      <img src="${p.imageUrl}" alt="${p.name}" loading="lazy">
      <div class="product-info">
        <h4 class="product-name">${p.name}</h4>
        <p class="product-price">₦${Number(p.price).toLocaleString()}</p>
        <a href="https://wa.me/2347040679105?text=Hi%20Olad%20%26%20Synsor%20Wears!%20I%20want%20to%20order%20${encodeURIComponent(p.name)}"
           class="btn-primary"
           target="_blank">Order on WhatsApp</a>
      </div>
    </div>
  `).join('');
}

const productsRef = ref(db, 'products');
onValue(productsRef, (snapshot) => {
  const data = snapshot.val();
  const grid = document.getElementById('product-grid');

  if (!data) {
    grid.innerHTML = '<div class="loading">No products yet. Check back soon.</div>';
    return;
  }

  allProducts = Object.entries(data).reverse().map(([id, p]) => ({ id, ...p }));
  renderProducts();
});

document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentCategory = btn.dataset.category;
    renderProducts();
  });
});
