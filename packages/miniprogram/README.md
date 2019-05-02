# wechat-backend-miniprogram

微信小程序服务端接口封装

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

- `appId`，**必需**，小程序唯一凭证，即 AppID，可在「微信公众平台 - 设置 - 开发设置」页中获得。（需要已经成为开发者，且帐号没有异常状态）
- `appSecret`，**必需**，小程序唯一凭证密钥，即 AppSecret，获取方式同 AppID
- `baseURL`，请求的基地址，如遇到异常，可以更换到备用服务器
- `timeout`，请求的超时时间，默认为 40 秒
- `debug`，是否输出请求日志，供内部开发调试使用

## API Methods List

<!--

名称|功能
----|----
code2Session|登录凭证校验
getPaidUnionId|用户支付完成后，获取该用户的 UnionId
getAccessToken|获取小程序全局唯一后台接口调用凭据（access_token）
getDailyRetain|获取用户访问小程序日留存
getMonthlyRetain|获取用户访问小程序月留存
getWeeklyRetain|获取用户访问小程序周留存
getDailyVisitTrend|获取用户访问小程序数据日趋势
getMonthlyVisitTrend|获取用户访问小程序数据月趋势
getWeeklyVisitTrend|获取用户访问小程序数据周趋势
getUserPortrait|获取小程序新增或活跃用户的画像分布数据
getVisitDistribution|获取用户小程序访问分布数据
getVisitPage|访问页面
getDailySummary|获取用户访问小程序数据概况
getTempMedia|获取客服消息内的临时素材
sendCustomMessage|发送客服消息给用户
setTyping|下发客服当前输入状态给用户
uploadTempMedia|把媒体文件上传到微信服务器
addTemplate|组合模板并添加至帐号下的个人模板库
deleteTemplate|删除帐号下的某个模板
getTemplateLibraryById|获取模板库某个模板标题下关键词库
getTemplateLibraryList|获取小程序模板库标题列表
getTemplateList|获取帐号下已存在的模板列表
sendTemplageMessage|发送模板消息
sendUniformMessage|下发小程序和公众号统一的服务消息
createActivityId|创建被分享动态消息的 activity_id
setUpdatableMsg|修改被分享的动态消息
applyPlugin|向插件开发者发起使用插件的申请
getPluginDevApplyList|获取当前所有插件使用方（供插件开发者调用）
getPluginList|查询已添加的插件
setDevPluginApplyStatus|修改插件使用申请的状态（供插件开发者调用）
unbindPlugin|删除已添加的插件
addNearbyPOI|添加附近的地点
delNearbyPOI|删除附近的地点
getNearbyPOIList|查看附近的地点列表
setNearbyShowStatus|展示/取消展示附近小程序
createQRCode|获取小程序二维码，适用于需要的码数量较少的业务场景
getWxaCode|获取小程序码，适用于需要的码数量较少的业务场景
getUnlimited|获取小程序码，适用于需要的码数量极多的业务场景
imgSecCheck|校验一张图片是否含有违法违规内容
msgSecCheck|检查一段文本是否含有违法违规内容
addOrder|生成运单
cancelOrder|取消运单
getAllDelivery|获取支持的快递公司列表
getOrder|获取运单数据
getPath|查询运单轨迹
getPrinter|获取打印员
getQuota|获取电子面单余额
updatePrinter|更新打印员
getContact|获取面单联系人信息
previewTemplate|预览面单模板
updateBusiness|更新商户审核结果
updatePath|更新运单轨迹
verifySignature|SOTER 生物认证秘钥签名验证

-->

