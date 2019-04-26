# wechat-backend-mp

微信公众号服务端接口封装

## Usage

```js
const API = require('./lib')
const api = new API({
  appId: 'xxx',
  appSecret: 'xxxx'
})

api[method](...)
```

初始化 API 的 `options` 参数说明：

- `appId`，**必需**，公众号唯一凭证，即 AppID，可在「微信公众平台 - 设置 - 开发设置」页中获得。（需要已经成为开发者，且帐号没有异常状态）
- `appSecret`，**必需**，公众号唯一凭证密钥，即 AppSecret，获取方式同 AppID
- `baseURL`，请求的基地址，如遇到异常，可以更换到备用服务器
- `timeout`，请求的超时时间，默认为 40 秒
- `printLog`，是否输出请求日志，供内部开发调试使用
