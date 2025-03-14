document.addEventListener("DOMContentLoaded", function () {
    // Create or retrieve a user ID and store it in localStorage
    function getOrCreateUserId() {
        let userId = localStorage.getItem("userId") || 
            document.cookie.split('; ').find(row => row.startsWith('userId='))?.split('=')[1];

        if (!userId) {
            userId = crypto.randomUUID(); // Create a new user ID using crypto.randomUUID()
            localStorage.setItem("userId", userId);
            document.cookie = `userId=${userId}; path=/; SameSite=Lax`;
            console.log("Generated new userId:", userId);
        } else {
            console.log("Existing userId found:", userId);
        }

        return userId;
    }

    // Run automatically on page load
    getOrCreateUserId();
});

// Cart functions on cart.html
document.addEventListener("DOMContentLoaded", function () {
    const API_BASE_URL = "https://southern-shard-449119-d4.nn.r.appspot.com";
    let cartSidebarLoaded = false;

    async function loadCartSidebar() {
        if (cartSidebarLoaded) return;
        try {
            const res = await fetch("cart-sidebar.html");
            const html = await res.text();
            document.body.insertAdjacentHTML("beforeend", html);
            
            const sidebar = document.getElementById("cart-sidebar");
            if(sidebar) sidebar.style.display = "none"; // Keep sidebar hidden
    
            initializeSidebarEvents();
            cartSidebarLoaded = true;
            await updateCart();
        } catch (error) {
            console.error("Error loading sidebar:", error);
        }
    }

    // Get user ID from localStorage or cookies
    function getUserId() {
        return localStorage.getItem("userId") || 
            document.cookie.split('; ').find(row => row.startsWith('userId='))?.split('=')[1];
    }

    // Fetch cart items
    async function fetchCartItems() {
        const userId = getUserId();
        if (!userId) return [];

        const res = await fetch(`${API_BASE_URL}/cart?userId=${userId}`);
        if (!res.ok) {
            console.error("Failed fetching cart items:", res.status);
            return [];
        }

        const data = await res.json();
        return data.cartItems || [];
    }

    // Add product to cart
    async function addToCart(product) {
        const userId = getUserId();
        if (!userId) {
            console.error("No user ID found.");
            return;
        }

        await fetch(`${API_BASE_URL}/cart`, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({ userId, productId: Number(product.id), quantity: 1 })
        });

        await loadCartSidebar();
        await updateCart();
        openSidebar();  // Show cart sidebar after adding items to cart
    }

    // Update cart item quantity
    async function updateCartItem(productId, quantityChange) {
        const userId = getUserId();
        await fetch(`${API_BASE_URL}/cart`, {
            method: "PUT",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({ userId, productId, quantityChange })
        });
        await updateCart();
    }

    // Remove cart item
    async function removeCartItem(productId) {
        const userId = getUserId();
        await fetch(`${API_BASE_URL}/cart`, {
            method: "DELETE",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({ userId, productId })
        });
        await updateCart();
    }

    // Update cart
    async function updateCart() {
        const items = await fetchCartItems();
        const badge = document.getElementById("cart-count");
        const container = document.getElementById("cart-items");

        const totalItems = items.reduce((acc, item) => acc + item.quantity, 0);

        if (badge) {
            badge.textContent = totalItems;
            badge.classList.toggle("d-none", totalItems === 0);
        }

        if (container) {
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
        }
    }

    // Open cart sidebar
    function openSidebar() {
        const sidebar = document.getElementById("cart-sidebar");
        if (sidebar) {
            sidebar.style.display = "block"; 
            sidebar.classList.add("open");
        }
    }

    // Close cart sidebar
    function closeSidebar() {
        const sidebar = document.getElementById("cart-sidebar");
        if (sidebar) {
            sidebar.classList.remove("open");
            sidebar.style.display = "none"; // hide sidebar
        }
    }

    // Initialize sidebar events
    function initializeSidebarEvents() {
        document.getElementById("close-cart")?.addEventListener("click", closeSidebar);
        
        document.getElementById("go-to-cart")?.addEventListener("click", () => {
            const userId = getUserId();
            location.href = `cart.html?userId=${userId}`;
        });

        document.getElementById("cart-items")?.addEventListener("click", (e) => {
            const id = e.target.dataset.id;
            if (e.target.matches(".increase-qty")) updateCartItem(id, 1);
            if (e.target.matches(".decrease-qty")) updateCartItem(id, -1);
            if (e.target.matches(".remove-item")) removeCartItem(id);
        });
    }

    // Initialize buy button event
    async function initializeBuyButtonEvent() {
        const buyBtn = document.getElementById("buy-button");
        if (buyBtn) {
            buyBtn.addEventListener("click", async () => {
                const product = {
                    id: buyBtn.dataset.productId
                };
                await addToCart(product);
            });
        }
    }

    // Cart icon event
    function initializeCartIconEvent() {
        const cartIconBtn = document.getElementById("cart-btn");
        if (cartIconBtn) {
            cartIconBtn.addEventListener("click", () => {
                const userId = getUserId();
                location.href = `cart.html?userId=${userId}`;
            });
        }
    }

    // Initialization function to be called on page load
    (async function init() {
        await loadCartSidebar();
        await updateCart();
        initializeCartIconEvent();
        initializeBuyButtonEvent();  // Ensure event after sidebar loaded
    })();
});