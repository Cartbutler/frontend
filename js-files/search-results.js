document.addEventListener("DOMContentLoaded", async () => {
    const searchResultsContainer = document.getElementById("search-results");
    const noResultsMessage = document.getElementById("no-results");
    const categoryTitle = document.getElementById("category-title");

    // Get query parameters from the URL (?query=banana OR ?category=Fruits&category_id=1)
    const urlParams = new URLSearchParams(window.location.search);
    const searchTerm = urlParams.get("query");
    const category = urlParams.get("category"); // Category name for display
    const categoryId = urlParams.get("category_id"); // Category ID for fetching data

    let results = [];

    // Display loading message
    searchResultsContainer.innerHTML = "<p>Loading results...</p>";

    try {
        const pageTitle = document.getElementById("page-title");
    
        if (categoryId) {
            console.log(`Fetching products for category ID: ${categoryId}`);
    
            if (category && pageTitle) {
                pageTitle.textContent = category; // Show only category name
            }
    
            results = await fetchProductsByCategory(categoryId);
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
                    <p class="price">$${parseFloat(product.price || 0).toFixed(2)}</p>
                </div>
            `;

            productCard.addEventListener("click", () => {
                alert(`Clicked on ${product.product_name}`);
            });

            searchResultsContainer.appendChild(productCard);
        });

    } catch (error) {
        console.error("Error fetching search results:", error);
        noResultsMessage.style.display = "block";
        searchResultsContainer.innerHTML = "<p>Failed to load search results. Please try again later.</p>";
    }
});
