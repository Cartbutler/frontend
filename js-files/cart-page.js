document.addEventListener("DOMContentLoaded", async () => {
    const API_BASE_URL = "https://southern-shard-449119-d4.nn.r.appspot.com";

    // Ensure user ID is created
    const userId = getOrCreateUserId(); // Imported from cart.js

    // Fetch cart items
    async function fetchCartItems() {
        if (!userId) return [];

        const res = await fetch(`${API_BASE_URL}/cart?userId=${userId}`);
        if (!res.ok) {
            console.error("Failed fetching cart items:", res.status);
            return [];
        }

        const data = await res.json();
        return data.cartItems || [];
    }

    // Debounce function
    function debounce(func, delay) {
        let timer;
        return (...args) => {
            clearTimeout(timer);
            timer = setTimeout(() => func(...args), delay);
        };
    }

    // Function to update cart item
    const debouncedUpdateCartItem = debounce(async (productId, quantityChange) => {
        await fetch(`${API_BASE_URL}/cart`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId, productId, quantity: quantityChange })
        });

        await loadCartItemsData();
    }, 500);

    // Function to remove cart item
    const debouncedRemoveCartItem = debounce(async (productId) => {
        await fetch(`${API_BASE_URL}/cart`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId, productId, quantity: 0 }) // Send quantity 0
        });

        await loadCartItemsData();
    }, 500);

    // Render cart items
    async function loadCartPageItems() {
        const items = await fetchCartItems();
        const container = document.getElementById("cart-items");
        const emptyMessage = document.getElementById("cart-empty-message");

        if (!container) return;

        container.innerHTML = items.length ? "" : "<p>Your cart is empty.</p>";

        items.forEach(item => {
            container.insertAdjacentHTML("beforeend", `
                <div class="cart-item">
                    <img src="${item.products.image_path}" class="cart-item-img">
                    <div class="cart-item-details">
                        <h6>${item.products.product_name}</h6>
                        <p>$${item.products.price}</p>
                        <div class="quantity-controls">
                            <button class="decrease-qty btn btn-sm btn-outline-secondary" data-id="${item.productId}">-</button>
                            <span>${item.quantity}</span>
                            <button class="increase-qty btn btn-sm btn-outline-secondary" data-id="${item.productId}">+</button>
                        </div>
                        <button class="remove-item btn btn-danger btn-sm" data-id="${item.productId}">Remove</button>
                    </div>
                </div>`);
        });

        if (emptyMessage) emptyMessage.style.display = items.length ? "none" : "block";
    }

    // Cart items events
    function loadCartItemsEvents() {
        document.getElementById("cart-items").onclick = (e) => {
            const id = e.target.dataset.id;
            if (e.target.matches(".increase-qty")) debouncedUpdateCartItem(id, 1);
            if (e.target.matches(".decrease-qty")) debouncedUpdateCartItem(id, -1);
            if (e.target.matches(".remove-item")) debouncedRemoveCartItem(id);
        };
    }

    // Cart items data
    async function loadCartItemsData() {
        await loadCartPageItems();
        loadCartItemsEvents();
    }

    // Initialize
    await loadCartItemsData();
});