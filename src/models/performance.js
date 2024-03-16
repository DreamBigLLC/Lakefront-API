const mongoose = require("mongoose");

const performanceSchema = mongoose.Schema({
    stage: mongoose.Schema.Types.ObjectId,
    artist: mongoose.Schema.Types.ObjectId,
    startTime: Date,
    endTime: Date,
});

module.exports = mongoose.model("Performances", performanceSchema);