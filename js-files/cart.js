import {debounce, getOrCreateUserId, getCurrentQuantity, updateCartIcon, loadCartSidebar, formatPrice} from './utils.js';
import {fetchCartItems, updateCartItem, removeCartItem, addToCart} from './network.js';

const API_BASE_URL = "https://cartbutler.duckdns.org/api";
let cartSidebarLoaded = false;
let cart_items = []; // Store data locally
const quantityTrackers = {}; // Track debounce per product ID

// Add item to cart
async function addToCartHandler(product_id) {
  const user_id = getOrCreateUserId();
  if (!user_id) {
    console.error("addToCart: No user ID found.");
    return;
  }
  console.log("Adding to cart:", { user_id, product_id });
  try {
    cart_items = await addToCart(user_id, product_id, 1);
    updateCartUI(); // Function to update UI without fetching
    updateCartIcon(cart_items);
    openSidebar();
  } catch (error) {
    console.error("Error adding to cart:", error.message);
  }
}

// Remove cart item
async function removeCartItemHandler(product_id) {
  const user_id = getOrCreateUserId();
  if (!user_id) {
    console.error("removeCartItem: No user ID found.");
    return;
  }
  console.log("Removing item from cart:", { user_id, product_id });
  try {
    cart_items = await removeCartItem(user_id, product_id);
    updateCartUI();
    updateCartIcon(cart_items);
  } catch (error) {
    console.error("Error removing cart item:", error.message);
  }
}

export function updateCartUI() {
  const badge = document.getElementById("cart-count");
  const container = document.getElementById("cart-items");
  if (!container) return;
  const totalItems = cart_items.reduce((acc, item) => acc + item.quantity, 0);
  if (badge) {
    badge.textContent = totalItems;
    badge.classList.toggle("d-none", totalItems === 0);
  }

  container.innerHTML = cart_items.length ? "" : "<p>Your cart is empty.</p>";
  cart_items.forEach(item => {
    const product = item.products || item;
    let minPrice = null;
    let maxPrice = null;
    if (Array.isArray(product.product_store) && product.product_store.length > 0) {
      const prices = product.product_store.map(store => store.price);
      minPrice = Math.min(...prices);
      maxPrice = Math.max(...prices);
    }
    const priceDisplay = formatPrice(product);

    container.insertAdjacentHTML("beforeend", `
      <div class="cart-item">
        <img src="${product.image_path}" class="cart-item-img">
        <div class="cart-item-details">
          <h6>${product.product_name}</h6>
          <p>${priceDisplay}</p>
          <div class="quantity-controls">
            <button class="decrease-qty btn btn-sm btn-outline-secondary" data-id="${item.product_id}">-</button>
            <span data-id="${item.product_id}">${(typeof item.quantity === 'number' && item.quantity >= 0) ? item.quantity : 0}</span>
            <button class="increase-qty btn btn-sm btn-outline-secondary" data-id="${item.product_id}">+</button>
          </div>
          <button class="remove-item btn btn-danger btn-sm" data-id="${item.product_id}">Remove</button>
        </div>
      </div>
    `);
  });
  attachCartItemEvents();
}

// Event handlers for cart items
function attachCartItemEvents() {
  document.querySelectorAll(".increase-qty").forEach(button => {
    button.addEventListener("click", (e) => {
      const id = e.target.dataset.id;
      updateLocalQuantity(id, 1);
    });
  });

  document.querySelectorAll(".decrease-qty").forEach(button => {
    button.addEventListener("click", (e) => {
      const id = e.target.dataset.id;
      updateLocalQuantity(id, -1);
    });
  });

  document.querySelectorAll(".remove-item").forEach(button => {
    button.addEventListener("click", (e) => {
      const id = e.target.dataset.id;
      removeCartItemHandler(id);
    });
  });

  document.querySelectorAll(".add-to-cart-btn").forEach(button => {
    button.addEventListener("click", async (e) => {
      const product_id = e.target.dataset.product_id;
      if (!product_id) return;
      await addToCartHandler(product_id);
    });
  });
}

function updateLocalQuantity(product_id, delta) {
  const span = document.querySelector(`.quantity-controls span[data-id="${product_id}"]`);
  if (span) {
    const current = parseInt(span.textContent, 10) || 0;
    span.textContent = Math.max(0, current + delta);
  }

  if (!quantityTrackers[product_id]) {
    quantityTrackers[product_id] = { delta: 0, timer: null };
  }

  quantityTrackers[product_id].delta += delta;

  clearTimeout(quantityTrackers[product_id].timer);
  quantityTrackers[product_id].timer = setTimeout(async () => {
    const change = quantityTrackers[product_id].delta;
    delete quantityTrackers[product_id];

    const user_id = getOrCreateUserId();
    const currentQty = getCurrentQuantity(product_id);
    const newQuantity = currentQty;

    if (newQuantity <= 0) {
      cart_items = await removeCartItem(user_id, product_id);
    } else {
      cart_items = await updateCartItem(user_id, product_id, newQuantity);
    }

    updateCartUI();
    updateCartIcon(cart_items);
  }, 500);
}

export function openSidebar() {
    const sidebar = document.getElementById("cart-sidebar");
    if (sidebar) {
        sidebar.style.display = "block"; 
        sidebar.classList.add("open");
    }
}

export function closeSidebar() {
    const sidebar = document.getElementById("cart-sidebar");
    if (sidebar) {
        sidebar.classList.remove("open");
        sidebar.style.display = "none"; // hide sidebar
    }
}

function initializeSidebarEvents() {
    document.getElementById("close-cart")?.addEventListener("click", closeSidebar);
    document.getElementById("go-to-cart")?.addEventListener("click", () => {
        location.href = `cart.html?user_id=${getOrCreateUserId()}`;
    });
    attachCartItemEvents();
}

async function initializeBuyButtonEvent() {
    const buyBtn = document.getElementById("buy-button");
    if (buyBtn) {
        buyBtn.addEventListener("click", async () => {
            const product_id = buyBtn.dataset.product_id;
            if (!product_id) return;
            await addToCartHandler(product_id);
        });
    }
}

// Cart icon event
function initializeCartIconEvent() {
    const cartIconBtn = document.getElementById("cart-btn");
    if (cartIconBtn) {
        cartIconBtn.addEventListener("click", () => {
            location.href = `cart.html?user_id=${getOrCreateUserId()}`;
        });
    }
}

document.addEventListener("DOMContentLoaded", async function () {
  await loadCartSidebar();
  initializeSidebarEvents();
  const user_id = getOrCreateUserId();
  cart_items = await fetchCartItems(user_id);
  updateCartUI();
  updateCartIcon(cart_items);
  initializeCartIconEvent();
  initializeBuyButtonEvent();
});