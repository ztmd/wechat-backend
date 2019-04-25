'use strict'

const Base = require('./base')

/**
 * 微信小程序服务端接口类
 * @constructor
 */
class API extends Base {

  // ----------------
  // 用户信息
  // auth
  // ----------------
  /**
   * 用户支付完成后，获取该用户的 UnionId
   *
   * @param {string} openid 用户的 openId
   * @param {object} data 附加数据
   * @param {string} data.transaction_id 微信支付订单号
   * @param {string} data.mch_id 微信支付分配的商户号，和商户订单号配合使用
   * @param {string} data.out_trade_no 微信支付商户订单号，和商户号配合使用
   *
   * @function auth.getPaidUnionId
   */
  getPaidUnionId(openid, data) {
    return this.request({
      url: '/wxa/getpaidunionid',
      method: 'get',
      params: {
        openid
      },
      data
    })
  }

  // ----------------
  // 数据分析
  // analysis
  // ----------------
  /**
   * 获取用户访问小程序日留存
   *
   * @param {string} begin_date 开始日期。格式为 yyyymmdd
   * @param {string} end_date 结束日期，限定查询1天数据，允许设置的最大值为昨日。格式为 yyyymmdd
   */
  getDailyRetain(begin_date, end_date) {
    return this.request({
      url: '/datacube/getweanalysisappiddailyretaininfo',
      data: {
        begin_date, end_date
      }
    })
  }

  /**
   * 获取用户访问小程序月留存
   *
   * @param {string} begin_date 开始日期，为自然月第一天。格式为 yyyymmdd
   * @param {string} end_date 结束日期，为自然月最后一天，限定查询一个月数据。格式为 yyyymmdd
   */
  getMonthlyRetain(begin_date, end_date) {
    return this.request({
      url: '/datacube/getweanalysisappidmonthlyretaininfo',
      data: {
        begin_date, end_date
      }
    })
  }

  /**
   * 获取用户访问小程序周留存
   *
   * @param {string} begin_date 开始日期，为周一日期。格式为 yyyymmdd
   * @param {string} end_date 结束日期，为周日日期，限定查询一周数据。格式为 yyyymmdd
   */
  getWeeklyRetain(begin_date, end_date) {
    return this.request({
      url: '/datacube/getweanalysisappidweeklyretaininfo',
      data: {
        begin_date, end_date
      }
    })
  }

  /**
   * 获取用户访问小程序数据日趋势
   *
   * @param {string} begin_date 开始日期。格式为 yyyymmdd
   * @param {string} end_date 结束日期，限定查询1天数据，允许设置的最大值为昨日。格式为 yyyymmdd
   */
  getDailyVisitTrend(begin_date, end_date) {
    return this.request({
      url: '/datacube/getweanalysisappiddailyvisittrend',
      data: {
        begin_date, end_date
      }
    })
  }

  /**
   * 获取用户访问小程序数据月趋势
   *
   * @param {string} begin_date 开始日期，为自然月第一天。格式为 yyyymmdd
   * @param {string} end_date 结束日期，为自然月最后一天，限定查询一个月数据。格式为 yyyymmdd
   */
  getMonthlyRetain(begin_date, end_date) {
    return this.request({
      url: '/datacube/getweanalysisappidmonthlyvisittrend',
      data: {
        begin_date, end_date
      }
    })
  }

  /**
   * 获取用户访问小程序数据周趋势
   *
   * @param {string} begin_date 开始日期，为周一日期。格式为 yyyymmdd
   * @param {string} end_date 结束日期，为周日日期，限定查询一周数据。格式为 yyyymmdd
   */
  getWeeklyVisitTrend(begin_date, end_date) {
    return this.request({
      url: '/datacube/getweanalysisappidweeklyvisittrend',
      data: {
        begin_date, end_date
      }
    })
  }

