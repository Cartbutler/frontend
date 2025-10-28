document.addEventListener("DOMContentLoaded", async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const userId = urlParams.get("user_id");
  const cartId = urlParams.get("cart_id");
  const storeId = parseInt(urlParams.get("store_id"));

  const storeImageEl = document.getElementById("store-image");
  const imageLoadingEl = document.getElementById("image-loading");
  const storeTotalEl = document.getElementById("store-total-price");
  const storeUniqueItemsEl = document.getElementById("unique-items-count");
  const storeProductsListEl = document.getElementById("store-products-list");
  const noProductsMsg = document.getElementById("no-products-message");

  if (!userId || !cartId || !storeId) {
    console.error("❌ Missing parameters in URL.");
    storeProductsListEl.innerHTML = "<p class='text-danger'>Missing URL parameters.</p>";
    return;
  }

  try {
    const API_BASE_URL = "https://southern-shard-449119-d4.nn.r.appspot.com";
    const response = await fetch(`${API_BASE_URL}/shopping-results?user_id=${userId}&cart_id=${cartId}`);

    if (!response.ok) throw new Error("❌ Failed to fetch shopping results");

    const stores = await response.json();
    const store = stores.find((s) => s.store_id === storeId);

    console.log("Store Name:", store?.store_name);
    console.log("Store Address:", store?.store_address);

    if (!store) {
      noProductsMsg.textContent = "This store has no matching items in your cart.";
      noProductsMsg.style.display = "block";
      return;
    }

    renderGoogleMap(store.store_name, store.store_address || store.store_location);

    storeTotalEl.textContent = store.total.toFixed(2);
    storeUniqueItemsEl.textContent = store.products.length;

    imageLoadingEl.textContent = "Loading image...";
    imageLoadingEl.style.display = "block";

    storeImageEl.onload = () => {
      storeImageEl.classList.remove("d-none");
      imageLoadingEl.style.display = "none";
    };

    storeImageEl.onerror = () => {
      storeImageEl.classList.add("d-none");
      imageLoadingEl.textContent = "⚠️ Failed to load image.";
    };

    if (store.store_image) {
      storeImageEl.src = store.store_image;
    } else {
      storeImageEl.classList.add("d-none");
      imageLoadingEl.textContent = "⚠️ No image available.";
    }

    noProductsMsg.style.display = "none";

    store.products.forEach((product) => {
      const item = document.createElement("div");
      item.classList.add("list-group-item", "text-start");

      item.innerHTML = `
        <div class="d-flex justify-content-between align-items-center">
          <div>
            <strong>${product.product_name}</strong><br/>
            <small data-i18n="quantity_label">Quantity:</small> ${product.quantity}
          </div>
          <div class="text-end">
            $${(product.price * product.quantity).toFixed(2)}
            <br/><small class="text-muted">$${product.price.toFixed(2)} each</small>
          </div>
        </div>
      `;

      storeProductsListEl.appendChild(item);
    });

    // ✅ Aplica a tradução após todos os elementos carregarem
    if (typeof applyLocalization === "function") {
      applyLocalization();
    }

  } catch (err) {
    console.error("❌ Error loading store details:", err);
    storeProductsListEl.innerHTML = `<p class="text-danger">Error loading data.</p>`;
  }
});

function renderGoogleMap(storeName, storeAddress) {
  const mapContainer = document.getElementById("store-map");
  if (!storeName || !storeAddress || !mapContainer) return;

  const iframe = document.createElement("iframe");
  iframe.width = "100%";
  iframe.height = "100%";
  iframe.style.border = "0";
  iframe.loading = "lazy";
  const query = encodeURIComponent(`${storeName}, ${storeAddress}`);
  iframe.src = `https://www.google.com/maps?q=${query}&output=embed`;

  mapContainer.appendChild(iframe);
}