# wechat-backend-minigame

微信小游戏服务端接口封装

## Usage

```js
const API = require('./lib')
const api = new API({
  appId: 'xxx',
  appSecret: 'xxxx'
})

api[method](...)
```

## API Methods List

名称|官方文档|功能
----|----|---
midasCancelPay/midasCancelPaySandbox|[midas.cancelPay](https://developers.weixin.qq.com/minigame/dev/api-backend/midas.cancelPay.html)|取消订单
midasGetBalance/midasGetBalanceSandbox|[midas.getBalance](https://developers.weixin.qq.com/minigame/dev/api-backend/midas.getBalance.html)|获取游戏币余额
midasPay/midasPaySandbox|[midas.pay](https://developers.weixin.qq.com/minigame/dev/api-backend/midas.pay.html)|扣除游戏币
midasPresent/midasPresentSandbox|[midas.present](https://developers.weixin.qq.com/minigame/dev/api-backend/midas.present.html)|给用户赠送游戏币
getAccessToken|[auth.getAccessToken](https://developers.weixin.qq.com/minigame/dev/api-backend/auth.getAccessToken.html)|获取小程序全局唯一后台接口调用凭据（access_token）
checkSessionKey|[auth.checkSessionKey](https://developers.weixin.qq.com/minigame/dev/api-backend/auth.checkSessionKey.html)|校验服务器所保存的登录态 session_key 是否合法
code2Session|[auth.code2Session](https://developers.weixin.qq.com/minigame/dev/api-backend/auth.code2Session.html)|登录凭证校验
msgSecCheck|[security.msgSecCheck](https://developers.weixin.qq.com/minigame/dev/api-backend/security.msgSecCheck.html)|检查一段文本是否含有违法违规内容
imgSecCheck|[security.imgSecCheck](https://developers.weixin.qq.com/minigame/dev/api-backend/security.imgSecCheck.html)|校验一张图片是否含有违法违规内容
removeUserStorage|[storage.removeUserStorage](https://developers.weixin.qq.com/minigame/dev/api-backend/storage.removeUserStorage.html)|删除已经上报到微信的key-value数据
setUserStorage|[storage.setUserStorage](https://developers.weixin.qq.com/minigame/dev/api-backend/storage.setUserStorage.html)|上报用户数据后台接口
createActivityId|[updatableMessage.createActivityId](https://developers.weixin.qq.com/minigame/dev/api-backend/updatableMessage.createActivityId.html)|创建被分享动态消息的 activity_id
setUpdatableMsg|[updatableMessage.setUpdatableMsg](https://developers.weixin.qq.com/minigame/dev/api-backend/updatableMessage.setUpdatableMsg.html)|修改被分享的动态消息
createQRCode|[wxacode.createQRCode](https://developers.weixin.qq.com/minigame/dev/api-backend/wxacode.createQRCode.html)|获取小程序二维码，适用于需要的码数量较少的业务场景
getWxaCode|[wxacode.get](https://developers.weixin.qq.com/minigame/dev/api-backend/wxacode.get.html)|获取小程序码，适用于需要的码数量较少的业务场景
getUnlimited|[wxacode.getUnlimited](https://developers.weixin.qq.com/minigame/dev/api-backend/wxacode.getUnlimited.html)|获取小程序码，适用于需要的码数量极多的业务场景
