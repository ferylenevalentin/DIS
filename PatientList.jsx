import React, { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "../pages/Sidebar";
import {
    Typography,
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
} from "@mui/material";
import "./AddPatient.css";

function PatientList() {
    const [patients, setPatients] = useState([]);
    const [editPatient, setEditPatient] = useState(null);
    const [openEditDialog, setOpenEditDialog] = useState(false);

    useEffect(() => {
        fetchPatients();
    }, []);

    // Fetch patients from the database
    const fetchPatients = async () => {
        try {
            const response = await axios.get("http://localhost:1337/fetchpatients");
            setPatients(response.data);
        } catch (error) {
            console.error("Error fetching patients:", error);
        }
    };

    // Handle delete patient
    const handleDeletePatient = async (id) => {
        if (window.confirm("Are you sure you want to delete this patient?")) {
            try {
                await axios.delete(`http://localhost:1337/deletepatient/${id}`);
                alert("Patient deleted successfully!");
                fetchPatients(); // Refresh the patient list
            } catch (error) {
                console.error("Error deleting patient:", error);
                alert("Failed to delete patient.");
            }
        }
    };

    // Handle edit patient
    const handleEditPatient = (patient) => {
        setEditPatient(patient);
        setOpenEditDialog(true);
    };

    // Handle update patient
    const handleUpdatePatient = async () => {
        try {
            await axios.put(`http://localhost:1337/updatepatient/${editPatient.id}`, editPatient);
            alert("Patient updated successfully!");
            setOpenEditDialog(false);
            fetchPatients(); // Refresh the patient list
        } catch (error) {
            console.error("Error updating patient:", error);
            alert("Failed to update patient.");
        }
    };

    return (
        <div className="container">
            <Sidebar />
            <div className="content">
                <Typography variant="h4" className="page-title">Patient List</Typography>
                <TableContainer component={Paper} className="patient-table">
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>ID</TableCell>
                                <TableCell>First Name</TableCell>
                                <TableCell>Last Name</TableCell>
                                <TableCell>Middle Name</TableCell>
                                <TableCell>Age</TableCell>
                                <TableCell>Contact</TableCell>
                                <TableCell>Address</TableCell>
                                <TableCell>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {patients.map((patient) => (
                                <TableRow key={patient.id}>
                                    <TableCell>{patient.id}</TableCell>
                                    <TableCell>{patient.firstName}</TableCell>
                                    <TableCell>{patient.lastName}</TableCell>
                                    <TableCell>{patient.middleName || "-"}</TableCell>
                                    <TableCell>{patient.age}</TableCell>
                                    <TableCell>{patient.contact}</TableCell>
                                    <TableCell>{patient.address}</TableCell>
                                    <TableCell>
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            onClick={() => handleEditPatient(patient)}
                                            style={{ marginRight: "10px" }}
                                        >
                                            Edit
                                        </Button>
                                        <Button
                                            variant="contained"
                                            color="secondary"
                                            onClick={() => handleDeletePatient(patient.id)}
                                        >
                                            Delete
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>

                {/* Edit Patient Dialog */}
                <Dialog open={openEditDialog} onClose={() => setOpenEditDialog(false)}>
                    <DialogTitle>Edit Patient</DialogTitle>
                    <DialogContent>
                        <TextField
                            label="First Name"
                            variant="outlined"
                            fullWidth
                            margin="normal"
                            value={editPatient?.firstName || ""}
                            onChange={(e) => setEditPatient({ ...editPatient, firstName: e.target.value })}
                        />
                        <TextField
                            label="Last Name"
                            variant="outlined"
                            fullWidth
                            margin="normal"
                            value={editPatient?.lastName || ""}
                            onChange={(e) => setEditPatient({ ...editPatient, lastName: e.target.value })}
                        />
                        <TextField
                            label="Middle Name"
                            variant="outlined"
                            fullWidth
                            margin="normal"
                            value={editPatient?.middleName || ""}
                            onChange={(e) => setEditPatient({ ...editPatient, middleName: e.target.value })}
                        />
                        <TextField
                            label="Age"
                            variant="outlined"
                            fullWidth
                            margin="normal"
                            value={editPatient?.age || ""}
                            onChange={(e) => setEditPatient({ ...editPatient, age: e.target.value })}
                        />
                        <TextField
                            label="Contact"
                            variant="outlined"
                            fullWidth
                            margin="normal"
                            value={editPatient?.contact || ""}
                            onChange={(e) => setEditPatient({ ...editPatient, contact: e.target.value })}
                        />
                        <TextField
                            label="Address"
                            variant="outlined"
                            fullWidth
                            margin="normal"
                            value={editPatient?.address || ""}
                            onChange={(e) => setEditPatient({ ...editPatient, address: e.target.value })}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setOpenEditDialog(false)} color="secondary">
                            Cancel
                        </Button>
                        <Button onClick={handleUpdatePatient} color="primary">
                            Update
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
        </div>
    );
}

export default PatientList;