var client = require('./httpClient');

var URL = require('url');

var options;

var birdUuap = module.exports = function (params, cb) {
    if (typeof params !== 'object') {
        throw new Error('Where are you params?');
    }
    options = params
    client.url_get(options.server || options.uuapServer, function(res, data) {
        options.lt = data.match(/name="lt" value="(.+?)"/)[1];
        options.execution = data.match(/name="execution" value="(.+?)"/)[1];
        uuapPost(cb)
    });
};


birdUuap.prototype.getCookie = function (cb) {
    return client.get_cookies_string()
};

// birdUuap.prototype.reloadConfig = function (params, cb) {
//     if (!params) {
//         throw new Error('Where are you params?');
//     }
//     options = params
//     client.url_get(options.uuapServer, function(res, data) {
//         options.lt = data.match(/name="lt" value="(.+?)"/)[1];
//         options.execution = data.match(/name="execution" value="(.+?)"/)[1];
//         uuapPost(cb)
//     });
// };

function uuapPost(cb) {
    var self = this;

    //Post登录
    var form = {
        username: options.username,
        password: options.password,
        rememberMe: 'on',
        lt: options.lt,
        execution: options.execution,
        _eventId: 'submit',
        type: 1
    };

    var tmp = URL.parse(options.server || options.uuapServer)

    client.post({
        protocol: tmp.protocol,
        host: tmp.hostname,
        port: tmp.port || (tmp.protocol == 'https:' ? 443 : 80),
        path: tmp.path,
        method: 'POST',
        headers: {
            'Referer': options.server || options.uuapServer,
        }
    }, form, function (res, data) {
        // console.log(data)
        client.get(options.server || (options.uuapServer + '?service' + options.service), function(res, data) {
            cb && cb(client.get_cookies_string());
        });
    });
};