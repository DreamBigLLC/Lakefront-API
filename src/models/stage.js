const mongoose = require("mongoose");

const reqString = {
    type: String,
    required: true,
}

const stageSchema = mongoose.Schema({
    stageName: reqString,
    stageId: mongoose.Schema.Types.ObjectId,
});

module.exports = mongoose.model('Stages', stageSchema);