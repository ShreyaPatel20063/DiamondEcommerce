import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema({}, {timestamps: true});

export const OrderItem = mongoose.model("OrderItem", orderItemSchema);