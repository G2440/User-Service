const mongoose = require("mongoose");

var userSchema = new mongoose.Schema({
    name: String,
    email: String,
    mobile: Number,
    age : Number,
    createdAt: {type: Date , default: Date.now()},
});

module.exports = mongoose.model("User",userSchema);