  /**
   * 获取小程序新增或活跃用户的画像分布数据。
   *
   * 时间范围支持昨天、最近7天、最近30天。
   * 其中，新增用户数为时间范围内首次访问小程序的去重用户数，活跃用户数为时间范围内访问过小程序的去重用户数。
   *
   * @param {string} begin_date 开始日期。格式为 yyyymmdd
   * @param {string} end_date 结束日期，开始日期与结束日期相差的天数限定为0/6/29，分别表示查询最近1/7/30天数据，允许设置的最大值为昨日。格式为 yyyymmdd
   */
  getUserPortrait(begin_date, end_date) {
    return this.request({
      url: '/datacube/getweanalysisappiduserportrait',
      data: {
        begin_date, end_date
      }
    })
  }

  /**
   * 获取用户小程序访问分布数据
   *
   * @param {string} begin_date 开始日期。格式为 yyyymmdd
   * @param {string} end_date 结束日期，限定查询1天数据，允许设置的最大值为昨日。格式为 yyyymmdd
   */
  getVisitDistribution(begin_date, end_date) {
    return this.request({
      url: '/datacube/getweanalysisappidvisitdistribution',
      data: {
        begin_date, end_date
      }
    })
  }

  /**
   * 访问页面
   *
   * @param {string} begin_date 开始日期。格式为 yyyymmdd
   * @param {string} end_date 结束日期，限定查询1天数据，允许设置的最大值为昨日。格式为 yyyymmdd
   */
  getVisitPage(begin_date, end_date) {
    return this.request({
      url: '/datacube/getweanalysisappidvisitpage',
      data: {
        begin_date, end_date
      }
    })
  }

  /**
   * 获取用户访问小程序数据概况
   *
   * @param {string} begin_date 开始日期。格式为 yyyymmdd
   * @param {string} end_date 结束日期，限定查询1天数据，允许设置的最大值为昨日。格式为 yyyymmdd
   */
  getDailySummary(begin_date, end_date) {
    return this.request({
      url: '/datacube/getweanalysisappiddailysummarytrend',
      data: {
        begin_date, end_date
      }
    })
  }

  // ----------------
  // 客服消息
  // customerServiceMessage
  // ----------------
  /**
   * 获取客服消息内的临时素材
   *
   * 即下载临时的多媒体文件。目前小程序仅支持下载图片文件。
   *
   * @param {string} media_id 媒体文件 ID
   *
   * @return {Buffer}
   */
  getTempMedia(media_id) {
    return this.request({
      url: '/cgi-bin/media/get',
      method: 'get',
      params: {
        media_id
      }
    })
  }

  /**
   * 发送客服消息给用户
   *
   * @param {object} data
   * @param {string} data.touser 用户的 OpenID
   * @param {string} data.msgtype 消息类型
   * @param {string} data.touser 消息类型
   * @param {string} data.content 文本消息内容，msgtype="text" 时必填
   * @param {object} data.image 图片消息，msgtype="image" 时必填
   * @param {string} data.image.media_id 发送的图片的媒体ID，通过 新增素材接口 上传图片文件获得
   * @param {object} data.link 链接消息，msgtype="link" 时必填
   * @param {string} data.link.title 消息标题
   * @param {string} data.link.description 图文链接消息
   * @param {string} data.link.url 图文链接消息被点击后跳转的链接
   * @param {string} data.link.thumb_url 图文链接消息的图片链接，支持 JPG、PNG 格式，较好的效果为大图 640 X 320，小图 80 X 80
   * @param {object} data.miniprogrampage 小程序卡片，msgtype="miniprogrampage" 时必填
   * @param {string} data.miniprogrampage.title 消息标题
   * @param {string} data.miniprogrampage.pagepath 小程序的页面路径，跟app.json对齐，支持参数，比如pages/index/index?foo=bar
   * @param {string} data.miniprogrampage.thumb_media_id 小程序消息卡片的封面， image 类型的 media_id，通过 新增素材接口 上传图片文件获得，建议大小为 520*416
   */
  sendCustomMessage(data) {
    return this.request({
      url: '/cgi-bin/message/custom/send',
      data
    })
  }

