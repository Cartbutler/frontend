document.addEventListener("DOMContentLoaded", function () {
    const languageToggleContainer = document.querySelector(".language-toggle-container");

    languageToggleContainer.innerHTML = `
        <div class="dropdown">
            <button class="btn btn-outline-secondary dropdown-toggle" type="button" id="languageDropdown" data-bs-toggle="dropdown" aria-expanded="false">
                🌐 Language
            </button>
            <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="languageDropdown">
                <li><a class="dropdown-item" href="#" data-lang="en">🇺🇸 English</a></li>
                <li><a class="dropdown-item" href="#" data-lang="pt">🇧🇷 Português</a></li>
            </ul>
        </div>
    `;

    document.querySelectorAll(".dropdown-item").forEach(item => {
        item.addEventListener("click", function (e) {
            e.preventDefault();
            const selectedLang = this.getAttribute("data-lang");
            setPreferredLanguage(selectedLang);
        });
    });

    // apply saved language on page load
    const savedLang = localStorage.getItem("preferred-language") || "en";
    setPreferredLanguage(savedLang);
});