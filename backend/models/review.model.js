import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
    createdBy:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,

    },
    product:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
    },
    rating : {
        type: Number,
        required: true,
    },
    comment : {
        type: String,
        default: "",
    }
}, {timestamps : true});

export const Review = mongoose.model('Review', reviewSchema);