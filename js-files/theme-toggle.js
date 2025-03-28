document.addEventListener("DOMContentLoaded", function () {
    const themeToggleContainer = document.querySelector(".theme-toggle-container");

    // Inject the theme toggle button
    themeToggleContainer.innerHTML = `
        <button id="theme-toggle" class="theme-toggle" title="Toggle theme">
            <svg class="theme-icon" width="24" height="24" viewBox="0 0 24 24">
                <circle class="sun" cx="12" cy="12" r="6" fill="currentColor"></circle>
                <g class="sun-beams" stroke="currentColor">
                    <line x1="12" y1="1" x2="12" y2="3" />
                    <line x1="12" y1="21" x2="12" y2="23" />
                    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                    <line x1="1" y1="12" x2="3" y2="12" />
                    <line x1="21" y1="12" x2="23" y2="12" />
                    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
                </g>
            </svg>
        </button>
    `;

    const themeToggle = document.getElementById("theme-toggle");
    const themeStyle = document.getElementById("theme-style");

    function setTheme(theme) {
        document.documentElement.setAttribute("data-theme", theme);
        localStorage.setItem("theme", theme);

        // Force reloading the correct CSS
        if (theme === "dark") {
            themeStyle.setAttribute("href", "styledark.css?ver=" + new Date().getTime());
        } else {
            themeStyle.setAttribute("href", "stylelight.css?ver=" + new Date().getTime());
        }
    }

    // Event listener for theme toggle
    themeToggle.addEventListener("click", function () {
        const currentTheme = document.documentElement.getAttribute("data-theme");
        const newTheme = currentTheme === "dark" ? "light" : "dark";
        setTheme(newTheme);
    });

    // Apply saved theme
    const savedTheme = localStorage.getItem("theme") || "light";
    setTheme(savedTheme);
});