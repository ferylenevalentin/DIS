const mongoose = require("mongoose");

const PaymentSchema = new mongoose.Schema({
    amount: {
        type: Number,
        required: true,
    },
    date: {
        type: Date,
        default: Date.now,
    },
});

const ServiceSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
});

const SOASchema = new mongoose.Schema({
    patientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Patient",
        required: true,
    },
    services: [ServiceSchema], // List of services availed by the patient
    payments: [PaymentSchema], // List of payments made by the patient
    balance: {
        type: Number,
        default: 0, // Remaining balance for the patient
    },
});

const SOA = mongoose.model("SOA", SOASchema);

module.exports = SOA;