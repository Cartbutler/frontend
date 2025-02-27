document.addEventListener("DOMContentLoaded", () => {
    fetch("cart.html")
        .then(response => response.text())
        .then(html => {
            console.log("Cart HTML Loaded:", html); 
            document.body.insertAdjacentHTML("beforeend", html); 

            
            const script = document.createElement("script");
            script.src = "js-files/cart.js";  
            document.body.appendChild(script);
        })
        .catch(error => console.error("Error loading cart:", error));
});