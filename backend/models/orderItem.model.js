import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema({});

export const OrderItem = mongoose.model("OrderItem", orderItemSchema);