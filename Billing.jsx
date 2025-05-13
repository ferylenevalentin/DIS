import React, { useState, useEffect } from "react";
import axios from "axios";
import {
    TextField,
    MenuItem,
    Checkbox,
    FormControlLabel,
    Button,
    Typography,
    Paper,
} from "@mui/material";
import Sidebar from "./Sidebar";
import "./Billing.css";

function Billing() {
    const [appointments, setAppointments] = useState([]);
    const [selectedAppointment, setSelectedAppointment] = useState("");
    const [servicePrice, setServicePrice] = useState(0);
    const [doctorFee, setDoctorFee] = useState(500); // Default doctor fee
    const [materialsFee, setMaterialsFee] = useState(300); // Default materials fee
    const [miscellaneousFee, setMiscellaneousFee] = useState(100); // Default miscellaneous fee
    const [discounts, setDiscounts] = useState({
        seniorCitizen: false,
        student: false,
        doctor: false,
    });
    const [totalBill, setTotalBill] = useState(0);

    useEffect(() => {
        fetchAppointments();
    }, []);

    // Fetch appointments
    const fetchAppointments = async () => {
        try {
            const response = await axios.get("http://localhost:1337/appointments");
            setAppointments(response.data);
        } catch (error) {
            console.error("Error fetching appointments:", error);
        }
    };

    // Calculate total bill
    const calculateTotal = async () => {
        let total = servicePrice + doctorFee + materialsFee + miscellaneousFee;
    
        // Apply discounts
        if (discounts.seniorCitizen) {
            total -= total * 0.20; // 20% discount for senior citizens
        }
        if (discounts.student) {
            total -= total * 0.10; // 10% discount for students
        }
        if (discounts.doctor) {
            total -= total * 0.15; // 15% discount for doctors
        }
    
        setTotalBill(total);
    
        // Send the total bill to the SOA server
        if (selectedAppointment) {
            try {
                const appointment = appointments.find((appt) => appt._id === selectedAppointment);
                if (appointment) {
                    await axios.post(`http://localhost:1337/soa/${appointment.patientId._id}`, {
                        totalBill: total,
                    });
                    alert("Total bill added to SOA successfully!");
                }
            } catch (error) {
                console.error("Error updating SOA:", error);
                alert("Failed to update SOA. Please try again.");
            }
        }
    };
    // Handle appointment selection
    const handleAppointmentChange = (appointmentId) => {
        setSelectedAppointment(appointmentId);

        // Find the selected appointment and calculate the service price
        const appointment = appointments.find((appt) => appt._id === appointmentId);
        if (appointment) {
            const totalServicePrice = appointment.services.reduce(
                (sum, service) => sum + service.price,
                0
            );
            setServicePrice(totalServicePrice);
        } else {
            setServicePrice(0);
        }
    };

    return (
        <div className="container">
            <Sidebar />
            <div className="content">
                <Typography variant="h4" className="page-title">
                    Billing
                </Typography>
                <Paper className="billing-form" elevation={3}>
                    <TextField
                        select
                        label="Select Appointment"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        value={selectedAppointment}
                        onChange={(e) => handleAppointmentChange(e.target.value)}
                    >
                        {appointments.map((appointment) => (
                            <MenuItem key={appointment._id} value={appointment._id}>
                                {appointment.patientId.firstName} {appointment.patientId.lastName} -{" "}
                                {new Date(appointment.date).toLocaleDateString()}
                            </MenuItem>
                        ))}
                    </TextField>
                    <TextField
                        label="Service Price"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        value={servicePrice}
                        InputProps={{ readOnly: true }}
                    />
                    <TextField
                        label="Doctor's Fee"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        value={doctorFee}
                        onChange={(e) => setDoctorFee(Number(e.target.value))}
                    />
                    <TextField
                        label="Dentistry Materials Fee"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        value={materialsFee}
                        onChange={(e) => setMaterialsFee(Number(e.target.value))}
                    />
                    <TextField
                        label="Miscellaneous Fee"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        value={miscellaneousFee}
                        onChange={(e) => setMiscellaneousFee(Number(e.target.value))}
                    />
                    <div className="discounts">
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={discounts.seniorCitizen}
                                    onChange={(e) =>
                                        setDiscounts({
                                            ...discounts,
                                            seniorCitizen: e.target.checked,
                                        })
                                    }
                                />
                            }
                            label="Senior Citizen Discount (20%)"
                        />
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={discounts.student}
                                    onChange={(e) =>
                                        setDiscounts({
                                            ...discounts,
                                            student: e.target.checked,
                                        })
                                    }
                                />
                            }
                            label="Student Discount (10%)"
                        />
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={discounts.doctor}
                                    onChange={(e) =>
                                        setDiscounts({
                                            ...discounts,
                                            doctor: e.target.checked,
                                        })
                                    }
                                />
                            }
                            label="Doctor Discount (15%)"
                        />
                    </div>
                    <Button
                        variant="contained"
                        color="primary"
                        fullWidth
                        onClick={calculateTotal}
                        style={{ marginTop: "20px" }}
                    >
                        Calculate Total
                    </Button>
                    <Typography
                        variant="h5"
                        style={{ marginTop: "20px", textAlign: "center", fontWeight: "bold" }}
                    >
                        Total Bill: ₱{totalBill.toFixed(2)}
                    </Typography>
                </Paper>
            </div>
        </div>
    );
}

export default Billing;