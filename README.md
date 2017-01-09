# bird-auth

[![NPM Version][npm-image]][npm-url]
![NODE Version][node-image]
![OSX Build][osx-image]
![LINUX Build][liunx-image]

解决 [birdv1](https://github.com/weger/bird) 版本手动取cookie问题

## Install

`npm install --save-dev bird-auth`

## Examples

<!-- ```new birdAuth.uuap(options[, callback(cookie)])``` -->

```new birdAuth.passport(options[, callback(cookie)])```

## Demo

<!-- #### Uuap auth

``` js
var birdAuth = require('bird-auth')
var uuap = new birdAuth.uuap({
    username: 'xxx',
    password: 'xxx',
    uuapServer: 'http://xxx.baidu.com/login', // CAS auth url 
    service: 'http://xxx.baidu.com/' // service address, if you don't know this url, you can logout you system, and get `service` parameters
}, function(cookie) {
    console.log(cookie)
});
``` -->

#### Passport auth

``` js
var birdAuth = require('bird-auth')
var passport = new birdAuth.passport({
    username: 'xxx',
    password: 'xxx',
    service: 'https://passport.baidu.com/v2/?login' //default passport.baidu.com
}, function(cookie) {
    console.log(cookie)
});
```

## Future

- Windows environment when execute passport auth, can't use `open` command to open verify-code picture
- Change account and get cookie afresh
- <s>Support Https</s>
- <s>Support online Passport auth</s>
- <s>Set rejectUnauthorized false and fix uuap auth bug.</s> [detail](http://stackoverflow.com/questions/20082893/unable-to-verify-leaf-signature)
- <s>Add bprouting support</s>
- <s>statusCode === 302 judgment</s>

## History

- [1.1.8] fix passport agent.
- [1.1.6] Fixup 302 response location is not a normal url 😂
- [1.1.3] Custom agent to fix https authorized bug. :(
- [1.1.0] Add `bird-auth` command, you can use `bird-auth -h` to see more :)
- [1.0.6] Fixed get_cookies_string bug
- [1.0.5] Fixed Syntax Error
- [1.0.4] Fixed passport auth bugfix
- [1.0.3] Project init

[npm-image]: https://img.shields.io/badge/npm-v1.1.8-blue.svg
[npm-url]: https://npmjs.org/package/bird-auth
[node-image]: https://img.shields.io/badge/node-v0.12.0%2B-yellow.svg
[osx-image]: https://img.shields.io/badge/OSX-passing-brightgreen.svg
[liunx-image]: https://img.shields.io/badge/Liunx-passing-brightgreen.svg