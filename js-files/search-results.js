import { fetchProductsByCategory, fetchSearchResults } from './api_service.js';

document.addEventListener("DOMContentLoaded", async () => {
    const searchResultsContainer = document.getElementById("search-results");
    const noResultsMessage = document.getElementById("no-results");
    const categoryTitle = document.getElementById("category-title");

    // Get query parameters from the URL (?query=banana OR ?category=Fruits&category_id=1)
    const urlParams = new URLSearchParams(window.location.search);
    const searchTerm = urlParams.get("query");
    const category = urlParams.get("category"); // Category name for display
    const category_id = urlParams.get("category_id"); // Category ID for fetching data

    let results = [];

    // Display loading message
    searchResultsContainer.innerHTML = "<p>Loading results...</p>";

    try {
        const pageTitle = document.getElementById("page-title");
    
        if (category_id) {
            console.log(`Fetching products for category ID: ${category_id}`);
    
            if (category && pageTitle) {
                pageTitle.textContent = category; // Show only category name
            }
    
            results = await fetchProductsByCategory(category_id);
        } else if (searchTerm) {
            console.log(`Searching for: ${searchTerm}`);
    
            if (pageTitle) {
                pageTitle.textContent = `Searching for "${searchTerm}"`; // Show search term
            }
    
            results = await fetchSearchResults(searchTerm);
        }

        // Clear previous content
        searchResultsContainer.innerHTML = "";

        if (!results || results.length === 0) {
            noResultsMessage.style.display = "block";
            return;
        } else {
            noResultsMessage.style.display = "none";
        }

        // Render products on the screen
        results.forEach(product => {
            const productCard = document.createElement("div");
            productCard.classList.add("card");

            let imageUrl = product.image_path && product.image_path.startsWith("http") 
                ? product.image_path 
                : `${window.location.origin}/${product.image_path || "images/default.jpg"}`;

            productCard.innerHTML = `
                <img src="${imageUrl}" class="card-img-top" alt="${product.product_name}" 
                     onerror="this.onerror=null; this.src='images/default.jpg';">
                <div class="card-body">
                    <h5 class="card-title">${product.product_name}</h5>
                    <p class="price-range">$${parseFloat(product.min_price || product.price || 0).toFixed(2)} - $${parseFloat(product.max_price || product.price || 0).toFixed(2)}
                    </p>
                </div>
            `;

            productCard.addEventListener("click", () => {
                window.location.href = `product-screen.html?id=${product.product_id}`;
            });

            searchResultsContainer.appendChild(productCard);
        });

    } catch (error) {
        console.error("Error fetching search results:", error);
        noResultsMessage.style.display = "block";
        searchResultsContainer.innerHTML = "<p>Failed to load search results. Please try again later.</p>";
    }
});