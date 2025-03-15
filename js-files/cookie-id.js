const COOKIE_NAME = "cart_session_id"; // Cookie name for cart session ID

/**
 * Generates a unique session ID using `crypto.randomUUID()`.
 * @returns {string} - A unique session ID.
 */
function generateSessionId() {
    return crypto.randomUUID(); // Use crypto.randomUUID() to generate a unique session ID
}

/**
 * Sets a cookie with no expiration time (it will be a session cookie).
 * @param {string} name - Cookie name.
 * @param {string} value - Cookie value.
 */
function setCookie(name, value) {
    document.cookie = `${name}=${value}; path=/; SameSite=Lax`;
}

/**
 * Gets the value of a specific cookie by name.
 * @param {string} name - The name of the cookie.
 * @returns {string|null} - The cookie value or null if not found.
 */
function getCookie(name) {
    const cookies = document.cookie.split("; ");
    for (let cookie of cookies) {
        let [cookieName, cookieValue] = cookie.split("=");
        if (cookieName === name) return decodeURIComponent(cookieValue);
    }
    return null;
}

/**
 * Retrieves or creates a cart session ID.
 * @returns {string} - The existing or newly generated session ID.
 */
function getOrCreateCartSessionId() {
    let sessionId = getCookie(COOKIE_NAME);
    if (!sessionId) {
        sessionId = generateSessionId();
        setCookie(COOKIE_NAME, sessionId); // No expiration, making it a session cookie
        console.log("New cart session ID created:", sessionId);
    } else {
        console.log("Existing cart session ID:", sessionId);
    }
    return sessionId;
}

/**
 * Retrieves the cart session ID from cookies.
 * @returns {string|null} - The cart session ID or null if not found.
 */
function getCartSessionId() {
    return getCookie(COOKIE_NAME) || null;
}

/**
 * Retrieves the userId from cookies.
 * @returns {string|null} - The userId or null if not found.
 */
function getUserId() {
    return getCookie("userId") || null; // Fixed cookie name
}

// Ensure the session ID exists on page load
document.addEventListener("DOMContentLoaded", () => {
    getOrCreateCartSessionId();
});