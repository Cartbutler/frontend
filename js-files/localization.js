// js-files/localization.js

window.applyLocalization = async function (lang = null) { // permite parâmetro opcional
    lang = lang || getPreferredLanguage(); // Usa o lang informado ou pega do localStorage
    const translations = await loadTranslations(lang);
    if (!translations) return;
  
    // data-i18n → texto interno
    document.querySelectorAll("[data-i18n]").forEach((el) => {
      const key = el.getAttribute("data-i18n");
      if (translations[key]) el.textContent = translations[key];
    });
  
    // data-i18n-placeholder → placeholder de input
    document.querySelectorAll("[data-i18n-placeholder]").forEach((el) => {
      const key = el.getAttribute("data-i18n-placeholder");
      if (translations[key]) el.setAttribute("placeholder", translations[key]);
    });
  };
  
  function getPreferredLanguage() {
    return localStorage.getItem("preferred-language") || "en";
  }
  
  window.setPreferredLanguage = function (lang) {
    const currentLang = getPreferredLanguage();
    if (lang !== currentLang) {
      localStorage.setItem("preferred-language", lang);
      location.reload();
    }
  };
  
  async function loadTranslations(lang) {
    try {
      const response = await fetch(`language/${lang}.json`);
      if (!response.ok) throw new Error("Failed to load translation file");
      return await response.json();
    } catch (err) {
      console.error("Translation error:", err.message);
      return null;
    }
  }