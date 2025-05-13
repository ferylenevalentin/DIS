import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AddPatient from "./pages/AddPatient";
import PatientList from "./pages/PatientList";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import UserList from "./pages/UserList";
import AddService from "./pages/AddService";
import ServiceList from "./pages/ServiceList";
import Appointment from "./pages/Appointment"; // Import Appointment
import AdminRoute from "./pages/AdminRoute";
import AppointmentList from "./pages/AppointmentList";
import Billing from "./pages/Billing";
import SOA from "./pages/SOA";
import "./App.css";

function App() {
    return (
        <Router>
            <div className="App">
                <Routes>
                    <Route path="/" element={<Login />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/add-patient" element={<AddPatient />} />
                    <Route path="/patient-list" element={<PatientList />} />
                    <Route
                        path="/user-list"
                        element={
                            <AdminRoute>
                                <UserList />
                            </AdminRoute>
                        }
                    />
                    <Route
                        path="/add-service"
                        element={
                            <AdminRoute>
                                <AddService />
                            </AdminRoute>
                        }
                    />
                    <Route path="/service-list" element={<ServiceList />} />
                    <Route path="/appointments" element={<Appointment />} />
                    <Route path="/appointment-list" element={<AppointmentList />} />
                    <Route path="/billing" element={<Billing />} /> 
                    <Route path="/soa" element={<SOA />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;