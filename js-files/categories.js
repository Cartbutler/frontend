document.addEventListener("DOMContentLoaded", async function () {
    const container = document.getElementById("category-container");

    // Show loading message
    container.innerHTML = `<p>Loading categories...</p>`;

    try {
        // Fetch categories from API
        const categories = await fetchCategories();

        // Clear loading message
        container.innerHTML = "";

        if (categories.length === 0) {
            container.innerHTML = `<p>No categories available.</p>`;
            return;
        }

        // Dynamically create clickable category elements
        categories.forEach(category => {
            const div = document.createElement("div");
            div.classList.add("col-md-2", "category-card");

            // Add category name as a link to search-results.html
            div.innerHTML = `
                <a href="search-results.html?category=${encodeURIComponent(category.category_name)}&category_id=${category.category_id}" class="market-card">
                    <h5>${category.category_name}</h5>
                </a>
            `;

            container.appendChild(div);
        });

    } catch (error) {
        console.error("Error loading categories:", error);
        container.innerHTML = `<p>Failed to load categories. Please try again later.</p>`;
    }
});