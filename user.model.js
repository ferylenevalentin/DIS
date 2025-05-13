const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
    {
        username: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        role: { type: String, enum: ["admin", "staff"], required: true }, // Role can be admin or staff
    },
    { collection: "user-data" } // Specify the collection name
);

module.exports = mongoose.model("User", UserSchema);