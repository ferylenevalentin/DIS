import React, { useState, useEffect } from "react";
import axios from "axios";
import {
    TextField,
    Button,
    Typography,
    Card,
    CardContent,
    Grid,
    Paper,
} from "@mui/material";
import Sidebar from "./Sidebar";
import "./SOA.css";

function SOA() {
    const [patients, setPatients] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedPatient, setSelectedPatient] = useState(null);
    const [paymentAmount, setPaymentAmount] = useState("");
    const [remainingBalance, setRemainingBalance] = useState(0);

    useEffect(() => {
        fetchPatients();
    }, []);

    // Fetch all patients
    const fetchPatients = async () => {
        try {
            const response = await axios.get("http://localhost:1337/fetchpatients");
            console.log("Fetched patients:", response.data); // Debugging log
            setPatients(response.data);
        } catch (error) {
            console.error("Error fetching patients:", error);
        }
    };

    // Fetch patient details by ID
    const fetchPatientDetails = async (patientId) => {
        try {
            const response = await axios.get(`http://localhost:1337/patient/${patientId}`);
            const patient = response.data;

            setSelectedPatient(patient);

            // Calculate the remaining balance
            const totalServices = patient.services.reduce(
                (sum, service) => sum + service.price,
                0
            );
            const totalPayments = patient.payments.reduce(
                (sum, payment) => sum + payment.amount,
                0
            );
            setRemainingBalance(totalServices - totalPayments);
        } catch (error) {
            console.error("Error fetching patient details:", error);
        }
    };

    // Handle payment submission
    const handlePayment = async () => {
        if (!paymentAmount || paymentAmount <= 0) {
            alert("Please enter a valid payment amount.");
            return;
        }

        try {
            const response = await axios.post(`http://localhost:1337/patient/${selectedPatient._id}/payment`, {
                amount: paymentAmount,
            });

            alert("Payment recorded successfully!");
            setPaymentAmount("");

            // Refresh patient details
            fetchPatientDetails(selectedPatient._id);
        } catch (error) {
            console.error("Error recording payment:", error);
            alert("Failed to record payment. Please try again.");
        }
    };

    return (
        <div className="container">
            <Sidebar />
            <div className="content">
                <Typography variant="h4" className="page-title">
                    Statement of Account (SOA)
                </Typography>
                <Paper className="soa-form" elevation={3}>
                    <TextField
                        label="Search Patient"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <Button
                        variant="contained"
                        color="primary"
                        fullWidth
                        onClick={() => {
                            console.log("Search query:", searchQuery); // Debugging log
                            console.log("Patients array:", patients); // Debugging log

                            const patient = patients.find(
                                (p) =>
                                    `${p.firstName} ${p.lastName}`
                                        .toLowerCase()
                                        .includes(searchQuery.trim().toLowerCase())
                            );

                            if (patient) {
                                console.log("Found patient:", patient); // Debugging log
                                fetchPatientDetails(patient._id);
                            } else {
                                alert("Patient not found.");
                            }
                        }}
                        style={{ marginTop: "10px" }}
                    >
                        Search
                    </Button>
                </Paper>

                {selectedPatient && (
                    <Card className="patient-card" elevation={3}>
                        <CardContent>
                            <Typography variant="h5" className="patient-name">
                                {selectedPatient.firstName} {selectedPatient.lastName}
                            </Typography>
                            <Typography variant="body1" className="patient-info">
                                <strong>Services Availed:</strong>
                            </Typography>
                            <ul>
                                {selectedPatient.services.map((service) => (
                                    <li key={service._id}>
                                        {service.name} - ₱{service.price.toFixed(2)}
                                    </li>
                                ))}
                            </ul>
                            <Typography variant="body1" className="patient-info">
                                <strong>Remaining Balance:</strong> ₱{remainingBalance.toFixed(2)}
                            </Typography>
                            <Typography variant="body1" className="patient-info">
                                <strong>Payment History:</strong>
                            </Typography>
                            <ul>
                                {selectedPatient.payments.map((payment, index) => (
                                    <li key={index}>
                                        ₱{payment.amount.toFixed(2)} -{" "}
                                        {new Date(payment.date).toLocaleDateString()}
                                    </li>
                                ))}
                            </ul>
                            <Grid container spacing={2} style={{ marginTop: "20px" }}>
                                <Grid item xs={8}>
                                    <TextField
                                        label="Payment Amount"
                                        variant="outlined"
                                        fullWidth
                                        value={paymentAmount}
                                        onChange={(e) => setPaymentAmount(Number(e.target.value))}
                                    />
                                </Grid>
                                <Grid item xs={4}>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        fullWidth
                                        onClick={handlePayment}
                                    >
                                        Submit Payment
                                    </Button>
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    );
}

export default SOA;