document.addEventListener("DOMContentLoaded", () => {
    const searchInput = document.getElementById("search-input");
    const suggestionsBox = document.getElementById("suggestions");

    // Check if the elements exist
    if (!searchInput || !suggestionsBox) return;

    let selectedIndex = -1;
    let suggestionsList = [];

    /**
     * Updates the suggestion list UI.
     * @param {Array} suggestions - List of suggestions.
     */
    function updateSuggestionsList(suggestions) {
        suggestionsBox.innerHTML = "";
        suggestionsList = suggestions;

        if (suggestions.length === 0) {
            suggestionsBox.style.display = "none";
            return;
        }

        suggestionsBox.style.display = "block";
        selectedIndex = -1; // Reset selection

        suggestions.forEach((suggestion, index) => {
            const li = document.createElement("li");
            li.classList.add("list-group-item", "suggestions-item");
            li.textContent = suggestion.name;

            li.addEventListener("click", () => selectSuggestion(index));
            suggestionsBox.appendChild(li);
        });
    }

    /**
     * Selects a suggestion and performs a search.
     * @param {number} index - The index of the selected suggestion.
     */
    function selectSuggestion(index) {
        if (index >= 0 && index < suggestionsList.length) {
            searchInput.value = suggestionsList[index].name;
            suggestionsBox.style.display = "none";
            performSearch();
        }
    }

    /**
     * Highlights the suggestion selected by keyboard.
     */
    function highlightSuggestion() {
        const items = document.querySelectorAll(".suggestions-item");

        items.forEach((item, i) => {
            item.classList.toggle("active", i === selectedIndex);
        });

        const activeItem = document.querySelector(".suggestions-item.active");
        if (activeItem) {
            activeItem.scrollIntoView({ block: "nearest", behavior: "smooth" });
        }
    }

    /**
     * Handles input events and fetches suggestions.
     */
    searchInput.addEventListener("input", async () => {
        const searchTerm = searchInput.value.trim().toLowerCase();
        if (searchTerm === "") {
            suggestionsBox.style.display = "none";
            return;
        }

        const suggestions = await fetchSuggestions(searchTerm);
        updateSuggestionsList(suggestions);
    });

    /**
     * Handles keyboard navigation.
     */
    searchInput.addEventListener("keydown", (event) => {
        const items = document.querySelectorAll(".suggestions-item");
        if (items.length === 0) return;

        switch (event.key) {
            case "ArrowDown":
                event.preventDefault();
                selectedIndex = (selectedIndex + 1) % items.length;
                highlightSuggestion();
                break;

            case "ArrowUp":
                event.preventDefault();
                selectedIndex = (selectedIndex - 1 + items.length) % items.length;
                highlightSuggestion();
                break;

            case "Enter":
                event.preventDefault();
                if (selectedIndex >= 0) {
                    selectSuggestion(selectedIndex);
                } else {
                    performSearch();
                }
                break;

            case "Escape":
                suggestionsBox.style.display = "none";
                break;
        }
    });

    /**
     * Closes suggestions when clicking outside.
     */
    document.addEventListener("click", (event) => {
        if (!searchInput.contains(event.target) && !suggestionsBox.contains(event.target)) {
            suggestionsBox.style.display = "none";
        }
    });

    /**
     * Redirects to the search results page.
     */
    function performSearch() {
        const searchTerm = searchInput.value.trim();
        if (searchTerm) {
            window.location.href = `search-results.html?query=${searchTerm}`;
        }
    }
});