import React from 'react';
import PropTypes from 'prop-types'; // Import PropTypes
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

function PrivateRoute({ element }) {
    const { currentUser } = useAuth();

    // Check if there's a currentUser, and render the element accordingly
    return currentUser ? element : <Navigate to="/" />;
}

PrivateRoute.propTypes = {
    element: PropTypes.element.isRequired 
};

export default PrivateRoute;
