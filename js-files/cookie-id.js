const COOKIE_NAME = "cart_session_id"; // Cookie name for cart session ID

/**
 * Generates a unique session ID (UUID v4-like).
 * @returns {string} - A unique session ID.
 */
function generateSessionId() {
    return 'xxxx-xxxx-4xxx-yxxx-xxxx'.replace(/[xy]/g, function (c) {
        const r = Math.random() * 16 | 0;
        return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
}

/**
 * Sets a persistent cookie with a very long expiration time (10 years).
 * @param {string} name 
 * @param {string} value 
 */
function setCookie(name, value) {
    const date = new Date();
    date.setFullYear(date.getFullYear() + 10); // Expiration set for 10 years even though user closes browser
    document.cookie = `${name}=${value}; expires=${date.toUTCString()}; path=/; SameSite=Lax`;
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
        if (cookieName === name) return cookieValue;
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
        setCookie(COOKIE_NAME, sessionId); // Now persistent at least 10 years
        console.log("New cart session ID created:", sessionId);
    } else {
        console.log("Existing cart session ID:", sessionId);
    }
    return sessionId;
}

// Ensure the session ID exists on page load
document.addEventListener("DOMContentLoaded", () => {
    getOrCreateCartSessionId();
});