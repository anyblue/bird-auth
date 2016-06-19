## Intro

解决 [birdv1](https://github.com/weger/bird) 版本手动取cookie问题


## Start

```new birdAuth.uuap(options[, callback(cookie)])```
```new birdAuth.passport(options[, callback(cookie)])```

## Demo

### Uuap auth

```js
    var birdAuth = require('bird-auth')

    var uuap = new birdAuth.uuap({
        username: 'xxx',
        password: 'xxx',
        uuapServer: 'http://xxx.baidu.com/login',
        dataServer: 'http://xxx.baidu.com/',
        bprouting: 'http://xxx.xxx.com:xxxx/bpservice=xxx' // erp stystem always use it, but this param isn't must
    }, function(cookie) {
        console.log(cookie)
    });
```

### Passport auth

```js
    var birdAuth = require('bird-auth')

    var passport = new birdAuth.passport({
        username: 'xxx',
        password: 'xxx'
    }, function(cookie) {
        console.log(cookie)
    });
```

## More

- [Funtion] getCookie


## History

- [1.2.0] Add Passport auth
- [1.1.1] Set rejectUnauthorized false and fix uuap auth bug. [detail](http://stackoverflow.com/questions/20082893/unable-to-verify-leaf-signature) 
- [1.1.0] Add bprouting
- [1.0.1] statusCode === 302 judgment
- [1.0.0] Project init