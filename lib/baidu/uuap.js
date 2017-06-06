/**
 * @file baidu > uuap > auth
 */

var client = require('./../httpClient');

var URL = require('url');

var UUAP_SERVER = 'https://uuap.baidu.com/login';

var baiduUuap = module.exports = function (params, cb) {
    if (typeof params !== 'object') {
        throw new Error('Where are you params?');
    }

    var self = this;

    self._options = params;
    self._cb = cb || function () {
        };
    client.url_get(self._options.server || self._options.uuapServer || UUAP_SERVER
        , function (res, data) {
            self._options.lt = data.match(/name="lt" value="(.+?)"/)
                ? data.match(/name="lt" value="(.+?)"/)[1]
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
    var form = {
        username: options.username,
        password: options.password,
        rememberMe: 'on',
        lt: options.lt,
        execution: options.execution,
        _eventId: 'submit',
        type: 1
    };

    var tmp = URL.parse(options.server || options.uuapServer || UUAP_SERVER);

    client.post({
        protocol: tmp.protocol,
        host: tmp.hostname,
        port: tmp.port || (tmp.protocol == 'https:' ? 443 : 80),
        path: tmp.path,
        method: 'POST',
        headers: {
            'Referer': options.server || options.uuapServer || UUAP_SERVER,
        }
    }, form, function (res, data) {
        // console.log(data)
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