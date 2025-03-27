
/**
 * Debounce function to limit API requests.
 * Ensures that the function is executed only after a delay.
 * @param {Function} func - The function to debounce.
 * @param {number} delay - The delay in milliseconds.
 * @returns {Function} - Debounced function.
 */
export function debounce(func, delay) {
    let timer;
    return (...args) => {
        clearTimeout(timer);
        timer = setTimeout(() => func(...args), delay);
    };
}

// Reuseable function to update cart item 
export async function updateCartItem(user_id, product_id, quantity) {
    const API_BASE_URL = "https://southern-shard-449119-d4.nn.r.appspot.com";
    try {
      const res = await fetch(`${API_BASE_URL}/cart`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: String(user_id),
          product_id: Number(product_id),
          quantity: Number(quantity)
        })
      });
  
      if (!res.ok) {
        const errorDetails = await res.text();
        throw new Error(`HTTP error ${res.status}: ${errorDetails}`);
      }
  
      const data = await res.json();
      return data.cart_items || [];
  
    } catch (error) {
      console.error("Error updating cart item:", error.message);
      return [];
    }
  }

  // Reuseable function to remove cart item
  export async function removeCartItem(user_id, product_id) {
    const API_BASE_URL = "https://southern-shard-449119-d4.nn.r.appspot.com";
    try {
      const res = await fetch(`${API_BASE_URL}/cart`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: String(user_id),
          product_id: Number(product_id),
          quantity: 0
        })
      });
  
      if (!res.ok) {
        const errorDetails = await res.text();
        throw new Error(`HTTP error ${res.status}: ${errorDetails}`);
      }
  
      const data = await res.json();
      return data.cart_items || [];
    } catch (error) {
      console.error("Error removing cart item:", error.message);
      return [];
    }
  }

  // Reusable function to add item to cart
export async function addToCart(user_id, product_id, quantity = 1) {
    const API_BASE_URL = "https://southern-shard-449119-d4.nn.r.appspot.com";
    try {
      const res = await fetch(`${API_BASE_URL}/cart`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: String(user_id),
          product_id: Number(product_id),
          quantity: Number(quantity)
        })
      });
  
      if (!res.ok) {
        const errorDetails = await res.text();
        throw new Error(`HTTP error ${res.status}: ${errorDetails}`);
      }
  
      const data = await res.json();
      return data.cart_items || [];
    } catch (error) {
      console.error("Error adding item to cart:", error.message);
      return [];
    }
  }

  // Reusable function to update cart badge
  export async function updateCartCountBadge() {
    const userId = localStorage.getItem("user_id") || 
        document.cookie.split('; ').find(row => row.startsWith('user_id='))?.split('=')[1];

    if (!userId) return;

    const badge = document.getElementById("cart-count");
    if (!badge) return;

    try {
        const res = await fetch(`https://southern-shard-449119-d4.nn.r.appspot.com/cart?user_id=${userId}`);
        if (!res.ok) return;

        const data = await res.json();
        const cartItems = data.cart_items || [];

        const totalItems = cartItems.reduce((acc, item) => acc + (item.quantity || 0), 0);
        badge.textContent = totalItems;
        badge.classList.toggle("d-none", totalItems === 0);
    } catch (error) {
        console.error("Failed to update cart badge:", error);
    }
}

// Reusable function to get or create user ID
export function getOrCreateUserId() {
  let user_id = localStorage.getItem("user_id") ||
      document.cookie.split('; ').find(row => row.startsWith('user_id='))?.split('=')[1];
  if (!user_id) {
      user_id = crypto.randomUUID();
      localStorage.setItem("user_id", user_id);
      document.cookie = `user_id=${user_id}; path=/; SameSite=Lax`;
  }
  return user_id;
}

// Reusable function to fetch cart items
export async function fetchCartItems(user_id) {
  const API_BASE_URL = "https://southern-shard-449119-d4.nn.r.appspot.com";
  try {
      const res = await fetch(`${API_BASE_URL}/cart?user_id=${user_id}`);
      if (!res.ok) throw new Error(`Failed fetching cart items: ${res.status}`);
      const data = await res.json();
      return data.cart_items || [];
  } catch (error) {
      console.error("Error fetching cart items:", error.message);
      return [];
  }
}

// Reusable function to get current quantity
export function getCurrentQuantity(productId) {
  const quantityElement = document.querySelector(`.quantity-controls span[data-id="${productId}"]`);
  return quantityElement ? parseInt(quantityElement.textContent, 10) || 0 : 0;
}

// Reusable function to update cart icon
export function updateCartIcon(items = []) {
  if (!Array.isArray(items)) return;
  const totalItems = items.reduce((acc, item) => {
      const qty = typeof item.quantity === 'number' && !isNaN(item.quantity) ? item.quantity : 0;
      return acc + qty;
  }, 0);
  const badge = document.getElementById("cart-count");
  if (badge) {
      badge.textContent = totalItems;
      badge.classList.toggle("d-none", totalItems === 0);
  }
}

// Reusable function to load cart sidebar
export async function loadCartSidebar() {
  try {
      const res = await fetch("cart-sidebar.html");
      const html = await res.text();
      document.body.insertAdjacentHTML("beforeend", html);
  } catch (error) {
      console.error("Sidebar loading error:", error);
  }
}