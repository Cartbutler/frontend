import { addToCart } from './network.js';
import { getOrCreateUserId } from './utils.js';
import { updateCartUI, openSidebar, cartDataPromise } from './cart.js';

document.addEventListener("DOMContentLoaded", async () => {
    const shoppingResultsContainer = document.getElementById("shopping-results");
    const noResultsMessage = document.getElementById("no-results-message");
    const cartButton = document.getElementById("cart-btn");
    
    // Ensure user ID is created
    const user_id = getOrCreateUserId();
    
    // Redirect to the cart when clicking the cart icon
    if (cartButton) {
        cartButton.addEventListener("click", () => {
            window.location.href = "cart.html";
        });
    }

    try {

        // Wait for cart data to be loaded from cart.js
        const cart_data = await cartDataPromise;

        if (!cart_data.cart_id) {
            throw new Error("Unable to retrieve cart_id");
        }
        
        const shoppingResults = await fetchShoppingResults(user_id, cart_data.cart_id);

        if (!shoppingResults || shoppingResults.length === 0) {
            noResultsMessage.style.display = "block"; // Displays "No results" message
            return;
        }

        // Hide the "No results" message
        noResultsMessage.style.display = "none";

        // Define the correct ranking labels
        const rankingLabels = ["1º", "2º", "3º"];

        // Render the results dynamically
        shoppingResultsContainer.innerHTML = shoppingResults.map((store, index) => `
            <div class="store-result card shadow-sm p-3 mb-3">
                <h4 class="store-name">
                    ${index === 0 ? '🏆' : ''} ${rankingLabels[index]} ${store.store_name}
                </h4>
                <p><strong>Location:</strong> ${store.location || "Not available"}</p>
                <p><strong>Total Price:</strong> $${store.total.toFixed(2)}</p>
                <button class="add-to-cart btn btn-primary btn-sm" data-product-id="${store.product_id}">
                    Add to Cart
                </button>
            </div>
        `).join("");

        // Attach event listeners for "Add to Cart"
        document.querySelectorAll(".add-to-cart").forEach(button => {
            button.addEventListener("click", async (e) => {
                const product_id = e.target.dataset.product_id;
                await addToCart(user_id, product_id);
                await updateCartUI();
                openSidebar();
            });
        });

    } catch (error) {
        console.error(" Error fetching shopping results:", error);
        shoppingResultsContainer.innerHTML = `<p class="text-danger">Failed to load shopping results. Please try again.</p>`;
    }
});

// Fetch shopping results from backend API
async function fetchShoppingResults(user_id, cart_id) {
    const API_BASE_URL = "https://cartbutler.duckdns.org/api";
    
    try {
        const params = new URLSearchParams({
            user_id: user_id,
            cart_id: cart_id
        });
        const response = await fetch(`${API_BASE_URL}/shopping-results?${params}`);
        if (!response.ok) {
            throw new Error(`Error fetching shopping results: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error("API fetch error:", error);
        return [];
    }
}