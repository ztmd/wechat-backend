'use strict'

const Base = require('./base')

/**
 * 微信小游戏服务端接口类
 * @constructor
 */
class API extends Base {
  // ----------------
  // 虚拟支付
  // 米大师支付
  // midas
  // ----------------
  /**
   * [虚拟支付]{@link https://developers.weixin.qq.com/minigame/dev/tutorial/open-ability/payment.html}
   *
   * 米大师通用参数
   *
   * @param {string} appid 小程序 appId
   * @param {string} offer_id 米大师分配的offer_id
   * @param {number} ts UNIX 时间戳，单位是秒
   *
   * 这三个参数在米大师接口进行请求的时候**不需要显式传递**
   * appId 和 offerId 在对象初始化给定，ts 取当前时间戳
   *
   * 每个方法提供两套接口，名字以 Sandbox 结尾表示为沙箱环境
   *
   * **签名会自动进行计算**，不需要进行传递
   *
   * @param {string} data.sig 以上所有参数（含可选最多9个）+uri+米大师密钥，用 HMAC-SHA256签名，详见 米大师支付签名算法
   * @param {string} data.mp_sig 以上所有参数（含可选最多11个）+uri+session_key，用 HMAC-SHA256签名，详见 米大师支付签名算法
   *
   */
  /**
   * 取消订单
   *
   * @param {object} data
   * @param {string} data.openid 用户唯一标识符
   * @param {string} data.zone_id 游戏服务器大区id,游戏不分大区则默认zoneId ="1",String类型。如过应用选择支持角色，则角色ID接在分区ID号后用"_"连接。
   * @param {string} data.pf 平台 安卓：android
   * @param {string} data.user_ip 用户外网 IP
   * @param {string} data.bill_no 订单号，业务需要保证全局唯一；相同的订单号不会重复扣款。长度不超过63，只能是数字、大小写字母_-
   * @param {string} data.pay_item 道具名称
   */
  midasCancelPay(data) {
    return this._midas({
      url: '/cgi-bin/midas/cancelpay',
      data
    })
  }
  midasCancelPaySandbox(data) {
    return this._midas({
      url: '/cgi-bin/midas/sandbox/cancelpay',
      data
    })
  }

  /**
   * 获取游戏币余额
   *
   * 开通了虚拟支付的小游戏，可以通过本接口查看某个用户的游戏币余额
   *
   * @param {string} data.openid 用户唯一标识符
   * @param {string} data.zone_id 游戏服务器大区id,游戏不分大区则默认zoneId ="1",String类型。如过应用选择支持角色，则角色ID接在分区ID号后用"_"连接。
   * @param {string} data.pf 平台 安卓：android
   * @param {string} data.user_ip 用户外网 IP
   */
  midasGetBalance(data) {
    return this._midas({
      url: '/cgi-bin/midas/getbalance',
      data
    })
  }
  midasGetBalanceSandBox(data) {
    return this._midas({
      url: '/cgi-bin/midas/sandbox/getbalance',
      data
    })
  }

  /**
   * 扣除游戏币
   *
   * 开通了虚拟支付的小游戏，可以通过本接口扣除某个用户的游戏币。 由于可能存在接口调用超时或返回系统失败，但是游戏币实际已经扣除的情况，所以当该接口返回系统失败时，可以用相同的bill_no再次调用本接口，直到返回非系统失败为止，不会重复扣款，也可以调用取消支付接口取消本次扣款。
   *
   * @param {object} data
   * @param {string} data.openid 用户唯一标识符
   * @param {string} data.zone_id 游戏服务器大区id,游戏不分大区则默认zoneId ="1",String类型。如过应用选择支持角色，则角色ID接在分区ID号后用"_"连接。
   * @param {string} data.pf 平台 安卓：android
   * @param {string} data.user_ip 用户外网 IP
   * @param {number} data.amt 扣除游戏币数量，不能为 0
   * @param {string} data.bill_no 订单号，业务需要保证全局唯一；相同的订单号不会重复扣款。长度不超过63，只能是数字、大小写字母_-
   * @param {string} data.pay_item 道具名称
   * @param {string} data.app_remark 备注。会写到账户流水
   */
  midasPay(data) {
    return this._midas({
      url: '/cgi-bin/midas/pay',
      data
    })
  }
  midasPaySandbox(data) {
    return this._midas({
      url: '/cgi-bin/midas/sandbox/pay',
      data
    })
  }

