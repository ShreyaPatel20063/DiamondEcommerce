const mongoose = require("mongoose");
const UserSchema = new mongoose.Schema({
    uid:{},
    uname:{},
    uemail:{},
    upassword:{},
    ucontact:{},
    uaddress:{},
    ucity:{},
});