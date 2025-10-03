// scripts/api.js
// Purpose: centralize every fetch call to the Fake Store API here so other modules
// can import and use these functions without copying fetch logic.

// Base API URL used by all functions below.
const API_BASE = "https://fakestoreapi.com";

/**
 * Fetch ALL products from the API.
 * - returns: Promise resolving to an array of product objects
 */
export async function fetchProducts() {
  const res = await fetch(`${API_BASE}/products`);
  if (!res.ok) throw new Error(`fetchProducts failed: ${res.status}`);
  return res.json();
}

export async function fetchCategories() {
  const res = await fetch(`${API_BASE}/products/categories`);
  return res.json(); // returns ["electronics","jewelery","men's clothing","women's clothing"]
}

/**
 * Login endpoint:
 * - Calls POST /auth/login with { username, password }
 * - FakeStore returns { token: "..." } on success
 * - returns parsed JSON (caller checks for .token)
 */
export async function login(username, password) {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password })
  });

  // Always check res.ok and surface a useful error if not
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`login failed (${res.status}): ${text}`);
  }

  // parse and return JSON. Caller expects { token } or other info.
  return res.json();
}

/**
 * Create a new cart (POST /carts)
 * - token: JWT from login (sent as Authorization header) — FakeStore may ignore it,
 *   but we include it to demonstrate typical behavior.
 * - cart: array of { productId, quantity } objects
 * - returns: created cart object from the API (includes id)
 */
export async function createCart(token, cart) {
  const res = await fetch(`${API_BASE}/carts`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": token ? `Bearer ${token}` : ""
    },
    body: JSON.stringify({
      userId: 1, // demo user id
      date: new Date().toISOString().split("T")[0],
      products: cart
    })
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`createCart failed (${res.status}): ${text}`);
  }
  return res.json();
}

/**
 * Update an existing cart (PUT /carts/:id)
 * - cartId: id returned from createCart
 * - cart: same shape as createCart's cart
 */
export async function updateCart(token, cartId, cart) {
  const res = await fetch(`${API_BASE}/carts/${cartId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "Authorization": token ? `Bearer ${token}` : ""
    },
    body: JSON.stringify({
      userId: 1,
      date: new Date().toISOString().split("T")[0],
      products: cart
    })
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`updateCart failed (${res.status}): ${text}`);
  }
  return res.json();
}
