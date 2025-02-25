document.addEventListener("DOMContentLoaded", () => {
    fetch("cart.html")
        .then(response => response.text())
        .then(html => {
            console.log("✅ Cart HTML Loaded:", html); 
            document.body.insertAdjacentHTML("beforeend", html); 

            // 🔥 Agora que o HTML do carrinho foi carregado, carregamos o cart.js
            const script = document.createElement("script");
            script.src = "js-files/cart.js";  
            document.body.appendChild(script);
        })
        .catch(error => console.error("❌ Error loading cart:", error));
});