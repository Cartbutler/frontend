// API Service Module
import { API_BASE_URL } from './config.js';

export async function fetchCategories() {
    console.log('fetchCategories called');
    try {
        const response = await fetch(`${API_BASE_URL}/categories`);
        if (!response.ok) throw new Error(`API error: ${response.status}`);
        return await response.json();
    } catch (error) {
        console.error("Error fetching categories:", error);
        return [];
    }
}

export async function fetchSearchResults(query) {
    if (!query) return [];
    try {
        const response = await fetch(`${API_BASE_URL}/search?query=${encodeURIComponent(query)}`);
        if (!response.ok) throw new Error(`API error: ${response.status}`);
        return await response.json();
    } catch (error) {
        console.error("Error fetching results:", error);
        return [];
    }
}

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

export async function fetchProductsByCategory(category_id) {
    try {
        if (!category_id) {
            console.error("Error: No category ID provided.");
            return [];
        }
        const response = await fetch(`${API_BASE_URL}/search?category_id=${encodeURIComponent(category_id)}`);
        if (!response.ok) throw new Error(`API error: ${response.status}`);
        return await response.json();
    } catch (error) {
        console.error("Error fetching category products:", error);
        return [];
    }
}

export async function fetchProductById(product_id) {
    console.log('fetchProductById called with:', product_id);
    try {
        const response = await fetch(`${API_BASE_URL}/product?id=${encodeURIComponent(product_id)}`);
        if (!response.ok) {
            console.error(`Product with ID ${product_id} not found (HTTP ${response.status})`);
            throw new Error(`Product with ID ${product_id} not found`);
        }
        return await response.json();
    } catch (error) {
        console.error("Error fetching product details:", error);
        throw error;
    }
}
