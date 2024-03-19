const mongoose = require("mongoose");

const reqString = {
    type: String,
    required: true,
}

const sponsorSchema = mongoose.Schema({
    category: reqString,
    name: reqString,
    src: reqString,
    href: reqString,
});

module.exports = mongoose.model('Sponsors', sponsorSchema);