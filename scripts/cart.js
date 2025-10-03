// scripts/cart.js
// Purpose: manage in-memory cart state and render the cart area in the DOM.
// Exported functions allow main.js to read and change the cart.

// --- internal state (module-private) ---
let cart = [];              // array of { productId, quantity }
let products = [];          // product details used to render cart entries
let currentCartId = null;   // id received from API after POST (if any)

/**
 * Set the product list that cart will reference for rendering.
 * - This should be called once after products are fetched.
 */
export function setProducts(data) {
  products = data;
}

/**
 * Get the in-memory cart (useful when sending to API).
 */
export function getCart() {
  return cart;
}

/**
 * Set the currentCartId (when API returns an id after POST).
 */
export function setCartId(id) {
  currentCartId = id;
}

/**
 * Get the currentCartId (used by update logic).
 */
export function getCartId() {
  return currentCartId;
}

/**
 * Add product to cart. If the product already exists, increment quantity.
 * - productId: numeric id of product to add
 */
export function addToCart(productId) {
  const idx = cart.findIndex(c => c.productId === productId);
  if (idx >= 0) {
    // product already present → increase quantity
    cart[idx].quantity += 1;
  } else {
    // new product → push with default quantity 1
    cart.push({ productId, quantity: 1 });
  }
  renderCart(); // update DOM after change
}

/**
 * Remove an item from the cart by index
 */
export function removeFromCart(index) {
  if (index < 0 || index >= cart.length) return;
  cart.splice(index, 1);
  renderCart();
}

/**
 * Clear the cart entirely (used on logout or after clearing)
 */
export function clearCart() {
  cart = [];
  currentCartId = null;
  renderCart();
}

/**
 * Render the cart HTML inside #cart-items.
 * - This function also enables/disables the Checkout & Update buttons
 *   based on whether there is a token (checked by existence of #checkoutBtn)
 *   and whether there is a current cart id.
 *
 * Notes:
 * - We access DOM elements directly inside the module for simple encapsulation.
 * - main.js still controls token & triggers API calls.
 */
export function renderCart() {
  const container = document.getElementById("cart-items");
  if (!container) return; // defensive: DOM may not be ready

  container.innerHTML = ""; // clear existing content

  if (cart.length === 0) {
    container.innerHTML = "<em>Cart is empty</em>";
  } else {
    // render each cart item: image + title + qty + remove button
    cart.forEach((item, index) => {
      const prod = products.find(p => p.id === item.productId) || { title: "Unknown", price: 0, image: "" };
      const div = document.createElement("div");
      div.className = "card";
      div.style.display = "flex";
      div.style.alignItems = "center";
      div.style.justifyContent = "space-between";
      div.style.gap = "8px";

      // left: thumbnail + title (compact)
      const left = document.createElement("div");
      left.style.display = "flex";
      left.style.alignItems = "center";
      left.style.gap = "10px";
      const img = document.createElement("img");
      img.src = prod.image;
      img.alt = prod.title;
      img.style.width = "60px";
      left.appendChild(img);

      const title = document.createElement("div");
      title.innerHTML = `<strong style="font-size:90%">${prod.title}</strong><br><small>$${prod.price} × ${item.quantity}</small>`;
      left.appendChild(title);

      div.appendChild(left);

      // right: remove button
      const btn = document.createElement("button");
      btn.textContent = "Remove";
      btn.className = "danger";
      btn.addEventListener("click", () => removeFromCart(index));
      div.appendChild(btn);

      container.appendChild(div);
    });
  }

  // Toggle Checkout & Update buttons based on DOM state & cart
  const checkoutBtn = document.getElementById("checkoutBtn");
  const updateCartBtn = document.getElementById("updateCartBtn");

  // If the buttons exist, enable checkout when cart has items.
  if (checkoutBtn) checkoutBtn.disabled = cart.length === 0;
  // Update button only enabled if we have a currentCartId (it means POST was done).
  if (updateCartBtn) updateCartBtn.disabled = cart.length === 0 || !currentCartId;
}
