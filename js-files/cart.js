/* Provisional code for cart events */
/* For demo purposes - waiting for BE endpoint cart */

document.addEventListener("DOMContentLoaded", function () {
    // Load cart.html before adding events
    fetch('cart.html')
        .then(response => response.text())
        .then(html => {
            document.body.insertAdjacentHTML('beforeend', html); // Add the cart to the end of the body
            setTimeout(initializeCartEventListeners, 500); // Wait for the cart to load
        })
        .catch(error => console.error('Error loading cart:', error));
});

// Function to add events only after cart.html is in the DOM
function initializeCartEventListeners() {
    const cartCount = document.getElementById("cart-count");
    const buyButton = document.getElementById("buy-button");
    const cartBtn = document.getElementById("cart-btn");
    const cartSidebar = document.getElementById("cart-sidebar");
    const closeCartBtn = document.getElementById("close-cart");
    const cartItemsContainer = document.getElementById("cart-items");

    const cartModal = document.getElementById("cart-modal");
    const cartModalYes = document.getElementById("cart-modal-yes");
    const cartModalNo = document.getElementById("cart-modal-no");

    function updateCartCount() {
        let cartItems = JSON.parse(localStorage.getItem("cart")) || [];
        let totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

        if (cartCount) {
            cartCount.textContent = totalItems;
            cartCount.classList.toggle("d-none", totalItems === 0);
        }
    }

    function loadCartItems() {
        let cartItems = JSON.parse(localStorage.getItem("cart")) || [];
        if (cartItemsContainer) {
            cartItemsContainer.innerHTML = cartItems.length === 0
                ? "<p class='text-center'>Your cart is empty.</p>"
                : "";

            cartItems.forEach((item, index) => {
                const cartItem = document.createElement("div");
                cartItem.classList.add("cart-item");
                cartItem.innerHTML = `
                    <img src="${item.image}" alt="${item.name}" class="cart-item-img">
                    <div class="cart-item-details">
                        <h6>${item.name}</h6>
                        <p>${item.price}</p>
                        <div class="quantity-controls">
                            <button class="decrease-qty btn btn-sm btn-outline-secondary" data-index="${index}">-</button>
                            <span class="item-quantity">${item.quantity}</span>
                            <button class="increase-qty btn btn-sm btn-outline-secondary" data-index="${index}">+</button>
                        </div>
                        <button class="remove-item btn btn-danger btn-sm" data-index="${index}">Remove</button>
                    </div>
                `;
                cartItemsContainer.prepend(cartItem);
            });

            // Add events to buttons only if elements exist
            document.querySelectorAll(".increase-qty").forEach(button => {
                button.addEventListener("click", event => {
                    let cartItems = JSON.parse(localStorage.getItem("cart")) || [];
                    const index = event.target.dataset.index;
                    cartItems[index].quantity++;
                    localStorage.setItem("cart", JSON.stringify(cartItems));
                    updateCartCount();
                    loadCartItems();
                });
            });

            document.querySelectorAll(".decrease-qty").forEach(button => {
                button.addEventListener("click", event => {
                    let cartItems = JSON.parse(localStorage.getItem("cart")) || [];
                    const index = event.target.dataset.index;

                    if (cartItems[index].quantity > 1) {
                        cartItems[index].quantity--;
                    } else {
                        cartItems.splice(index, 1);
                    }

                    localStorage.setItem("cart", JSON.stringify(cartItems));
                    updateCartCount();
                    loadCartItems();
                });
            });

            document.querySelectorAll(".remove-item").forEach(button => {
                button.addEventListener("click", event => {
                    let cartItems = JSON.parse(localStorage.getItem("cart")) || [];
                    const index = event.target.dataset.index;
                    cartItems.splice(index, 1);
                    localStorage.setItem("cart", JSON.stringify(cartItems));
                    updateCartCount();
                    loadCartItems();
                });
            });
        }
    }

    function addToCart() {
        let cartItems = JSON.parse(localStorage.getItem("cart")) || [];

        const productName = document.getElementById("product-name")?.textContent.trim();
        const productPrice = document.getElementById("product-price")?.textContent.trim();
        const productImage = document.getElementById("product-image")?.src;

        if (!productName || !productPrice || !productImage) {
            console.error("Error adding item to cart: element not found.");
            return;
        }

        const existingProduct = cartItems.find(item => item.name === productName);

        if (existingProduct) {
            if (cartModal) {
                cartModal.style.display = "flex";

                cartModalYes.onclick = () => {
                    existingProduct.quantity++;
                    localStorage.setItem("cart", JSON.stringify(cartItems));
                    updateCartCount();
                    loadCartItems();
                    cartModal.style.display = "none";
                };

                cartModalNo.onclick = () => {
                    cartModal.style.display = "none";
                };
            }
        } else {
            const product = { name: productName, price: productPrice, image: productImage, quantity: 1 };
            cartItems.push(product);

            localStorage.setItem("cart", JSON.stringify(cartItems));

            updateCartCount();
            loadCartItems();
        }

        // Open the cart sidebar after adding to cart automatically
        openCartSidebar();
    }

    function openCartSidebar() {
        if (cartSidebar) {
            cartSidebar.classList.add("open");
            loadCartItems();
        }
    }

    function closeCartSidebar() {
        if (cartSidebar) {
            cartSidebar.classList.remove("open");
        }
    }

    if (buyButton) buyButton.addEventListener("click", addToCart);
    if (cartBtn) cartBtn.addEventListener("click", openCartSidebar);
    if (closeCartBtn) closeCartBtn.addEventListener("click", closeCartSidebar);

    updateCartCount();

    window.cart = window.cart || {}; // Ensure cart object exists globally
    console.log("Cart object initialized:", window.cart);

    console.log("cart.js is loaded!");

    window.cart = {
        items: [],
        
        addItem: function (product) {
            this.items.push(product);
            console.log("Item added to cart:", product);
        },
    
        getItems: function () {
            return this.items;
        }
    };
}