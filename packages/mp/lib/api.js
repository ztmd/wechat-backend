'use strict'

const Base = require('./base')

const {
  genNouce,
  getTimestamp
} = require('../utils/helper')

const {
  genSha1
} = require('../utils/sign')

/**
 * 微信公众平台服务端接口
 * @constructor
 */
class API extends Base {
  /**
   * 获取微信服务器IP地址
   *
   * 如果公众号基于安全等考虑，需要获知微信服务器的IP地址列表，以便进行相关限制，可以通过该接口获得微信服务器IP地址列表或者IP网段信息。
   */
  getCallbackIp() {
    return this.request({
      url: '/cgi-bin/getcallbackip'
    })
  }

  /**
   * 网络检测
   *
   * @param {string} action 执行的检测动作，允许的值：dns（做域名解析）、ping（做ping检测）、all（dns和ping都做）
   * @param {string} check_operator 指定平台从某个运营商进行检测，允许的值：CHINANET（电信出口）、UNICOM（联通出口）、CAP（腾讯自建出口）、DEFAULT（根据ip来选择运营商）
   *
   * [仅测试，未完成]
   */
  checkCallback(action = 'all', check_operator = 'DEFAULT') {
    return this.request({
      url: '/cgi-bin/callback/check',
      data: {
        action, check_operator
      }
    })
  }

  // ----------------
  // 自定义菜单
  // ----------------
  /**
   * 自定义菜单创建接口
   *
   * @param {Array.<object>} button 一级菜单数组，个数应为1~3个
   * @param {Array.<object>} button[].sub_button 二级菜单数组，个数应为1~5个
   *
   * 一级菜单和二级菜单的内部结构类似，这里采用变量 item 进行统一说明
   * @param {string} item.type 菜单的响应动作类型，view表示网页类型，click表示点击类型，miniprogram表示小程序类型
   * @param {string} item.name 菜单标题，不超过16个字节，子菜单不超过60个字节
   * @param {string} item.key 菜单KEY值，用于消息接口推送，不超过128字节。click等点击类型必须
   * @param {string} item.url 网页 链接，用户点击菜单可打开链接，不超过1024字节。 type为miniprogram时，不支持小程序的老版本客户端将打开本url。view、miniprogram类型必须
   * @param {string} item.media_id 调用新增永久素材接口返回的合法media_id。media_id类型和view_limited类型必须
   * @param {string} item.miniprogram 小程序的appid（仅认证公众号可配置）。miniprogram类型必须
   * @param {string} item.pagepath 小程序的页面路径。miniprogram类型必须
   */
  createMenu(button) {
    return this.request({
      url: '/cgi-bin/menu/create',
      data: {
        button
      }
    })
  }

  /**
   * 自定义菜单查询接口
   *
   * 使用接口创建自定义菜单后，开发者还可使用接口查询自定义菜单的结构。另外请注意，在设置了个性化菜单后，使用本自定义菜单查询接口可以获取默认菜单和全部个性化菜单信息。
   */
  getMenu() {
    return this.request({
      url: '/cgi-bin/menu/get',
      method: 'get'
    })
  }

  /**
   * 自定义菜单删除接口
   *
   * 使用接口创建自定义菜单后，开发者还可使用接口删除当前使用的自定义菜单。另请注意，在个性化菜单时，调用此接口会删除默认菜单及全部个性化菜单。
   */
  delMenu() {
    return this.request({
      url: '/cgi-bin/menu/delete',
      method: 'get'
    })
  }

  /**
   * 创建个性化菜单
   *
   * @param {Array.<object>} button 说明参见上方创建菜单接口
   * @param {object} matchrule 菜单匹配规则
   * @param {string} matchrule.tag_id 用户标签的id，可通过用户标签管理接口获取
   * @param {string} matchrule.sex 性别：男（1）女（2），不填则不做匹配
   * @param {string} matchrule.client_platform_type 客户端版本，当前只具体到系统型号：IOS(1), Android(2),Others(3)，不填则不做匹配
   * @param {string} matchrule.country 国家信息，是用户在微信中设置的地区，具体请参考地区信息表
   * @param {string} matchrule.province 省份信息，是用户在微信中设置的地区，具体请参考地区信息表
   * @param {string} matchrule.city 城市信息，是用户在微信中设置的地区，具体请参考地区信息表
   * @param {string} matchrule.language 语言信息，是用户在微信中设置的语言，具体请参考语言表： 1、简体中文 "zh_CN" 2、繁体中文TW "zh_TW" 3、繁体中文HK "zh_HK" 4、英文 "en" 5、印尼 "id" 6、马来 "ms" 7、西班牙 "es" 8、韩国 "ko" 9、意大利 "it" 10、日本 "ja" 11、波兰 "pl" 12、葡萄牙 "pt" 13、俄国 "ru" 14、泰文 "th" 15、越南 "vi" 16、阿拉伯语 "ar" 17、北印度 "hi" 18、希伯来 "he" 19、土耳其 "tr" 20、德语 "de" 21、法语 "fr"
   *
   * matchrule共六个字段，均可为空，但不能全部为空，至少要有一个匹配信息是不为空的。 country、province、city组成地区信息，将按照country、province、city的顺序进行验证，要符合地区信息表的内容。地区信息从大到小验证，小的可以不填，即若填写了省份信息，则国家信息也必填并且匹配，城市信息可以不填。 例如 “中国 广东省 广州市”、“中国 广东省”都是合法的地域信息，而“中国 广州市”则不合法，因为填写了城市信息但没有填写省份信息。
   *
   * [地区信息表]{@link http://wximg.gtimg.com/shake_tv/mpwiki/areainfo.zip}
   */
  addConditionalMenu(button, matchrule = {}) {
    return this.request({
      url: '/cgi-bin/menu/addconditional',
      data: {
        button, matchrule
      }
    })
  }

  /**
   * 删除个性化菜单
   * @param {string} menuid menuid为菜单id，可以通过自定义菜单查询接口获取。
   */
  delConditionalMenu(menuid) {
    return this.request({
      url: '/cgi-bin/menu/delconditional',
      data: {
        menuid
      }
    })
  }

  /**
   * 测试个性化菜单匹配结果
   * @param {string} user_id user_id可以是粉丝的OpenID，也可以是粉丝的微信号。
   */
  matchMenu(user_id) {
    return this.request({
      url: '/cgi-bin/menu/trymatch',
      data: {
        user_id
      }
    })
  }

  /**
   * 获取自定义菜单配置接口
   *
   * 本接口将会提供公众号当前使用的自定义菜单的配置，如果公众号是通过API调用设置的菜单，则返回菜单的开发配置，而如果公众号是在公众平台官网通过网站功能发布菜单，则本接口返回运营者设置的菜单配置。
   */
  getCurrentSelfMenuInfo() {
    return this.request({
      url: '/cgi-bin/get_current_selfmenu_info',
      method: 'get'
    })
  }

  // ----------------
  // 消息管理
  // ----------------
  /*
   * 请注意，必须先在公众平台官网为公众号设置微信号后才能使用该能力。
   */
  /**
   * 添加客服帐号
   *
   * @param {object} data
   * @param {string} data.kf_account 客服帐号
   * @param {string} data.nickname 客服昵称
   * @param {string} data.password 客服密码
   */
  addKfAccount(data) {
    return this.request({
      url: '/customservice/kfaccount/add',
      data
    })
  }

  /**
   * 修改客服帐号
   *
   * @param {object} data
   * @param {string} data.kf_account 客服帐号
   * @param {string} data.nickname 客服昵称
   * @param {string} data.password 客服密码
   */
  updateKfAccount(data) {
    return this.request({
      url: '/customservice/kfaccount/update',
      data
    })
  }

  /**
   * 删除客服帐号
   *
   * @param {object} data
   * @param {string} data.kf_account 客服帐号
   * @param {string} data.nickname 客服昵称
   * @param {string} data.password 客服密码
   */
  delKfAccount(data) {
    return this.request({
      url: '/customservice/kfaccount/del',
      method: 'get',
      data
    })
  }

  /**
   * 设置客服帐号的头像
   *
   * 开发者可调用本接口来上传图片作为客服人员的头像
   *
   * @param {string} kf_account 客服帐号
   * @param {FormData} avatar 头像图片文件必须是jpg格式，推荐使用640*640大小的图片以达到最佳效果
   */
  setKfAccountAvatar(kf_account, avatar) {
    return this._upload({
      url: '/customservice/kfaccount/uploadheadimg',
      params: {
        kf_account
      },
      data: {
        media: avatar
      }
    })
  }

  /**
   * 获取所有客服账号
   */
  getKfList() {
    return this.request({
      url: '/cgi-bin/customservice/getkflist',
      method: 'get'
    })
  }

  /**
   * 客服接口-发消息
   */
  sendCustomMessage(data) {
    return this.request({
      url: '/cgi-bin/message/custom/send',
      data
    })
  }

  /**
   * 客服输入状态
   *
   * 开发者可通过调用“客服输入状态”接口，返回客服当前输入状态给用户。
   *
   * @param {string} touser 普通用户（openid）
   * @param {string} command "Typing"：对用户下发“正在输入"状态 "CancelTyping"：取消对用户的”正在输入"状态
   */
  setCustomTyping(touser, command = 'Typing') {
    return this.request({
      url: '/cgi-bin/message/custom/typing',
      data: {
        touser, command
      }
    })
  }

  /**
   * 上传图文消息内的图片获取URL
   *
   * 请注意，本接口所上传的图片不占用公众号的素材库中图片数量的5000个的限制。图片仅支持jpg/png格式，大小必须在1MB以下。
   *
   * @param {FormData} media form-data中媒体文件标识，有filename、filelength、content-type等信息
   */
  uploadImg(media) {
    return this._upload({
      url: '/cgi-bin/media/uploadimg',
      data: {
        media
      }
    })
  }

