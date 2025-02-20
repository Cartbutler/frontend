document.addEventListener("DOMContentLoaded", () => {
    const themeToggle = document.getElementById("theme-toggle"); 
    const themeStyle = document.getElementById("theme-style");
    const storageKey = "theme-preference";
    const suggestionsBox = document.getElementById("suggestions");

    function getThemePreference() {
        return localStorage.getItem(storageKey) || "light";
    }

    function applyTheme(theme) {
        themeStyle.setAttribute("href", theme === "dark" ? "styledark.css" : "stylelight.css");
        document.documentElement.dataset.theme = theme;

        if (themeToggle) {
            themeToggle.title = theme === "dark" ? "Light mode" : "Dark mode";
        }
    }

    
    applyTheme(getThemePreference());

    if (themeToggle) {
        themeToggle.addEventListener("click", () => {
            const newTheme = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
            const suggestionsWereVisible = suggestionsBox && window.getComputedStyle(suggestionsBox).display !== "none";

            localStorage.setItem(storageKey, newTheme);
            applyTheme(newTheme);

            if (suggestionsWereVisible && suggestionsBox && suggestionsBox.children.length > 0) {
                setTimeout(() => {
                    suggestionsBox.style.display = "block";
                }, 100);
            }
        });
    }

    const searchForm = document.getElementById("search-form");
    if (searchForm) {
        searchForm.addEventListener("submit", (event) => {
            event.preventDefault();
            applyTheme(getThemePreference());
        });
    }
});