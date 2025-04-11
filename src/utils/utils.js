const { uniqueNamesGenerator, adjectives, colors, animals } = require('unique-names-generator');
var crypto = require('crypto');

function generateRandomGadgetName() {
    const shortName = uniqueNamesGenerator({
        dictionaries: [adjectives, animals, colors], // colors can be omitted here as not used
        length: 2
    });
    return shortName.replace('_', ' ')
}

function getRandomInt(min=0, max=100) {
    const minCeiled = Math.ceil(min);
    const maxFloored = Math.floor(max);
    return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled); // The maximum is exclusive and the minimum is inclusive
}

const isNumeric = (string) => /^\d+$/.test(string)

function generateHash(password) {
    return crypto.createHash('md5').update(password).digest('hex')
}

module.exports = {
    generateRandomGadgetName,
    getRandomInt,
    isNumeric,
    generateHash
};