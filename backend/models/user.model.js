import mongoose from 'mongoose';
 
const userSchema = new mongoose.Schema({
    username : {
        type: String,
        required: true,
        unique: true,
    },
    email : {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
    },
    password : {
        type: String,
        required: true,
    },
    profilePicture : {
        type: String,
        default: "",
    },
    address : {
        type: String,
        default: "",
    },
    phone : {
        type: String,
        default: "",
    },
    orders : [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order'
    }],
    
}, {timestamps: true});

export const User = mongoose.model('User', userSchema);