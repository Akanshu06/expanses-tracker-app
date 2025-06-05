const mongoose = require("mongoose");

// Define the forgotPasswordRequest schema
const forgotPasswordRequestSchema = new mongoose.Schema({
  // Use mongoose's UUID type or a string to represent UUIDs
  id: {
    type: mongoose.Schema.Types.String, // UUIDs are often stored as strings
    default: () => require("uuid").v4(), // Generate a UUID by default
    required: true,
    unique: true,
  },
  active: {
    type: Boolean,
    default: true, // Default value if not specified
  },
  expiresby: { type: Date, required: true },
});

// Create the model from the schema
const forgotPasswordRequest = mongoose.model(
  "forgotPasswordRequest",
  forgotPasswordRequestSchema
);

module.exports = forgotPasswordRequest;
