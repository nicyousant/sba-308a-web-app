// js/main.js
import { fetchProducts, fetchCategories, login, createCart, updateCart } from "./api.js";
import { setProducts, addToCart, renderCart, getCart, setCartId, getCartId } from "./cart.js";

let token = null;
let allProducts = [];

// Load products + categories on startup
async function init() {
  const [products, categories] = await Promise.all([
    fetchProducts(),
    fetchCategories()
  ]);

  allProducts = products;
  setProducts(products);
  displayProducts(products);
  populateCategoryDropdown(categories);
}

function populateCategoryDropdown(categories) {
  const categorySelect = document.getElementById("categoryFilter");
  categorySelect.innerHTML = `<option value="all">all</option>`;
  categories.forEach(cat => {
    const option = document.createElement("option");
    option.value = cat;
    option.textContent = cat; // no capitalization
    categorySelect.appendChild(option);
  });

  // listen for change
  categorySelect.addEventListener("change", () => {
    const selected = categorySelect.value;
    displayProducts(allProducts, selected);
  });
}

function displayProducts(products, category = "all") {
  const productsContainer = document.getElementById("products");
  productsContainer.innerHTML = "";

  products.forEach(product => {
    if (category === "all" || product.category === category) {
      const card = document.createElement("div");
      card.className = "product-card";
      card.innerHTML = `
        <img src="${product.image}" alt="${product.title}">
        <h4>${product.title}</h4>
        <p class="price">$${product.price}</p>
        <p class="cat">${product.category}</p>
      `;
      const addBtn = document.createElement("button");
      addBtn.textContent = "Add to Cart";
      addBtn.disabled = !token;
      addBtn.addEventListener("click", () => addToCart(product.id));
      card.appendChild(addBtn);
      productsContainer.appendChild(card);
    }
  });
}

// LOGIN
document.getElementById("loginForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;
  const data = await login(username, password);
  if (data.token) {
    token = data.token;
    document.getElementById("status").textContent = "✅ Logged in!";
    document.querySelectorAll(".product-card button").forEach(btn => btn.disabled = false);
  } else {
    document.getElementById("status").textContent = "❌ Login failed";
  }
});

// LOGIN
document.getElementById("loginForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;
  const data = await login(username, password);
  if (data.token) {
    token = data.token;
    document.getElementById("status").textContent = "✅ Logged in!";
    document.querySelectorAll(".product-card button").forEach(btn => btn.disabled = false);
    document.getElementById("logoutBtn").style.display = "inline-block"; // show logout
  } else {
    document.getElementById("status").textContent = "❌ Login failed";
  }
});

// LOGOUT
document.getElementById("logoutBtn").addEventListener("click", () => {
  token = null;
  document.getElementById("status").textContent = "🚪 Logged out";
  document.querySelectorAll(".product-card button").forEach(btn => btn.disabled = true);
  document.getElementById("logoutBtn").style.display = "none"; // hide logout again
});


// Checkout
document.getElementById("checkoutBtn").addEventListener("click", async () => {
  if (!token) return;
  const cart = getCart();
  const data = await createCart(token, cart);
  setCartId(data.id);
  document.getElementById("status").textContent = "✅ Cart created!";
});

// Update cart
document.getElementById("updateCartBtn").addEventListener("click", async () => {
  if (!token) return;
  const cart = getCart();
  const cartId = getCartId();
  const data = await updateCart(token, cartId, cart);
  document.getElementById("status").textContent = "✅ Cart updated!";
});

// Start everything
init();
