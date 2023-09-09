import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

function PrivateRoute({element}) {
    const { currentUser } = useAuth();

  // Check if there's a currentUser, and render the element accordingly
    return currentUser ? element : <Navigate to="/" />;
}

export default PrivateRoute;