名称|官方文档|功能
----|----|---
code2Session|[auth.code2Session](https://developers.weixin.qq.com/miniprogram/dev/api-backend/auth.code2Session.html)|登录凭证校验
getPaidUnionId|[auth.getPaidUnionId](https://developers.weixin.qq.com/miniprogram/dev/api-backend/auth.getPaidUnionId.html)|用户支付完成后，获取该用户的 UnionId，无需用户授权
getAccessToken|[auth.getAccessToken](https://developers.weixin.qq.com/miniprogram/dev/api-backend/auth.getAccessToken.html)|获取小程序全局唯一后台接口调用凭据（access_token）
getDailyRetain|[analysis.getDailyRetain](https://developers.weixin.qq.com/miniprogram/dev/api-backend/analysis.getDailyRetain.html)|获取用户访问小程序日留存
getMonthlyRetain|[analysis.getMonthlyRetain](https://developers.weixin.qq.com/miniprogram/dev/api-backend/analysis.getMonthlyRetain.html)|获取用户访问小程序月留存
getWeeklyRetain|[analysis.getWeeklyRetain](https://developers.weixin.qq.com/miniprogram/dev/api-backend/analysis.getWeeklyRetain.html)|获取用户访问小程序周留存
getDailyVisitTrend|[analysis.getDailyVisitTrend](https://developers.weixin.qq.com/miniprogram/dev/api-backend/analysis.getDailyVisitTrend.html)|获取用户访问小程序数据日趋势
getMonthlyVisitTrend|[analysis.getMonthlyVisitTrend](https://developers.weixin.qq.com/miniprogram/dev/api-backend/analysis.getMonthlyVisitTrend.html)|获取用户访问小程序数据月趋势
getWeeklyVisitTrend|[analysis.getWeeklyVisitTrend](https://developers.weixin.qq.com/miniprogram/dev/api-backend/analysis.getWeeklyVisitTrend.html)|获取用户访问小程序数据周趋势
getUserPortrait|[analysis.getUserPortrait](https://developers.weixin.qq.com/miniprogram/dev/api-backend/analysis.getUserPortrait.html)|获取小程序新增或活跃用户的画像分布数据
getVisitDistribution|[analysis.getVisitDistribution](https://developers.weixin.qq.com/miniprogram/dev/api-backend/analysis.getVisitDistribution.html)|获取用户小程序访问分布数据
getVisitPage|[analysis.getVisitPage](https://developers.weixin.qq.com/miniprogram/dev/api-backend/analysis.getVisitPage.html)|访问页面
getDailySummary|[analysis.getDailySummary](https://developers.weixin.qq.com/miniprogram/dev/api-backend/analysis.getDailySummary.html)|获取用户访问小程序数据概况
getTempMedia|[customerServiceMessage.getTempMedia](https://developers.weixin.qq.com/miniprogram/dev/api-backend/customerServiceMessage.getTempMedia.html)|获取客服消息内的临时素材
sendCustomMessage|[customerServiceMessage.send](https://developers.weixin.qq.com/miniprogram/dev/api-backend/customerServiceMessage.send.html)|发送客服消息给用户
setTyping|[customerServiceMessage.setTyping](https://developers.weixin.qq.com/miniprogram/dev/api-backend/customerServiceMessage.setTyping.html)|下发客服当前输入状态给用户
uploadTempMedia|[customerServiceMessage.uploadTempMedia](https://developers.weixin.qq.com/miniprogram/dev/api-backend/customerServiceMessage.uploadTempMedia.html)|把媒体文件上传到微信服务器
addTemplate|[templateMessage.addTemplate](https://developers.weixin.qq.com/miniprogram/dev/api-backend/templateMessage.addTemplate.html)|组合模板并添加至帐号下的个人模板库
deleteTemplate|[templateMessage.deleteTemplate](https://developers.weixin.qq.com/miniprogram/dev/api-backend/templateMessage.deleteTemplate.html)|删除帐号下的某个模板
getTemplateLibraryById|[templateMessage.getTemplateLibraryById](https://developers.weixin.qq.com/miniprogram/dev/api-backend/templateMessage.getTemplateLibraryById.html)|获取模板库某个模板标题下关键词库
getTemplateLibraryList|[templateMessage.getTemplateLibraryList](https://developers.weixin.qq.com/miniprogram/dev/api-backend/templateMessage.getTemplateLibraryList.html)|获取小程序模板库标题列表
getTemplateList|[templateMessage.getTemplateList](https://developers.weixin.qq.com/miniprogram/dev/api-backend/templateMessage.getTemplateList.html)|获取帐号下已存在的模板列表
sendTemplageMessage|[templateMessage.send](https://developers.weixin.qq.com/miniprogram/dev/api-backend/templateMessage.send.html)|发送模板消息
sendUniformMessage|[uniformMessage.send](https://developers.weixin.qq.com/miniprogram/dev/api-backend/uniformMessage.send.html)|下发小程序和公众号统一的服务消息
createActivityId|[updatableMessage.createActivityId](https://developers.weixin.qq.com/miniprogram/dev/api-backend/updatableMessage.createActivityId.html)|创建被分享动态消息的 activity_id
setUpdatableMsg|[updatableMessage.setUpdatableMsg](https://developers.weixin.qq.com/miniprogram/dev/api-backend/updatableMessage.setUpdatableMsg.html)|修改被分享的动态消息
applyPlugin|[pluginManager.applyPlugin](https://developers.weixin.qq.com/miniprogram/dev/api-backend/pluginManager.applyPlugin.html)|向插件开发者发起使用插件的申请
getPluginDevApplyList|[pluginManager.getPluginDevApplyList](https://developers.weixin.qq.com/miniprogram/dev/api-backend/pluginManager.getPluginDevApplyList.html)|获取当前所有插件使用方（供插件开发者调用）
getPluginList|[pluginManager.getPluginList](https://developers.weixin.qq.com/miniprogram/dev/api-backend/pluginManager.getPluginList.html)|查询已添加的插件
setDevPluginApplyStatus|[pluginManager.setDevPluginApplyStatus](https://developers.weixin.qq.com/miniprogram/dev/api-backend/pluginManager.setDevPluginApplyStatus.html)|修改插件使用申请的状态（供插件开发者调用）
unbindPlugin|[pluginManager.unbindPlugin](https://developers.weixin.qq.com/miniprogram/dev/api-backend/pluginManager.unbindPlugin.html)|删除已添加的插件
addNearbyPOI|[nearbyPoi.add](https://developers.weixin.qq.com/miniprogram/dev/api-backend/nearbyPoi.add.html)|添加地点
delNearbyPOI|[nearbyPoi.delete](https://developers.weixin.qq.com/miniprogram/dev/api-backend/nearbyPoi.delete.html)|删除地点
getNearbyPOIList|[nearbyPoi.getList](https://developers.weixin.qq.com/miniprogram/dev/api-backend/nearbyPoi.getList.html)|查看地点列表
setNearbyShowStatus|[nearbyPoi.setShowStatus](https://developers.weixin.qq.com/miniprogram/dev/api-backend/nearbyPoi.setShowStatus.html)|展示/取消展示附近小程序
createQRCode|[wxacode.createQRCode](https://developers.weixin.qq.com/miniprogram/dev/api-backend/wxacode.createQRCode.html)|获取小程序二维码，适用于需要的码数量较少的业务场景
getWxaCode|[wxacode.get](https://developers.weixin.qq.com/miniprogram/dev/api-backend/wxacode.get.html)|获取小程序码，适用于需要的码数量较少的业务场景
getUnlimited|[wxacode.getUnlimited](https://developers.weixin.qq.com/miniprogram/dev/api-backend/wxacode.getUnlimited.html)|获取小程序码，适用于需要的码数量极多的业务场景
imgSecCheck|[security.imgSecCheck](https://developers.weixin.qq.com/miniprogram/dev/api-backend/security.imgSecCheck.html)|校验一张图片是否含有违法违规内容
msgSecCheck|[security.msgSecCheck](https://developers.weixin.qq.com/miniprogram/dev/api-backend/security.msgSecCheck.html)|检查一段文本是否含有违法违规内容
addOrder|[logistics.addOrder](https://developers.weixin.qq.com/miniprogram/dev/api-backend/logistics.addOrder.html)|生成运单
cancelOrder|[logistics.cancelOrder](https://developers.weixin.qq.com/miniprogram/dev/api-backend/logistics.cancelOrder.html)|取消运单
getAllDelivery|[logistics.getAllDelivery](https://developers.weixin.qq.com/miniprogram/dev/api-backend/logistics.getAllDelivery.html)|获取支持的快递公司列表
getOrder|[logistics.getOrder](https://developers.weixin.qq.com/miniprogram/dev/api-backend/logistics.getOrder.html)|获取运单数据
getPath|[logistics.getPath](https://developers.weixin.qq.com/miniprogram/dev/api-backend/logistics.getPath.html)|查询运单轨迹
getPrinter|[logistics.getPrinter](https://developers.weixin.qq.com/miniprogram/dev/api-backend/logistics.getPrinter.html)|获取打印员
getQuota|[logistics.getQuota](https://developers.weixin.qq.com/miniprogram/dev/api-backend/logistics.getQuota.html)|获取电子面单余额
updatePrinter|[logistics.updatePrinter](https://developers.weixin.qq.com/miniprogram/dev/api-backend/logistics.updatePrinter.html)|更新打印员
getContact|[logistics.getContact](https://developers.weixin.qq.com/miniprogram/dev/api-backend/logistics.getContact.html)|获取面单联系人信息
previewTemplate|[logistics.previewTemplate](https://developers.weixin.qq.com/miniprogram/dev/api-backend/logistics.previewTemplate.html)|预览面单模板
updateBusiness|[logistics.updateBusiness](https://developers.weixin.qq.com/miniprogram/dev/api-backend/logistics.updateBusiness.html)|更新商户审核结果
updatePath|[logistics.updatePath](https://developers.weixin.qq.com/miniprogram/dev/api-backend/logistics.updatePath.html)|更新运单轨迹
verifySignature|[soter.verifySignature](https://developers.weixin.qq.com/miniprogram/dev/api-backend/soter.verifySignature.html)|SOTER 生物认证秘钥签名验证
