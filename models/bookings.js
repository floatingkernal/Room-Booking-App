let mongoose = require('mongoose');

let bookingSchema = new mongoose.Schema({
    roomId: {
        type: String,
        required: true,
    },
    day: {
        type: Date,
        required: true
    },
    time: {
        start: {
            type: String,
            required: true
        },
        end: {
            type: String,
            required: true
        }
    },
    userId: {
        type: String,
        required: true
    },
    purposes: {
        type: [String],
        required: true
    }
});

const Booking = mongoose.model('Booking', bookingSchema);
module.exports = Booking;
