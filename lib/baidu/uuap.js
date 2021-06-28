/**
 * @file baidu > uuap > auth
 */

const client = require('./../httpClient');
const {URL} = require('url');
const JSEncrypt = require('node-jsencrypt');
const UUAP_SERVER = 'https://uuap.baidu.com/login';

const baiduUuap = module.exports = function (params, cb) {
    if (typeof params !== 'object') {
        throw new Error('Where are you params?');
    }

    const self = this;

    self._options = params;
    self._cb = cb || function () {};

    client.url_get(self._options.server || self._options.uuapServer || UUAP_SERVER
        , function (res, data) {
            self._options.lt = data.match(/name="lt" .*value="(.+?)"/)
                ? data.match(/name="lt" .*value="(.+?)"/)[1]
                : '';
            self._options.execution = data.match(/name="execution" value="(.+?)"/)
                ? data.match(/name="execution" value="(.+?)"/)[1]
                : '';
            _login(self._options, function (cookie) {
                self._cookie = cookie;
                self._cb(cookie);
            })
        }
    );
};

/**
 * 获取cookie
 * @type {get_cookies_string}
 */
baiduUuap.prototype.getCookie = client.get_cookies_string;

/**
 * 重试
 */
baiduUuap.prototype.retry = function (options) {
    baiduUuap(options || this._options, this._cb);
};

/**
 * Post登录
 * @param options
 * @param callback
 * @private
 */
function _login(options, callback) {
    const form = {
        username: options.username,
        password: options.password,
        rememberMe: 'on',
        lt: options.lt,
        execution: options.execution,
        _eventId: 'submit',
        type: 1
    };

    if (options.rsa) {
        const timestamp = new Date().getTime();
        const arr = [options.lt, timestamp, options.password];

        const encrypt = new JSEncrypt();
        encrypt.setPublicKey(options.rsa);
        const encryptedPassword = encrypt.encrypt(arr.join(','));

        form.password = encryptedPassword;
    }

    const tmp = new URL(options.server || options.uuapServer || UUAP_SERVER);

    client.post({
        protocol: tmp.protocol,
        host: tmp.hostname,
        port: tmp.port || (tmp.protocol == 'https:' ? 443 : 80),
        path: tmp.pathname,
        method: 'POST',
        headers: {
            'Referer': options.server || options.uuapServer || UUAP_SERVER,
        }
    }, form, function (res, data) {
        if (options.server || options.uuapServer) {
            client.get(options.server || (options.uuapServer + '?service=' + options.service), function (res, data) {
                callback(client.get_cookies_string());
            });
        }
        else {
            callback(client.get_cookies_string());
        }
    });
};
