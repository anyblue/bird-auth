#!/usr/bin/env node

var argv = require('yargs')
    .help('h')
    .alias('h', 'help')
    .alias('t', 'type')
    .default('t', 'uuap')
    .describe('t', 'which `uuap` or `passport` you want to use ?')
    .alias('u', 'username')
    .demand('u', true)
    .describe('u', 'username')
    .alias('p', 'password')
    .demand('p', true)
    .describe('p', 'password')
    .alias('s', 'server')
    .describe('s', "server(uuap need it), if you don't know this, you can logout you system and get url.")
    .argv;

var URL = require('url');

var uuap = require('./lib/uuap.js')
var passport = require('./lib/passport.js')

if (argv.t == 'uuap' && argv.s) {
    uuap({
        username: argv.u,
        password: argv.p,
        server: argv.s
    }, function (cookie) {
        console.log(cookie)
    })
}
else if (argv.t == 'passport'){
    passport({
        username: argv.u,
        password: argv.p
    }, function (cookie) {
        console.log(cookie)
    })
}