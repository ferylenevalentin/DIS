import React, { useState, useEffect } from "react";
import axios from "axios";
import {
    Typography,
    TextField,
    MenuItem,
    Button,
    Checkbox,
    FormControlLabel,
} from "@mui/material";
import Sidebar from "./Sidebar";
import "./Appointment.css";

function Appointment() {
    const [patients, setPatients] = useState([]);
    const [services, setServices] = useState([]);
    const [selectedPatient, setSelectedPatient] = useState("");
    const [selectedServices, setSelectedServices] = useState([]);
    const [date, setDate] = useState("");
    const [time, setTime] = useState("");
    const [notes, setNotes] = useState("");

    useEffect(() => {
        fetchPatients();
        fetchServices();
    }, []);

    const fetchPatients = async () => {
        try {
            const response = await axios.get("http://localhost:1337/fetchpatients");
            setPatients(response.data);
        } catch (error) {
            console.error("Error fetching patients:", error);
        }
    };

    const fetchServices = async () => {
        try {
            const response = await axios.get("http://localhost:1337/services");
            setServices(response.data);
        } catch (error) {
            console.error("Error fetching services:", error);
        }
    };

    const handleServiceSelection = (serviceId) => {
        if (selectedServices.includes(serviceId)) {
            setSelectedServices(selectedServices.filter((id) => id !== serviceId));
        } else {
            setSelectedServices([...selectedServices, serviceId]);
        }
    };

    const handleCreateAppointment = async () => {
        const newAppointment = {
            patientId: selectedPatient,
            services: selectedServices,
            date,
            time,
            notes,
        };

        try {
            await axios.post("http://localhost:1337/appointments", newAppointment);
            alert("Appointment created successfully!");
            setSelectedPatient("");
            setSelectedServices([]);
            setDate("");
            setTime("");
            setNotes("");
        } catch (error) {
            console.error("Error creating appointment:", error);
            alert("Failed to create appointment.");
        }
    };

    return (
        <div className="container">
            <Sidebar />
            <div className="content">
                <Typography variant="h4" className="page-title">Schedule Appointment</Typography>
                <TextField
                    select
                    label="Select Patient"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={selectedPatient}
                    onChange={(e) => setSelectedPatient(e.target.value)}
                >
                    {patients.map((patient) => (
                        <MenuItem key={patient._id} value={patient._id}>
                            {patient.firstName} {patient.lastName}
                        </MenuItem>
                    ))}
                </TextField>
                <Typography variant="h6" className="section-title">Select Services</Typography>
                {services.map((service) => (
                    <FormControlLabel
                        key={service._id}
                        control={
                            <Checkbox
                                checked={selectedServices.includes(service._id)}
                                onChange={() => handleServiceSelection(service._id)}
                            />
                        }
                        label={`${service.name} - ₱${service.price}`}
                    />
                ))}
                <TextField
                    label="Date"
                    type="date"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    InputLabelProps={{ shrink: true }}
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                />
                <TextField
                    label="Time"
                    type="time"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    InputLabelProps={{ shrink: true }}
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                />
                <TextField
                    label="Notes"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    multiline
                    rows={4}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                />
                <Button variant="contained" color="primary" onClick={handleCreateAppointment}>
                    Schedule Appointment
                </Button>
            </div>
        </div>
    );
}

export default Appointment;