const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, "please provide property title"]
    },
    location: {
        type: String,
        required: [true, "please provide property location"]
    },
    price: {
        type: String,
        required: [true, "please provide property price"]
    },
    numberOfBedrooms: {
        type: Number,
        required: [true, "please provide number of bedrooms"]
    },
    numberOfBathrooms: {
        type: Number,
        required: [true, "please provide number of bathrooms"]
    },
    image: {
        type: String,
        required: [true, "please provide property image URL"]
    },
}, {timestamps: true}
);


module.exports = mongoose.model('Property', propertySchema)