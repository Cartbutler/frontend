
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
    
      if (typeof applyLocalization === "function") {
        applyLocalization();
      }

  } catch (error) {
      console.error("Sidebar loading error:", error);
  }
}

// Reusable function to format price
export function formatPrice(product) {
  if (!product) return "Price unavailable";

  const min = product.min_price;
  const max = product.max_price;
  const price = product.price;

  if (typeof min === 'number' && typeof max === 'number') {
    return `$${min.toFixed(2)} - $${max.toFixed(2)}`;
  }

  if (Array.isArray(product.product_store) && product.product_store.length > 0) {
    const prices = product.product_store.map(p => p.price);
    const fallbackMin = Math.min(...prices);
    const fallbackMax = Math.max(...prices);
    return `$${fallbackMin.toFixed(2)} - $${fallbackMax.toFixed(2)}`;
  }

  if (typeof price === 'number') {
      return `$${price.toFixed(2)}`;
  }

  return "Price unavailable";
}

export function getBackendLanguageId() {
  const lang = localStorage.getItem("preferred-language") || "en";
  if (lang === "pt") return "pt-BR";
  if (lang === "en") return "en-US";
  return "en-US"; // fallback seguro
}