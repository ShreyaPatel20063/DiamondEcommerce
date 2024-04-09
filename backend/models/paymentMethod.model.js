import mongoose from "mongoose";

const paymentMethodSchema = new mongoose.Schema({
    paymentType: {
        type: String,
        required: true,
    },
    cardDetails: {
        type: String,
        required: true,
    },
});

export const PaymentMethod = mongoose.model("PaymentMethod", paymentMethodSchema);