document.addEventListener("DOMContentLoaded", () => {
    const searchForm = document.getElementById("search-form");
    const searchInput = document.getElementById("search-input");

    if (!searchForm || !searchInput) {
        console.error("Search form or input not found!");
        return;
    }

    /**
     * Handles search submission (Enter key or Search button click)
     */
    searchForm.addEventListener("submit", function (event) {
        event.preventDefault(); // Prevent default form submission behavior

        const searchTerm = searchInput.value.trim();
        if (searchTerm) {
            // Redirects to search-results.html with the query in the URL
            window.location.href = `search-results.html?query=${encodeURIComponent(searchTerm)}`;
        }
    });
});