  /**
   * 上传图文消息素材
   *
   * @param {Array.<object>} articles 图文消息，一个图文消息支持1到8条图文
   * @param {string} article.thumb_media_id 图文消息缩略图的media_id，可以在素材管理-新增素材中获得
   * @param {string} article.author 图文消息的作者
   * @param {string} article.title 图文消息的标题
   * @param {string} article.content_source_url 在图文消息页面点击“阅读原文”后的页面，受安全限制，如需跳转Appstore，可以使用itun.es或appsto.re的短链服务，并在短链后增加 #wechat_redirect 后缀。
   * @param {string} article.content 图文消息页面的内容，支持HTML标签。具备微信支付权限的公众号，可以使用a标签，其他公众号不能使用，如需插入小程序卡片，请参考官方文档。
   * @param {string} article.digest 图文消息的描述，如本字段为空，则默认抓取正文前64个字
   * @param {number} article.show_cover_pic 是否显示封面，1为显示，0为不显示
   * @param {number} article.need_open_comment Uint32 是否打开评论，0不打开，1打开
   * @param {number} article.only_fans_can_comment Uint32 是否粉丝才可评论，0所有人可评论，1粉丝才可评论
   */
  uploadNews(articles) {
    return this.request({
      url: '/cgi-bin/media/uploadnews',
      data: {
        articles
      }
    })
  }

  /**
   * 上传视频
   *
   * 注意，此处的上传视频并非文件处理，而是将视频素材转为视频消息
   *
   * @param {object} data
   * @param {string} data.media_id 视频素材编号，需通过素材管理->新增素材来得到
   * @param {string} data.title 视频标题
   * @param {string} data.description 视频描述
   */
  uploadVideo(data) {
    return this.request({
      url: '/cgi-bin/media/uploadvideo',
      data
    })
  }

  /**
   * 根据标签进行群发
   *
   * @param {object} data
   * @param {object} data.filter 过滤对象
   * @param {boolean} data.filter.is_to_all 用于设定是否向全部用户发送，值为true或false，选择true该消息群发给所有用户，选择false可根据tag_id发送给指定群组的用户
   * @param {string} data.filter.tag_id 群发到的标签的tag_id，参见用户管理中用户分组接口，若is_to_all值为true，可不填写tag_id
   * @param {string} data.msgtype 群发的消息类型，图文消息为mpnews，文本消息为text，语音为voice，音乐为music，图片为image，视频为video，卡券为wxcard
   * @param {stirng} data.send_ignore_reprint 消息被判定为转载时，是否继续群发。 1为继续群发（转载），0为停止群发。 该参数默认为0。
   *
   * @param {object} data.mpnews 用于设定即将发送的图文消息
   * @param {string} data.mpnews.media_id 素材ID
   * @param {object} data.text 用于设定即将发送的文本消息
   * @param {string} data.text.content 文本内容
   * @param {object} data.voice 用于设定即将发送的语音/音频消息
   * @param {string} data.voice.media_id 素材ID
   * @param {object} data.image 用于设定即将发送的图片消息
   * @param {string} data.image.media_id 素材ID
   * @param {object} data.mpvideo 用于设定即将发送的视频消息
   * @param {string} data.mpvideo.media_id 素材ID
   * @param {object} data.wxcard 用于设定即将发送的卡券消息
   * @param {string} data.wxcard.card_id 卡券ID
   */
  sendAll(data) {
    return this.request({
      url: '/cgi-bin/message/mass/sendall',
      data
    })
  }

  /**
   * 根据OpenID列表群发
   *
   * @param {object} data
   * @param {array.<string>} data.touser 用户列表
   * @param {string} data.msgtype 群发的消息类型，图文消息为mpnews，文本消息为text，语音为voice，音乐为music，图片为image，视频为video，卡券为wxcard
   *
   * @param {object} data.mpnews 用于设定即将发送的图文消息
   * @param {string} data.mpnews.media_id 素材ID
   * @param {object} data.text 用于设定即将发送的文本消息
   * @param {string} data.text.content 文本内容
   * @param {object} data.voice 用于设定即将发送的语音/音频消息
   * @param {string} data.voice.media_id 素材ID
   * @param {object} data.image 用于设定即将发送的图片消息
   * @param {string} data.image.media_id 素材ID
   * @param {object} data.mpvideo 用于设定即将发送的视频消息
   * @param {string} data.mpvideo.media_id 素材ID
   * @param {object} data.wxcard 用于设定即将发送的卡券消息
   * @param {string} data.wxcard.card_id 卡券ID
   *
   */
  sendMessage(data) {
    return this.request({
      url: '/cgi-bin/message/mass/send',
      data
    })
  }

  /**
   * 删除群发
   *
   * @param {string|number} 发送出去的消息ID
   * @param {number} article_idx 要删除的文章在图文消息中的位置，第一篇编号为1，该字段不填或填0会删除全部文章
   */
  delMesaage(msg_id, article_idx) {
    return this.request({
      url: '/cgi-bin/message/mass/delete',
      data: {
        msg_id, article_idx
      }
    })
  }

  /**
   * 预览接口
   *
   * 开发者可通过该接口发送消息给指定用户，在手机端查看消息的样式和排版。为了满足第三方平台开发者的需求，在保留对openID预览能力的同时，增加了对指定微信号发送预览的能力，但该能力每日调用次数有限制（100次），请勿滥用。
   *
   * @param {string} touser 用户的 openId
   * @param {string} towxname 用户的微信号，优先级**高于** touser
   * @param {object} data 其他参数，大部分同按标签分组群发接口
   *
   * @param {object} data.wxcard.card_ext 卡券的附加参数
   */
  previewMessage(touser, data) {
    return this.request({
      url: '/cgi-bin/message/mass/preview',
      data: {
        touser,
        ...data
      }
    })
  }

  /**
   * 查询群发消息发送状态
   *
   * @param {string|number} msg_id 群发消息后返回的消息id
   *
   * 消息发送后的状态，SEND_SUCCESS表示发送成功，SENDING表示发送中，SEND_FAIL表示发送失败，DELETE表示已删除
   */
  getMessageStatus(msg_id) {
    return this.request({
      url: '/cgi-bin/message/mass/get',
      data: {
        msg_id
      }
    })
  }

  /**
   * 获取群发速度
   */
  getMessageSpeed() {
    return this.request({
      url: '/cgi-bin/message/mass/speed/get'
    })
  }

  /**
   * 设置群发速度
   *
   * @param {number} 群发速度的级别，是一个0到4的整数，数字越大表示群发速度越慢。
   */
  setMessageSpeed(speed) {
    return this.request({
      url: '/cgi-bin/message/mass/speed/set',
      data: {
        speed
      }
    })
  }

  /**
   * 设置所属行业
   *
   * 设置行业可在微信公众平台后台完成，每月可修改行业1次，帐号仅可使用所属行业中相关的模板，为方便第三方开发者，提供通过接口调用的方式来修改账号所属行业
   *
   * @param {number} industry_id1 公众号模板消息所属行业编号
   * @param {number} industry_id2 公众号模板消息所属行业编号
   */
  setIndustry(industry_id1, industry_id2) {
    return this.request({
      url: '/cgi-bin/template/api_set_industry',
      data: {
        industry_id1, industry_id2
      }
    })
  }

  /**
   * 获取设置的行业信息
   */
  getIndustry() {
    return this.request({
      url: '/cgi-bin/template/get_industry'
    })
  }

  /**
   * 获得模板ID
   *
   * 从行业模板库选择模板到帐号后台，获得模板ID的过程可在微信公众平台后台完成。为方便第三方开发者，提供通过接口调用的方式来获取模板ID
   */
  getTemplateId() {
    return this.request({
      url: '/cgi-bin/template/api_add_template'
    })
  }

  /**
   * 获取模板列表
   *
   * 获取**已添加**至帐号下所有模板列表，可在微信公众平台后台中查看模板列表信息。为方便第三方开发者，提供通过接口调用的方式来获取帐号下所有模板信息
   *
   */
  getTemplateList() {
    return this.request({
      url: '/cgi-bin/template/get_all_private_template'
    })
  }

  /**
   * 删除模板
   *
   * @param {string} template_id 公众帐号下模板消息ID
   */
  delTemplateById(template_id) {
    return this.request({
      url: '/cgi-bin/template/del_private_template',
      data: {
        template_id
      }
    })
  }

  /**
   * 发送模板消息
   *
   * @param {object} data
   * @param {string} data.touser 接收者openid
   * @param {string} data.template_id 模板ID
   * @param {string} data.url 模板跳转链接（海外帐号没有跳转能力）
   * @param {object} data.miniprogram 跳小程序所需数据，不需跳小程序可不用传该数据
   * @param {string} data.miniprogram.appid 所需跳转到的小程序appid（该小程序appid必须与发模板消息的公众号是绑定关联关系，暂不支持小游戏）
   * @param {string} data.miniprogram.pagepath 所需跳转到小程序的具体页面路径，支持带参数,（示例index?foo=bar），要求该小程序已发布，暂不支持小游戏
   * @param {object} data.data 模板数据
   *
   * 模板数据为一个对象，键值对的说明如下：
   *
   * @param {string} data.data[key].value 内容
   * @param {string} data.data[key].color 模板内容字体颜色，不填默认为黑色
   *
   * key 为 first 时表示为添加在消息最开头的内容
   * key 为 remark 时表示为添加在消息最后面的内容
   *
   * 注：url和miniprogram都是非必填字段，若都不传则模板无跳转；若都传，会优先跳转至小程序。开发者可根据实际需要选择其中一种跳转方式即可。当用户的微信客户端版本不支持跳小程序时，将会跳转至url。
   */
  sendTemplateMessage(data) {
    return this.request({
      url: '/cgi-bin/message/template/send',
      data
    })
  }

  /**
   * 获取公众号的自动回复规则
   */
  getAutoReplyInfo() {
    return this.request({
      url: '/cgi-bin/get_current_autoreply_info',
      method: 'get'
    })
  }

