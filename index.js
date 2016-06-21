var birdUuap = require('./lib/uuap.js')
var birdPassport = require('./lib/passport.js')
var client = require('./lib/httpClient.js')

module.exports = {
    uuap: birdUuap,
    passport: birdPassport,
    client: client
}