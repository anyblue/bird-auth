/**
 * baidu passport auth
 * get token
 * first post
 * if need to verify, to get verify code and repost
 */

'use strict'

var fs = require('fs');
var URL = require('url');
var readline = require('readline');

var client = require('./../httpClient');

var rl;

var options = {
    // sign_url: options.server + '/v2/api/?login'
};

var birdPassport = module.exports = function (params, cb) {
    if (typeof params !== 'object') {
        throw new Error('Where are you params?');
    }
    options.callback = cb;
    options.username = params.username;
    options.password = params.password;
    options.service = params.service || 'https://passport.baidu.com/v2/?login';

    if (!params.server) {
        var tmp = URL.parse(decodeURIComponent(options.service));
        options.server = tmp.protocol + '//' + tmp.hostname + (~~tmp.port ? ':' + tmp.port : '');
    }
    else {
        options.server = params.server;
    }
    options.sign_url = options.server + '/v2/api/?login';

    // GET BAIDUID
    client.url_get(options.server + '/v2/?login', function (res, data) {
        client.get(options.server + '/v2/api/?getapi&tpl=pp&apiver=v3&tt=' + Date.now() + '&class=login&logintype=dialogLogin&callback=bd__cbs__w5lrwn', function (res, data) {
            // console.log(data)
            options.token = data.match(/"token" : "(.*?)"/i)[1];
            Login();
        })
    });
};

function Login(data) {
    var form = data
    if (!data) {
        form = {
            'username': options.username,
            'password': options.password,
            'u': 'https://www.baidu.com/',
            'tpl': 'pp',
            'token': options.token,
            'codestring': '',
            'verifycode': '',
            'staticpage': options.server + '/static/passpc-account/html/v3Jump.html',
            'isPhone': 'false',
            'mem_pass': 'on'
        }
    }
    var tmp = URL.parse(options.sign_url)
    client.post({
        protocol: tmp.protocol,
        host: tmp.hostname,
        port: tmp.port || (tmp.protocol == 'https:' ? 443 : 80),
        path: tmp.path,
        method: 'POST',
        headers: {
            'Refer': 'https://www.baidu.com/'
        }
    }, form, function (res, data) {
        // console.log(data)
        if (data.match(/error=(\d+)/i)) {
            if (+data.match(/error=(\d+)/i)[1] === 257) {
                options.codestring = data.match(/codestring=(.+?)&username/i)[1];
                getVerifyCode();
            }
            else if (+data.match(/error=(\d+)/i)[1] === 0) {
                options.callback && options.callback(client.get_cookies_string());
            }
        }
        else if (data.match(/err_no=(\d+)&callback/i)) {
            if (+data.match(/err_no=(\d+)&callback/i)[1] === 0) {
                options.callback && options.callback(client.get_cookies_string());
            }
            else if (+data.match(/err_no=(\d+)&callback/i)[1] === 6) {
                options.codestring = data.match(/codestring=(.+?)&username/i)[1];
                getVerifyCode();
            }
        }
    })
}

function getVerifyCode() {
    var url = options.server + "/cgi-bin/genimage?" + options.codestring;
    client.url_get(url, function (res, data) {
        if (url.match(/rdtest|qatest/)) {
            Login({
                'apiver': 'v3',
                'codestring': options.codestring,
                'isPhone': '',
                'logLoginType': ' pc_loginDialog',
                'loginmerge': 'true',
                'logintype': 'dialogLogin',
                'mem_pass': 'on',
                'password': options.password,
                'ppui_logintime': '5452',
                'quick_user': '0',
                'safeflg': '0',
                'splogin': 'newuser',
                'staticpage': 'https://www.baidu.com/cache/user/html/v3Jump.html',
                'token': options.token,
                'tpl': 'mn',
                'tt': Date.now(),
                'u': options.server + '/',
                'username': options.username,
                'verifycode': 'aaaa'
            });
            return
        }
        fs.writeFile('./code.png', data, 'binary', function (err) {
            if (err) {
                console.log(err);
            }
            else {
                rl = readline.createInterface({
                    input: process.stdin,
                    output: process.stdout
                });
                require('child_process').exec('open ./code.png');
                rl.question('Please input the verify code : ', function (code) {
                    options.code = code;
                    rl.close();
                    require('child_process').exec('rm -rf ./code.png');
                    Login({
                        'apiver': 'v3',
                        'codestring': options.codestring,
                        'isPhone': '',
                        'logLoginType': ' pc_loginDialog',
                        'loginmerge': 'true',
                        'logintype': 'dialogLogin',
                        'mem_pass': 'on',
                        'password': options.password,
                        'ppui_logintime': '5452',
                        'quick_user': '0',
                        'safeflg': '0',
                        'splogin': 'newuser',
                        'staticpage': 'https://www.baidu.com/cache/user/html/v3Jump.html',
                        'token': options.token,
                        'tpl': 'mn',
                        'tt': Date.now(),
                        'u': options.server + '/',
                        'username': options.username,
                        'verifycode': options.code
                    });
                });
            }
        });
    }, function (res) {
        res.setEncoding('binary');
    });
}