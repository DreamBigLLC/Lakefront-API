const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
    {
        name: {
            type: String,
            trim: true,
            require: true,
            max: 64
        },
        email: {
            type: String,
            trim: true,
            require: true,
        },
        phone: {
            type: String,
            trim: true,
            require: true
        },
        password: {
            type: String,
            require: true
        },
        confirmPassword: {
            type: String,
            require: true
        },
        userType: {
            type: String,
            default: "client"
        },
        id: mongoose.Schema.Types.ObjectId,
        resetLink: {
            type: String,
            default: "",
        }
    }
);

module.exports = mongoose.model("Users", userSchema);