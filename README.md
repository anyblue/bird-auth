# bird-auth

[![NPM Version][npm-image]][npm-url]
![NODE Version][node-image]
![OSX Build][osx-image]
![LINUX Build][liunx-image]

解决 [birdv1](https://github.com/weger/bird) 版本手动取cookie问题, 支持网易云音乐、百度认证。

## Install

`npm install --save-dev bird-auth`

## API

### birdAuth

| name | api | instance function |
| :----- | :----- | :----- |
| `client` | `client[fn]` | not support |
| `baidu.uuap` | `birdAuth.baidu.uuap(options[, callback])` | `retry`, `getCookie` |
| `baidu.passport`| `birdAuth.baidu.passport(options[, callback])` | `getCookie` |
| `netease.music`| `birdAuth.netease.music(options[, callback])` | `retry`, `getCookie`, `aesEncrypt` |


### client

| method | demo | detail |
| :----- | :-- | :----- |
| `url_get` | `client.url_get(url, callback)` | get method(no cookie) |
| `get` | `client.get(url, callback)` | get method(with cookie) |
| `post` | `client.post(options, callback)` | post method(with cookie) |
| `get_cookies_string` | `client.get_cookies_string()` | get all cookies |
| `update_cookies` | `client.update_cookies(cookies, true)` | update new cookies |
| `set_cookies` | `client.set_cookies(cookies, true)` | set new cookies |
| `clear_cookies` | `client.clear_cookies()` | remove all cookies |


## Command Line

usage: `bird -u xxx -p xxx -t netseae_music`

```bash
Options:
  -h, --help      Show help                                           [boolean]
  -t, --type      baidu_uuap, baidu_passport, netease_music           [default: "baidu_uuap"]
  -u, --username  username                                            [required]
  -p, --password  password                                            [required]
  -s, --server    server(baidu_uuap need it), if you don't know this, you can logout you system and get url.
```

## Examples

#### baidu uuap auth

```javascript
const birdAuth = require('bird-auth')
const uuap = new birdAuth.baidu.uuap({
    username: 'xxx',
    password: 'xxx',
    type: 3, // default 1 is username and password; 3 is username and verification code.
    uuapServer: 'http://xxx.baidu.com/login', // CAS auth url 
    service: 'http://xxx.baidu.com/' // service address, if you don't know this url, you can logout you system, and get `service` parameters
}, function(cookie) {
    console.log(cookie)
});

uuap.retry({
    username: 'xxx',
    password: 'xxx',
    uuapServer: 'http://xxx.baidu.com/login',
    service: 'http://xxx.baidu.com/'
});
```

#### baidu passport auth

```javascript
const birdAuth = require('bird-auth')
const passport = new birdAuth.baidu.passport({
    username: 'xxx',
    password: 'xxx',
    service: 'https://passport.baidu.com/v2/?login' //default passport.baidu.com
}, function(cookie) {
    console.log(cookie)
});
```

#### netease music auth

```javascript
const birdAuth = require('bird-auth')
const music = new birdAuth.netease.music({
    username: 'xxx', // phone number or mail
    password: 'xxx'
}, function(cookie) {
    console.log(cookie)
});
```

## History

- [2.4.1] fix url check method.
- [2.4.0] switch login to authorize.
- [2.3.1] add type option to auth parameter.
- [2.3.0] fix token verification mechanism.
- [2.2.1] modify parameter naming.
- [2.2.0] change login to authorize.
- [2.1.0] remove service params.
- [2.0.0] refactor & update auth.
- [1.2.8] add auth rsa check.
- [1.2.7] add `client.set_cookies & client.clear_cookies` method.
- [1.2.5] add `client.update_cookies` method.
- [1.2.4] fix passport test(qatest/rdtest) auth bug.
- [1.2.0] group auth and add netease music auth.
- [1.1.10] add httpClient Content-Type adjust.
- [1.1.9] fix passport agent.
- [1.1.6] Fixup 302 response location is not a normal url 😂
- [1.1.3] Custom agent to fix https authorized bug. :(
- [1.1.0] Add `bird-auth` command, you can use `bird-auth -h` to see more :)
- [1.0.6] Fixed get_cookies_string bug
- [1.0.5] Fixed Syntax Error
- [1.0.4] Fixed passport auth bugfix
- [1.0.3] Project init

[npm-image]: https://img.shields.io/badge/npm-v5.3.6-blue.svg
[npm-url]: https://npmjs.org/package/bird-auth
[node-image]: https://img.shields.io/badge/node-v10.0.0%2B-yellow.svg
[osx-image]: https://img.shields.io/badge/OSX-passing-brightgreen.svg
[liunx-image]: https://img.shields.io/badge/Liunx-passing-brightgreen.svg

## Future
- refactor with typescript.
- optimize function, remove useless code.
- <s>Change account and get cookie afresh</s>
- <s>Support Https</s>
- <s>Support online Passport auth</s>
- <s>Set rejectUnauthorized false and fix uuap auth bug.</s> [detail](http://stackoverflow.com/questions/20082893/unable-to-verify-leaf-signature)
- <s>Add bprouting support</s>
- <s>statusCode === 302 judgment</s>