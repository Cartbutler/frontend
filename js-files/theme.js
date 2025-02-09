document.addEventListener("DOMContentLoaded", () => {
    const themeToggle = document.getElementById("theme-toggle"); // Theme toggle button
    const themeStyle = document.getElementById("theme-style"); // Theme style element
    const storageKey = "theme-preference"; // Local storage key
    const suggestionsBox = document.getElementById("suggestions"); // Suggestions box

    // Get theme preference from local storage
    function getThemePreference() {
        return localStorage.getItem(storageKey) || "dark";
    }

    // Apply theme to the page
    function applyTheme(theme) {
        themeStyle.setAttribute("href", theme === "dark" ? "styledark.css" : "stylelight.css");
        document.documentElement.dataset.theme = theme;
        themeToggle.title = theme === "dark" ? "Light mode" : "Dark mode";
    }

    // Event listener for theme toggle
    themeToggle.addEventListener("click", () => {
        const newTheme = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
        
        const suggestionsWereVisible = window.getComputedStyle(suggestionsBox).display !== "none";
        
        // Store theme preference in local storage
        localStorage.setItem(storageKey, newTheme);
        applyTheme(newTheme);

        if (suggestionsWereVisible && suggestionsBox.children.length > 0) {
            setTimeout(() => {
                suggestionsBox.style.display = "block";
            }, 100);
        }
    });

    applyTheme(getThemePreference()); // Apply theme to the page
});