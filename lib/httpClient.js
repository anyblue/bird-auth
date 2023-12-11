/**
 * @file http client
 */

const http = require('http');
const https = require('https');
const {URL} = require('url');
const querystring = require('querystring');
const union = require('lodash.union');

const USER_AGENT = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.103 Safari/537.36';

let all_cookies = [];

let agent;

const _getNet = url => {
    let protocol = http;

    if (url.indexOf('https:') === 0) {
        protocol = https;
    }
    return protocol;
}

const get_cookies_string = function () {
    const cookie_map = {};

    all_cookies.forEach(function (ck) {
        const v = ck.split(';');
        v.forEach(function (item) {
            if (!item.match('path')) {
                const kv = item.trim().split('=');
                if (kv[1]) {
                    cookie_map[kv[0]] = kv[1];
                }
            }
        })
    });

    const cks = [];
    for (let k in cookie_map) {
        cks.push(k + '=' + cookie_map[k]);
    }

    return cks.join(';')
}

const update_cookies = function (cks) {
    if (cks) {
        all_cookies = union(all_cookies, cks);
    }
}

const set_cookies = function (cks, single) {
    if (cks) {
        all_cookies = union(all_cookies, single ? cks : cks.split(' '));
    }
}

const clear_cookies = function() {
    all_cookies = [];
}

// No Cookie Get
const url_get = function (url, options, callback) {
    const http_or_https = _getNet(url);

    if (url.match('passport')) {
        options.rejectUnauthorized = false;
        options.port = options.port || (options.protocol == 'https:' ? 443 : 80);
        agent = new https.Agent(options);
        options.agent = agent;
    }

    http_or_https.get(url, options, function (res) {
        all_cookies = [];
        set_cookies(res.headers['set-cookie'], true);

        let body = '';
        res.on('data', function (chunk) {
            return body += chunk;
        })
        res.on('end', function () {
            return callback(res, body);
        })
    }).on('error', function (e) {
        return console.error(e);
    });
}

// Cookie Post
const post = function (options, data, callback) {
    const http_or_https = _getNet(options.protocol);

    if (options.protocol === 'https:') {
        options.agent = agent;
    }

    if (typeof options.headers !== 'object') {
        options.headers = {};
    }

    const postData = options.headers['Content-Type'] ? JSON.stringify(data) : querystring.stringify(data);

    options.headers['Content-Type'] = options.headers['Content-Type'] || 'application/x-www-form-urlencoded';
    options.headers['Content-Length'] = Buffer.byteLength(postData);
    options.headers['Cookie'] = get_cookies_string();
    options.headers['User-Agent'] = USER_AGENT;

    const req = http_or_https.request(options, function (resp) {
        const res = resp;
        let body = '';
        resp.on('data', function (chunk) {
            body += chunk;
        })

        set_cookies(resp.headers['set-cookie'], true);

        resp.on('end', function (argument) {
            callback(res, body);
        })
    }).on('error', function (e) {
        return console.error(e);
    });

    req.write(postData);

    return req.end();
}

// Cookie Get
const get = function (url, callback) {
    const http_or_https = _getNet(url);

    const {protocol, hostname, port, pathname, search} = new URL(url);

    const options = {
        protocol,
        host: hostname,
        port: port || (protocol == 'https:' ? 443 : 80),
        path: pathname + search,
        method: 'GET',
        rejectUnauthorized: false,
        headers: {}
    }

    options.headers['Content-Type'] = 'application/x-www-form-urlencoded';
    options.headers['Cookie'] = get_cookies_string();
    options.headers['User-Agent'] = USER_AGENT;

    const req = http_or_https.request(options, function (res, data) {
        let body = '';
        res.on('data', function (chunk) {
            body += chunk;
        });

        set_cookies(res.headers['set-cookie'], true);

        return res.on('end', function (argument) {
            if (res.statusCode === 302 && res.headers.location.match(/^http/)) {
                get(res.headers.location, callback);
            } else {
                callback(res, body);
            }
        })
    }).on('error', function (e) {
        console.error(e, options);
    });

    return req.end();
}

module.exports = {
    url_get,
    get,
    post,
    get_cookies_string,
    update_cookies,
    set_cookies,
    clear_cookies
};