  // ----------------
  // 微信网页开发
  // ----------------
  /**
   * 生成给 WEB SDK 调用的权限配置参数
   *
   * @param {string} url 页面完整路径
   * @param {Array} jsApiList 需要使用的 JS 接口列表，将原封不动的传回
   * @param {boolean} debug 开启调试模式，将原封不动的传回
   */
  genWebConfig(url, jsApiList = [], debug = false) {
    const timestamp = getTimestamp()
    const noncestr = genNouce()
    return new Promise((resolve, reject) => {
      this.getJsTicket().then(({ticket: jsapi_ticket}) => {
        const signature = genSha1({
          jsapi_ticket,
          url,
          timestamp,
          noncestr
        })
        resolve({
          appId: this.appId,
          timestamp,
          nonceStr: noncestr,
          signature,
          jsApiList,
          debug
        })
      }).catch(error => {
        reject(error)
      })
    })
  }

  // ----------------
  // 素材管理
  // ----------------
  /**
   * 新增临时素材
   *
   * 公众号经常有需要用到一些临时性的多媒体素材的场景，例如在使用接口特别是发送消息时，对多媒体文件、多媒体消息的获取和调用等操作，是通过media_id来进行的。素材管理接口对所有认证的订阅号和服务号开放。通过本接口，公众号可以新增临时素材（即上传临时多媒体文件）
   *
   * 注意点：
   *  - 1、临时素材media_id是可复用的。
   *  - 2、媒体文件在微信后台保存时间为3天，即3天后media_id失效。
   *  - 3、上传临时素材的格式、大小限制与公众平台官网一致。
   *    - 图片（image）: 2M，支持PNG\JPEG\JPG\GIF格式
   *    - 语音（voice）：2M，播放长度不超过60s，支持AMR\MP3格式
   *    - 视频（video）：10MB，支持MP4格式
   *    - 缩略图（thumb）：64KB，支持JPG格式
   *
   * @param {FormData} media form-data中媒体文件标识，有filename、filelength、content-type等信息
   * @param {string} type 媒体文件类型，分别有图片（image）、语音（voice）、视频（video）和缩略图（thumb）
   */
  uploadMedia(media, type = 'image') {
    return this._upload({
      url: '/cgi-bin/media/upload',
      params: {
        type
      },
      data: {
        media
      }
    })
  }

  /**
   * 获取临时素材
   *
   * @param {string} media_id 媒体文件ID
   */
  getMedia(media_id) {
    return this.request({
      url: '/cgi-bin/media/get',
      method: 'get',
      params: {
        media_id
      }
    })
  }

  /**
   * 高清语音素材获取接口
   *
   * 公众号可以使用本接口获取从JSSDK的uploadVoice接口上传的临时语音素材，格式为speex，16K采样率。该音频比上文的临时素材获取接口（格式为amr，8K采样率）更加清晰，适合用作语音识别等对音质要求较高的业务。
   *
   * @param {string} media_id 媒体文件ID
   */
  getHMedia(media_id) {
    return this.request({
      url: '/cgi-bin/media/get/jssdk',
      method: 'get',
      params: {
        media_id
      }
    })
  }

  /**
   * 新增永久图文素材
   *
   * @param {array.<object>} articles 图文素材列表
   *
   * @param {string} article.title 标题
   * @param {string} article.thumb_media_id 图文消息的封面图片素材id（必须是永久mediaID）
   * @param {string} article.author 作者
   * @param {string} article.digest 图文消息的摘要，仅有单图文消息才有摘要，多图文此处为空。如果本字段为没有填写，则默认抓取正文前64个字。
   * @param {number} article.show_cover_pic 是否显示封面，0为false，即不显示，1为true，即显示
   * @param {string} article.content 图文消息的具体内容，支持HTML标签，必须少于2万字符，小于1M，且此处会去除JS,涉及图片url必须来源 "上传图文消息内的图片获取URL"接口获取。外部图片url将被过滤。
   * @param {string} article.content_source_url 图文消息的原文地址，即点击“阅读原文”后的URL
   * @param {number} article.need_open_comment Uint32 是否打开评论，0不打开，1打开
   * @param {number} article.only_fans_can_comment Uint32 是否粉丝才可评论，0所有人可评论，1粉丝才可评论
   *
   */
  uploadArticle(articles) {
    return this.request({
      url: '/cgi-bin/material/add_news',
      data: {
        articles
      }
    })
  }

  /**
   * 新增其他类型永久素材
   *
   * 参数限制同 uploadMedia
   * 在上传视频素材时需要POST另一个表单，id为description，包含素材的描述信息：{ "title":VIDEO_TITLE, "introduction":INTRODUCTION }
   *
   * @param {FormData} media form-data中媒体文件标识，有filename、filelength、content-type等信息
   * @param {string} type 媒体文件类型，分别有图片（image）、语音（voice）、视频（video）和缩略图（thumb）
   *
   */
  uploadMaterial(media, type = 'image') {
    return this._upload({
      url: '/cgi-bin/material/add_material',
      params: {
        type
      },
      data: {
        media
      }
    })
  }

  /**
   * 获取永久素材
   *
   * @param {string} media_id 要获取的素材的media_id
   */
  getMaterial(media_id) {
    return this.request({
      url: '/cgi-bin/material/get_material',
      params: {
        media_id
      }
    })
  }

  /**
   * 删除永久素材
   *
   * @param {string} media_id 素材的media_id
   */
  delMaterial(media_id) {
    return this.request({
      url: '/cgi-bin/material/del_material',
      params: {
        media_id
      }
    })
  }

  /**
   * 修改永久图文素材
   *
   * 开发者可以通过本接口对永久图文素材进行修改
   *
   * @param {string} media_id 要修改的图文消息的id
   * @param {number} index 要更新的文章在图文消息中的位置（多图文消息时，此字段才有意义），第一篇为0
   * @param {object} article
   * @param {string} article.title 标题
   * @param {string} article.thumb_media_id 图文消息的封面图片素材id（必须是永久mediaID）
   * @param {string} article.author 作者
   * @param {string} article.digest 图文消息的摘要，仅有单图文消息才有摘要，多图文此处为空
   * @param {string} article.show_cover_pic 是否显示封面，0为false，即不显示，1为true，即显示
   * @param {string} article.content 图文消息的具体内容，支持HTML标签，必须少于2万字符，小于1M，且此处会去除JS
   * @param {string} article.content_source_url 图文消息的原文地址，即点击“阅读原文”后的URL
   */
  updateArticle(media_id, index, article) {
    return this.request({
      url: '/cgi-bin/material/update_news',
      data: {
        media_id, index, article
      }
    })
  }

  /**
   * 获取素材总数
   */
  getMaterialCount() {
    return this.request({
      url: '/cgi-bin/material/get_materialcount',
      method: 'get'
    })
  }

  /**
   * 获取素材列表
   *
   * @param {string} type 素材的类型，图片（image）、视频（video）、语音 （voice）、图文（news）
   * @param {number} offset 从全部素材的该偏移位置开始返回，0表示从第一个素材 返回
   * @param {number} count 返回素材的数量，取值在1到20之间
   */
  getMaterialList(type = 'news', offset = 0, count = 20) {
    return this.request({
      url: '/cgi-bin/material/batchget_material',
      data: {
        type, offset, count
      }
    })
  }

  // ----------------
  // 图文消息留言管理
  // ----------------
  /**
   * 打开已群发文章评论
   *
   * @param {Uint32} msg_data_id 群发返回的msg_data_id
   * @param {Uint32} index 多图文时，用来指定第几篇图文，从0开始，不带默认操作该msg_data_id的第一篇图文
   */
  openComment(msg_data_id, index) {
    return this.request({
      url: '/cgi-bin/comment/open',
      data: {
        msg_data_id, index
      }
    })
  }

  /**
   * 关闭已群发文章评论
   *
   * @param {number} msg_data_id 群发返回的msg_data_id
   * @param {object} index 多图文时，用来指定第几篇图文，从0开始，不带默认操作该msg_data_id的第一篇图文
   */
  closeComment(msg_data_id, index) {
    return this.request({
      url: '/cgi-bin/comment/close',
      data: {
        msg_data_id,
        index
      }
    })
  }

  /**
   * 查看指定文章的评论数据
   *
   * @param {number} msg_data_id 群发返回的msg_data_id
   * @param {object} options 查询参数
   * @param {number} options.index 多图文时，用来指定第几篇图文，从0开始，不带默认返回该msg_data_id的第一篇图文
   * @param {number} options.begin 起始位置
   * @param {number} options.count 获取数目（>=50会被拒绝）
   * @param {number} options.type type=0 普通评论&精选评论 type=1 普通评论 type=2 精选评论
   */
  listComment(msg_data_id, {index, begin = 0, count = 20, type = 0} = {}) {
    return this.request({
      url: '/cgi-bin/comment/list',
      data: {
        msg_data_id,
        index,
        begin,
        count,
        type
      }
    })
  }

  /**
   * 将评论标记精选
   *
   * @param {number} msg_data_id 群发返回的msg_data_id
   * @param {string} user_comment_id 用户评论id
   * @param {object} index 多图文时，用来指定第几篇图文，从0开始，不带默认操作该msg_data_id的第一篇图文
   */
  markComment(msg_data_id, user_comment_id, index) {
    return this.request({
      url: '/cgi-bin/comment/markelect',
      data: {
        msg_data_id,
        user_comment_id,
        index
      }
    })
  }

  /**
   * 将评论标记精选
   *
   * @param {number} msg_data_id 群发返回的msg_data_id
   * @param {string} user_comment_id 用户评论id
   * @param {object} index 多图文时，用来指定第几篇图文，从0开始，不带默认操作该msg_data_id的第一篇图文
   */
  markelectComment(msg_data_id, user_comment_id, index) {
    return this.request({
      url: '/cgi-bin/comment/markelect',
      data: {
        msg_data_id,
        user_comment_id,
        index
      }
    })
  }

  /**
   * 将评论取消精选
   *
   * @param {number} msg_data_id 群发返回的msg_data_id
   * @param {string} user_comment_id 用户评论id
   * @param {object} index 多图文时，用来指定第几篇图文，从0开始，不带默认操作该msg_data_id的第一篇图文
   */
  unmarkelectComment(msg_data_id, user_comment_id, index) {
    return this.request({
      url: '/cgi-bin/comment/unmarkelect',
      data: {
        msg_data_id,
        user_comment_id,
        index
      }
    })
  }

