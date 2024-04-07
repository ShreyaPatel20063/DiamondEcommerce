import mongoose from 'mongoose';

const orderSchema = new mongoose.model({}, {timestamps: true});

export const Order = mongoose.model('Order', orderSchema);