import {redirect} from 'react-router-dom'

// Token Management Utilities

const getAuthToken = () => {
    // logic to get auth token from api endpoint
}

const setAuthToken = (token) => {
    // logic to set auth token to api endpoint
}

const removeAuthToken = () => {
    // logic to remove auth token from api endpoint
}

// Loader for Protected Routes
const protectedLoader = (loader) => {
    return async (args) => {
        const token = getAuthToken()

        if (!token) {
            // If no token, redirect to /login before the loader even runs.
            return redirect('/login');
        }

        // If token exists, run the original loader
        return loader(args);
    }
}

// Loader for
const protectedAction = (action) => {
    return async (args) => {
        const token = getAuthToken()
        if (!token) {
            // If no token, redirect to /login before the action even runs.
            return redirect('/login');
        }

        // If token exists, run the original action
        return action(args);
    }
}

export {
    getAuthToken,
    setAuthToken,
    removeAuthToken,
    protectedLoader,
    protectedAction,
}