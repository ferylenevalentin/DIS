const express = require("express");
const cors = require("cors");
const fs = require("fs");
const mongoose = require("mongoose");
const User = require("./models/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const Patient = require("./models/patient.model");
const Service = require("./models/service.model");
const Appointment = require("./models/appointment.model"); 
const SOA = require("./models/soa.model");
const app = express();
app.use(cors());
app.use(express.json());

const SECRET_KEY = "your_secret_key"
// MongoDB connection
mongoose.connect("mongodb://localhost:27017/DentalSystem")
    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => console.error("Error connecting to MongoDB:", err));

// Routes for patients
app.get("/fetchpatients", async (req, res) => {
    try {
        const patients = await Patient.find({}, "firstName lastName _id email");
        res.json(patients);
    } catch (error) {
        console.error("Error fetching patients:", error);
        res.status(500).json({ message: "Error fetching patients" });
    }
});

app.post("/addpatient", async (req, res) => {
    console.log("Request Body:", req.body); // Debugging line
    const newPatient = req.body;

    try {
        const patient = new Patient(newPatient);
        await patient.save();
        res.status(201).json(patient);
        console.log("Added Patient:", patient);
    } catch (error) {
        if (error.code === 11000) {
            res.status(400).json({ message: "Patient ID already exists. Please use a unique ID." });
        } else {
            console.error("Error adding patient:", error);
            res.status(500).json({ message: "Error adding patient" });
        }
    }
});

app.put("/updatepatient/:id", async (req, res) => {
    const { id } = req.params;
    const updatedPatient = req.body;

    try {
        const patient = await Patient.findOneAndUpdate({ id: id }, updatedPatient, { new: true });
        if (patient) {
            res.json({ message: "Patient updated successfully", updatedPatient: patient });
            console.log("Updated Patient:", patient);
        } else {
            res.status(404).json({ message: "Patient not found" });
        }
    } catch (error) {
        console.error("Error updating patient:", error);
        res.status(500).json({ message: "Error updating patient" });
    }
});

app.delete("/deletepatient/:id", async (req, res) => {
    const { id } = req.params;

    try {
        const patient = await Patient.findOneAndDelete({ id: id });
        if (patient) {
            res.json({ message: "Patient deleted successfully" });
            console.log("Deleted Patient ID:", id);
        } else {
            res.status(404).json({ message: "Patient not found" });
        }
    } catch (error) {
        console.error("Error deleting patient:", error);
        res.status(500).json({ message: "Error deleting patient" });
    }
});
app.post("/login", async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const token = jwt.sign({ id: user._id, role: user.role }, SECRET_KEY, { expiresIn: "1h" });
        res.json({ token, role: user.role });
    } catch (error) {
        console.error("Error during login:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
app.post("/signup", async (req, res) => {
    const { username, password, role } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10); // Hash the password
        const newUser = new User({ username, password: hashedPassword, role });
        await newUser.save();
        res.status(201).json({ message: "User created successfully" });
    } catch (error) {
        console.error("Error during sign up:", error);
        if (error.code === 11000) {
            res.status(400).json({ message: "Username already exists" });
        } else {
            res.status(500).json({ message: "Internal server error" });
        }
    }
});
// Fetch all users
app.get("/users", async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({ message: "Error fetching users" });
    }
});

// Update a user
app.put("/users/:id", async (req, res) => {
    const { id } = req.params;
    const { username, role } = req.body;

    try {
        const updatedUser = await User.findByIdAndUpdate(
            id,
            { username, role },
            { new: true }
        );
        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json({ message: "User updated successfully", user: updatedUser });
    } catch (error) {
        console.error("Error updating user:", error);
        res.status(500).json({ message: "Error updating user" });
    }
});

// Delete a user
app.delete("/users/:id", async (req, res) => {
    const { id } = req.params;

    try {
        const deletedUser = await User.findByIdAndDelete(id);
        if (!deletedUser) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json({ message: "User deleted successfully" });
    } catch (error) {
        console.error("Error deleting user:", error);
        res.status(500).json({ message: "Error deleting user" });
    }
});
// Fetch all services
app.get("/services", async (req, res) => {
    try {
        const services = await Service.find({}, "name price");
        res.json(services);
    } catch (error) {
        console.error("Error fetching services:", error);
        res.status(500).json({ message: "Error fetching services" });
    }
});

// Add a new service (Admin only)
app.post("/services", async (req, res) => {
    const { name, description, price } = req.body;

    try {
        const newService = new Service({ name, description, price });
        await newService.save();
        res.status(201).json({ message: "Service added successfully", service: newService });
    } catch (error) {
        console.error("Error adding service:", error);
        res.status(500).json({ message: "Error adding service" });
    }
});

// Update a service (Admin only)
app.put("/services/:id", async (req, res) => {
    const { id } = req.params;
    const { name, description, price } = req.body;

    try {
        const updatedService = await Service.findByIdAndUpdate(
            id,
            { name, description, price },
            { new: true }
        );
        if (!updatedService) {
            return res.status(404).json({ message: "Service not found" });
        }
        res.json({ message: "Service updated successfully", service: updatedService });
    } catch (error) {
        console.error("Error updating service:", error);
        res.status(500).json({ message: "Error updating service" });
    }
});

