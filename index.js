/**
 * @file bird-auth > index
 */

const uuap = require('./lib/baidu/uuap.js');
const passport = require('./lib/baidu/passport.js');
const birdNetease = require('./lib/netease/music.js');
const client = require('./lib/httpClient.js');

module.exports = {
    uuap,
    passport,
    baidu: {
        uuap,
        passport
    },
    netease: {
        music: birdNetease
    },
    client
};
