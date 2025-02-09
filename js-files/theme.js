document.addEventListener("DOMContentLoaded", () => {
    const themeToggle = document.getElementById("theme-toggle"); // Theme toggle button
    const themeStyle = document.getElementById("theme-style"); // Theme style element
    const storageKey = "theme-preference"; // Local storage key
    const suggestionsBox = document.getElementById("suggestions"); // Suggestions box

    // Get theme preference from local storage, default to light if not found
    function getThemePreference() {
        return localStorage.getItem(storageKey) || "light"; // Default to light theme
    }

    // Apply theme to the page
    function applyTheme(theme) {
        themeStyle.setAttribute("href", theme === "dark" ? "styledark.css" : "stylelight.css");
        document.documentElement.dataset.theme = theme;
        themeToggle.title = theme === "dark" ? "Light mode" : "Dark mode";
    }

    // Apply the saved or default theme preference (will start with the current theme from localStorage)
    applyTheme(getThemePreference());

    // Event listener for theme toggle
    themeToggle.addEventListener("click", () => {
        // Toggle between dark and light themes
        const newTheme = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
        
        const suggestionsWereVisible = window.getComputedStyle(suggestionsBox).display !== "none";
        
        // Store the new theme preference in local storage
        localStorage.setItem(storageKey, newTheme);
        // Apply the new theme to the page
        applyTheme(newTheme);

        // Reapply suggestions box visibility (if needed)
        if (suggestionsWereVisible && suggestionsBox.children.length > 0) {
            setTimeout(() => {
                suggestionsBox.style.display = "block";
            }, 100);
        }
    });

    // Ensure the theme is applied when searching or navigating between pages
    const searchForm = document.getElementById("search-form");
    if (searchForm) {
        searchForm.addEventListener("submit", (event) => {
            event.preventDefault();
            // Reapply the theme (whether dark or light) when performing a search
            applyTheme(getThemePreference());
        });
    }
});