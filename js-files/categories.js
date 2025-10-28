import { fetchCategories } from './api_service.js';

document.addEventListener("DOMContentLoaded", async function () {
    await applyLocalization();

    const container = document.getElementById("category-container");

    // Show loading message
    container.innerHTML = `<p data-i18n="loadingCategories">Loading categories...</p>`;

    try {
        // Fetch categories from API
        const categories = await fetchCategories();

        // Clear loading message
        container.innerHTML = "";

        if (categories.length === 0) {
            container.innerHTML = `<p data-i18n="noCategories">No categories available.</p>`;
            await applyLocalization(); // traduz string dinâmica
            return;
        }

        // Dynamically create clickable category elements
        categories.forEach(category => {
            const div = document.createElement("div");
            div.classList.add("col-md-2", "category-card", "text-center", "p-3");

            // Add category name and image as a link to search-results.html
            div.innerHTML = `
                <a href="search-results.html?category=${encodeURIComponent(category.category_name)}&category_id=${category.category_id}" class="market-card">
                    <img src="${category.image_path}" alt="${category.category_name}" class="category-image img-fluid rounded"
                        onerror="this.onerror=null; this.src='/images/fallback.jpg';">
                    <h5 class="mt-2">${category.category_name}</h5>
                </a>
            `;

            container.appendChild(div);
        });

        // Apply localization after categories are rendered
        await applyLocalization();

        console.log("Categories rendered with images:", categories);

    } catch (error) {
        console.error("Error loading categories:", error);
        container.innerHTML = `<p data-i18n="errorCategories">Failed to load categories. Please try again later.</p>`;
        await applyLocalization(); // traduz fallback message também
    }
});