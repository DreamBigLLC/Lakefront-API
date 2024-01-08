const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema(
    {
        email: String,
        phone: Number,
        password: String,
        id: mongoose.Schema.Types.ObjectId,
        // authToken: String
    }
);

module.exports = mongoose.model('User', userSchema);