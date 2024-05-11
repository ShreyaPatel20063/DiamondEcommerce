import e from 'express';
import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
    name : {
        type: String,
        required: true,
        unique: true,
    },
    carat: {
        type: Number,
        required: true,
    },
    clarity: {
        type: String,
        required: true,
        enum : ["FL", "IF", "VVS1", "VVS2", "VS1", "VS2", "SI1", "SI2", "I1", "I2", "I3"],
    },
    color: {
        type: String,
        required: true,
        enum : ["D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N"],
    },
    cut: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    desciption:{
        type: String,
        required: true,
    },
    imageURLs:[{
        type: String,
        required: true,
    }],
}, {timestamps: true});

export const Product = mongoose.model('Product', productSchema);