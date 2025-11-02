import {createBrowserRouter, redirect, RouterProvider} from 'react-router-dom'

// Mantine Imports
import '@mantine/core/styles.css'
import {MantineProvider} from '@mantine/core'
import {Notifications} from '@mantine/notifications'

// Auth Provider
import {AuthProvider} from './store/AuthContext.jsx'
import {protectedLoader} from "./utils/auth.js";

// Layout and Components
import AppLayout from "./components/AppLayout.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";

// Pages
import Dashboard from "./pages/Dashboard.jsx";
import Login, {loginAction} from "./pages/LoginPage.jsx";
// import SignUp from "./pages/SignUpPage.jsx";
import NotFound from "./pages/NotFound.jsx";
import ErrorPage from "./pages/ErrorPage.jsx";
import dashboard from "./pages/Dashboard.jsx"; // for route errors

// Define Loaders & Actions
// need to define loaders/actions here or co-locate them with their components


// action/loader can be defined in the component file

const router = createBrowserRouter([
    {
        path: '/',
        element: (
            <ProtectedRoute>
                <AppLayout />
            </ProtectedRoute>
        ),
        errorElement: <ErrorPage />, // catch route errors for all child routes
        children: [
            {
                index: true,
                // loader: dashboardLoader, // Need to write the loader to the route
                element: <Dashboard />,
            },
            // {
            //     path: 'add',
            //     element: <AddSubscription />,
            // },
            // {
            //     path: 'edit/:subscriptionId',
            //     loader: protectedLoader(editSubscriptionLoader), // Protect the loader
            //     element: <EditSubscription />,
            // },
        ],
    },
    {
        path: '/login',
        action: loginAction, // defined in LoginPage.jsx refactor it later
        element: <Login />,
    },
    // Similar route can be created for SignUp page
    {
        path: '*', // Catch-all for undefined routes
        element: <NotFound />,
    },
])
function App() {
    return (
        <MantineProvider>
            <Notifications />
            <AuthProvider>
                <RouterProvider router={router} />
            </AuthProvider>
        </MantineProvider>
    )
}

export default App
