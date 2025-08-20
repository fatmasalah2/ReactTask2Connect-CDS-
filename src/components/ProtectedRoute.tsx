import { Navigate } from "react-router-dom";

interface ProtectedRouteProps {
    children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
    // Simple check for auth token
    const isAuthenticated = () => {
        const token = localStorage.getItem("authToken");
        console.log("ProtectedRoute: Checking authentication, token:", token);
        return !!token;
    };

    const authenticated = isAuthenticated();
    console.log("ProtectedRoute: Is authenticated:", authenticated);

    if (!authenticated) {
        console.log("ProtectedRoute: Redirecting to login");
        return <Navigate to="/" replace />;
    }

    console.log("ProtectedRoute: Allowing access to protected route");
    return <>{children}</>;
};

export default ProtectedRoute;
