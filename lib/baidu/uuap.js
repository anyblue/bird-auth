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

    // Url 处理
    // 是否还需要uuapServer, 是否统一整合成一个url 
    const url = (self._options.server || self._options.uuapServer || UUAP_SERVER).replace('login', '_login');
    client.url_get(url , function (res, data) {
        const {result} = JSON.parse(data);
        const {lt, execution, rsaPublicKey, _eventId, loginPath} = result;
        const loginOptions = {
            lt,
            execution,
            rsaPublicKey,
            _eventId,
            loginPath
        };

        _login(self._options, loginOptions, function (cookie) {
            self._cookie = cookie;
            self._cb(cookie);
        })
    });
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
function _login(options, loginOptions, callback) {
    const {username, password} = options;
    const {lt, execution, rsaPublicKey, _eventId, loginPath} = loginOptions;

    const form = {
        username,
        password,
        rememberMe: true,
        lt,
        execution,
        _eventId,
        type: 1
    };

    if (rsaPublicKey) {
        const timestamp = new Date().getTime();
        const arr = [lt, timestamp, password];

        const encrypt = new JSEncrypt();
        encrypt.setPublicKey(rsaPublicKey);
        const encryptedPassword = encrypt.encrypt(arr.join(','));

        form.password = encryptedPassword;
    }

    // const tmpObj = new URL(options.server || options.uuapServer || UUAP_SERVER); // TODO
    const tmpUrl = (options.server || options.uuapServer || UUAP_SERVER).replace('/login', loginPath);
    const tmpObj = new URL(tmpUrl);

    const {protocol, hostname, port, pathname, search} = tmpObj;

    client.post({
        protocol,
        host: hostname,
        port: port || (protocol == 'https:' ? 443 : 80),
        path: pathname + search,
        method: 'POST',
        headers: {
            'Referer': options.server || options.uuapServer || UUAP_SERVER,
        }
    }, form, function (res, data) {
        const {code, result} = JSON.parse(data);
        if (code === 302 && result.redirectUrl) {
            client.get(result.redirectUrl, function (res, data) {
                callback(client.get_cookies_string());
            });
        } else if (options.server || options.uuapServer) {
            client.get(options.server || (options.uuapServer + '?service=' + options.service), function (res, data) {
                callback(client.get_cookies_string());
            });
        } else {
            callback(client.get_cookies_string());
        }
    });
};