  /**
   * 删除评论
   *
   * @param {number} msg_data_id 群发返回的msg_data_id
   * @param {string} user_comment_id 用户评论id
   * @param {object} index 多图文时，用来指定第几篇图文，从0开始，不带默认操作该msg_data_id的第一篇图文
   */
  deleteComment(msg_data_id, user_comment_id, index) {
    return this.request({
      url: '/cgi-bin/comment/delete',
      data: {
        msg_data_id,
        user_comment_id,
        index
      }
    })
  }

  /**
   * 回复评论
   *
   * @param {number} msg_data_id 群发返回的msg_data_id
   * @param {string} user_comment_id 用户评论id
   * @param {string} content 回复内容
   * @param {object} index 多图文时，用来指定第几篇图文，从0开始，不带默认操作该msg_data_id的第一篇图文
   */
  replyComment(msg_data_id, user_comment_id, content, index) {
    return this.request({
      url: '/cgi-bin/comment/reply/add',
      data: {
        msg_data_id,
        user_comment_id,
        content,
        index
      }
    })
  }

  /**
   * 删除回复
   *
   * @param {number} msg_data_id 群发返回的msg_data_id
   * @param {string} user_comment_id 用户评论id
   * @param {string} content 回复内容
   * @param {object} index 多图文时，用来指定第几篇图文，从0开始，不带默认操作该msg_data_id的第一篇图文
   */
  delReplyComment(msg_data_id, user_comment_id, index) {
    return this.request({
      url: '/cgi-bin/comment/reply/delete',
      data: {
        msg_data_id,
        user_comment_id,
        index
      }
    })
  }

  // ----------------
  // 用户管理
  // ----------------
  /**
   * 创建标签
   *
   * 一个公众号，最多可以创建100个标签。
   *
   * @param {object} tag 标签
   * @param {string} tag.name 标签名（30个字符以内）
   */
  createTag(tag) {
    return this.request({
      url: '/cgi-bin/tags/create',
      data: {
        tag
      }
    })
  }

  /**
   * 获取公众号已创建的标签
   */
  getTagList() {
    return this.request({
      url: '/cgi-bin/tags/get',
      method: 'get'
    })
  }

  /**
   * 编辑标签
   *
   * @param {object} tag 标签
   * @param {string} tag.name 标签名（30个字符以内）
   */
  updateTag(tag) {
    return this.request({
      url: '/cgi-bin/tags/update',
      data: {
        tag
      }
    })
  }

  /**
   * 删除标签
   *
   * 请注意，当某个标签下的粉丝超过10w时，后台不可直接删除标签。此时，开发者可以对该标签下的openid列表，先进行取消标签的操作，直到粉丝数不超过10w后，才可直接删除该标签。
   *
   * @param {object} tag 标签
   * @param {string} tag.id 标签id
   * @param {string} tag.name 标签名（30个字符以内）
   */
  deleteTag(tag) {
    return this.request({
      url: '/cgi-bin/tags/delete',
      data: {
        tag
      }
    })
  }

  /**
   * 获取标签下粉丝列表
   *
   * @param {number} tagid 标签id
   * @param {string} next_openid 第一个拉取的OPENID，不填默认从头开始拉取
   */
  getUserByTag(tagid, next_openid) {
    return this.request({
      url: '/cgi-bin/user/tag/get',
      data: {
        tagid, next_openid
      }
    })
  }

  /**
   * 批量为用户打标签
   *
   * @param {array} openid_list 粉丝列表
   * @param {number} tagid 标签id
   */
  setUserTag(tagid, openid_list) {
    return this.request({
      url: '/cgi-bin/tags/members/batchtagging',
      data: {
        tagid, openid_list
      }
    })
  }

  /**
   * 批量为用户取消标签
   *
   * @param {array} openid_list 粉丝列表
   * @param {number} tagid 标签id
   */
  cancelUserTag(tagid, openid_list) {
    return this.request({
      url: '/cgi-bin/tags/members/batchuntagging',
      data: {
        tagid, openid_list
      }
    })
  }

  /**
   * 获取用户身上的标签列表
   *
   * @param {array} openid 用户标识
   */
  getTagByUser(openid) {
    return this.request({
      url: '/cgi-bin/tags/getidlist',
      data: {
        openid
      }
    })
  }

  /**
   * 设置用户备注名
   *
   * @param {array} openid 用户标识
   * @param {array} remark 新的备注名，长度必须小于30字符
   */
  setUserRemark(openid, remark) {
    return this.request({
      url: '/cgi-bin/user/info/updateremark',
      data: {
        openid, remark
      }
    })
  }

  /**
   * 获取用户基本信息(UnionID机制)
   *
   * 这里的接口是 UnionID 机制的
   * 注意与 getUserInfo 区分
   *
   * @param {string} openid 普通用户的标识，对当前公众号唯一
   * @param {string} lang 返回国家地区语言版本，zh_CN 简体，zh_TW 繁体，en 英语
   */
  getUserData(openid, lang = 'zh_CN') {
    return this.request({
      url: '/cgi-bin/user/info',
      method: 'get',
      params: {
        openid, lang
      }
    })
  }

  /**
   * 批量获取用户基本信息
   *
   * @param {array} user_list
   * @param {string} user.openid 普通用户的标识，对当前公众号唯一
   * @param {string} user.lang 返回国家地区语言版本，zh_CN 简体，zh_TW 繁体，en 英语
   */
  getUserData(user_list) {
    return this.request({
      url: '/cgi-bin/user/info/batchget',
      data: {
        user_list
      }
    })
  }

  /**
   * 获取用户列表
   *
   * 公众号可通过本接口来获取帐号的关注者列表，关注者列表由一串OpenID（加密后的微信号，每个用户对每个公众号的OpenID是唯一的）组成。一次拉取调用最多拉取10000个关注者的OpenID，可以通过多次拉取的方式来满足需求。
   *
   * @param {string} next_openid 第一个拉取的OPENID，不填默认从头开始拉取
   */
  getUserList(next_openid) {
    return this.request({
      url: '/cgi-bin/user/get',
      method: 'get',
      params: {
        next_openid
      }
    })
  }

  /**
   * 获取公众号的黑名单列表
   *
   * 公众号可通过该接口来获取帐号的黑名单列表，黑名单列表由一串 OpenID（加密后的微信号，每个用户对每个公众号的OpenID是唯一的）组成。
   * 该接口每次调用最多可拉取 10000 个OpenID，当列表数较多时，可以通过多次拉取的方式来满足需求。
   *
   * @param {string} begin_openid 第一个拉取的OPENID，不填默认从头开始拉取
   */
  getBlackList(begin_openid) {
    return this.request({
      url: '/cgi-bin/tags/members/getblacklist',
      data: {
        begin_openid
      }
    })
  }

  /**
   * 拉黑用户
   *
   * @param {string} openid_list 需要拉入黑名单的用户的openid，一次拉黑最多允许20个
   */
  setBlackList(openid_list) {
    return this.request({
      url: '/cgi-bin/tags/members/batchblacklist',
      data: {
        openid_list
      }
    })
  }

  /**
   * 取消拉黑用户
   *
   * @param {string} openid_list 需要拉入黑名单的用户的openid，一次拉黑最多允许20个
   */
  cancelBlackList(openid_list) {
    return this.request({
      url: '/cgi-bin/tags/members/batchunblacklist',
      data: {
        openid_list
      }
    })
  }

  // ----------------
  // 账号管理
  // ----------------
  /**
   * 创建二维码
   *
   * 接口会返回ticket，可用于在无登录态的情况下直接换取二维码图片
   *
   * @param {string} action_name 二维码类型，QR_SCENE为临时的整型参数值，QR_STR_SCENE为临时的字符串参数值，QR_LIMIT_SCENE为永久的整型参数值，QR_LIMIT_STR_SCENE为永久的字符串参数值
   * @param {number} sceneIdOrStr 场景值ID，临时二维码时为32位非0整型，永久二维码时最大值为100000（目前参数只支持1--100000）
   * @param {string} sceneIdOrStr 场景值ID（字符串形式的ID），字符串类型，长度限制为1到64
   * @param {number} expire_seconds 该二维码有效时间，以秒为单位。 最大不超过2592000（即30天），此字段如果不填，则默认有效期为30秒。
   *
   * 缓存 ticket 的相关逻辑请另行实现，这里不做封装
   */
  getQRCode(action_name, sceneIdOrStr, expire_seconds = 30) {
    const data = {
      expire_seconds,
      action_name
    }
    if (action_name === 'QR_SCENE' || action_name === 'QR_LIMIT_SCENE') {
      data.action_info = {
        scene: {
          scene_id: sceneIdOrStr
        }
      }
    } else {
      data.action_info = {
        scene: {
          scene_str: sceneIdOrStr
        }
      }
    }
    return this.request({
      url: '/cgi-bin/qrcode/create',
      data
    })
  }

  /**
   * 通过ticket换取二维码
   *
   * @param {string} ticket 二维码ticket
   */
  getQRByTicket(ticket) {
    return `https://mp.weixin.qq.com/cgi-bin/showqrcode?ticket=${encodeURIComponent(ticket)}`

    // return this._request({
    //   url: 'https://mp.weixin.qq.com/cgi-bin/showqrcode',
    //   params: {
    //     ticket
    //   }
    // })
  }

  /**
   * 长链接转短链接接口
   *
   * @param {string} long_url 需要转换的长链接，支持http://、https://、weixin://wxpay 格式的url
   */
  getShortURL(long_url) {
    return this.request({
      url: '/cgi-bin/shorturl',
      data: {
        action: 'long2short',
        long_url
      }
    })
  }

