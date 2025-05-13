import React, { useState } from "react";
import axios from "axios";
import { Button, TextField, Typography } from "@mui/material";
import Sidebar from "./Sidebar";
import "./AddService.css";

function AddService() {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("");

    const handleAddService = async () => {
        try {
            await axios.post("http://localhost:1337/services", { name, description, price });
            alert("Service added successfully!");
            setName("");
            setDescription("");
            setPrice("");
        } catch (error) {
            console.error("Error adding service:", error);
            alert("Failed to add service.");
        }
    };

    return (
        <div className="container">
            <Sidebar />
            <div className="content">
                <Typography variant="h4" className="page-title">Add Service</Typography>
                <TextField
                    label="Service Name"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
                <TextField
                    label="Description"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />
                <TextField
                    label="Price"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                />
                <Button variant="contained" color="primary" onClick={handleAddService}>
                    Add Service
                </Button>
            </div>
        </div>
    );
}

export default AddService;