  /**
   * 下发客服当前输入状态给用户
   *
   * @param {string} touser 用户的 OpenID
   * @param {string} command 命令（Typing|CancelTyping）
   *
   * [客服消息输入状态]{@link https://developers.weixin.qq.com/miniprogram/dev/framework/open-ability/customer-message/typing.html}
   */
  setTyping(touser, command) {
    return this.request({
      url: '/cgi-bin/message/custom/typing',
      data: {
        touser, command
      }
    })
  }

  /**
   * 新增素材接口
   *
   * 把媒体文件上传到微信服务器。
   * 目前仅支持图片。用于发送客服消息或被动回复用户消息。
   *
   * @param {FormData} media form-data 中媒体文件标识，有filename、filelength、content-type等信息
   * @param {string} type 文件类型，默认为 image，目前只支持该值
   */
  uploadTempMedia(media, type = 'image') {
    return this.request({
      url: '/cgi-bin/media/upload',
      params: {
        type
      },
      data: media
    })
  }

  // ----------------
  // 模板消息
  // templateMessage
  // ----------------
  /**
   * 组合模板并添加至帐号下的个人模板库
   *
   * @param {string} 模板标题id，可通过接口获取，也可登录小程序后台查看获取
   * @param {Array.<number>} 开发者自行组合好的模板关键词列表，关键词顺序可以自由搭配（例如[3,5,4]或[4,5,3]），最多支持10个关键词组合
   */
  addTemplate(id, keyword_id_list) {
    return this.request({
      url: '/cgi-bin/wxopen/template/add',
      data: {id, keyword_id_list}
    })
  }

  /**
   * 删除帐号下的某个模板
   *
   * @param {string} template_id 要删除的模板id
   */
  deleteTemplate(template_id) {
    return this.request({
      url: '/cgi-bin/wxopen/template/del',
      data: {template_id}
    })
  }

  /**
   * 获取帐号下**已存在**的模板列表
   *
   * @param {number} offset 用于分页，表示从offset开始。从 0 开始计数。
   * @param {number} count 用于分页，表示拉取count条记录。最大为 20。
   */
  getTemplateList(offset = 0, count = 20) {
    return this.request({
      url: '/cgi-bin/wxopen/template/list',
      data: {offset, count}
    })
  }

  /**
   * 获取模板库某个模板标题下关键词库
   *
   * @param {string} id 模板标题id，可通过接口获取，也可登录小程序后台查看获取
   */
  getTemplateLibraryById(id) {
    return this.request({
      url: '/cgi-bin/wxopen/template/library/get',
      data: {id}
    })
  }

  /**
   * 获取小程序模板库标题列表
   *
   * @param {number} offset 用于分页，表示从offset开始。从 0 开始计数。
   * @param {number} count 用于分页，表示拉取count条记录。最大为 20。
   */
  getTemplateLibraryList(offset = 0, count = 20) {
    return this.request({
      url: '/cgi-bin/wxopen/template/library/list',
      data: {offset, count}
    })
  }

  /**
   * 发送模板消息
   *
   * @name send
   *
   * @param {object} data
   * @param {string} data.touser 接收者（用户）的 openid
   * @param {string} data.template_id 所需下发的模板消息的id
   * @param {string} data.page 击模板卡片后的跳转页面，仅限本小程序内的页面。支持带参数,（示例index?foo=bar）。该字段不填则模板无跳转。
   * @param {string} data.form_id 表单提交场景下，为 submit 事件带上的 formId；支付场景下，为本次支付的 prepay_id
   * @param {object} data.data 模板内容，不填则下发空模板。
   * @param {string} data.emphasis_keyword 模板需要放大的关键词，不填则默认无放大
   */
  sendTemplateMessage(data) {
    return this.request({
      url: '/cgi-bin/message/wxopen/template/send',
      data
    })
  }

