const { uniqueNamesGenerator, adjectives, colors, animals } = require('unique-names-generator');
var crypto = require('crypto');

/**
 * Generates a random gadget name using adjectives and animals
 * @returns {string} A randomly generated gadget name in the format "adjective animal"
 * @example
 * // Returns something like "Happy Lion" or "Swift Eagle"
 * generateRandomGadgetName();
 */
function generateRandomGadgetName() {
    const shortName = uniqueNamesGenerator({
        dictionaries: [adjectives, animals, colors], // colors can be omitted here as not used
        length: 2
    });
    return shortName.replace('_', ' ')
}

/**
 * Generates a random integer between min (inclusive) and max (exclusive)
 * @param {number} [min=0] - The minimum value (inclusive)
 * @param {number} [max=100] - The maximum value (exclusive)
 * @returns {number} A random integer between min and max
 * @example
 * // Returns a number between 0 and 100
 * getRandomInt();
 * // Returns a number between 1 and 10
 * getRandomInt(1, 10);
 */
function getRandomInt(min=0, max=100) {
    const minCeiled = Math.ceil(min);
    const maxFloored = Math.floor(max);
    return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled); // The maximum is exclusive and the minimum is inclusive
}

/**
 * Checks if a string contains only numeric characters
 * @param {string} string - The string to check
 * @returns {boolean} True if the string contains only digits, false otherwise
 * @example
 * // Returns true
 * isNumeric("123");
 * // Returns false
 * isNumeric("123a");
 */
const isNumeric = (string) => /^\d+$/.test(string)

/**
 * Generates an MD5 hash of the provided password
 * @param {string} password - The password to hash
 * @returns {string} The MD5 hash of the password in hexadecimal format
 * @example
 * // Returns "5f4dcc3b5aa765d61d8327deb882cf99"
 * generateHash("password");
 */
function generateHash(password) {
    return crypto.createHash('md5').update(password).digest('hex')
}

module.exports = {
    generateRandomGadgetName,
    getRandomInt,
    isNumeric,
    generateHash
};