  // ----------------
  // 数据统计
  // ----------------
  /**
   * 获取用户增减数据
   *
   * @param {string<YYYY-MM-DD>} begin_date 获取数据的起始日期，begin_date和end_date的差值需小于“最大时间跨度”（比如最大时间跨度为1时，begin_date和end_date的差值只能为0，才能小于1），否则会报错
   * @param {string<YYYY-MM-DD>} end_data 获取数据的结束日期，end_date允许设置的最大值为昨日
   *
   * 时间最大跨度为 7 天
   */
  dcUserSummary(begin_date, end_date) {
    return this.request({
      url: '/datacube/getusersummary',
      data: {
        begin_date, end_date
      }
    })
  }

  /**
   * 获取累计用户数据
   *
   * @alias getUserCount
   *
   * @param {string<YYYY-MM-DD>} begin_date 获取数据的起始日期，begin_date和end_date的差值需小于“最大时间跨度”（比如最大时间跨度为1时，begin_date和end_date的差值只能为0，才能小于1），否则会报错
   * @param {string<YYYY-MM-DD>} end_data 获取数据的结束日期，end_date允许设置的最大值为昨日
   *
   * 时间最大跨度为 7 天
   */
  dcUserCumulate(begin_date, end_date) {
    return this.request({
      url: '/datacube/getusercumulate',
      data: {
        begin_date, end_date
      }
    })
  }
  dcUserCount(begin_date, end_date) {
    return this.getUserCumulate(begin_date, end_date)
  }

  /**
   * 获取图文群发每日数据
   *
   * @param {string<YYYY-MM-DD>} begin_date 获取数据的起始日期，begin_date和end_date的差值需小于“最大时间跨度”（比如最大时间跨度为1时，begin_date和end_date的差值只能为0，才能小于1），否则会报错
   * @param {string<YYYY-MM-DD>} end_data 获取数据的结束日期，end_date允许设置的最大值为昨日
   *
   * 时间最大跨度为 1 天
   */
  dcArticleSummary(begin_date, end_date) {
    return this.request({
      url: '/datacube/getarticlesummary',
      data: {
        begin_date, end_date
      }
    })
  }

  /**
   * 获取图文群发总数据
   *
   * @param {string<YYYY-MM-DD>} begin_date 获取数据的起始日期，begin_date和end_date的差值需小于“最大时间跨度”（比如最大时间跨度为1时，begin_date和end_date的差值只能为0，才能小于1），否则会报错
   * @param {string<YYYY-MM-DD>} end_data 获取数据的结束日期，end_date允许设置的最大值为昨日
   *
   * 时间最大跨度为 1 天
   */
  dcArticleTotal(begin_date, end_date) {
    return this.request({
      url: '/datacube/getarticletotal',
      data: {
        begin_date, end_date
      }
    })
  }

  /**
   * 获取图文统计数据
   *
   * @param {string<YYYY-MM-DD>} begin_date 获取数据的起始日期，begin_date和end_date的差值需小于“最大时间跨度”（比如最大时间跨度为1时，begin_date和end_date的差值只能为0，才能小于1），否则会报错
   * @param {string<YYYY-MM-DD>} end_data 获取数据的结束日期，end_date允许设置的最大值为昨日
   *
   * 时间最大跨度为 3 天
   */
  dcUserRead(begin_date, end_date) {
    return this.request({
      url: '/datacube/getuserread',
      data: {
        begin_date, end_date
      }
    })
  }

  /**
   * 获取图文统计分时数据
   *
   * @param {string<YYYY-MM-DD>} begin_date 获取数据的起始日期，begin_date和end_date的差值需小于“最大时间跨度”（比如最大时间跨度为1时，begin_date和end_date的差值只能为0，才能小于1），否则会报错
   * @param {string<YYYY-MM-DD>} end_data 获取数据的结束日期，end_date允许设置的最大值为昨日
   *
   * 时间最大跨度为 1 天
   */
  dcUserReadHour(begin_date, end_date) {
    return this.request({
      url: '/datacube/getuserreadhour',
      data: {
        begin_date, end_date
      }
    })
  }

  /**
   * 获取图文分享转发数据
   *
   * @param {string<YYYY-MM-DD>} begin_date 获取数据的起始日期，begin_date和end_date的差值需小于“最大时间跨度”（比如最大时间跨度为1时，begin_date和end_date的差值只能为0，才能小于1），否则会报错
   * @param {string<YYYY-MM-DD>} end_data 获取数据的结束日期，end_date允许设置的最大值为昨日
   *
   * 时间最大跨度为 7 天
   */
  dcUserShare(begin_date, end_date) {
    return this.request({
      url: '/datacube/getusershare',
      data: {
        begin_date, end_date
      }
    })
  }

  /**
   * 获取图文分享转发数据
   *
   * @param {string<YYYY-MM-DD>} begin_date 获取数据的起始日期，begin_date和end_date的差值需小于“最大时间跨度”（比如最大时间跨度为1时，begin_date和end_date的差值只能为0，才能小于1），否则会报错
   * @param {string<YYYY-MM-DD>} end_data 获取数据的结束日期，end_date允许设置的最大值为昨日
   *
   * 时间最大跨度为 1 天
   */
  dcUserShareHour(begin_date, end_date) {
    return this.request({
      url: '/datacube/getusersharehour',
      data: {
        begin_date, end_date
      }
    })
  }

  /**
   * 获取消息发送概况数据
   *
   * @param {string<YYYY-MM-DD>} begin_date 获取数据的起始日期，begin_date和end_date的差值需小于“最大时间跨度”（比如最大时间跨度为1时，begin_date和end_date的差值只能为0，才能小于1），否则会报错
   * @param {string<YYYY-MM-DD>} end_data 获取数据的结束日期，end_date允许设置的最大值为昨日
   *
   * 时间最大跨度为 7 天
   */
  dcUpstreamMesaage(begin_date, end_date) {
    return this.request({
      url: '/datacube/getupstreammsg',
      data: {
        begin_date, end_date
      }
    })
  }

  /**
   * 获取消息分送分时数据
   *
   * @param {string<YYYY-MM-DD>} begin_date 获取数据的起始日期，begin_date和end_date的差值需小于“最大时间跨度”（比如最大时间跨度为1时，begin_date和end_date的差值只能为0，才能小于1），否则会报错
   * @param {string<YYYY-MM-DD>} end_data 获取数据的结束日期，end_date允许设置的最大值为昨日
   *
   * 时间最大跨度为 1 天
   */
  dcUpstreamMesaageHour(begin_date, end_date) {
    return this.request({
      url: '/datacube/getupstreammsghour',
      data: {
        begin_date, end_date
      }
    })
  }

  /**
   * 获取消息发送周数据
   *
   * @param {string<YYYY-MM-DD>} begin_date 获取数据的起始日期，begin_date和end_date的差值需小于“最大时间跨度”（比如最大时间跨度为1时，begin_date和end_date的差值只能为0，才能小于1），否则会报错
   * @param {string<YYYY-MM-DD>} end_data 获取数据的结束日期，end_date允许设置的最大值为昨日
   *
   * 时间最大跨度为 30 天
   */
  dcUpstreamMesaageWeek(begin_date, end_date) {
    return this.request({
      url: '/datacube/getupstreammsgweek',
      data: {
        begin_date, end_date
      }
    })
  }

  /**
   * 获取消息发送月数据
   *
   * @param {string<YYYY-MM-DD>} begin_date 获取数据的起始日期，begin_date和end_date的差值需小于“最大时间跨度”（比如最大时间跨度为1时，begin_date和end_date的差值只能为0，才能小于1），否则会报错
   * @param {string<YYYY-MM-DD>} end_data 获取数据的结束日期，end_date允许设置的最大值为昨日
   *
   * 时间最大跨度为 30 天
   */
  dcUpstreamMesaageMonth(begin_date, end_date) {
    return this.request({
      url: '/datacube/getupstreammsgmonth',
      data: {
        begin_date, end_date
      }
    })
  }

  /**
   * 获取消息发送分布数据
   *
   * @param {string<YYYY-MM-DD>} begin_date 获取数据的起始日期，begin_date和end_date的差值需小于“最大时间跨度”（比如最大时间跨度为1时，begin_date和end_date的差值只能为0，才能小于1），否则会报错
   * @param {string<YYYY-MM-DD>} end_data 获取数据的结束日期，end_date允许设置的最大值为昨日
   *
   * 时间最大跨度为 15 天
   */
  dcUpstreamMesaageDistribute(begin_date, end_date) {
    return this.request({
      url: '/datacube/getupstreammsgdist',
      data: {
        begin_date, end_date
      }
    })
  }

  /**
   * 获取消息发送分布周数据
   *
   * @param {string<YYYY-MM-DD>} begin_date 获取数据的起始日期，begin_date和end_date的差值需小于“最大时间跨度”（比如最大时间跨度为1时，begin_date和end_date的差值只能为0，才能小于1），否则会报错
   * @param {string<YYYY-MM-DD>} end_data 获取数据的结束日期，end_date允许设置的最大值为昨日
   *
   * 时间最大跨度为 30 天
   */
  dcUpstreamMesaageDistributeWeek(begin_date, end_date) {
    return this.request({
      url: '/datacube/getupstreammsgdistweek',
      data: {
        begin_date, end_date
      }
    })
  }

  /**
   * 获取消息发送分布月数据
   *
   * @param {string<YYYY-MM-DD>} begin_date 获取数据的起始日期，begin_date和end_date的差值需小于“最大时间跨度”（比如最大时间跨度为1时，begin_date和end_date的差值只能为0，才能小于1），否则会报错
   * @param {string<YYYY-MM-DD>} end_data 获取数据的结束日期，end_date允许设置的最大值为昨日
   *
   * 时间最大跨度为 30 天
   */
  dcUpstreamMesaageDistributeMonth(begin_date, end_date) {
    return this.request({
      url: '/datacube/getupstreammsgdistmonth',
      data: {
        begin_date, end_date
      }
    })
  }

