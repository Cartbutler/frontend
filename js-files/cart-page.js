import {debounce, getOrCreateUserId, getCurrentQuantity, updateCartIcon, loadCartSidebar, formatPrice} from './utils.js';
import {fetchCartItems, updateCartItem, removeCartItem, addToCart} from './network.js';

  document.addEventListener("DOMContentLoaded", function () {
    const API_BASE_URL = "hhttps://cartbutler.duckdns.org/api";
    let cartSidebarLoaded = false;
    let cart_items = []; // Added to store data locally
    let cart_id = null;
    const quantityTrackers = {}; // { [productId]: { delta, timer } }

    // Add item to cart
    async function addToCartHandler(product_id) {
        const user_id = getOrCreateUserId();
        if (!user_id) {
            console.error("addToCart: No user ID found.");
            return;
        }
        console.log("Adding to cart:", { user_id, product_id });
        try {
            cart_items = await addToCart(user_id, product_id, 1);
            updateCartUI();
            updateCartIcon(cart_items);
            openSidebar();
        } catch (error) {
            console.error("Error adding to cart:", error.message);
        }
    }

    // Remove cart item
    async function removeCartItemHandler(product_id) {
        const user_id = getOrCreateUserId();
        if (!user_id) {
            console.error("removeCartItem: No user ID found.");
            return;
        }
        console.log("Removing item from cart:", { user_id, product_id });
        try {
            await removeCartItem(user_id, product_id);
            const cart_data = await fetchCartItems(user_id);
            cart_items = cart_data.cart_items;
            cart_id = cart_data.cart_id;
            updateCartUI();
            updateCartIcon(cart_items);
        } catch (error) {
            console.error("Error removing cart item:", error.message);
        }
    }

    // Function to update cart UI without fetching
    function updateCartUI() {
        const badge = document.getElementById("cart-count");
        const container = document.getElementById("cart-items");
        if (!container) return;
        const totalItems = cart_items.reduce((acc, item) => acc + item.quantity, 0);
        if (badge) {
            badge.textContent = totalItems;
            badge.classList.toggle("d-none", totalItems === 0);
        }

        container.innerHTML = cart_items.length ? "" : "<p>Your cart is empty.</p>";
        cart_items.forEach(item => {
            const product = item.products || item;
            
            const priceDisplay = formatPrice(product);

            container.insertAdjacentHTML("beforeend", `
                <div class="cart-item">
                    <img src="${product.image_path}" class="cart-item-img">
                    <div class="cart-item-details">
                        <h6>${product.product_name}</h6>
                        <p>${priceDisplay}</p>
                        <div class="quantity-controls">
                            <button class="decrease-qty btn btn-sm btn-outline-secondary" data-id="${item.product_id}">-</button>
                            <span data-id="${item.product_id}">${(typeof item.quantity === 'number' && item.quantity >= 0) ? item.quantity : 0}</span>
                            <button class="increase-qty btn btn-sm btn-outline-secondary" data-id="${item.product_id}">+</button>
                        </div>
                        <button class="remove-item btn btn-danger btn-sm" data-id="${item.product_id}">Remove</button>
                    </div>
                </div>
            `);
        });
        attachCartItemEvents();
    }

    function attachCartItemEvents() {
        document.querySelectorAll(".increase-qty").forEach(button => {
            button.addEventListener("click", (e) => handleQuantityChange(e, 1));
        });

        document.querySelectorAll(".decrease-qty").forEach(button => {
            button.addEventListener("click", (e) => handleQuantityChange(e, -1));
        });

        document.querySelectorAll(".remove-item").forEach(button => {
            button.addEventListener("click", (e) => {
                const id = e.target.dataset.id;
                removeCartItemHandler(id);
            });
        });
    }

    function handleQuantityChange(e, delta) {
        const id = e.target.dataset.id;
        const span = document.querySelector(`.quantity-controls span[data-id="${id}"]`);
        if (span) {
            const current = parseInt(span.textContent, 10) || 0;
            span.textContent = Math.max(0, current + delta);
        }

        if (!quantityTrackers[id]) {
            quantityTrackers[id] = { delta: 0, timer: null };
        }

        quantityTrackers[id].delta += delta;
        clearTimeout(quantityTrackers[id].timer);
        quantityTrackers[id].timer = setTimeout(async () => {
            const change = quantityTrackers[id].delta;
            delete quantityTrackers[id];

            const user_id = getOrCreateUserId();
            const currentQuantity = getCurrentQuantity(id);
            const newQuantity = currentQuantity;

            if (newQuantity <= 0) {
                await removeCartItem(user_id, id);
            } else {
                await updateCartItem(user_id, id, newQuantity);
            }
            const cart_data = await fetchCartItems(user_id);
            cart_items = cart_data.cart_items;
            cart_id = cart_data.cart_id;

            updateCartUI();
            updateCartIcon(cart_items);
        }, 500);
    }

    async function initializeBuyButtonEvent() {
        const buyBtn = document.getElementById("buy-button");
        if (buyBtn) {
            buyBtn.addEventListener("click", async () => {
                const product_id = buyBtn.dataset.product_id;
                if (!product_id) return;
                await addToCartHandler(product_id);
            });
        }
    }

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
            sidebar.style.display = "none";
        }
    }

    function initializeSidebarEvents() {
        document.getElementById("close-cart")?.addEventListener("click", closeSidebar);
        document.getElementById("go-to-cart")?.addEventListener("click", () => {
            location.href = `cart.html?user_id=${getOrCreateUserId()}`;
        });
        attachCartItemEvents();
    }

    function initializeCartIconEvent() {
        const cartIconBtn = document.getElementById("cart-btn");
        if (cartIconBtn) {
            cartIconBtn.addEventListener("click", () => {
                location.href = `cart.html?user_id=${getOrCreateUserId()}`;
            });
        }
    }

    function initializeCheckoutButtonEvent() {
        const checkoutBtn = document.getElementById("checkout-button");
        if (checkoutBtn) {
            checkoutBtn.addEventListener("click", () => {
                window.location.href = "shopping-results.html";
            });
        }
    }

    (async function init() {
        await loadCartSidebar();
        initializeSidebarEvents();
        const user_id = getOrCreateUserId();
        const cart_data = await fetchCartItems(user_id);
        cart_items = cart_data.cart_items;
        cart_id = cart_data.cart_id;
        updateCartUI();
        updateCartIcon(cart_items);
        initializeCartIconEvent();
        initializeBuyButtonEvent();
        initializeCheckoutButtonEvent()
    })();
});
