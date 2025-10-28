import { API_BASE_URL } from './config.js';
import { getBackendLanguageId } from "./utils.js";

/**
 * Fetches category data from the API.
 * @returns {Promise<Array>} - List of categories.
 */
export async function fetchCategories() {
    const language_id = getBackendLanguageId();
    try {
        const response = await fetch(`${API_BASE_URL}/categories?language_id=${language_id}`);
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
export async function fetchSearchResults(query) {
    if (!query) return []; 
    const language_id = getBackendLanguageId();

    try {
        console.log("Searching for:", query);
        const response = await fetch(`${API_BASE_URL}/search?query=${encodeURIComponent(query)}&language_id=${language_id}`);
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
export async function fetchSuggestions(query) {
    if (!query) return [];
    try {
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
export async function fetchProductsByCategory(category_id) {
    const language_id = getBackendLanguageId();
    try {
        console.log(`Fetching products for category ID: ${category_id}`);

        if (!category_id) {
            console.error("Error: No category ID provided.");
            return [];
        }

        const response = await fetch(`${API_BASE_URL}/search?category_id=${encodeURIComponent(category_id)}&language_id=${language_id}`);

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
export async function fetchProductById(product_id) {
    const language_id = getBackendLanguageId();
    console.log(`Fetching product with ID: ${product_id}`);

    try {
        const response = await fetch(`${API_BASE_URL}/product?id=${encodeURIComponent(product_id)}&language_id=${language_id}`);

        if (!response.ok) {
            console.error(`Product with ID ${product_id} not found (HTTP ${response.status})`);
            throw new Error(`Product with ID ${product_id} not found`);
        }

        const product = await response.json();
        console.log("API response:", product);
        return product;
    } catch (error) {
        console.error("Error fetching product details:", error);
        throw error;
    }
}