  /**
   * 获取接口分析数据
   *
   * @param {string<YYYY-MM-DD>} begin_date 获取数据的起始日期，begin_date和end_date的差值需小于“最大时间跨度”（比如最大时间跨度为1时，begin_date和end_date的差值只能为0，才能小于1），否则会报错
   * @param {string<YYYY-MM-DD>} end_data 获取数据的结束日期，end_date允许设置的最大值为昨日
   *
   * 时间最大跨度为 30 天
   */
  dcInterfaceSummary(begin_date, end_date) {
    return this.request({
      url: '/datacube/getinterfacesummary',
      data: {
        begin_date, end_date
      }
    })
  }

  /**
   * 获取接口分析分时数据
   *
   * @param {string<YYYY-MM-DD>} begin_date 获取数据的起始日期，begin_date和end_date的差值需小于“最大时间跨度”（比如最大时间跨度为1时，begin_date和end_date的差值只能为0，才能小于1），否则会报错
   * @param {string<YYYY-MM-DD>} end_data 获取数据的结束日期，end_date允许设置的最大值为昨日
   *
   * 时间最大跨度为 30 天
   */
  dcInterfaceSummaryHour(begin_date, end_date) {
    return this.request({
      url: '/datacube/getinterfacesummaryhour',
      data: {
        begin_date, end_date
      }
    })
  }

  // ----------------
  // 微信卡券
  // ----------------
  /**
   * 创建卡券
   *
   * @param {string(24)} card_type 团购券类型
   * @param {object} data 卡券数据
   *
   * card_type 分为
   *  - GROUPON 团购
   *  - CASH 代金券
   *  - DISCOUNT 折扣券
   *  - GIFT 兑换券
   *  - MEMBER_CARD 会员卡
   *
   */
  createCard(card_type = 'GROUPON', data = {}) {
    return this.request({
      url: '/card/create',
      data: {
        card_type: card_type.toUpperCase(),
        [card_type.toLowerCase()]: data
      }
    })
  }

  /**
   * 设置买单接口
   *
   * 创建卡券之后，开发者可以通过设置微信买单接口设置该card_id支持微信买单功能。值得开发者注意的是，设置买单的card_id必须已经配置了门店，否则会报错。
   *
   * @param {string} card_id 卡券id
   * @param {boolean} is_open 是否支持微信买单
   */
  setCardPayable(card_id, is_open) {
    return this.request({
      url: '/card/paycell/set',
      data: {
        card_id,
        is_open: !!is_open
      }
    })
  }

  /**
   * 设置自助核销接口
   *
   * 创建卡券之后，开发者可以通过设置微信买单接口设置该card_id支持自助核销功能。值得开发者注意的是，设置自助核销的card_id必须已经配置了门店，否则会报错。
   *
   * @param {string} card_id 卡券id
   * @param {boolean} is_open 是否开启自助核销功能，填true/false，默认为false
   * @param {boolean} need_verify_cod 用户核销时是否需要输入验证码， 填true/false， 默认为false
   * @param {boolean} need_remark_amount 用户核销时是否需要备注核销金额， 填true/false， 默认为false
   */
  setCardPayable(card_id, is_open, need_verify_cod, need_remark_amount) {
    return this.request({
      url: '/card/paycell/set',
      data: {
        card_id,
        is_open: !!is_open,
        need_verify_cod: !!need_verify_cod,
        need_remark_amount: !!need_remark_amount
      }
    })
  }

  /**
   * 创建卡券二维码
   *
   * 开发者可调用该接口生成一张卡券二维码供用户扫码后添加卡券到卡包。
   * 自定义Code码的卡券调用接口时，POST数据中需指定code，非自定义code不需指定，指定openid同理。指定后的二维码只能被用户扫描领取一次。
   * 获取二维码ticket后，开发者可用通过ticket换取二维码接口换取二维码图片详情。
   *
   * @param {string} action_name 取 QR_CARD 表示单张卡券，QR_MULTIPLE_CARD 表示多张卡券，其他值无效
   * @param {object} action_info 卡券信息
   * @param {number} expire_seconds 指定二维码的有效时间，范围是60 ~ 1800秒。不填默认为365天有效
   */
  createCardQR(action_name, action_info, expire_seconds) {
    return this.request({
      url: '/card/qrcode/create',
      data: {
        action_name, action_info, expire_seconds
      }
    })
  }

  /**
   * 创建货架接口
   *
   * @param {object} data
   * @param {string} data.banner 页面的banner图片链接，须调用，建议尺寸为640*300。
   * @param {string} data.title 页面的title。
   * @param {boolean} data.can_share 页面是否可以分享,填入true/false
   * @param {string} data.scene 投放页面的场景值； SCENE_NEAR_BY 附近 SCENE_MENU 自定义菜单 SCENE_QRCODE 二维码 SCENE_ARTICLE 公众号文章 SCENE_H5 h5页面 SCENE_IVR 自动回复 SCENE_CARD_CUSTOM_CELL 卡券自定义cell
   * @param {array} data.card_list 卡券列表，每个item有两个字段
   * @param {string} data.card_list[].card_id 所要在页面投放的card_id
   * @param {string} data.card_list[].thumb_url 缩略图url
   */
  createLandingPage(data) {
    return this.request({
      url: '/card/landingpage/create',
      data
    })
  }

  /**
   * 导入code接口
   *
   * 在自定义code卡券成功创建并且通过审核后，必须将自定义code按照与发券方的约定数量调用导入code接口导入微信后台
   *
   * @param {string} card_id 需要进行导入code的卡券ID。
   * @param {array} code 需导入微信卡券后台的自定义code，上限为100个。
   */
  depositCardCode(card_id, code) {
    return this.request({
      url: '/card/code/deposit',
      data: {
        card_id, code
      }
    })
  }

  /**
   * 查询导入code数目接口
   */
  getDepositCardCodeCount() {
    return this.request('/card/code/getdepositcount')
  }

  /**
   * 核查code接口
   *
   * @param {string} card_id 需要进行导入code的卡券ID。
   * @param {array} code 需导入微信卡券后台的自定义code，上限为100个。
   */
  checkCardCode(card_id, code) {
    return this.request({
      url: '/card/code/checkcode',
      data: {
        card_id, code
      }
    })
  }

  /**
   * 图文消息群发卡券
   *
   * 支持开发者调用该接口获取卡券嵌入图文消息的标准格式代码，将返回代码填入上传图文素材接口中content字段，即可获取嵌入卡券的图文消息素材。
   *
   * 特别注意：目前该接口仅支持填入非自定义code的卡券,自定义code的卡券需先进行code导入后调用。
   *
   * @param {string} card_id 卡券ID
   */
  getCardHTML(card_id) {
    return this.request({
      url: '/card/mpnews/gethtml',
      data: {
        card_id
      }
    })
  }

  /**
   * 设置测试白名单
   *
   * 由于卡券有审核要求，为方便公众号调试，可以设置一些测试帐号，这些帐号可领取未通过审核的卡券，体验整个流程。
   *
   * @param {array} openid 测试的openid列表。
   * @param {array} username 测试的微信号列表。
   *
   * 1. 同时支持“openid”、“username”两种字段设置白名单，总数上限为10个
   * 2. 设置测试白名单接口为全量设置，即测试名单发生变化时需调用该接口重新传入所有测试人员的ID.
   * 3. 白名单用户领取该卡券时将无视卡券失效状态，请开发者注意。
   */
  setCardWhiteList({openid, username}) {
    return this.request({
      url: '/card/testwhitelist/set',
      data: {
        openid, username
      }
    })
  }

  /**
   * 查询Code接口
   *
   * 我们强烈建议开发者在调用核销code接口之前调用查询code接口，并在核销之前对非法状态的code(如转赠中、已删除、已核销等)做出处理。
   *
   * @param {string} code 单张卡券的唯一标准
   * @param {string} card_id 卡券ID代表一类卡券。自定义code卡券必填。
   * @param {boolean} check_consume 是否校验code核销状态，填入true和false时的code异常状态返回数据不同。
   */
  getCardCode(code, card_id, check_consume) {
    return this.request({
      url: '/card/code/get',
      data: {
        code, card_id, check_consume
      }
    })
  }

  /**
   * 核销Code接口
   *
   * 消耗code接口是核销卡券的唯一接口,开发者可以调用当前接口将用户的优惠券进行核销，该过程不可逆。
   *
   * @param {string} code 需核销的Code码。
   * @param {string} card_id 卡券ID。创建卡券时use_custom_code填写true时必填。非自定义Code不必填写
   */
  consumeCardCode(code, card_id) {
    return this.request({
      url: '/card/code/consume',
      data: {
        code, card_id
      }
    })
  }

  /**
   * Code解码接口
   *
   * code解码接口支持两种场景：
   * 1. 商家获取choos_card_info后，将card_id和encrypt_code字段通过解码接口，获取真实code。
   * 2. 卡券内跳转外链的签名中会对code进行加密处理，通过调用解码接口获取真实code。
   *
   * @param {string} encrypt_code 经过加密的Code码。
   */
  decryptCardCode(encrypt_code) {
    return this.request({
      url: '/card/code/decrypt',
      data: {
        encrypt_code
      }
    })
  }

  /**
   * 获取用户已领取卡券接口
   *
   * @param {string} openid 需要查询的用户openid
   * @param {string} card_id 卡券ID。不填写时默认查询当前appid下的卡券。
   */
  getUserCardList(openid, card_id) {
    return this.request({
      url: '/card/user/getcardlist',
      data: {
        openid, card_id
      }
    })
  }

  /**
   * 查看卡券详情
   *
   * @param {string} card_id 卡券ID。
   */
  getCardDetail(card_id) {
    return this.request({
      url: '/card/get',
      data: {
        card_id
      }
    })
  }

  /**
   * 批量查询卡券列表
   *
   * @param {number} offset 查询卡列表的起始偏移量，从0开始，即offset: 5是指从从列表里的第六个开始读取。
   * @param {number} count 需要查询的卡片的数量（数量最大50）。
   * @param {string|array} 支持开发者拉出指定状态的卡券列表 “CARD_STATUS_NOT_VERIFY”, 待审核 ； “CARD_STATUS_VERIFY_FAIL”, 审核失败； “CARD_STATUS_VERIFY_OK”， 通过审核； “CARD_STATUS_DELETE”， 卡券被商户删除； “CARD_STATUS_DISPATCH”， 在公众平台投放过的卡券；支持多个状态一起查询，传入数组即可。
   */
  getCardListBatch(offset = 0, count = 20, status_list) {
    return this.request({
      url: '/card/batchget',
      data: {
        offset, count, status_list
      }
    })
  }

