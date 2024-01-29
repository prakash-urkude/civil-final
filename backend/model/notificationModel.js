const mongoose = require("mongoose");

const notificationSchema = mongoose.Schema({
    to: {
        type: mongoose.Schema.Types.ObjectId, // Corrected field type definition
        required: true
    },
    title: {
        type: String,
        default: ''
    },
    message: {
        type: String,
        required: true
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Notification', notificationSchema);
