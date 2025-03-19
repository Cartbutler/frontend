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
    const API_BASE_URL = "https://southern-shard-449119-d4.nn.r.appspot.com";
    let cartSidebarLoaded = false;
    let cartItems = []; // Added to store data locally

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
        } catch (error) {
            console.error("Error loading sidebar:", error);
        }
    }

    async function fetchCartItems() {
        const userId = getOrCreateUserId();
        if (!userId) {
            console.error("fetchCartItems: No user ID found.");
            return [];
        }
        console.log("Fetching cart items for userId:", userId);
        const res = await fetch(`${API_BASE_URL}/cart?userId=${userId}`);
        if (!res.ok) {
            console.error("Failed fetching cart items:", res.status);
            return [];
        }
        const data = await res.json();
        cartItems = data.cartItems || []; // Update local state
        return cartItems;
    }

    // Debounce function to limit API requests
    function debounce(func, delay) {
        let timer;
        return (...args) => {
            clearTimeout(timer);
            timer = setTimeout(() => func(...args), delay);
        };
    }

    function getCurrentQuantity(productId) {
        const quantityElement = document.querySelector(`.quantity-controls span[data-id="${productId}"]`);
        return quantityElement ? parseInt(quantityElement.textContent, 10) || 0 : 0;
    }

    // Add item to cart
    async function addToCart(productId) {
        const userId = getOrCreateUserId();
        if (!userId) {
            console.error("addToCart: No user ID found.");
            return;
        }
        console.log("Adding to cart:", { userId, productId });
        try {
            const res = await fetch(`${API_BASE_URL}/cart`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    userId: String(userId),
                    productId: Number(productId),
                    quantity: 1
                })
            });
            if (!res.ok) {
                const errorDetails = await res.text();
                throw new Error(`HTTP error ${res.status}: ${errorDetails}`);
            }
            const data = await res.json();
            cartItems = data.cartItems || []; // update local state
            updateCartUI(); // Function to update UI without fetching
            openSidebar(); 
        } catch (error) {
            console.error("Error adding to cart:", error.message);
        }
    }

    // Update cart item quantity
    const debouncedUpdateCartItem = debounce(async (productId, quantityChange) => {
        const userId = getOrCreateUserId();
        if (!userId) {
            console.error("updateCartItem: No user ID found.");
            return;
        }
        const quantityElement = document.querySelector(`.quantity-controls span[data-id="${productId}"]`);
        if (!quantityElement) return;
        let currentQuantity = parseInt(quantityElement.textContent, 10) || 0;
        let newQuantity = currentQuantity + quantityChange;
        if (newQuantity <= 0) {
            console.warn("Quantity is zero or negative. Removing item.");
            await debouncedRemoveCartItem(productId);
            return;
        }
        try {
            const res = await fetch(`${API_BASE_URL}/cart`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    userId: String(userId),
                    productId: Number(productId),
                    quantity: newQuantity
                })
            });
            if (!res.ok) {
                const errorDetails = await res.text();
                throw new Error(`HTTP error ${res.status}: ${errorDetails}`);
            }
            const data = await res.json();
            cartItems = data.cartItems || []; // Update local state
            updateCartUI(); // update UI without fetching
        } catch (error) {
            console.error("Error updating cart item:", error.message);
            quantityElement.textContent = currentQuantity;
        }
    }, 500);

    // Remove cart item with debounce
    const debouncedRemoveCartItem = debounce(async (productId) => {
        const userId = getOrCreateUserId();
        if (!userId) {
            console.error("removeCartItem: No user ID found.");
            return;
        }
        console.log("Removing item from cart:", { userId, productId });
        try {
            const res = await fetch(`${API_BASE_URL}/cart`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId: String(userId), productId: Number(productId), quantity: 0 })
            });
            if (!res.ok) {
                const errorDetails = await res.text();
                throw new Error(`HTTP error ${res.status}: ${errorDetails}`);
            }
            const data = await res.json();
            cartItems = data.cartItems || []; // Update local state
            updateCartUI(); // Update UI without fetching
        } catch (error) {
            console.error("Error removing cart item:", error.message);
        }
    }, 500);

    // Function to update cart UI without fetching
    function updateCartUI() {
        const badge = document.getElementById("cart-count");
        const container = document.getElementById("cart-items");
        if (!container) return;
        const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);
        if (badge) {
            badge.textContent = totalItems;
            badge.classList.toggle("d-none", totalItems === 0);
        }
        container.innerHTML = cartItems.length ? "" : "<p>Your cart is empty.</p>";
        cartItems.forEach(item => {
            container.insertAdjacentHTML("beforeend", `
                <div class="cart-item">
                    <img src="${item.products.image_path}" class="cart-item-img">
                    <div class="cart-item-details">
                        <h6>${item.products.product_name}</h6>
                        <p>$${item.products.price}</p>
                        <div class="quantity-controls">
                            <button class="decrease-qty btn btn-sm btn-outline-secondary" data-id="${item.productId}">-</button>
                            <span data-id="${item.productId}">${item.quantity}</span>
                            <button class="increase-qty btn btn-sm btn-outline-secondary" data-id="${item.productId}">+</button>
                        </div>
                        <button class="remove-item btn btn-danger btn-sm" data-id="${item.productId}">Remove</button>
                    </div>
                </div>
            `);
        });
        attachCartItemEvents();
    }

    const debouncedUpdateCart = debounce(async () => {
        await updateCart();
    }, 500);

    async function updateCart() {
        cartItems = await fetchCartItems(); 
        updateCartUI(); 
    }

    // Event handlers for cart items
    function attachCartItemEvents() {
        document.querySelectorAll(".increase-qty").forEach(button => {
            button.addEventListener("click", (e) => {
                const id = e.target.dataset.id;
                debouncedUpdateCartItem(id, 1);
            });
        });
        document.querySelectorAll(".decrease-qty").forEach(button => {
            button.addEventListener("click", (e) => {
                const id = e.target.dataset.id;
                debouncedUpdateCartItem(id, -1);
            });
        });
        document.querySelectorAll(".remove-item").forEach(button => {
            button.addEventListener("click", (e) => {
                const id = e.target.dataset.id;
                debouncedRemoveCartItem(id);
            });
        });
        document.querySelectorAll(".add-to-cart-btn").forEach(button => {
            button.addEventListener("click", async (e) => {
                const productId = e.target.dataset.productId;
                if (!productId) return;
                await addToCart(productId);
            });
        });
    }

    // Open cart sidebar
    function openSidebar() {
        const sidebar = document.getElementById("cart-sidebar");
        if (sidebar) {
            sidebar.style.display = "block"; 
            sidebar.classList.add("open");
        }
    }
    function closeSidebar() {
        const sidebar = document.getElementById("cart-sidebar");
        if (sidebar) {
            sidebar.classList.remove("open");
            sidebar.style.display = "none"; // hide sidebar
        }
    }
    function initializeSidebarEvents() {
        document.getElementById("close-cart")?.addEventListener("click", closeSidebar);
        document.getElementById("go-to-cart")?.addEventListener("click", () => {
            location.href = `cart.html?userId=${getOrCreateUserId()}`;
        });
        attachCartItemEvents();
    }
    async function initializeBuyButtonEvent() {
        const buyBtn = document.getElementById("buy-button");
        if (buyBtn) {
            buyBtn.addEventListener("click", async () => {
                const productId = buyBtn.dataset.productId;
                if (!productId) return;
                await addToCart(productId);
            });
        }
    }

    // Cart icon event
    function initializeCartIconEvent() {
        const cartIconBtn = document.getElementById("cart-btn");
        if (cartIconBtn) {
            cartIconBtn.addEventListener("click", () => {
                location.href = `cart.html?userId=${getOrCreateUserId()}`;
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