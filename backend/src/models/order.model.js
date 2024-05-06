import mongoose from 'mongoose';
const orderItemSchema = new mongoose.Schema({
    product : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
    },
    quantity : {
        type: Number,
        required: true,
        default: 1,
    },
    price : {
        type: Number,
        required: true,
    }, 
});
const orderSchema = new mongoose.model({
    orderItems: [{
        type: orderItemSchema,
        required: true,
    }],
    status: {
        type: String,
        required: true,
        enum : ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"],
        default: "Pending",
        required: true,
    },
    deliveredAt: {
        type: Date,
        required: true,
    },
    shippingAddress: {
        type: String,
        required: true,
    },
    paymentMethod : [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'PaymentMethod',
        required: true,
    }],
    totalPrice: {
        type: Number,
        required: true,
    },
    
}, {timestamps: true});

export const Order = mongoose.model('Order', orderSchema);