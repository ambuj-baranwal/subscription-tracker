import {createContext, useContext, useState} from "react";
import {getAuthToken, removeAuthToken, setAuthToken} from "../utils/auth.js";

const AuthContext = createContext(null)


const AuthProvider = ({children}) => {
    const [isAuthenticated, setIsAuthenticated] = useState(!!getAuthToken());

    const login = (token) => {
        setAuthToken(token)
        setIsAuthenticated(true);
    }

    const logout = () => {
        removeAuthToken();
        setIsAuthenticated(false);
    }
    /**
     * @type {{isAuthenticated: boolean, login: login, logout: logout}}
     */
    const value = {
        isAuthenticated,
        login,
        logout,
    }

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// Custom hook to use the AuthContext
const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}

export {
    AuthProvider,
    useAuth,
};


