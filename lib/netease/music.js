/**
 * @file netease > music > auth
 */

var URL = require('url');

var client = require('./../httpClient');
var crypto = require('./crypto');

var neteaseMusic = module.exports = function (params, cb) {
    if (typeof params !== 'object') {
        throw new Error('Where are you params?');
    }

    var self = this;

    self._options = params;
    self._cb = cb || function () {
        };
    // console.log(params);
    var url,
        pattern = /^0\d{2,3}\d{7,8}$|^1[34578]\d{9}$/,
        body = {
            password: crypto.MD5(params.password),
            rememberLogin: 'false'
        };

    if (pattern.test(params.username)) {
        body.phone = params.username;
        url = 'http://music.163.com/weapi/login/cellphone/';
    } else {
        body.username = params.username;
        url = 'http://music.163.com/weapi/login';
    }

    _login(url, crypto.aesRsaEncrypt(JSON.stringify(body)), function (cookie) {
        self._cookie = cookie;
        self._cb(cookie);
    });
};

/**
 * 获取cookie
 * @type {get_cookies_string}
 */
neteaseMusic.prototype.getCookie = client.get_cookies_string;

/**
 * 加密参数
 * @type {Crypto.aesEncrypt}
 */
neteaseMusic.prototype.aesEncrypt = crypto.aesEncrypt;

/**
 * 重试
 */
neteaseMusic.prototype.retry = function (options) {
    neteaseMusic(options || this._options, this._cb);
};

function _login(url, encBody, callback) {

    var tmp = URL.parse(url);

    client.post({
        protocol: tmp.protocol,
        host: tmp.hostname,
        port: tmp.port || (tmp.protocol == 'https:' ? 443 : 80),
        path: tmp.path,
        method: 'POST',
        headers: {
            'Referer': 'http://music.163.com/'
        }
    }, encBody, function (res, data) {
        callback(client.get_cookies_string());
    });
};

