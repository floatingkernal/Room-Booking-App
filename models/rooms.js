let mongoose = require('mongoose');

let roomSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    address: {
        type: String,
        required: true
    },
    rating: {
        type: Number,
        min: 0,
        max: 5
    },
    reviews: [
        {
            reviewer: {
                type: String,
                required: true
            },
            date: {
                type: Date,
                required: true
            },
            comment: String,
            rating: {
                type: Number,
                required: true,
                min: 0,
                max: 5
            }
        }
    ],
    price: {
        type: Number,
        min: 0,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    purposes: {
        type: [String],
        required: true
    },
    hours: {
        start: {
            type: Number,
            required: true,
            min: 0,
            max: 1439
        },
        end: {
            type: Number,
            required: true,
            min: 0,
            max: 1439
        }
    },
    days: {
        type: [String],
        required: true
    },
    capacity: {
        type: Number,
        required: true
    },
    numberOfVists: {
        type: Number,
        default: 0
    },
    owner: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    images: [{
        id: String
    }]
});

const Room = mongoose.model('Room', roomSchema);
module.exports = Room;