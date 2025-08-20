export const isAuthenticated = (): boolean => {
    try {
        const tokenString = localStorage.getItem("authToken");
        if (!tokenString) return false;

        const token = JSON.parse(tokenString);

        // Check if token exists and has required properties
        if (!token || !token.token || !token.expiresIn) {
            return false;
        }

        // Check if token is expired
        const currentTime = Math.floor(Date.now() / 1000);
        if (currentTime >= token.expiresIn) {
            // Token is expired, remove it
            localStorage.removeItem("authToken");
            return false;
        }

        return true;
    } catch (error) {
        // If there's any error parsing the token, consider user as not authenticated
        localStorage.removeItem("authToken");
        return false;
    }
};

export const logout = (): void => {
    localStorage.removeItem("authToken");
};
