document.addEventListener("DOMContentLoaded", async () => {
    const productContainer = document.getElementById("product-container");
    const productImage = document.getElementById("product-image");
    const productName = document.getElementById("product-name");
    const productPrice = document.getElementById("product-price");
    const productDescription = document.getElementById("product-description");
    const buyButton = document.getElementById("buy-button");

    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get("id");

    if (!productId) {
        console.error(" Product ID not found in URL parameters!");
        return;
    }

    try {
        const products = await fetchProductById(productId);

        if (!products || products.length === 0) {
            console.error(" No product data received!");
            productContainer.innerHTML = "<p>Product details not available.</p>";
            return;
        }

        // Pegando apenas o primeiro item do array
        const product = products[0];

        console.log(" Produto encontrado:", product);
        console.log("🔍 Image Path do Backend:", product.image_path);

        // Verifica se a imagem é válida
        if (!product.image_path || !product.image_path.startsWith("http")) {
            console.error(" Imagem inválida recebida do backend!");
            productContainer.innerHTML = "<p>Product details not available.</p>";
            return;
        }

        //  Agora atribui a imagem corretamente
        productImage.src = product.image_path;
        productImage.alt = product.product_name || "Product Image";

        // Atualiza os textos
        productName.textContent = product.product_name || "Unknown Product";
        productPrice.textContent = product.price 
            ? `$${parseFloat(product.price).toFixed(2)}` 
            : "Price unavailable";        
        productDescription.textContent = product.description || "Description not available";

        // Evento de clique no botão
        buyButton.addEventListener("click", () => {
            alert(`Buying ${product.product_name} for $${product.price}`);
        });

    } catch (error) {
        console.error(" Error fetching product details:", error);
        productContainer.innerHTML = "<p>Failed to load product details. Please try again later.</p>";
    }
});