  /**
   * 给用户赠送游戏币
   *
   * 通了虚拟支付的小游戏，可以通过该接口赠送游戏币给某个用户。
   *
   * @param {object} data
   * @param {string} data.openid 用户唯一标识符
   * @param {string} data.zone_id 游戏服务器大区id,游戏不分大区则默认zoneId ="1",String类型。如过应用选择支持角色，则角色ID接在分区ID号后用"_"连接。
   * @param {string} data.pf 平台 安卓：android
   * @param {string} data.user_ip 用户外网 IP
   * @param {string} data.bill_no 订单号，业务需要保证全局唯一；相同的订单号不会重复扣款。长度不超过63，只能是数字、大小写字母_-
   * @param {number} data.present_counts 赠送游戏币的个数，不能为0
   */
  midasPresent(data) {
    return this._midas({
      url: '/cgi-bin/midas/present',
      data
    })
  }
  midasPresentSandbox(data) {
    return this._midas({
      url: '/cgi-bin/midas/sandbox/present',
      data
    })
  }
  // ----------------
  // 登录
  // auth
  // ----------------
  /**
   * 校验服务器所保存的登录态 session_key 是否合法
   *
   * 为了保持 session_key 私密性，接口不明文传输 session_key，而是通过校验登录态签名完成。
   *
   * @param {string} openid 用户唯一标识符
   * @param {string} signature 用户登录态签名
   * @param {string} sig_method 用户登录态签名的哈希方法，目前只支持 hmac_sha256
   *
   * [用户登录态签名]{@link https://developers.weixin.qq.com/minigame/dev/tutorial/open-ability/session-signature.html}
   */
  checkSessionKey(openid, signature, sig_method = 'hmac_sha256') {
    return this.request({
      url: '/wxa/checksession',
      method: 'get',
      params: {
        openid, signature, sig_method
      }
    })
  }

  // ----------------
  // 内容安全
  // security
  // ----------------
  /**
   * 校验一张图片是否含有违法违规内容
   *
   * 应用场景举例：
   *  - 图片智能鉴黄：涉及拍照的工具类应用(如美拍，识图类应用)用户拍照上传检测；电商类商品上架图片检测；媒体类用户文章里的图片检测等；
   *  - 敏感人脸识别：用户头像；媒体类用户文章里的图片检测；社交类用户上传的图片检测等。 频率限制：单个 appId 调用上限为 2000 次/分钟，200,000 次/天*（图片大小限制：1M）
   *
   * @param {FormData} media 要检测的图片文件，格式支持PNG、JPEG、JPG、GIF，图片尺寸不超过 750px x 1334px
   *
   */
  imgSecCheck(media) {
    return this._upload({
      url: '/wxa/img_sec_check',
      data: {
        media
      }
    })
  }

  /**
   * 检查一段文本是否含有违法违规内容
   *
   * 应用场景举例：
   *  - 用户个人资料违规文字检测；
   *  - 媒体新闻类用户发表文章，评论内容检测；
   *  - 游戏类用户编辑上传的素材(如答题类小游戏用户上传的问题及答案)检测等。 频率限制：单个 appId 调用上限为 4000 次/分钟，2,000,000 次/天*
   *
   * @param {string} content 要检测的文本内容，长度不超过 500KB
   *
   */
  msgSecCheck(content) {
    return this.request({
      url: '/wxa/msg_sec_check',
      data: content
    })
  }

  // ----------------
  // 开放数据
  // storage
  // ----------------
  /**
   * 删除已经上报到微信的key-value数据
   *
   * @param {string[]} key 要删除的数据key列表
   * @param {string} openid 用户唯一标识符
   * @param {string} signature 用户登录态签名，签名算法请参考用户登录态签名算法
   * @param {string} sig_method 用户登录态签名的哈希方法，如hmac_sha256等，请参考用户登录态签名算法
   */
  removeUserStorage(key, openid, signature, sig_method = 'hmac_sha256') {
    return this.request({
      url: '/wxa/remove_user_storage',
      params: {
        openid, signature, sig_method
      },
      data: {
        key
      }
    })
  }

  /**
   * 上报用户数据后台接口
   *
   * 小游戏可以通过本接口上报key-value数据到用户的CloudStorage。
   *
   * @param {Array.<object>} kv_list 要上报的数据
   * @param {string} kv_list[].key 数据的key
   * @param {string} kv_list[].value 数据的value
   * @param {string} openid 用户唯一标识符
   * @param {string} signature 用户登录态签名，签名算法请参考用户登录态签名算法
   * @param {string} sig_method 用户登录态签名的哈希方法，如hmac_sha256等，请参考用户登录态签名算法
   */
  setUserStorage(kv_list, openid, signature, sig_method = 'hmac_sha256') {
    return this.request({
      url: '/wxa/set_user_storage',
      params: {
        openid, signature, sig_method
      },
      data: {
        kv_list
      }
    })
  }

  // ----------------
  // 动态消息
  // updatableMessage
  // ----------------
  /**
   * 创建被分享动态消息的 activity_id
   */
  createActivityId() {
    return this.request({
      url: '/cgi-bin/message/wxopen/activityid/create'
    })
  }

