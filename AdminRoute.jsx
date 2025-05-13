import React from "react";
import { Navigate } from "react-router-dom";

const AdminRoute = ({ children }) => {
    const role = localStorage.getItem("role"); // Get the user's role from localStorage

    // Check if the user is an admin
    if (role !== "admin") {
        return <Navigate to="/" />; // Redirect non-admin users to the home page
    }

    return children; // Render the children if the user is an admin
};

export default AdminRoute;