// Delete a service (Admin only)
app.delete("/services/:id", async (req, res) => {
    const { id } = req.params;

    try {
        const deletedService = await Service.findByIdAndDelete(id);
        if (!deletedService) {
            return res.status(404).json({ message: "Service not found" });
        }
        res.json({ message: "Service deleted successfully" });
    } catch (error) {
        console.error("Error deleting service:", error);
        res.status(500).json({ message: "Error deleting service" });
    }
});
app.post("/appointments", async (req, res) => {
    const { patientId, services, date, time, notes } = req.body;

    try {
        const newAppointment = new Appointment({ patientId, services, date, time, notes });
        await newAppointment.save();
        res.status(201).json({ message: "Appointment created successfully", appointment: newAppointment });
    } catch (error) {
        console.error("Error creating appointment:", error);
        res.status(500).json({ message: "Error creating appointment" });
    }
});

// Fetch all appointments
app.get("/appointments", async (req, res) => {
    try {
        const appointments = await Appointment.find()
            .populate("patientId", "firstName lastName")
            .populate("services", "name price");
        res.json(appointments);
    } catch (error) {
        console.error("Error fetching appointments:", error);
        res.status(500).json({ message: "Error fetching appointments" });
    }
});

// Update an appointment status
// Update an appointment
app.put("/appointments/:id", async (req, res) => {
    const { id } = req.params;
    const { patientId, services, date, time, notes, status } = req.body;

    try {
        const updatedAppointment = await Appointment.findByIdAndUpdate(
            id,
            { patientId, services, date, time, notes, status },
            { new: true }
        );
        if (!updatedAppointment) {
            return res.status(404).json({ message: "Appointment not found" });
        }
        res.json({ message: "Appointment updated successfully", appointment: updatedAppointment });
    } catch (error) {
        console.error("Error updating appointment:", error);
        res.status(500).json({ message: "Error updating appointment" });
    }
});

// Delete an appointment
app.delete("/appointments/:id", async (req, res) => {
    const { id } = req.params;

    try {
        const deletedAppointment = await Appointment.findByIdAndDelete(id);
        if (!deletedAppointment) {
            return res.status(404).json({ message: "Appointment not found" });
        }
        res.json({ message: "Appointment deleted successfully" });
    } catch (error) {
        console.error("Error deleting appointment:", error);
        res.status(500).json({ message: "Error deleting appointment" });
    }
});
app.get("/billing/:appointmentId", async (req, res) => {
    const { appointmentId } = req.params;

    try {
        const appointment = await Appointment.findById(appointmentId)
            .populate("patientId", "firstName lastName")
            .populate("services", "name price");

        if (!appointment) {
            return res.status(404).json({ message: "Appointment not found" });
        }

        res.json(appointment);
    } catch (error) {
        console.error("Error fetching billing data:", error);
        res.status(500).json({ message: "Error fetching billing data" });
    }
});
app.get("/soa/:patientId", async (req, res) => {
    const { patientId } = req.params;

    try {
        const soa = await SOA.findOne({ patientId })
            .populate("services", "name price")
            .populate("payments", "amount date");

        if (!soa) {
            return res.status(404).json({ message: "SOA not found for this patient" });
        }

        res.json(soa);
    } catch (error) {
        console.error("Error fetching SOA details:", error);
        res.status(500).json({ message: "Error fetching SOA details" });
    }
});
app.post("/soa/create", async (req, res) => {
    const { patientId, services } = req.body;

    try {
        const totalServicePrice = services.reduce((sum, service) => sum + service.price, 0);

        const newSOA = new SOA({
            patientId,
            services,
            balance: totalServicePrice,
        });

        await newSOA.save();
        res.status(201).json({ message: "SOA created successfully", soa: newSOA });
    } catch (error) {
        console.error("Error creating SOA:", error);
        res.status(500).json({ message: "Error creating SOA" });
    }
});
app.post("/soa/:patientId/payment", async (req, res) => {
    const { patientId } = req.params;
    const { amount } = req.body;

    if (!amount || amount <= 0) {
        return res.status(400).json({ message: "Invalid payment amount" });
    }

    try {
        const soa = await SOA.findOne({ patientId });

        if (!soa) {
            return res.status(404).json({ message: "SOA not found for this patient" });
        }

        // Add the payment to the payments array
        soa.payments.push({ amount });

        // Deduct the payment amount from the balance
        soa.balance -= amount;

        await soa.save();
        res.json({ message: "Payment recorded successfully", soa });
    } catch (error) {
        console.error("Error recording payment:", error);
        res.status(500).json({ message: "Error recording payment" });
    }
});
app.get("/appointments/patient/:patientId", async (req, res) => {
    const { patientId } = req.params;

    try {
        const appointments = await Appointment.find({ patientId })
            .populate("services", "name price")
            .populate("patientId", "firstName lastName");

        if (!appointments || appointments.length === 0) {
            return res.status(404).json({ message: "No appointments found for this patient" });
        }

        res.json(appointments);
    } catch (error) {
        console.error("Error fetching appointments for patient:", error);
        res.status(500).json({ message: "Error fetching appointments for patient" });
    }
});
// Default route
app.get("/", (req, res) => {
    res.send("Dental System API is running!");
});

// Start the server
const port = 1337;
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});