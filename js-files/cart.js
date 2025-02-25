document.addEventListener("DOMContentLoaded", () => {
    const cartCount = document.getElementById("cart-count");
    const buyButton = document.getElementById("buy-button");
    const cartBtn = document.getElementById("cart-btn");
    const cartSidebar = document.getElementById("cart-sidebar");
    const closeCartBtn = document.getElementById("close-cart");
    const cartItemsContainer = document.getElementById("cart-items");

    // Get modal elements
    const cartModal = document.getElementById("cart-modal");
    const cartModalYes = document.getElementById("cart-modal-yes");
    const cartModalNo = document.getElementById("cart-modal-no");

    function updateCartCount() {
        let cartItems = JSON.parse(localStorage.getItem("cart")) || [];
        let totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

        cartCount.textContent = totalItems;
        cartCount.classList.toggle("d-none", totalItems === 0);
    }

    function loadCartItems() {
        let cartItems = JSON.parse(localStorage.getItem("cart")) || [];
        cartItemsContainer.innerHTML = "";

        if (cartItems.length === 0) {
            cartItemsContainer.innerHTML = "<p class='text-center'>Your cart is empty.</p>";
            return;
        }

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
            cartItemsContainer.appendChild(cartItem);
        });

        // Increase quantity button
        document.querySelectorAll(".increase-qty").forEach(button => {
            button.addEventListener("click", (event) => {
                let cartItems = JSON.parse(localStorage.getItem("cart")) || [];
                const index = event.target.dataset.index;
                cartItems[index].quantity++;
                localStorage.setItem("cart", JSON.stringify(cartItems));
                updateCartCount();
                loadCartItems();
            });
        });

        // Decrease quantity button
        document.querySelectorAll(".decrease-qty").forEach(button => {
            button.addEventListener("click", (event) => {
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

        // Remove item button
        document.querySelectorAll(".remove-item").forEach(button => {
            button.addEventListener("click", (event) => {
                let cartItems = JSON.parse(localStorage.getItem("cart")) || [];
                const index = event.target.dataset.index;
                cartItems.splice(index, 1);
                localStorage.setItem("cart", JSON.stringify(cartItems));
                updateCartCount();
                loadCartItems();
            });
        });
    }

    // Function to handle adding an item to the cart
    function addToCart() {
        let cartItems = JSON.parse(localStorage.getItem("cart")) || [];

        const productName = document.getElementById("product-name").textContent.trim();
        const productPrice = document.getElementById("product-price").textContent.trim();
        const productImage = document.getElementById("product-image").src;

        const existingProduct = cartItems.find(item => item.name === productName);

        if (existingProduct) {
            // Open custom modal instead of confirm()
            cartModal.style.display = "flex";

            cartModalYes.onclick = () => {
                existingProduct.quantity++;
                localStorage.setItem("cart", JSON.stringify(cartItems));
                updateCartCount();
                loadCartItems();
                cartModal.style.display = "none"; // Close modal
            };

            cartModalNo.onclick = () => {
                cartModal.style.display = "none"; // Close modal
            };
        } else {
            // Add new product
            const product = { name: productName, price: productPrice, image: productImage, quantity: 1 };
            cartItems.push(product);

            localStorage.setItem("cart", JSON.stringify(cartItems));

            updateCartCount();
            loadCartItems();
        }
    }

    // Automatically add item to cart when clicking on Buy Now
    buyButton.addEventListener("click", addToCart);

    // Open cart sidebar
    cartBtn.addEventListener("click", () => {
        cartSidebar.classList.add("open");
        loadCartItems();
    });

    // Close cart sidebar
    closeCartBtn.addEventListener("click", () => {
        cartSidebar.classList.remove("open");
    });

    // Initialize cart count on page load
    updateCartCount();

    // Load cart items on page load
    document.addEventListener("DOMContentLoaded", function () {
        fetch('cart.html')
            .then(response => response.text())
            .then(html => {
                document.body.insertAdjacentHTML('beforeend', html); // Insere o carrinho no final do body
            })
            .catch(error => console.error('Error loading cart:', error));
    });
});