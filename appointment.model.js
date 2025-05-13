const mongoose = require("mongoose");

const AppointmentSchema = new mongoose.Schema(
    {
        patientId: { type: mongoose.Schema.Types.ObjectId, ref: "Patient", required: true },
        services: [{ type: mongoose.Schema.Types.ObjectId, ref: "Service", required: true }],
        date: { type: Date, required: true },
        time: { type: String, required: true },
        notes: { type: String },
        status: { 
            type: String, 
            enum: ["Pending", "Done", "Cancelled"], 
            default: "Pending" 
        },
    },
    { collection: "appointment-data" }
);

module.exports = mongoose.model("Appointment", AppointmentSchema);