/**
 * @file bird-auth > index
 */

var birdUuap = require('./lib/baidu/uuap.js');
var birdPassport = require('./lib/baidu/passport.js');
var birdNetease = require('./lib/netease/music.js');
var client = require('./lib/httpClient.js');

module.exports = {
    uuap: birdUuap,
    passport: birdPassport,
    baidu: {
        uuap: birdUuap,
        passport: birdPassport
    },
    netease: {
        music: birdNetease
    },
    client: client
};