document.addEventListener("DOMContentLoaded", async () => {
    const shoppingResultsContainer = document.getElementById("shopping-results");
    const noResultsMessage = document.getElementById("no-results-message");
    const cartButton = document.getElementById("cart-btn");

    // Redirect to the cart when clicking the cart icon
    if (cartButton) {
        cartButton.addEventListener("click", () => {
            window.location.href = "cart.html";
        });
    }

    try {
        // Simulated data until the backend is ready (remove when the BE is ready)
        const shoppingResults = await fetchShoppingResults(); 

        if (!shoppingResults || shoppingResults.length === 0) {
            noResultsMessage.style.display = "block"; // Displays "No results" message
            return;
        }

        // Hide the "No results" message
        noResultsMessage.style.display = "none";

        // Define the correct ranking labels
        const rankingLabels = ["1º", "2º", "3º"];

        // Render the results
        shoppingResultsContainer.innerHTML = shoppingResults.map((store, index) => `
            <div class="store-result card shadow-sm p-3 mb-3">
                <h4 class="store-name">
                    ${index === 0 ? '🏆' : ''} ${rankingLabels[index]} ${store.store_name}
                </h4>
                <p><strong>Location:</strong> ${store.location || "Not available"}</p>
                <p><strong>Total Price:</strong> $${store.total_price.toFixed(2)}</p>
            </div>
        `).join("");

    } catch (error) {
        console.error(" Error fetching shopping results:", error);
        shoppingResultsContainer.innerHTML = `<p class="text-danger">Failed to load shopping results. Please try again.</p>`;
    }
});

// Just to simulate a backend response - remove when the BE is ready
// Simulated function that will return price comparison results between stores
async function fetchShoppingResults() {
    return [
        { store_name: "Walmart", location: "Toronto, ON", total_price: 45.99 },
        { store_name: "Sobeys", location: "Mississauga, ON", total_price: 50.25 },
        { store_name: "No Frills", location: "Brampton, ON", total_price: 55.10 }
    ];
}