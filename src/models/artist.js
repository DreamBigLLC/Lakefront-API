const mongoose = require("mongoose");

const reqString = {
    type: String,
    required: true,
}

const artistSchema = mongoose.Schema({
    artistName: reqString,
    src: reqString,
    href: reqString,
    artistId: mongoose.Schema.Types.ObjectId,
});

module.exports = mongoose.model('Artists', artistSchema);