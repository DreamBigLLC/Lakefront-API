const mongoose = require("mongoose");

const reqString = {
    type: String,
    required: true,
}

const sponsorsSchema = mongoose.Schema({
    name: reqString,
    src: reqString,
    href: reqString,
})

const sponsorSchema = mongoose.Schema({
    category: reqString,
    sponsors: [sponsorsSchema]
});

module.exports = mongoose.model('Sponsors', sponsorSchema);