  // ----------------
  // 统一服务消息
  // uniformMessage
  // ----------------
  /**
   * 下发小程序和公众号统一的服务消息
   *
   * @name send
   *
   * @param {object} data
   * @param {string} data.tosuer 用户openid，可以是小程序的openid，也可以是mp_template_msg.appid对应的公众号的openid
   * @param {object} data.weapp_template_msg 小程序模板消息相关的信息，可以参考小程序模板消息接口; 有此节点则优先发送小程序模板消息
   * @param {string} data.weapp_template_msg.template_id 小程序模板ID
   * @param {string} data.weapp_template_msg.page 小程序页面路径
   * @param {string} data.weapp_template_msg.form_id 小程序模板消息formid
   * @param {object} data.weapp_template_msg.data 小程序模板数据
   * @param {object} data.weapp_template_msg.emphasis_keyword 小程序模板放大关键词
   * @param {object} data.mp_template_msg 公众号模板消息相关的信息，可以参考公众号模板消息接口；有此节点并且没有weapp_template_msg节点时，发送公众号模板消息
   * @param {string} data.mp_template_msg.appid 公众号appid，要求与小程序有绑定且同主体
   * @param {string} data.mp_template_msg.template_id 公众号模板id
   * @param {string} data.mp_template_msg.url 公众号模板消息所要跳转的url
   * @param {string} data.mp_template_msg.miniprogram 公众号模板消息所要跳转的小程序，小程序的必须与公众号具有绑定关系
   * @param {object} data.mp_template_msg.data 公众号模板消息的数据
   *
   * [统一消息服务]{@link https://developers.weixin.qq.com/miniprogram/dev/api-backend/uniformMessage.send.html}
   */
  sendUniformMessage(data) {
    return this.request({
      url: '/cgi-bin/message/wxopen/template/uniform_send',
      data
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
  // 插件管理
  // pluginManager
  // ----------------
  /**
   * 向插件开发者发起使用插件的申请
   *
   * @param {string} plugin_appid 插件 appId
   * @param {string} reason 申请使用理由
   */
  applyPlugin(plugin_appid, reason) {
    return this.request({
      url: '/wxa/plugin',
      data: {
        action: 'apply',
        plugin_appid,
        reason
      }
    })
  }

  /**
   * 获取当前所有插件使用方（供插件开发者调用）
   *
   * @param {number} page 要拉取第几页的数据
   * @param {number} num 每页的记录数
   */
  getPluginDevApplyList(page = 1, num = 20) {
    return this.request({
      url: '/wxa/devplugin',
      data: {
        action: 'dev_apply_list',
        page,
        num
      }
    })
  }

  /**
   * 查询已添加的插件
   */
  getPluginList() {
    return this.request({
      url: '/wxa/plugin',
      data: {
        action: 'list'
      }
    })
  }

  /**
   * 修改插件使用申请的状态（供插件开发者调用）
   *
   * @param {string} action 修改操作
   *  - dev_agree 同意申请
   *  - dev_refuse 拒绝申请
   *  - dev_delete 删除已拒绝的申请者
   * @param {string} appid 使用者的 appid。同意申请时填写。
   * @param {string} reason 拒绝理由。拒绝申请时填写。
   */
  setDevPluginApplyStatus(action, appid, reason) {
    return this.request({
      url: '/wxa/devplugin',
      data: {
        action, appid, reason
      }
    })
  }

  /**
   * 删除已添加的插件
   *
   * @param {string} plugin_appid 插件 appId
   */
  unbindPlugin(plugin_appid) {
    return this.request({
      url: '/wxa/plugin',
      data: {
        action: 'unbind',
        plugin_appid
      }
    })
  }

  // ----------------
  // 附近的小程序
  // nearbyPoi
  // ----------------
  /**
   * 添加地点
   *
   * @name add
   *
   * @param {string} data.related_name 经营资质主体，必填
   * @param {string} data.related_credential 经营资质证件号，必填
   * @param {string} data.related_address 经营资质地址，必填
   * @param {string} data.related_proof_material 相关证明材料照片临时素材 mediaid。经营资质主体与小程序同主体时不填;经营资质主体与小程序非同主体时必填。可通过 customerServiceMessage.uploadTempMedia 接口上传照片临时素材。
   */
  addNearbyPOI(data) {
    return this.request({
      url: '/wxa/addnearbypoi',
      data
    })
  }

  /**
   * 删除地点
   *
   * @name delete
   *
   * @param {string} poi_id 附近地点 ID
   */
  delNearbyPOI(poi_id) {
    return this.request({
      url: '/wxa/delnearbypoi',
      data: {
        poi_id
      }
    })
  }

  /**
   * 查看地点列表
   *
   * @name getList
   *
   * @param {number} page 起始页id（从1开始计数）
   * @param {number} page_rows 每页展示个数（最多1000个）
   */
  getNearbyPOIList(page = 1, page_rows = 20) {
    return this.request({
      url: '/wxa/getnearbypoilist',
      params: {
        page, page_rows
      }
    })
  }

  /**
   * 展示/取消展示附近小程序
   *
   * @name setShowStatus
   * @param {string} poi_id 附近地点 ID
   * @param {number} status 是否展示
   *  - 0 不展示
   *  - 1 展示
   */
  setNearbyShowStatus(poi_id, status) {
    return this.request({
      url: '/wxa/setnearbypoishowstatus',
      data: {
        poi_id, status
      }
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
    return this.request({
      url: '/wxa/img_sec_check',
      data: media
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
  // 物流助手
  // 小程序使用
  // logistics
  // ----------------
  /**
   * 生成运单
   *
   * @param {object} data
   * @param {string} data.order_id 订单ID，须保证全局唯一，不超过512字节
   * @param {string} data.openid 用户 openid
   * @param {string} data.delivery_id 快递公司ID，参见getAllDelivery
   * @param {string} data.biz_id 快递客户编码或者现付编码
   * @param {string} data.custom_remark 快递备注信息，比如"易碎物品"，不超过1024字节
   * @param {object} data.sender 发件人信息
   * @param {object} data.receiver 收件人信息
   * @param {object} data.cargo 包裹信息，将传递给快递公司
   * @param {object} data.shop 商品信息，会展示到物流通知消息中
   * @param {object} data.insured 保价信息
   * @param {object} data.service 服务类型
   *
   * [生成运单]{@link https://developers.weixin.qq.com/miniprogram/dev/api-backend/logistics.addOrder.html}
   */
  addOrder(data) {
    return this.request({
      url: '/cgi-bin/express/business/order/add',
      data
    })
  }

  /**
   * 取消运单
   *
   * @param {object} data
   * @param {string} data.order_id 订单 ID，需保证全局唯一
   * @param {string} data.openid 用户 openid
   * @param {string} data.delivery_id 快递公司ID，参见getAllDelivery
   * @param {string} data.waybill_id 运单ID
   */
  cancelOrder(data) {
    return this.request({
      url: '/cgi-bin/express/business/order/cancel',
      data
    })
  }

  /**
   * 获取支持的快递公司列表
   */
  getAllDelivery() {
    return this.request({
      url: '/cgi-bin/express/business/delivery/getall',
      method: 'get'
    })
  }

  /**
   * 获取运单数据
   *
   * @param {object} data
   * @param {string} data.order_id 订单 ID，需保证全局唯一
   * @param {string} data.openid 用户 openid
   * @param {string} data.delivery_id 快递公司ID，参见getAllDelivery
   * @param {string} data.waybill_id 运单ID
   */
  getOrder(data) {
    return this.request({
      url: '/cgi-bin/express/business/order/get',
      data
    })
  }

  /**
   * 查询运单轨迹
   *
   * @param {object} data
   * @param {string} data.order_id 订单 ID，需保证全局唯一
   * @param {string} data.openid 用户 openid
   * @param {string} data.delivery_id 快递公司ID，参见getAllDelivery
   * @param {string} data.waybill_id 运单ID
   */
  getPath(data) {
    return this.request({
      url: '/cgi-bin/express/business/path/get',
      data
    })
  }

  /**
   * 获取打印员
   *
   * 若需要使用微信打单 PC 软件，才需要调用。
   */
  getPrinter() {
    return this.request({
      url: '/cgi-bin/express/business/printer/getall',
      method: 'get'
    })
  }

  /**
   * 获取电子面单余额
   *
   * @param {string} delivery_id 快递公司ID，参见getAllDelivery
   * @param {string} biz_id 快递公司客户编码
   */
  getQuota(delivery_id, biz_id) {
    return this.request({
      url: '/cgi-bin/express/business/quota/get',
      data: {
        delivery_id, biz_id
      }
    })
  }

  /**
   * 更新打印员
   *
   * 若需要使用微信打单 PC 软件，才需要调用。
   *
   * @param {string} openid 打印员 openid
   * @param {string} update_type 更新类型
   */
  updatePrinter(openid, update_type) {
    return this.request({
      url: '/cgi-bin/express/business/printer/update',
      data: {
        openid, update_type
      }
    })
  }

  // ----------------
  // 物流助手
  // 服务提供方使用
  // logistics
  // ----------------
  /**
   * 获取面单联系人信息
   * @param {string} token 必填，商户侧下单事件中推送的 Token 字段
   * @param {string} waybill_id 必填，运单 ID
   */
  getContact(token, waybill_id) {
    return this.request({
      url: '/cgi-bin/express/delivery/contact/get',
      data: {
        token, waybill_id
      }
    })
  }

  /**
   * 预览面单模板
   *
   * 用于调试面单模板使用。
   *
   * @param {string} data.waybill_id 运单 ID
   * @param {string} data.waybill_template 面单 HTML 模板内容（需经 Base64 编码）
   * @param {string} data.waybill_data 面单数据。详情参考下单事件返回值中的 WaybillData
   * @param {object} data.custom 商户下单数据，格式是商户侧下单 API 中的请求体
   */
  previewTemplate(data) {
    return this.request({
      url: '/cgi-bin/express/delivery/template/preview',
      data
    })
  }

  /**
   * 更新商户审核结果
   *
   * @param {object} data
   * @param {string} data.shop_app_id 商户的小程序AppID，即审核商户事件中的 ShopAppID
   * @param {string} data.biz_id 商户账户
   * @param {number} data.result_code 审核结果，0 表示审核通过，其他表示审核失败
   * @param {string} data.result_msg 审核错误原因，仅 result_code 不等于 0 时需要设置
   */
  updateBusiness(data) {
    return this.request({
      url: '/cgi-bin/express/delivery/service/business/update',
      data
    })
  }

  /**
   * 更新运单轨迹
   *
   * @param {object} data
   * @param {string} data.token 商户侧下单事件中推送的 Token 字段
   * @param {string} data.waybill_id 运单 ID
   * @param {number} data.action_time 轨迹变化 Unix 时间戳
   * @param {number} data.action_type 轨迹变化类型
   * @param {string} data.action_msg 轨迹变化具体信息说明，展示在快递轨迹详情页中。若有手机号码，则直接写11位手机号码。使用UTF-8编码。
   *
   * action_type 的合法值
   *  - 100001 揽件阶段-揽件成功
   *  - 100002 揽件阶段-揽件失败
   *  - 100003 揽件阶段-分配业务员
   *  - 200001 运输阶段-更新运输轨迹
   *  - 300002 派送阶段-开始派送
   *  - 300003 派送阶段-签收成功
   *  - 300004 派送阶段-签收失败
   *  - 400001 异常阶段-订单取消
   *  - 400002 异常阶段-订单滞留
   */
  updatePath(data) {
    return this.request({
      url: '/cgi-bin/express/delivery/path/update',
      data
    })
  }

  // ----------------
  // 生物认证
  // soter
  // ----------------
  /**
   * SOTER 生物认证秘钥签名验证
   *
   * @param {object} data
   * @param {string} data.openid 用户 openid
   * @param {string} data.json_string 通过 wx.startSoterAuthentication 成功回调获得的 resultJSON 字段
   * @param {string} data.json_signature 通过 wx.startSoterAuthentication 成功回调获得的 resultJSONSignature 字段
   */
  verifySignature(data) {
    return this.request({
      url: '/cgi-bin/soter/verify_signature',
      data
    })
  }
}

module.exports = API
