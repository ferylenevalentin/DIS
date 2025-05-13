import React, { useState, useRef } from 'react';
import Sidebar from '../pages/Sidebar';
import { TextField, Button, Typography, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import axios from 'axios';
import './AddPatient.css';

function AddPatient() {
    const [openModal, setOpenModal] = useState(false);
    const idRef = useRef();
    const firstNameRef = useRef();
    const lastNameRef = useRef();
    const middleNameRef = useRef();
    const ageRef = useRef();
    const contactRef = useRef();
    const addressRef = useRef();

    const handleOpenModal = () => {
        setOpenModal(true);
    };

    const handleCloseModal = () => {
        setOpenModal(false);
    };

    const handleAddPatient = async () => {
        const newPatient = {
            id: idRef.current.value,
            firstName: firstNameRef.current.value,
            lastName: lastNameRef.current.value,
            middleName: middleNameRef.current?.value || "", // Optional field
            age: parseInt(ageRef.current.value), // Ensure age is a number
            contact: contactRef.current.value,
            address: addressRef.current.value,
        };
    
        console.log("New Patient Data:", newPatient); // Log the patient data before sending
    
        try {
            const response = await axios.post("http://localhost:1337/addpatient", newPatient);
            alert("Patient added successfully!");
            handleCloseModal();
        } catch (error) {
            console.error("Error adding patient:", error.response?.data || error.message);
            alert("Failed to add patient. Please try again.");
        }
    };
    return (
        <div className="container">
            <Sidebar />
            <div className="content">
                <Typography variant="h4" className="page-title">Add Patient</Typography>
                <hr />
                <Button onClick={handleOpenModal} variant="contained" color="primary">Add Patient</Button>
                
                <Dialog open={openModal} onClose={handleCloseModal}>
                    <DialogTitle>Add New Patient</DialogTitle>
                    <DialogContent>
                        <TextField inputRef={idRef} label="Patient ID" variant="outlined" fullWidth margin="normal" />
                        <TextField inputRef={firstNameRef} label="First Name" variant="outlined" fullWidth margin="normal" />
                        <TextField inputRef={lastNameRef} label="Last Name" variant="outlined" fullWidth margin="normal" />
                        <TextField inputRef={middleNameRef} label="Middle Name" variant="outlined" fullWidth margin="normal" />
                        <TextField inputRef={ageRef} label="Age" variant="outlined" fullWidth margin="normal" />
                        <TextField inputRef={contactRef} label="Contact Number" variant="outlined" fullWidth margin="normal" />
                        <TextField inputRef={addressRef} label="Address" variant="outlined" fullWidth margin="normal" />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseModal} color="primary">Cancel</Button>
                        <Button onClick={handleAddPatient} color="primary">Add Patient</Button>
                    </DialogActions>
                </Dialog>
            </div>
        </div>
    );
}

export default AddPatient;