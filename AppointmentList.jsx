import React, { useState, useEffect } from "react";
import axios from "axios";
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    MenuItem,
} from "@mui/material";
import Sidebar from "./Sidebar";
import "./AppointmentList.css";

function AppointmentList() {
    const [appointments, setAppointments] = useState([]);
    const [editAppointment, setEditAppointment] = useState(null);
    const [openEditDialog, setOpenEditDialog] = useState(false);

    useEffect(() => {
        fetchAppointments();
    }, []);

    // Fetch all appointments
    const fetchAppointments = async () => {
        try {
            const response = await axios.get("http://localhost:1337/appointments");
            const sortedAppointments = response.data.sort((a, b) => {
                const dateA = new Date(a.date + " " + a.time);
                const dateB = new Date(b.date + " " + b.time);

                // If status is "Done" or "Cancelled", move it to the bottom
                if ((a.status === "Done" || a.status === "Cancelled") && b.status !== "Done" && b.status !== "Cancelled") {
                    return 1;
                }
                if ((b.status === "Done" || b.status === "Cancelled") && a.status !== "Done" && a.status !== "Cancelled") {
                    return -1;
                }

                // Otherwise, sort by ascending date and time
                return dateA - dateB;
            });
            setAppointments(sortedAppointments);
        } catch (error) {
            console.error("Error fetching appointments:", error);
        }
    };

    // Handle delete appointment
    const handleDeleteAppointment = async (id) => {
        if (window.confirm("Are you sure you want to delete this appointment?")) {
            try {
                await axios.delete(`http://localhost:1337/appointments/${id}`);
                alert("Appointment deleted successfully!");
                fetchAppointments(); // Refresh the list
            } catch (error) {
                console.error("Error deleting appointment:", error);
                alert("Failed to delete appointment.");
            }
        }
    };

    // Handle edit appointment
    const handleEditAppointment = (appointment) => {
        setEditAppointment(appointment);
        setOpenEditDialog(true);
    };

    // Handle update appointment
    const handleUpdateAppointment = async () => {
        try {
            await axios.put(`http://localhost:1337/appointments/${editAppointment._id}`, {
                patientId: editAppointment.patientId._id,
                services: editAppointment.services.map((service) => service._id),
                date: editAppointment.date,
                time: editAppointment.time,
                notes: editAppointment.notes,
                status: editAppointment.status,
            });
            alert("Appointment updated successfully!");
            setOpenEditDialog(false);
            fetchAppointments();
        } catch (error) {
            console.error("Error updating appointment:", error);
            alert("Failed to update appointment.");
        }
    };

    // Get background color based on status
    const getStatusStyle = (status) => {
        switch (status) {
            case "Pending":
                return { backgroundColor: "blue", color: "white" };
            case "Cancelled":
                return { backgroundColor: "red", color: "white" };
            case "Done":
                return { backgroundColor: "green", color: "white" };
            default:
                return {};
        }
    };

    return (
        <div className="container">
            <Sidebar />
            <div className="content">
                <h2>Appointment List</h2>
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Patient</TableCell>
                                <TableCell>Services</TableCell>
                                <TableCell>Date</TableCell>
                                <TableCell>Time</TableCell>
                                <TableCell>Status</TableCell>
                                <TableCell>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {appointments.map((appointment) => (
                                <TableRow key={appointment._id}>
                                    <TableCell>
                                        {appointment.patientId.firstName} {appointment.patientId.lastName}
                                    </TableCell>
                                    <TableCell>
                                        {appointment.services.map((service) => service.name).join(", ")}
                                    </TableCell>
                                    <TableCell>{new Date(appointment.date).toLocaleDateString()}</TableCell>
                                    <TableCell>{appointment.time}</TableCell>
                                    <TableCell style={getStatusStyle(appointment.status)}>
                                        {appointment.status}
                                    </TableCell>
                                    <TableCell>
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            onClick={() => handleEditAppointment(appointment)}
                                            style={{ marginRight: "10px" }}
                                        >
                                            Edit
                                        </Button>
                                        <Button
                                            variant="contained"
                                            color="secondary"
                                            onClick={() => handleDeleteAppointment(appointment._id)}
                                        >
                                            Delete
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>

                {/* Edit Appointment Dialog */}
                <Dialog open={openEditDialog} onClose={() => setOpenEditDialog(false)}>
                    <DialogTitle>Edit Appointment</DialogTitle>
                    <DialogContent>
                        <TextField
                            label="Date"
                            type="date"
                            variant="outlined"
                            fullWidth
                            margin="normal"
                            InputLabelProps={{ shrink: true }}
                            value={editAppointment?.date || ""}
                            onChange={(e) =>
                                setEditAppointment({ ...editAppointment, date: e.target.value })
                            }
                        />
                        <TextField
                            label="Time"
                            type="time"
                            variant="outlined"
                            fullWidth
                            margin="normal"
                            InputLabelProps={{ shrink: true }}
                            value={editAppointment?.time || ""}
                            onChange={(e) =>
                                setEditAppointment({ ...editAppointment, time: e.target.value })
                            }
                        />
                        <TextField
                            select
                            label="Status"
                            variant="outlined"
                            fullWidth
                            margin="normal"
                            value={editAppointment?.status || ""}
                            onChange={(e) =>
                                setEditAppointment({ ...editAppointment, status: e.target.value })
                            }
                        >
                            <MenuItem value="Pending">Pending</MenuItem>
                            <MenuItem value="Done">Done</MenuItem>
                            <MenuItem value="Cancelled">Cancelled</MenuItem>
                        </TextField>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setOpenEditDialog(false)} color="secondary">
                            Cancel
                        </Button>
                        <Button onClick={handleUpdateAppointment} color="primary">
                            Update
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
        </div>
    );
}

export default AppointmentList;