import mongoose from 'mongoose';

const imageSchema = new mongoose.Schema({}, {timestamps : true});

export const Image = mongoose.model('Image', imageSchema);