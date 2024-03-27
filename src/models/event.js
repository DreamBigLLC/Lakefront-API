const mongoose = require("mongoose");

const reqString = {
    type: String,
    required: true,
}

const stageSchema = mongoose.Schema({
    stageName: reqString,
    stageId: mongoose.Schema.Types.ObjectId,
});

const artistSchema = mongoose.Schema({
    artistName: reqString,
    artistId: mongoose.Schema.Types.ObjectId,
});

const performanceSchema = mongoose.Schema({
    stage: mongoose.Schema.Types.ObjectId,
    artist: mongoose.Schema.Types.ObjectId,
    startTime: Date,
    endTime: Date,
});

const sponsorSchema = mongoose.Schema({
    category: reqString,
    name: reqString,
    src: reqString,
    href: reqString
});

const eventSchema = mongoose.Schema({
    startDate: Date,
    endDate: Date,
    eventName: reqString,
    eventId: mongoose.Schema.Types.ObjectId,
    stages: [stageSchema],
    artists: [artistSchema],
    performances: [performanceSchema],
    sponsors: [sponsorSchema]
});

module.exports = mongoose.model('Events', eventSchema);