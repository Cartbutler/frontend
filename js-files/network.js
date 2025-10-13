const API_BASE_URL = "http://ec2-18-223-114-11.us-east-2.compute.amazonaws.com:5000";

export async function fetchCartItems(user_id) {
    try {
        const res = await fetch(`${API_BASE_URL}/cart?user_id=${String(user_id)}`);
        if (!res.ok) throw new Error(`Fetch error: ${res.status}`);
        const data = await res.json();
        return data.cart_items || [];
    } catch (err) {
        console.error("Error fetching cart items:", err.message);
        return [];
    }
}

export async function addToCart(user_id, product_id, quantity = 1) {
    try {
        const res = await fetch(`${API_BASE_URL}/cart`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                user_id: String(user_id),
                product_id: Number(product_id),
                quantity: Number(quantity)
            })
        });
        if (!res.ok) throw new Error(await res.text());
        const data = await res.json();
        return data.cart_items || [];
    } catch (err) {
        console.error("Error adding item to cart:", err.message);
        return [];
    }
}

export async function removeCartItem(user_id, product_id) {
    return addToCart(user_id, product_id, 0);
}

export async function updateCartItem(user_id, product_id, quantity) {
    return addToCart(user_id, product_id, quantity);
}