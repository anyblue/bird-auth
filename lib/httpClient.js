var http = require('http');
var https = require('https');
var URL = require('url');
var querystring = require('querystring');
var _ = require('lodash');

var all_cookies = []

var get_cookies_string = function () {

    var cookie_map = {};

    all_cookies.forEach(function (ck) {

        var v = ck.split(';');
        v.forEach(function(item) {
            if(!item.match('path')) {
                var kv = item.trim().split('=');
                if (kv[1]) {
                    cookie_map[kv[0]] = kv[1];
                }
            } 
        })
    });

    var cks = [];
    for (var k in cookie_map) {
        cks.push(k + '=' + cookie_map[k]);
    }

    return cks.join(';')
}

var update_cookies = function (cks) {
    if (cks) {
        all_cookies = _.union(all_cookies, cks);
    }
}

// No Cookie Get
var url_get = function (url, callback, pre_callback) {
    // console.log(url)
    var http_or_https = http;

    // http or https判断
    if (url.indexOf('https:') === 0) {
         http_or_https = https;
    }
    return http_or_https.get(url, function(res) {
        if (pre_callback) pre_callback(res);
        // all_cookies = []
        update_cookies(res.headers['set-cookie']);

        var body = '';
        res.on('data', function (chunk) {
            return body += chunk;
        })
        res.on('end', function () {
            return callback(res, body);
        })
    }).on('error', function (e) {
        return console.log(e);
    });
}

// Cookie Post
var post = function (options, data, callback) {
    var http_or_https = http;

    //ΩΩ http or https判断
    if (options.protocol === 'https:') {
         http_or_https = https;
    }

    var postData = querystring.stringify(data);

    if (typeof options.headers !== 'object') {
        options.headers = {};
    }

    options.headers['Content-Type'] = 'application/x-www-form-urlencoded';
    options.headers['Content-Length'] = Buffer.byteLength(postData);
    options.headers['Cookie'] = get_cookies_string();
    options.headers['User-Agent'] = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.103 Safari/537.36';

    var req = http_or_https.request(options, function (resp) {
        var res = resp;
        var body = '';
        resp.on('data', function (chunk) {
            body += chunk;
        })

        update_cookies(resp.headers['set-cookie']);

        resp.on('end', function (argument) {
            callback(res, body);
        })
    }).on('error', function (e) {
        return console.log(e);
    });

    req.write(postData);

    return req.end();
}

// Cookie Get
var get = function (url, callback) {
    // console.log(url)
    var http_or_https = http;

    // http or https判断
    if (url.indexOf('https:') === 0) {
         http_or_https = https;
    }
    var tmpUrl = URL.parse(url);

    var options = {
        protocol: tmpUrl.protocol,
        host: tmpUrl.hostname,
        port: tmpUrl.port || (tmpUrl.protocol == 'https:' ? 443 : 80),
        path: tmpUrl.path,
        method: 'GET',
        rejectUnauthorized: false,
        headers: {}
    }

    // options.headers['Referer'] = global.refer;
    options.headers['Content-Type'] = 'application/x-www-form-urlencoded';
    options.headers['Cookie'] = get_cookies_string();
    options.headers['User-Agent'] = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.103 Safari/537.36';

    var req = http_or_https.request(options, function (res) {
        var body = '';
        res.on('data', function (chunk) {
            body += chunk;
        })
        // console.log(res.headers['set-cookie'])
        update_cookies(res.headers['set-cookie']);

        return res.on('end', function (argument) {
            // console.log(res.statusCode)
            if (res.statusCode === 302) {
                var urls = res.headers.location;
                get(urls, callback)
            }
            else {
                callback(res, body);
            }
        })
    }).on('error', function (e) {
        console.log(e, options);
    });

    return req.end();
}

module.exports = {
    url_get: url_get,
    get: get,
    post: post,
    get_cookies_string: get_cookies_string
};