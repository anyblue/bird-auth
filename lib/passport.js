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

var client = require('./httpClient');

var rl;

var options = {
    sign_url: 'https://passport.baidu.com/v2/api/?login'
};

var birdPassport = module.exports = function (params, cb) {
    if (!params) {
        throw new Error('Where are you params?');
    }
    if (typeof params === 'Object') {
        throw new Error('What you params?');
    }
    options.callback = cb;
    options.username = params.username;
    options.password = params.password;

    // GET BAIDUID
    client.url_get('https://www.baidu.com/', function(res, data) {
        client.get('https://passport.baidu.com/v2/api/?getapi&tpl=pp&apiver=v3&tt=' + Date.now() + '&class=login&logintype=dialogLogin&callback=bd__cbs__w5lrwn', function(res, data) {
            // console.log(data)
            options.token = data.match(/"token" : "(.*?)"/i)[1];
            Login();
        })
    });
};

function Login (data) {
    var form = data
    if (!data) {
        form = {
            'username': options.username,
            'password': options.password,
            'u': 'https://passport.baidu.com/',
            'tpl': 'pp',
            'token': options.token,
            'codestring': '',
            'verifycode': '',
            'staticpage': 'https://passport.baidu.com/static/passpc-account/html/v3Jump.html',
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
    }, form, function(res, data) {
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

function getVerifyCode () {
    rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });
    var url = "https://passport.baidu.com/cgi-bin/genimage?" + options.codestring;
    client.url_get(url, function(res, data) {
        fs.writeFile('./code.png', data, 'binary', function (err) {
            if (err) {
                console.log(err);
            }
            else {
                require('child_process').exec('open ./code.png');
                rl.question('Please input the verify code : ', (code) => {
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
                        'u': 'https://www.baidu.com/',
                        'username': options.username,
                        'verifycode': options.code,
                    });
                });
            }
        });
    }, function(res){
        res.setEncoding('binary');
    });
}