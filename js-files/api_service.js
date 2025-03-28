const API_BASE_URL = "https://southern-shard-449119-d4.nn.r.appspot.com";

/**
 * Fetches category data from the API.
 * @returns {Promise<Array>} - List of categories.
 */
async function fetchCategories() {
    try {
        const response = await fetch(`${API_BASE_URL}/categories`);
        if (!response.ok) throw new Error(`API error: ${response.status}`);
        return await response.json();
    } catch (error) {
        console.error("Error fetching categories:", error);
        return [];
    }
}

/**
 * Fetches search results based on the query.
 * @param {string} query - The search term.
 * @returns {Promise<Array>} - List of products.
 */
async function fetchSearchResults(query) {
    if (!query) return []; 

    try {
        console.log("Searching for:", query);
        const response = await fetch(`${API_BASE_URL}/search?query=${encodeURIComponent(query)}`);
        if (!response.ok) throw new Error(`API error: ${response.status}`);
        return await response.json();
    } catch (error) {
        console.error("Error fetching results:", error);
        return [];
    }
}

/**
 * Fetches suggestions based on the user's input.
 * @param {string} query - The search term.
 * @returns {Promise<Array>} - List of suggestions.
 */
async function fetchSuggestions(query) {
    if (!query) return [];

    try {
        console.log("Fetching suggestions for:", query);
        const response = await fetch(`${API_BASE_URL}/suggestions?query=${encodeURIComponent(query)}`);
        
        if (!response.ok) throw new Error(`API error: ${response.status}`);

        return await response.json();
    } catch (error) {
        console.error("Error fetching suggestions:", error);
        return [];
    }
}

/**
 * Fetches products based on category ID.
 * @param {string} category_id - The category ID.
 * @returns {Promise<Array>} - List of products filtered by category.
 */
async function fetchProductsByCategory(category_id) {
    try {
        console.log(`Fetching products for category ID: ${category_id}`);

        // Check if category ID is provided before making the request
        if (!category_id) {
            console.error("Error: No category ID provided.");
            return [];
        }

        // Make the request to the search endpoint using category_id
        const response = await fetch(`${API_BASE_URL}/search?category_id=${encodeURIComponent(category_id)}`);

        if (!response.ok) {
            throw new Error(`API error: ${response.status}`);
        }

        const data = await response.json();

        console.log("Fetched Products:", data);
        return data;
    } catch (error) {
        console.error("Error fetching category products:", error);
        return [];
    }
}

/**
 * Fetches product details by ID.
 * @param {string} product_id - The ID of the product.
 * @returns {Promise<Object>} - The product details.
 */
async function fetchProductById(product_id) {
    console.log(`Fetching product with ID: ${product_id}`); // Log the product ID being fetched

    try {
        const response = await fetch(`${API_BASE_URL}/product?id=${encodeURIComponent(product_id)}`);

        // Check if response is not OK (e.g., 404 or 500 errors)
        if (!response.ok) {
            console.error(`Product with ID ${product_id} not found (HTTP ${response.status})`);
            throw new Error(`Product with ID ${product_id} not found`);
        }

        const product = await response.json();
        console.log("API response:", product); // Log the API response

        return product; // Return the product object
    } catch (error) {
        console.error("Error fetching product details:", error);
        throw error;
    }
}