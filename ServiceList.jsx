import React, { useState, useEffect } from "react";
import axios from "axios";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField } from "@mui/material";
import Sidebar from "./Sidebar";
import "./ServiceList.css";

function ServiceList() {
    const [services, setServices] = useState([]);
    const [editService, setEditService] = useState(null);
    const [openEditDialog, setOpenEditDialog] = useState(false);
    const role = localStorage.getItem("role"); // Get the user's role

    useEffect(() => {
        fetchServices();
    }, []);

    const fetchServices = async () => {
        try {
            const response = await axios.get("http://localhost:1337/services");
            setServices(response.data);
        } catch (error) {
            console.error("Error fetching services:", error);
        }
    };

    const handleDeleteService = async (id) => {
        if (role !== "admin") return alert("Only admins can delete services.");
        if (window.confirm("Are you sure you want to delete this service?")) {
            try {
                await axios.delete(`http://localhost:1337/services/${id}`);
                alert("Service deleted successfully!");
                fetchServices();
            } catch (error) {
                console.error("Error deleting service:", error);
                alert("Failed to delete service.");
            }
        }
    };

    const handleEditService = (service) => {
        if (role !== "admin") return alert("Only admins can edit services.");
        setEditService(service);
        setOpenEditDialog(true);
    };

    const handleUpdateService = async () => {
        try {
            await axios.put(`http://localhost:1337/services/${editService._id}`, editService);
            alert("Service updated successfully!");
            setOpenEditDialog(false);
            fetchServices();
        } catch (error) {
            console.error("Error updating service:", error);
            alert("Failed to update service.");
        }
    };

    return (
        <div className="container">
            <Sidebar />
            <div className="content">
                <h2>Service List</h2>
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Name</TableCell>
                                <TableCell>Description</TableCell>
                                <TableCell>Price</TableCell>
                                {role === "admin" && <TableCell>Actions</TableCell>}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {services.map((service) => (
                                <TableRow key={service._id}>
                                    <TableCell>{service.name}</TableCell>
                                    <TableCell>{service.description}</TableCell>
                                    <TableCell>{service.price}</TableCell>
                                    {role === "admin" && (
                                        <TableCell>
                                            <Button
                                                variant="contained"
                                                color="primary"
                                                onClick={() => handleEditService(service)}
                                                style={{ marginRight: "10px" }}
                                            >
                                                Edit
                                            </Button>
                                            <Button
                                                variant="contained"
                                                color="secondary"
                                                onClick={() => handleDeleteService(service._id)}
                                            >
                                                Delete
                                            </Button>
                                        </TableCell>
                                    )}
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>

                {/* Edit Service Dialog */}
                <Dialog open={openEditDialog} onClose={() => setOpenEditDialog(false)}>
                    <DialogTitle>Edit Service</DialogTitle>
                    <DialogContent>
                        <TextField
                            label="Service Name"
                            variant="outlined"
                            fullWidth
                            margin="normal"
                            value={editService?.name || ""}
                            onChange={(e) => setEditService({ ...editService, name: e.target.value })}
                        />
                        <TextField
                            label="Description"
                            variant="outlined"
                            fullWidth
                            margin="normal"
                            value={editService?.description || ""}
                            onChange={(e) => setEditService({ ...editService, description: e.target.value })}
                        />
                        <TextField
                            label="Price"
                            variant="outlined"
                            fullWidth
                            margin="normal"
                            value={editService?.price || ""}
                            onChange={(e) => setEditService({ ...editService, price: e.target.value })}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setOpenEditDialog(false)} color="secondary">
                            Cancel
                        </Button>
                        <Button onClick={handleUpdateService} color="primary">
                            Update
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
        </div>
    );
}

export default ServiceList;