  /**
   * 更改卡券信息接口
   *
   * @param {object} data
   * @param {string} data.card_id 卡券id
   * @param {object} data[type] 卡券数据，type 为该卡券的类型
   */
  updateCard(data) {
    return this.request({
      url: '/card/update',
      data
    })
  }

  /**
   * 修改库存接口
   *
   * @param {string} card_id 卡券ID。
   * @param {number} increase_stock_value 增加多少库存，支持不填或填0。
   * @param {number} reduce_stock_value 减少多少库存，可以不填或填0。
   */
  setCardStock(card_id, increase_stock_value = 0, reduce_stock_value = 0) {
    return this.request({
      url: '/card/modifystock',
      data: {
        card_id, increase_stock_value, reduce_stock_value
      }
    })
  }

  /**
   * 更改Code接口
   *
   * @param {string} code 需变更的Code码。
   * @param {string} new_code 变更后的有效Code码。
   * @param {string} card_id 卡券ID。自定义Code码卡券为必填。
   */
  updateCardCode(code, new_code, card_id) {
    return this.request({
      url: '/card/code/update',
      data: {
        code, new_code, card_id
      }
    })
  }

  /**
   * 删除卡券接口
   *
   * @param {string} card_id 卡券ID。
   */
  delCard(card_id) {
    return this.request({
      url: '/card/delete',
      data: {
        code, new_code, card_id
      }
    })
  }

  /**
   * 设置卡券失效接口
   *
   * 为满足改票、退款等异常情况，可调用卡券失效接口将用户的卡券设置为失效状态。
   *
   * @param {string} card_id 卡券ID。
   * @param {string} code 设置失效的Code码。
   * @param {string} reason 失效理由
   *
   * 注意事项：
   * 1. 设置卡券失效的操作**不可逆**，即无法将设置为失效的卡券调回有效状态，商家须慎重调用该接口。
   * 2. 商户调用失效接口前须与顾客事先告知并取得同意，否则因此带来的顾客投诉，微信将会按照《微信运营处罚规则》
   */
  disableCardCode(card_id, code, reason) {
    return this.request({
      url: '/card/code/unavailable',
      data: {
        card_id, code, reason
      }
    })
  }

  /**
   * 拉取卡券概况数据接口
   *
   * @param {string<YYYY-MM-DD>} begin_date 获取数据的起始日期，begin_date和end_date的差值需小于“最大时间跨度”（比如最大时间跨度为1时，begin_date和end_date的差值只能为0，才能小于1），否则会报错
   * @param {string<YYYY-MM-DD>} end_data 获取数据的结束日期，end_date允许设置的最大值为昨日
   * @param {number} cond_source 卡券来源，0为公众平台创建的卡券数据 、1是API创建的卡券数据
   *
   * 最大时间跨度为 62 天
   *
   */
  dcCardBizInfo(begin_date, end_date, cond_source) {
    return this.request({
      url: '/datacube/getcardbizuininfo',
      data: {
        begin_date, end_date, cond_source
      }
    })
  }

  /**
   * 获取免费券数据接口
   *
   * @param {string<YYYY-MM-DD>} begin_date 获取数据的起始日期，begin_date和end_date的差值需小于“最大时间跨度”（比如最大时间跨度为1时，begin_date和end_date的差值只能为0，才能小于1），否则会报错
   * @param {string<YYYY-MM-DD>} end_data 获取数据的结束日期，end_date允许设置的最大值为昨日
   * @param {number} cond_source 卡券来源，0为公众平台创建的卡券数据 、1是API创建的卡券数据
   * @param {string} card_id 卡券ID。填写后，指定拉出该卡券的相关数据。
   *
   * 最大时间跨度为 62 天
   *
   */
  dcCardCardInfo(begin_date, end_date, cond_source, card_id) {
    return this.request({
      url: '/datacube/getcardcardinfo',
      data: {
        begin_date, end_date, cond_source, card_id
      }
    })
  }

  /**
   * 拉取会员卡概况数据接口
   *
   * @param {string<YYYY-MM-DD>} begin_date 获取数据的起始日期，begin_date和end_date的差值需小于“最大时间跨度”（比如最大时间跨度为1时，begin_date和end_date的差值只能为0，才能小于1），否则会报错
   * @param {string<YYYY-MM-DD>} end_data 获取数据的结束日期，end_date允许设置的最大值为昨日
   * @param {number} cond_source 卡券来源，0为公众平台创建的卡券数据 、1是API创建的卡券数据
   *
   */
  dcCardMemberInfo(begin_date, end_date, cond_source) {
    return this.request({
      url: '/datacube/getcardmembercardinfo',
      data: {
        begin_date, end_date, cond_source
      }
    })
  }

  /**
   * 拉取单张会员卡数据接口
   *
   * @param {string<YYYY-MM-DD>} begin_date 获取数据的起始日期，begin_date和end_date的差值需小于“最大时间跨度”（比如最大时间跨度为1时，begin_date和end_date的差值只能为0，才能小于1），否则会报错
   * @param {string<YYYY-MM-DD>} end_data 获取数据的结束日期，end_date允许设置的最大值为昨日
   * @param {string} card_id 卡券id
   *
   */
  dcCardMemberDetail(begin_date, end_date, card_id) {
    return this.request({
      url: '/datacube/getcardmembercarddetail',
      data: {
        begin_date, end_date, card_id
      }
    })
  }

  /**
   * 创建-礼品卡货架接口
   *
   * @param {object} data
   */
  createCardGiftPage(data) {
    return this.request({
      url: '/card/giftcard/page/add',
      data
    })
  }

  /**
   * 查询-礼品卡货架信息接口
   *
   * @param {string} page_id 货架id
   */
  getCardGiftPage(page_id) {
    return this.request({
      url: '/card/giftcard/page/get',
      data: {
        page_id
      }
    })
  }

  /**
   * 修改-礼品卡货架信息接口
   *
   * @param {string} page_id 货架id
   */
  updateCardGiftPage(page_id) {
    return this.request({
      url: '/card/giftcard/page/update',
      data: {
        page_id
      }
    })
  }

  /**
   * 查询-礼品卡货架列表接口
   */
  getCardGiftPageList() {
    return this.request('/card/giftcard/page/batchget')
  }

  /**
   * 下架-礼品卡货架接口
   *
   * @param {string} page_id 货架id，如果不传，则下架所有
   */
  setCardGiftMantain(page_id) {
    const data = {
      maintain: true
    }
    if (page_id) {
      data.page_id = page_id
    } else {
      data.all = true
    }
    return this.request({
      url: '/card/giftcard/maintain/set',
      data
    })
  }

  /**
   * 开通微信支付礼品卡权限
   *
   * @param {string} sub_mch_id 微信支付子商户号
   */
  applyCardGiftPayWhiteList(sub_mch_id) {
    return this.request({
      url: '/card/giftcard/pay/whitelist/add',
      data: {
        sub_mch_id
      }
    })
  }

  /**
   * 绑定商户号到礼品卡小程序接口
   *
   * @param {string} sub_mch_id 微信支付子商户号
   * @param {string} wxa_appid 小程序标识
   */
  bindCardGiftWxa(sub_mch_id, wxa_appid) {
    return this.request({
      url: '/card/giftcard/pay/submch/bind',
      data: {
        sub_mch_id, wxa_appid
      }
    })
  }

  /**
   * 上传小程序代码
   *
   * @param {string} wxa_appid 小程序标识
   * @param {string} page_id 货架id
   */
  setCardGiftWxa(wxa_appid, page_id) {
    return this.request({
      url: '/card/giftcard/wxa/set',
      data: {
        page_id, wxa_appid
      }
    })
  }

  /**
   * 查询-单个礼品卡订单信息接口
   *
   * @param {string} order_id 礼品卡订单号，商户可以通过购买成功的事件推送或者批量查询订单接口获得
   */
  getCardGiftOrder(order_id) {
    return this.request({
      url: '/card/giftcard/order/get',
      data: {
        order_id
      }
    })
  }

  /**
   * 查询-批量查询礼品卡订单信息接口
   *
   * @param {number} offset 查询的订单偏移量，如填写100则表示从第100个订单开始拉取
   * @param {number} count 查询订单的数量，如offset填写100，count填写10，则表示查询第100个到第110个订单
   * @param {timestamp} begin_time 查询的时间起点，十位时间戳（utc+8）
   * @param {timestamp} end_time 查询的时间终点，十位时间戳（utc+8）
   * @param {string} sort_type 填"ASC" / "DESC"，表示对订单创建时间进行“升 / 降”排序
   *
   * 注意事项：
   * 1. 返回中的total_count是在当前查询条件下的totalcount，类似于分页的实现改变offset/count，直到某次请求的\时表示拉取结束。
   * 2. begin_time和end_time的跨度不能超过31天。
   * 3. count不能超过100。
   * 4. sort_type可以填"ASC" / "DESC"，表示对*订单创建时间进行“升 / 降”排序。
   *
   */
  getCardGiftOrder(offset, count, begin_time, end_time, sort_type = 'ACS') {
    return this.request({
      url: '/card/giftcard/order/batchget',
      data: {
        offset, count, begin_time, end_time, sort_type
      }
    })
  }

  /**
   * 更新用户礼品卡信息接口
   *
   * @param {string}
   */
  updateCardGiftUserInfo(data) {
    return this.request({
      url: '/card/generalcard/updateuser',
      data
    })
  }

  /**
   * 退款
   *
   * @param {string} order_id 须退款的订单id
   */
  refundCardGift(order_id) {
    return this.request({
      url: '/card/giftcard/order/refund',
      data: {
        order_id
      }
    })
  }

