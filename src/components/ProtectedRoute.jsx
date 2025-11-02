import {Navigate} from 'react-router-dom'
import {useAuth} from "../store/AuthContext.jsx";

// Logic to check for a valid JWT token in  cookies,
// a cookie, or context.



const ProtectedRoute = ({ children }) => {
    const isAuthenticated = useAuth() ;

    //  Can add a 'loading' state for AuthContext
    // for a brief moment when the app first loads.
    // if (isLoading) {
    //   return <Center h="100vh"><Loader /></Center>;
    // }

    if (!isAuthenticated) {
        // If not authenticated, redirect to login page
        return <Navigate to='/login' replace />;
    }

    // If authenticated, render the protected component
    return children;
}

export default ProtectedRoute;