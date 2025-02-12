document.addEventListener("DOMContentLoaded", async () => {
    const searchResultsContainer = document.getElementById("search-results");
    const noResultsMessage = document.getElementById("no-results");

    // Get the query parameter from the URL (e.g., ?query=banana)
    const urlParams = new URLSearchParams(window.location.search);
    const searchTerm = urlParams.get("query");

    if (!searchTerm) {
        console.error("No search term provided.");
        return;
    }

    // Show a loading message while fetching data
    searchResultsContainer.innerHTML = "<p>Loading results ⏳</p>";

    try {
        // Call the API to fetch search results
        const results = await fetchSearchResults(searchTerm);

        // Clear the previous content
        searchResultsContainer.innerHTML = "";

        if (!results || results.length === 0) {
            noResultsMessage.style.display = "block"; // Show "No results found" message
            return;
        } else {
            noResultsMessage.style.display = "none"; // Hide message
        }

        // Render the products on the screen
        results.forEach(product => {
            const productCard = document.createElement("div");
            productCard.classList.add("card");

            // Check and fix image path
            let imageUrl = product.image_path && product.image_path.startsWith("http") 
                ? product.image_path 
                : `${window.location.origin}/${product.image_path || "images/default.jpg"}`;

            productCard.innerHTML = `
                <img src="${imageUrl}" class="card-img-top" alt="${product.product_name}" 
                     onerror="this.onerror=null; this.src='images/default.jpg';">
                <div class="card-body">
                    <h5 class="card-title">${product.product_name}</h5>
                    <p class="card-text">${product.description}</p>
                    <p class="price">$${parseFloat(product.price || 0).toFixed(2)}</p>
                </div>
            `;

            // Add click event (Example: Redirect to product details page)
            productCard.addEventListener("click", () => {
                alert(`Clicked on ${product.product_name}`);
                // Example: window.location.href = `product-details.html?id=${product.product_id}`;
            });

            searchResultsContainer.appendChild(productCard);
        });
    } catch (error) {
        console.error("Error fetching search results:", error);
        noResultsMessage.style.display = "block";
        searchResultsContainer.innerHTML = "<p>Failed to load search results. Please try again later.</p>";
    }
});