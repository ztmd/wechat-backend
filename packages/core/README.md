# wechat-backend

Backend for WeChat.

## Install

```
npm install wechat-backend
```

## Usage

```js
const {
  Minigame,
  Miniprogram,
  Mp,
  Pay
} = require('wechat-backend');

const game = new Minigame(...);
const program = new Miniprogram(...);
const mp = new Mp(...);
const pay = new Pay(...);
```

## Doc

See [wechat-backend-minigame], [wechat-backend-miniprogram], [wechat-backend-mp], [wechat-backend-pay].

[wechat-backend-minigame]: https://www.npmjs.com/package/wechat-backend-minigame
[wechat-backend-miniprogram]: https://www.npmjs.com/package/wechat-backend-miniprogram
[wechat-backend-mp]: https://www.npmjs.com/package/wechat-backend-mp
[wechat-backend-pay]: https://www.npmjs.com/package/wechat-backend-pay
