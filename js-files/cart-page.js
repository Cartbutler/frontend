import {
    debounce, updateCartItem as updateCartItemFromUtils, removeCartItem as removeCartItemFromUtils,
    getOrCreateUserId,fetchCartItems,getCurrentQuantity,updateCartIcon,loadCartSidebar} from './utils.js';
  
  document.addEventListener("DOMContentLoaded", async () => {
      // Render cart items dynamically into the DOM
      function renderCartItems(items) {
          const container = document.getElementById("cart-items");
          const emptyMessage = document.getElementById("cart-empty-message");
          const badge = document.getElementById("cart-count");
  
          const totalItems = items.reduce((acc, item) => acc + item.quantity, 0);
  
          if (badge) {
              badge.textContent = totalItems;
              badge.classList.toggle("d-none", totalItems === 0);
          }
  
          if (!container) return;
  
          container.innerHTML = items.length ? "" : "<p>Your cart is empty.</p>";
          items.forEach(item => {
              const product = item.products || item;

                // Use min_price and max_price directly from the backend response
                let minPrice = product.min_price ?? null;
                let maxPrice = product.max_price ?? null;

                const hasRange = minPrice !== null && maxPrice !== null;
                const hasPrice = typeof product.price === "number";

                const priceDisplay = hasRange
                    ? `$${minPrice.toFixed(2)} - $${maxPrice.toFixed(2)}`
                    : hasPrice
                        ? `$${product.price.toFixed(2)}`
                        : "Price unavailable";
  
              container.insertAdjacentHTML("beforeend", `
                  <div class="cart-item col-md-4">
                      <img src="${product.image_path}" class="cart-item-img">
                      <div class="cart-item-details">
                          <h6>${product.product_name}</h6>
                          <p>${priceDisplay}</p>
                          <div class="quantity-controls">
                              <button class="decrease-qty btn btn-sm btn-outline-secondary" data-id="${item.product_id}">-</button>
                              <span data-id="${item.product_id}">${item.quantity || 0}</span>
                              <button class="increase-qty btn btn-sm btn-outline-secondary" data-id="${item.product_id}">+</button>
                          </div>
                          <button class="remove-item btn btn-danger btn-sm" data-id="${item.product_id}">Remove</button>
                      </div>
                  </div>
              `);
          });
  
          if (emptyMessage) {
              emptyMessage.style.display = items.length ? "none" : "block";
          }
  
          attachCartItemEvents();
          updateCartIcon(items);
      }
  
      // Attach events to cart item buttons
      function attachCartItemEvents() {
          const debouncedUpdate = debounce((id, quantityChange) => {
              updateCartItem(id, quantityChange);
          }, 500);
  
          document.getElementById("cart-items")?.addEventListener("click", (e) => {
              const id = e.target.dataset.id;
              if (e.target.matches(".increase-qty")) debouncedUpdate(id, 1);
              if (e.target.matches(".decrease-qty")) debouncedUpdate(id, -1);
              if (e.target.matches(".remove-item")) removeCartItem(id);
          });
      }
  
      // Update cart item with new quantity
      async function updateCartItem(productId, quantityChange) {
          const userId = getOrCreateUserId();
          if (!userId) return;
  
          const currentQuantity = getCurrentQuantity(productId);
          const newQuantity = currentQuantity + quantityChange;
  
          if (newQuantity <= 0) {
              await removeCartItem(productId);
              return;
          }
  
          const updatedItems = await updateCartItemFromUtils(userId, productId, newQuantity);
          renderCartItems(updatedItems);
      }
  
      // Remove item from cart
      async function removeCartItem(productId) {
          const userId = getOrCreateUserId();
          if (!userId) return;
  
          const updatedItems = await removeCartItemFromUtils(userId, productId);
          renderCartItems(updatedItems);
      }
  
      // Initialization function to be called on page load
      async function init() {
          await loadCartSidebar(); 
          const items = await fetchCartItems(getOrCreateUserId()); 
          renderCartItems(items);
          updateCartIcon(items); 
  
          const checkoutButton = document.getElementById("checkout-button");
          if (checkoutButton) {
              checkoutButton.addEventListener("click", async () => {
                  if (items.length > 0) {
                      window.location.href = "shopping-results.html";
                  } else {
                      alert("Your cart is empty! Add items before checking out.");
                  }
              });
          }
      }
  
      init();
  });
  