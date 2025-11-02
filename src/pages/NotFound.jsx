import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
    return (
        <div>
            <h2>404 - Page Not Found</h2>
            <p>Oops! The page you're looking for doesn't exist.</p>
            <Link to="/">Go to Homepage</Link>
        </div>
    );
};

export default NotFound;