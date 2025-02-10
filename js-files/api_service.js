const API_BASE_URL = "https://southern-shard-449119-d4.nn.r.appspot.com";

/**
 * Fetches category data from the API.
 * @returns {Promise<Array>} - List of categories.
 */ 
async function fetchCategories() {
    try {
        const response = await fetch(`${API_BASE_URL}/categories`);

        if (!response.ok) {
            throw new Error(`API error: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error("Error fetching categories:", error);
        return []; // Return an empty array in case of error
    }
}

/**
 * Fetches suggestions based on the user's input.
 * @param {string} query - The search term.
 * @returns {Promise<Array>} - List of suggestions.
 */
async function fetchSuggestions(query) {
    try {
        const response = await fetch(`${API_BASE_URL}/suggestions?query=${query}`);
        return await response.json();
    } catch (error) {
        console.error("Error fetching suggestions:", error);
        return [];
    }
}

/**
 * Fetches search results based on the query.
 * @param {string} query - The search term.
 * @returns {Promise<Array>} - List of products.
 */
async function fetchSearchResults(query) {
    if (!query) return []; // If no query is provided, return an empty array.

    try {
        console.log("Searching for:", query);
        
        // Fetch search results from the API
        const response = await fetch(`${API_BASE_URL}/search?query=${encodeURIComponent(query)}`);

        if (!response.ok) {
            throw new Error(`API error: ${response.status}`);
        }

        const results = await response.json();

        if (!results || results.length === 0) {
            console.log("No results found for:", query);
            document.getElementById("no-results").style.display = "block"; // Show the message
        } else {
            document.getElementById("no-results").style.display = "none"; // Hide the message if results exist
        }

        return results;

    } catch (error) {
        console.error("Error fetching results:", error);
        document.getElementById("no-results").style.display = "block"; 
        return [];
    }
}