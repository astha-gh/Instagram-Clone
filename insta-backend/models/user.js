const mongoose = require('mongoose');
const {ObjectId} = mongoose.Schema.Types;
const userSchema = new mongoose.Schema({
    name : {
        type : String,
        required : true,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    pic: {
        type: String,
        default: "https://res.cloudinary.com/dislhmbst/image/upload/v1749119635/Screenshot_2025-06-05_160345_xy7pgi.png",
    },
    followers : [{type : ObjectId  , ref : "User"}],
    following: [{ type: ObjectId, ref: "User" }]
});

mongoose.model("User" , userSchema);