import { fetchProductById } from './api_service.js';
import { getBackendLanguageId } from "./utils.js"; // ✅ Importa idioma

// Fetch product details by ID
async function fetchProductById(product_id) {
    const language_id = getBackendLanguageId(); // ✅ Usa o idioma
    try {
        const response = await fetch(`${API_BASE_URL}/product?id=${product_id}&language_id=${language_id}`);

        if (!response.ok) throw new Error(`Error fetching product. Status: ${response.status}`);

        return await response.json();
    } catch (error) {
        console.error("Error fetching product:", error);
        return null;
    }
}

// Load product details
document.addEventListener("DOMContentLoaded", async () => {
    const productContainer = document.getElementById("product-container");
    const productImage = document.getElementById("product-image");
    const product_name = document.getElementById("product-name");
    const productPrice = document.getElementById("product-price");
    const productDescription = document.getElementById("product-description");
    const buyButton = document.getElementById("buy-button");

    // Get the product ID from the URL parameters (e.g., ?id=1)
    const urlParams = new URLSearchParams(window.location.search);
    const product_id = urlParams.get("id");

    // Check if the product ID is present
    if (!product_id) {
        console.error("Product ID not found in URL parameters!");
        return;
    }

    // Fetch the product details from the API based on the ID
    try {
        const product = await fetchProductById(product_id);

        if (!product) {
            console.error("No product data received!");
            productContainer.innerHTML = "<p>Product details not available.</p>";
            return;
        }

        console.log("Product found:", product); // Log the product details for debugging

        // Now correctly assigns the image
        productImage.src = product.image_path;
        productImage.alt = product.product_name || "Product Image";

        // Updates the texts
        product_name.textContent = product.product_name || "Unknown Product";
        if (product.stores && product.stores.length > 0) {
            const minPrice = product.min_price;
            const maxPrice = product.max_price;

            productPrice.textContent = (minPrice === maxPrice)
                ? `$${minPrice.toFixed(2)}`
                : `$${minPrice.toFixed(2)} - $${maxPrice.toFixed(2)}`;
        } else {
            productPrice.textContent = "Price unavailable";
        }
        productDescription.textContent = product.description || "Description not available";

        // Get the store container
        const productStoreContainer = document.getElementById("store-list");

        // Check if there are stores available
        if (product.stores && product.stores.length > 0) {
            // Create a list of stores dynamically
            const storeList = product.stores.map(store => `
                <div class="store-item">
                    <h5>${store.store_name}</h5>
                    <p><strong>Location:</strong> ${store.store_location || "Not available"}</p>
                    <p><strong>Price:</strong> <span style="color: var(--on-background);">$${store.price ? store.price.toFixed(2) : "Not available"}</span></p>
                    <p><strong>Stock:</strong> ${store.stock} available</p>
                </div>
            `).join("");

            // Insert into the HTML
            productStoreContainer.innerHTML = storeList;
        } else {
            productStoreContainer.innerHTML = "<p>No stores available for this product.</p>";
        }

        // Store the product ID inside the "Add to Cart" button
        if (product && product.product_id) {
            buyButton.dataset.product_id = product.product_id;
            console.log(" Product ID stored:", buyButton.dataset.product_id);
        } else {
            console.error(" Error: Product ID not found!");
        }

    } catch (error) {
        console.error("Error fetching product details:", error);
        productContainer.innerHTML = "<p>Failed to load product details. Please try again later.</p>";
    }

    // Ensure search functionality works the same as in index.html
    document.getElementById("search-form").addEventListener("submit", function (event) {
        event.preventDefault();
        let query = document.getElementById("search-input").value.trim();

        if (!query) return;

        window.location.href = `search-results.html?query=${encodeURIComponent(query)}`;
    });

    // Open Sidebar on "Add to cart" button click
    buyButton.addEventListener("click", () => {
        const sidebar = document.getElementById("cart-sidebar");

        // Logic to add product to the cart...
        const productId = buyButton.dataset.product_id;
        if (productId) {
            addToCart(productId);
        }

        // Open the sidebar
        if (sidebar) {
            sidebar.classList.add("open");

            // Apply localization after opening the sidebar
            if (typeof applyLocalization === 'function') {
                applyLocalization();
            }
        } else {
            console.error("❌ Sidebar not found");
        }
    });
});