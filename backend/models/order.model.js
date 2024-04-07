import mongoose from 'mongoose';

const orderSchema = new mongoose.model({});

export const Order = mongoose.model('Order', orderSchema);