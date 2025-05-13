const mongoose = require("mongoose");

const Patient = new mongoose.Schema(
    {
        id: { type: String, required: true, unique: true },
        firstName: { type: String, required: true },
        lastName: { type: String, required: true },
        middleName: { type: String },
        age: { type: Number, required: true },
        contact: { type: String, required: true },
        address: { type: String, required: true },
    },
    { collection: "patient-data" }
);


module.exports = mongoose.model("Patient", Patient);