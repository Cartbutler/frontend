document.addEventListener("DOMContentLoaded", function () {
    // List of categories - body content
    const categories = [
        "Fruits", "Vegetables", "Dairy", "Meat", "Beverages", "Snacks",
        "Frozen", "Bakery", "Seafood", "Spices", "Household", "Personal Care"
    ];

    const container = document.getElementById("category-container");

    categories.forEach(category => {
        const div = document.createElement("div");
        div.classList.add("col-md-2", "category-card"); // 6 columns per row

        div.innerHTML = `
            <div class="market-card">
                <h5>${category}</h5>
            </div>
        `;

        container.appendChild(div);
    });
});