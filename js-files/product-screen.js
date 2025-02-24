document.addEventListener("DOMContentLoaded", async () => {
    const productContainer = document.getElementById("product-container");
    const productImage = document.getElementById("product-image");
    const productName = document.getElementById("product-name");
    const productPrice = document.getElementById("product-price");
    const productDescription = document.getElementById("product-description");
    const buyButton = document.getElementById("buy-button");

    // Get the product ID from the URL parameters (e.g.,?id=1)
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get("id");

    // Check if the product ID is present
    if (!productId) {
        console.error("Product ID not found in URL parameters!");
        return;
    }

    // Fetch the product details from the API based on the ID
    try {
        const product = await fetchProductById(productId);

        if (!product) {
            console.error("No product data received!");
            productContainer.innerHTML = "<p>Product details not available.</p>";
            return;
        }

        console.log("Product found:", product); // Log the product details for debugging

        // Now correctly assigns the image
        productImage.src = product.image_path;
        productImage.alt = product.product_name || "Product Image";

        // Updates the texts
        productName.textContent = product.product_name || "Unknown Product";
        productPrice.textContent = product.price 
            ? `$${parseFloat(product.price).toFixed(2)}` 
            : "Price unavailable";        
        productDescription.textContent = product.description || "Description not available";

    } catch (error) {
        console.error("Error fetching product details:", error);
        productContainer.innerHTML = "<p>Failed to load product details. Please try again later.</p>";
    }
});