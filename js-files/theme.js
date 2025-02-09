document.addEventListener("DOMContentLoaded", () => {
    const themeToggle = document.getElementById("theme-toggle"); // Theme toggle button
    const themeStyle = document.getElementById("theme-style"); // Theme style element
    const storageKey = "theme-preference"; // Local storage key
    const suggestionsBox = document.getElementById("suggestions"); // Suggestions box

    // Force theme to be light on initial load (regardless of localStorage)
    function getThemePreference() {
        // Always use light theme on initial load
        return "light"; // Set default to light theme, ignore localStorage here
    }

    // Apply theme to the page
    function applyTheme(theme) {
        // Set the correct CSS file based on the theme
        themeStyle.setAttribute("href", theme === "dark" ? "styledark.css" : "stylelight.css");
        // Apply theme to document element to change the dataset attribute
        document.documentElement.dataset.theme = theme;
        // Update the title of the theme toggle button
        themeToggle.title = theme === "dark" ? "Light mode" : "Dark mode";
    }

    // Apply the saved or default theme preference (always light for initial load)
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
});