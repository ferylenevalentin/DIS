const mongoose = require("mongoose");

const ServiceSchema = new mongoose.Schema(
    {
        name: { type: String, required: true, unique: true },
        description: { type: String, required: true },
        price: { type: Number, required: true },
    },
    { collection: "service-data" }
);

module.exports = mongoose.model("Service", ServiceSchema);