  /**
   * 设置支付后开票信息
   *
   * @param {object} paymch_info 授权页字段
   * @param {string} paymch_info.mchid 微信支付商户号
   * @param {object} paymch_info.s_pappid 开票平台id，需要找开票平台提供
   */
  doCardInvoice(paymch_info) {
    return this.request({
      url: '/card/invoice/setbizattr',
      params: {
        action: 'set_pay_mch'
      },
      data: {
        paymch_info
      }
    })
  }

  /**
   * 查询支付后开票信息接口
   *
   * @param {object} paymch_info 授权页字段
   * @param {string} paymch_info.mchid 微信支付商户号
   * @param {object} paymch_info.s_pappid 开票平台id，需要找开票平台提供
   */
  queryCardInvoice(paymch_info) {
    return this.request({
      url: '/card/invoice/setbizattr',
      params: {
        action: 'get_pay_mch'
      },
      data: {
        paymch_info
      }
    })
  }

  /**
   * 设置授权页字段信息接口
   *
   * @param {object} auth_field
   * @param {object} auth_field.user_field 授权页个人发票字段
   * @param {object} auth_field.biz_field 授权页单位发票字段
   */
  setCardInvoiceAuth(auth_field) {
    return this.request({
      url: '/card/invoice/setbizattr',
      params: {
        action: 'set_auth_field'
      },
      data: {
        auth_field
      }
    })
  }

  /**
   * 查询授权页字段信息接口
   */
  getCardInvoiceAuth() {
    return this.request({
      url: '/card/invoice/setbizattr',
      params: {
        action: 'get_auth_field'
      }
    })
  }

  /**
   * 查询开票信息
   *
   * @param {string} order_id 发票order_id
   * @param {string} s_appid 发票平台的身份id
   */
  getCardInvoiceInfo(order_id, s_appid) {
    return this.request({
      url: '/card/invoice/getauthdata',
      data: {
        order_id, s_appid
      }
    })
  }

  // ----------------
  // 会员卡
  // ----------------
  /**
   * 会员卡隶属于卡券系统，创建等相关接口参考上方接口
   */
  /**
   * 会员卡接口激活
   *
   * @param {object} data
   * @param {string} data.membership_number 会员卡编号，由开发者填入，作为序列号显示在用户的卡包里。可与Code码保持等值。
   * @param {string} data.code 领取会员卡用户获得的code
   * @param {string} data.card_id 卡券ID,自定义code卡券必填
   * @param {string} data.background_pic_url 商家自定义会员卡背景图，须 先调用 上传图片接口 将背景图上传至CDN，否则报错， 卡面设计请遵循 微信会员卡自定义背景设计规范
   * @param {timestamp} data.activate_begin_time 激活后的有效起始时间。若不填写默认以创建时的 data_info 为准。Unix时间戳格式。
   * @param {timestamp} data.activate_end_time 激活后的有效截至时间。若不填写默认以创建时的 data_info 为准。Unix时间戳格式。
   * @param {number} data.init_bonus 初始积分，不填为0。
   * @param {string} data.init_bonus_record 积分同步说明。
   * @param {number} data.init_balance 初始余额，不填为0。
   * @param {string} data.init_custom_field_value1 创建时字段custom_field1定义类型的初始值，限制为4个汉字，12字节。
   * @param {string} data.init_custom_field_value2 创建时字段custom_field2定义类型的初始值，限制为4个汉字，12字节。
   * @param {string} data.init_custom_field_value3 创建时字段custom_field3定义类型的初始值，限制为4个汉字，12字节。
   */
  activeMemberCard(data) {
    return this.request({
      url: '/card/membercard/activate',
      data
    })
  }

  /**
   * 设置会员卡开卡字段接口
   *
   * @param {string} card_id 卡券ID。
   * @param {object} data 卡券数据
   * @param {object} data.required_form 会员卡激活时的必填选项。
   * @param {object} data.optional_form 会员卡激活时的选填项。
   * @param {object} data.service_statement 服务声明，用于放置商户会员卡守则
   * @param {object} data.bind_old_card 绑定老会员链接
   */
  setMemberCardFields(card_id, data = {}) {
    return this.request({
      url: '/card/membercard/activateuserform/set',
      data: {
        card_id,
        ...data
      }
    })
  }

  /**
   * 拉取会员信息接口
   *
   * @param {string} card_id 卡券ID。
   * @param {string} code 卡券Code码。
   */
  getMemberCardUserInfo(card_id, code) {
    return this.request({
      url: '/card/membercard/userinfo/get',
      data: {
        card_id, code
      }
    })
  }

  /**
   * 获取用户提交资料
   */
  getMemberCardUserTempInput(activate_ticket) {
    return this.request({
      url: '/card/membercard/activatetempinfo/get',
      data: {
        activate_ticket
      }
    })
  }

  /**
   * 更新会员信息
   *
   * 当会员持卡消费后，支持开发者调用该接口更新会员信息。会员卡交易后的每次信息变更需通过该接口通知微信，便于后续消息通知及其他扩展功能。
   *
   * @param {object} data
   * @param {string} data.code 卡券Code码。
   * @param {string} data.card_id 卡券ID。
   * @param {string} data.background_pic_url 支持商家激活时针对单个会员卡分配自定义的会员卡背景。
   * @param {number} data.bonus 需要设置的积分全量值，传入的数值会直接显示
   * @param {number} data.add_bonus 本次积分变动值，传负数代表减少
   * @param {string} data.record_bonus 	商家自定义积分消耗记录，不超过14个汉字
   * @param {number} data.balance 需要设置的余额全量值，传入的数值会直接显示在卡面
   * @param {number} data.add_balance 	本次余额变动值，传负数代表减少
   * @param {string} data.record_balance 商家自定义金额消耗记录，不超过14个汉字。
   * @param {string} data.custom_field_value1 创建时字段custom_field1定义类型的最新数值，限制为4个汉字，12字节。
   * @param {string} data.custom_field_value2 创建时字段custom_field2定义类型的最新数值，限制为4个汉字，12字节。
   * @param {string} data.custom_field_value3 创建时字段custom_field3定义类型的最新数值，限制为4个汉字，12字节。
   * @param {object} data.notify_optional 控制原生消息结构体，包含各字段的消息控制字段
   * @param {string} data.notify_optional.is_notify_bonus 积分变动时是否触发系统模板消息，默认为true
   * @param {string} data.notify_optional.is_notify_balance 余额变动时是否触发系统模板消息，默认为true
   * @param {string} data.notify_optional.is_notify_custom_field1 自定义group1变动时是否触发系统模板消息，默认为false。（2、3同理）
   */
  updateMemberCardUser(data) {
    return this.request({
      url: '/card/membercard/updateuser',
      data
    })
  }

  /**
   * 设置支付后投放卡券接口
   *
   * @param {object} rule_info 支付后营销规则结构体
   */
  setCardGiftAfterPay(rule_info) {
    return this.request({
      url: '/card/paygiftcard/add',
      data: {
        rule_info
      }
    })
  }

  /**
   * 删除支付后投放卡券规则接口
   *
   * @param {string|number} rule_id 支付即会员的规则名称
   */
  delCardGiftAfterPay(rule_id) {
    return this.request({
      url: '/card/paygiftcard/delete',
      data: {
        rule_id
      }
    })
  }

  /**
   * 删除支付后投放卡券规则接口
   *
   * @param {string|number} rule_id 支付即会员的规则名称
   */
  getCardGiftAfterPay(rule_id) {
    return this.request({
      url: '/card/paygiftcard/getbyid',
      data: {
        rule_id
      }
    })
  }

  /**
   * 批量查询支付后投放卡券规则接口
   *
   * @param {number} offset 起始偏移量
   * @param {number} count 查询的数量
   * @param {boolean} effective 是否仅查询生效的规则
   */
  getCardGiftAfterPayBatch(offset, count, effective) {
    return this.request({
      url: '/card/paygiftcard/batchget',
      data: {
        type: 'RULE_TYPE_PAY_MEMBER_CARD',
        offset, count, effective
      }
    })
  }

  /**
   * 开通券点账户接口
   *
   * 本接口用于开发者为当前appid开通券点账户并获得免费券点奖励
   */
  activateCardPay() {
    return this.request('/card/pay/activate')
  }

  /**
   * 对优惠券批价
   *
   * 本接口用于提前查询本次新增库存需要多少券点
   *
   * @param {string} card_id 需要来配置库存的card_id
   * @param {number} quantity 本次需要兑换的库存数目
   */
  activateCardPay(card_id, quantity) {
    return this.request({
      url: '/card/pay/getpayprice',
      data: {
        card_id, quantity
      }
    })
  }

  /**
   * 查询券点余额接口
   */
  getCardPayCoinsInfo() {
    return this.request('/card/pay/getcoinsinfo')
  }

  /**
   * 确认兑换库存接口
   *
   * @param {string} card_id 需要来兑换库存的card_id
   * @param {string} order_id 仅可以使用上面得到的订单号，保证批价有效性
   * @param {number} quantity 本次需要兑换的库存数目
   */
  confirmCardPay(card_id, order_id, quantity) {
    return this.request({
      url: '/card/pay/confirm',
      data: {
        card_id, order_id, quantity
      }
    })
  }

  /**
   * 充值券点接口
   *
   * @param {number} coin_count 需要充值的券点数目，1点=1元
   */
  rechargeCardPay(coin_count) {
    return this.request({
      url: '/card/pay/recharge',
      data: {
        coin_count
      }
    })
  }

  /**
   * 查询订单详情接口
   *
   * @param {number} order_id 上一步中获得的订单号，作为一次交易的唯一凭证
   */
  getCardPayOrderInfo(order_id) {
    return this.request({
      url: '/card/pay/getorder',
      data: {
        order_id
      }
    })
  }

  /**
   * 查询券点流水详情接口
   *
   * @param {number} order_id 上一步中获得的订单号，作为一次交易的唯一凭证
   */
  getCardPayOrderList(order_id) {
    return this.request({
      url: '/card/pay/getorderlist',
      data: {
        order_id
      }
    })
  }



  noop() {}












}

module.exports = API