  /**
   * 修改被分享的动态消息
   *
   * @param {object} data
   * @param {object} data.activity_id 动态消息的 ID，通过 updatableMessage.createActivityId 接口获取
   * @param {number} data.target_state 动态消息修改后的状态（具体含义见后文）0 表示未开始，1 表示已开始。
   * @param {object} data.template_info 动态消息对应的模板信息
   * @param {Array.<Object>} data.template_info.parameter_list 模板中需要修改的参数
   * @param {string} data.template_info.parameter_list[].name 要修改的参数名
   * @param {string} data.template_info.parameter_list[].value 修改后的参数值
   *
   * 其中 name 的合法值为：
   *  - `member_count` target_state = 0 时必填，文字内容模板中 member_count 的值
   *  - `room_limit` target_state = 0 时必填，文字内容模板中 room_limit 的值
   *  - `path` target_state = 1 时必填，点击「进入」启动小程序时使用的路径。对于小游戏，没有页面的概念，可以用于传递查询字符串（query），如 "?foo=bar"
   *  - `version_type` target_state = 1 时必填，点击「进入」启动小程序时使用的版本。有效参数值为：develop（开发版），trial（体验版），release（正式版）
   */
  setUpdatableMsg(data) {
    return this.request({
      url: '/cgi-bin/message/wxopen/updatablemsg/send',
      data
    })
  }

  // ----------------
  // 小程序码
  // wxacode
  // ----------------
  /**
   * 获取小程序二维码
   *
   * 适用于需要的码数量较少的业务场景。通过该接口生成的小程序码，永久有效，有数量限制
   *
   * @param {string} path 必填。扫码进入的小程序页面路径，最大长度 128 字节，不能为空；对于小游戏，可以只传入 query 部分，来实现传参效果，如：传入 "?foo=bar"，即可在 wx.getLaunchOptionsSync 接口中的 query 参数获取到 {foo:"bar"}
   * @param {number} width 二维码的宽度，单位 px。最小 280px，最大 1280px
   *
   * @return {Buffer}
   */
  createQRCode(path, width = 430) {
    return this.request({
      url: '/cgi-bin/wxaapp/createwxaqrcode',
      data: {
        path, width
      }
    })
  }

  /**
   * 获取小程序码
   *
   * 适用于需要的码数量较少的业务场景。通过该接口生成的小程序码，永久有效，有数量限制
   *
   * @name get
   *
   * @param {string} path 必填。扫码进入的小程序页面路径，最大长度 128 字节，不能为空；对于小游戏，可以只传入 query 部分，来实现传参效果，如：传入 "?foo=bar"，即可在 wx.getLaunchOptionsSync 接口中的 query 参数获取到 {foo:"bar"}
   * @param {object} options 生成选项
   * @param {number} options.width 二维码的宽度，单位 px。最小 280px，最大 1280px
   * @param {boolean} options.auto_color 自动配置线条颜色，如果颜色依然是黑色，则说明不建议配置主色调
   * @param {object} options.line_color auto_color 为 false 时生效，使用 rgb 设置颜色 例如 {"r":"xxx","g":"xxx","b":"xxx"} 十进制表示
   * @param {boolean} options.is_hyaline 是否需要透明底色，为 true 时，生成透明底色的小程序码
   *
   * @return {Buffer}
   */
  getWxaCode(path, options = {}) {
    return this.request({
      url: '/wxa/getwxacode',
      data: {
        path,
        ...options
      }
    })
  }

  /**
   * 获取小程序码
   *
   * 适用于需要的码数量极多的业务场景。通过该接口生成的小程序码，永久有效，数量暂无限制
   *
   * @param {string} data.scene 必填，最大32个可见字符，只支持数字，大小写英文以及部分特殊字符：!#$&'()*+,/:;=?@-._~，其它字符请自行编码为合法字符（因不支持%，中文无法使用 urlencode 处理，请使用其他编码方式
   * @param {string} data.page 必须是已经发布的小程序存在的页面（否则报错），例如 pages/index/index, 根路径前不要填加 /,不能携带参数（参数请放在scene字段里），如果不填写这个字段，默认跳主页面
   * @param {number} data.width 二维码的宽度，单位 px，最小 280px，最大 1280px
   * @param {boolean} data.auto_color 自动配置线条颜色，如果颜色依然是黑色，则说明不建议配置主色调，默认 false
   * @param {object} data.line_color auto_color 为 false 时生效，使用 rgb 设置颜色 例如 {"r":"xxx","g":"xxx","b":"xxx"} 十进制表示
   * @param {boolean} data.is_hyaline 是否需要透明底色，为 true 时，生成透明底色的小程序
   *
   * @return {Buffer}
   */
  getUnlimited(data) {
    return this.request({
      url: '/wxa/getwxacodeunlimit',
      data
    })
  }
}

module.exports = API
