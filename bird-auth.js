#!/usr/bin/env node

var argv = require('yargs')
    .help('h')
    .alias('h', 'help')
    .alias('t', 'type')
    .default('t', 'baidu_uuap')
    .describe('t', 'baidu_uuap, baidu_uuap, netease_music')
    .alias('u', 'username')
    .demand('u', true)
    .describe('u', 'username')
    .alias('p', 'password')
    .demand('p', true)
    .describe('p', 'password')
    .alias('s', 'server')
    .describe('s', "server(baidu_uuap need it), if you don't know this, you can logout you system and get url.")
    .argv;

var baiduUuap = require('./lib/baidu/uuap.js');
var baiduPassport = require('./lib/baidu/passport.js');
var neteaseMusic = require('./lib/netease/music.js');


var CALLBACK = function (cookie) {
    console.log(cookie);
    return cookie;
};

switch (argv.t) {
    case 'baidu_uuap':
        baiduUuap({
            username: argv.u,
            password: argv.p,
            server: argv.s
        }, CALLBACK);
        break;
    case 'baidu_passport':
        baiduPassport({
            username: argv.u,
            password: argv.p,
            server: argv.s
        }, CALLBACK);
        break;
    case 'netease_music':
        neteaseMusic({
            username: argv.u,
            password: argv.p
        }, CALLBACK);
        break;
    default:
        break;
}
