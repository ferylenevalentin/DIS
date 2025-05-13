import React from "react";
import { Link } from "react-router-dom";
import "./Sidebar.css"; // Import the CSS file

const Sidebar = () => {
    const role = localStorage.getItem("role"); // Get the user's role

    return (
        <div className="sidebar">
            <h2>Billedo Dental Clinic</h2>
            <ul>
                <li>
                    <Link to="/">Home</Link>
                </li>
                <li>
                    <Link to="/add-patient">Add Patient</Link>
                </li>
                <li>
                    <Link to="/patient-list">Patient List</Link>
                </li>
                {role === "admin" && ( // Show this link only for admins
                    <li>
                        <Link to="/user-list">User List</Link>
                    </li>
                )}
                {role === "admin" && ( // Show Add Service only for admins
                    <li>
                        <Link to="/add-service">Add Service</Link>
                    </li>
                )}
                <li>
                    <Link to="/service-list">Service List</Link> {/* Visible to both admins and staff */}
                </li>
                <li>
                <Link to="/appointments">Add Appointment</Link>
                </li>
                <li>
                <Link to="/appointment-list">Appointment List</Link>
                </li>
                <li>
                <Link to="/billing">Billing</Link> 
                </li>
                <li>
                <Link to="/soa">Statement of Account</Link> 
                </li>
            </ul>
        </div>
    );
};

export default Sidebar;