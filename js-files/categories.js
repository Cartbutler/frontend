document.addEventListener("DOMContentLoaded", async () => {
    const categoryContainer = document.getElementById("category-container");

    // Show loading message
    categoryContainer.innerHTML = `<p>Loading categories...</p>`;

    try {
        // Fetch categories from API
        const categories = await fetchCategories();

        // Clear loading message
        categoryContainer.innerHTML = "";

        if (!categories || categories.length === 0) {
            categoryContainer.innerHTML = `<p>No categories available.</p>`;
            return;
        }

        // Dynamically create clickable category elements with images
        categories.forEach(category => {
            const categoryCard = document.createElement("div");
            categoryCard.classList.add("col-md-4", "mb-4");

            let imageUrl = isValidUrl(category.image_path) 
                ? category.image_path 
                : "https://storage.googleapis.com/southern-shard-449119-d4.appspot.com/default.png";

            categoryCard.innerHTML = `
                <div class="card">
                    <a href="search-results.html?category=${encodeURIComponent(category.category_name)}&category_id=${category.category_id}" class="market-card">
                        <img src="${imageUrl}" class="card-img-top category-image" alt="${category.category_name}" 
                             onerror="this.onerror=null; this.src='https://storage.googleapis.com/southern-shard-449119-d4.appspot.com/default.png';">
                        <div class="card-body">
                            <h5 class="card-title">${category.category_name}</h5>
                        </div>
                    </a>
                </div>
            `;

            categoryContainer.appendChild(categoryCard);
        });

    } catch (error) {
        console.error("Error loading categories:", error);
        categoryContainer.innerHTML = `<p>Failed to load categories. Please try again later.</p>`;
    }
});

/**
 * Validates if a given string is a valid URL and ensures it uses the base URL.
 * @param {string} urlString - The URL string to validate.
 * @returns {string} - The validated URL.
 */
function isValidUrl(urlString) {
    const baseUrl = "https://storage.googleapis.com/";
    try {
        const url = new URL(urlString);
        return url.href.startsWith(baseUrl) ? url.href : `${baseUrl}${urlString}`;
    } catch (error) {
        return `${baseUrl}${urlString}`;
    }
}