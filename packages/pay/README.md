# wechat-backend-minigame

针对**普通商户**的微信支付接口封装。

通常接口也适用于服务商版和银行服务商版。

[微信支付官方文档](https://pay.weixin.qq.com/wiki/doc/api/index.html)

## Usage

```js
const API = require('./lib')
const api = new API({
  appId: '...',
  mchId: '...',
  mchKey: '...'
})

api[method](...)
```

初始化 API 的 `options` 参数说明：

- `appId`，**必需**，公众号标识，即 AppID，可在「微信公众平台 - 设置 - 开发设置」页中获得。（需要已经成为开发者，且帐号没有异常状态）。
- `mchId`，**必需**，商户号。
- `mchKey`，**必需**，商户密钥。
- `signType`，签名类型，目前支持 HMAC-SHA256 和 MD5，默认为 MD5。
- `pfx`，商户证书。
- `pfxPath`，商户证书路径，在 pfx 不存在时进行读取。
- `publicKey`，RSA 公钥。
- `notifyUrl`，支付结果通知的回调地址。
- `refundUrl`，退款结果通知的回调地址。
- `baseURL`，请求的基地址，通常这个值为 `https://api.mch.weixin.qq.com`，不需要进行更改。
- `timeout`，请求的超时时间，默认为 40 秒。
- `debug`，供内部开发调试使用。

> 初始化参数的属性名采用驼峰形式，微信支付大部分接口的参数是下划线风格，请注意进行区分。

## 沙箱模式

微信提供了[微信支付仿真测试系统](https://pay.weixin.qq.com/wiki/doc/api/micropay.php?chapter=23_1&index=1)，本工具也支持了沙箱模式的调用，调用方式如下：

1. 如果已经明确知道沙箱密钥 `sandbox_signkey`

```js
const api = new API({
  appId: '...',
  mchId: '...',
  mchKey: sandbox_signkey
})
...
```

2. 如果没有沙箱密钥，则采用商户密钥进行异步获取之后再进行后续操作。

```js
;(async () => {
  const api = await API.sandbox({
    appId: '...',
    mchId: '...',
    mchKey: '...'
  })

  ...

})()
```

> 沙箱密钥的获取逻辑通过 `getSandboxSignkey` 进行暴露。

## API Methods List

- 随机字符串参数 `nonce_str` 会统一进行处理，不需要传入。
- `appid` 和 `mch_id` 参数会自动进行处理，不需要传入。
- 通常情况下，签名类型参数 `sign_type` 不需要传入，接口有特别要求时会显式的指定。
- 使用默认签名类型，即 `MD5` 的方式，在进行签名计算的时候会删除 `sign_type` 参数。
- 签名类型目前只支持 `MD5` 和 `HMAC-SHA256`，传入其他值会直接报错。
- 签名 `sign` 会自动进行计算，不需要传入。
- 传递给微信接口的对象使用 JS 对象即可，会自动进行 XML 封装。
- 微信接口请求成功后给回的是 XML 字符串，会自动进行解析，不需要重复解析。

方法|功能
----|----
unifiedOrder|统一下单
getPayParams|直接获取 JSSDK 支付参数，兼容小程序
getAppParams|直接获取 APP 支付参数
getH5Link|直接获取 H5 支付的跳转链接
orderQuery|查询订单
closeOrder|关闭订单
refund|退款申请
refundQuery|查询退款
downloadBill|下载对账单
downloadFundFlow|下载资金账单
payitilReport|交易保障
getBillComment|拉取订单评价数据
micropay|提交付款码支付
reverse|撤销订单
getOpenIdByAuthCode|授权码查询openid
getNativeUrl|获取扫码支付的 URL
getShortUrl|扫码支付的链接转为短链接
sendCoupon|发放代金券
queryCouponStock|查询代金券批次
queryCouponsInfo|查询代金券信息
sendRedpack|发放普通红包
sendGroupRedpack|发放裂变红包
queryRedpack|查询红包记录
transfers|企业付款
getTransferInfo|查询企业付款
payBank|企业付款到银行卡
queryBank|查询企业付款到银行卡
