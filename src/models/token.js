const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const tokenSchema = new Schema({
    userId: Schema.Types.ObjectId,
    token: String,
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 3600,
    },
});

module.exports = mongoose.model('Token', tokenSchema);