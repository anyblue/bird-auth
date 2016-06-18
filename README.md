## Intro

解决 [birdv1](https://github.com/weger/bird) 版本手动取cookie问题


## Start

```new birdUuap(options[, callback(cookie)])```

## Demo

```js
    var birdUuap = require('bird-uuap')

    var uuap = new birdUuap({
        username: 'xxx',
        password: 'xxx',
        uuapServer: 'http://xxx.baidu.com/login',
        dataServer: 'http://xxx.baidu.com/',
        bprouting: 'http://xxx.xxx.com:xxxx/bpservice=xxx' // erp stystem always use it, but this param isn't must
    }, function(cookie) {
        console.log(cookie)
    });
```

## More

```uuap.getCookie()```


## Version

- [1.1.1] rejectUnauthorized: fasle [detail](http://stackoverflow.com/questions/20082893/unable-to-verify-leaf-signature) Online uuap auth bugfix
- [1.1.0] add bprouting
- [1.0.1] statusCode === 302 judgment
- [1.0.0] project init