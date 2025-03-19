document.addEventListener("DOMContentLoaded", async () => {
    const API_BASE_URL = "https://southern-shard-449119-d4.nn.r.appspot.com";

    // Get user ID from localStorage or cookies
    function getUserId() {
        return localStorage.getItem("userId") ||
            document.cookie.split('; ').find(row => row.startsWith('userId='))?.split('=')[1];
    }

    // Fetch cart items
    async function fetchCartItems() {
        const userId = getOrCreateUserId(); // Get or create user ID
        if (!userId) return [];

        const res = await fetch(`${API_BASE_URL}/cart?userId=${userId}`);
        if (!res.ok) {
            console.error("Failed fetching cart items:", res.status);
            return [];
        }

        const data = await res.json();
        return data.cartItems || [];
    }

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

    // Automatically run on load cart.html
    document.addEventListener("DOMContentLoaded", loadCartSidebar);
    document.addEventListener("DOMContentLoaded", loadCartItemsOnCartPage);

    // Cart sidebar functions
    async function loadCartSidebar() {
        try {
            const res = await fetch("cart-sidebar.html");
            const html = await res.text();
            document.body.insertAdjacentHTML("beforeend", html);
        } catch (error) {
            console.error("Sidebar loading error:", error);
        }
    }

    // Cart items functions
    async function loadCartItemsOnCartPage() {
        await loadCartSidebar();
        loadCartItemsEvents();
        loadCartItemsData();
    }

    // Cart items events
    function loadCartItemsEvents() {
        document.getElementById("cart-items").onclick = (e) => {
            const id = e.target.dataset.id;
            if (e.target.matches(".increase-qty")) updateCartItem(id, 1);
            if (e.target.matches(".decrease-qty")) updateCartItem(id, -1);
            if (e.target.matches(".remove-item")) removeCartItem(id);
        };
    }

    // Cart items data
    async function loadCartItemsData() {
        await fetchCartItems().then(items => {
            const container = document.getElementById("cart-items");
            const emptyMessage = document.getElementById("cart-empty-message");
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
                    </div>
                `);
            });

            emptyMessage.style.display = items.length ? "none" : "block"; 
        });
    }
});
