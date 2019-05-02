'use strict'

const Base = require('./base')

class API extends Base {
  /**
   * 统一下单
   *
   * 除付款码支付场景以外，商户系统先调用该接口在微信支付服务后台生成预支付交易单，返回正确的预支付交易会话标识后再按Native、JSAPI、APP等不同场景生成交易串调起支付。
   *
   * @param {object} data
   * @param {string} data.device_info 自定义参数，可以为终端设备号(门店号或收银设备ID)，PC网页或公众号内支付可以传"WEB"
   * @param {string} data.body 商品简单描述，该字段请按照规范传递
   * @param {string} data.detail 商品详细描述，对于使用单品优惠的商户，改字段必须按照规范上传
   * @param {string} data.attach 附加数据，在查询API和支付通知中原样返回，可作为自定义参数使用。
   * @param {string} data.out_trade_no 商户系统内部订单号，要求32个字符内，只能是数字、大小写字母_-|* 且在同一个商户号下唯一。
   * @param {string} data.fee_type 符合ISO 4217标准的三位字母代码，默认人民币：CNY
   * @param {number} data.total_fee 订单总金额，单位为分
   * @param {string} data.spbill_create_ip 支持IPV4和IPV6两种格式的IP地址。调用微信支付API的机器IP
   * @param {string} data.time_start 订单生成时间，格式为yyyyMMddHHmmss，如2009年12月25日9点10分10秒表示为20091225091010
   * @param {string} data.time_expire 订单失效时间，格式为yyyyMMddHHmmss，如2009年12月27日9点10分10秒表示为20091227091010。订单失效时间是针对订单号而言的，由于在请求支付的时候有一个必传参数prepay_id只有两小时的有效期，所以在重入时间超过2小时的时候需要重新请求下单接口获取新的prepay_id。建议：最短失效时间间隔大于1分钟
   * @param {string} data.goods_tag 订单优惠标记，使用代金券或立减优惠功能时需要的参数
   * @param {string} data.notify_url 异步接收微信支付结果通知的回调地址，通知url必须为外网可访问的url，不能携带参数。
   * @param {string} data.trade_type JSAPI -JSAPI支付；NATIVE -Native支付；APP -APP支付
   * @param {string} data.product_id trade_type=NATIVE时，此参数必传。此参数为二维码中包含的商品ID，商户自行定义。
   * @param {string} data.limit_pay 上传此参数no_credit--可限制用户不能使用信用卡支付
   * @param {string} data.openid trade_type=JSAPI时（即JSAPI支付），此参数必传，此参数为微信用户在商户对应appid下的唯一标识。
   * @param {string} data.receipt Y，传入Y时，支付成功消息和支付详情页将出现开票入口。需要在微信支付商户平台或微信公众平台开通电子发票功能，传此字段才可生效
   * @param {object} data.scene_info 该字段常用于线下活动时的场景信息上报，支持上报实际门店信息，商户也可以按需求自己上报相关信息。该字段为JSON对象数据，对象格式为{"store_info":{"id": "门店ID","name": "名称","area_code": "编码","address": "地址" }}
   * @param {string} data.scene_info.id 门店编号，由商户自定义
   * @param {string} data.scene_info.name 门店名称 ，由商户自定义
   * @param {string} data.scene_info.area_code 门店所在地行政区划码
   * @param {string} data.scene_info.address 门店详细地址 ，由商户自定义
   */
  unifiedOrder(data) {
    return this.request('/pay/unifiedorder', {
      notify_url: this.notifyUrl,
      trade_type: 'JSAPI',
      ...data
    })
  }

  /**
   * 获取 JSAPI 支付参数
   *
   * 可以直接用于发起支付
   * 该方法同样适用于小程序
   *
   * @param {object} data 传给统一下单接口的参数
   */
  async getPayParams(data) {
    data.trade_type = 'JSAPI'
    data.sign_type = data.sign_type || this.signType
    const {
      sub_appid,
      prepay_id
    } = await this.unifiedOrder(data)
    const param = {
      appId: sub_appid || this.appId,
      timeStamp: this._timestamp(),
      nonceStr: this._nonce(),
      package: 'prepay_id=' + prepay_id,
      signType: data.sign_type
    }

    param.paySign = this._sign(param, data.sign_type) // 签名方式要一致

    return param
  }

  /**
   * 获取 APP 支付参数
   *
   * @param {object} data 传给统一下单接口的参数
   */
  async getAppParams(data) {
    data.trade_type = 'APP'
    data.sign_type = data.sign_type || this.signType
    const {
      sub_appid,
      sub_mch_id,
      prepay_id
    } = await this.unifiedOrder(data)

    const param = {
      appid: sub_appid || this.appId,
      partnerid: sub_mch_id || this.mchId,
      prepayid: prepay_id,
      package: 'Sign=WXPay',
      noncestr: this._nonce(),
      timestamp: this._timestamp()
    }

    param.sign = this._sign(param, data.sign_type) // 签名方式要一致

    return param
  }

  /**
   * 获取 H5 支付的跳转链接
   *
   * @param {object} data 传给统一下单接口的参数
   * @param {string} redirect_url 回调页面
   */
  async getH5Link(data, redirect_url) {
    data.trade_type = 'MWEB'
    data.sign_type = data.sign_type || this.signType
    const {
      mweb_url
    } = await this.unifiedOrder(data)

    return `${mweb_url}&redirect_url=${encodeURIComponent(redirect_url)}`
  }

  /**
   * 查询订单
   *
   * 该接口提供所有微信支付订单的查询，商户可以通过查询订单接口主动查询订单状态，完成下一步的业务逻辑。
   *
   * 需要调用查询接口的情况：
   *  - 当商户后台、网络、服务器等出现异常，商户系统最终未接收到支付通知；
   *  - 调用支付接口后，返回系统错误或未知交易状态情况；
   *  - 调用付款码支付API，返回USERPAYING的状态；
   *  - 调用关单或撤销接口API之前，需确认支付状态；
   *
   * @param {object} data
   * @param {string} data.transaction_id 微信的订单号，建议优先使用
   * @param {string} data.out_trade_no 商户系统内部订单号，要求32个字符内，只能是数字、大小写字母_-|*@ ，且在同一个商户号下唯一。
   */
  orderQuery(data) {
    return this.request('/pay/orderquery', data)
  }

  /**
   * 关闭订单
   *
   * 以下情况需要调用关单接口：商户订单支付失败需要生成新单号重新发起支付，要对原订单号调用关单，避免重复支付；系统下单后，用户支付超时，系统退出不再受理，避免用户继续，请调用关单接口。
   * 注意：订单生成后不能马上调用关单接口，最短调用时间间隔为5分钟。
   *
   * @param {object} data
   * @param {string} data.out_trade_no 商户系统内部订单号，要求32个字符内，只能是数字、大小写字母_-|*@ ，且在同一个商户号下唯一。
   */
  closeOrder(data) {
    return this.request('/pay/closeorder', data)
  }

  /**
   * 申请退款
   *
   * 当交易发生之后一段时间内，由于买家或者卖家的原因需要退款时，卖家可以通过退款接口将支付款退还给买家，微信支付将在收到退款请求并且验证成功之后，按照退款规则将支付款按原路退到买家帐号上。
   *
   * @param {object} data
   * @param {string} data.transaction_id 微信生成的订单号，在支付通知中有返回
   * @param {string} data.out_trade_no 商户系统内部订单号，要求32个字符内，只能是数字、大小写字母_-|*@ ，且在同一个商户号下唯一。
   * @param {string} data.out_refund_no 商户系统内部的退款单号，商户系统内部唯一，只能是数字、大小写字母_-|*@ ，同一退款单号多次请求只退一笔。
   * @param {number} data.total_fee 订单总金额，单位为分，只能为整数
   * @param {number} data.refund_fee 退款总金额，订单总金额，单位为分，只能为整数
   * @param {string} data.refund_fee_type 退款货币类型，需与支付一致，或者不填。符合ISO 4217标准的三位字母代码，默认人民币：CNY
   * @param {string} data.refund_desc 若商户传入，会在下发给用户的退款消息中体现退款原因。注意：若订单退款金额≤1元，且属于部分退款，则不会在退款消息中体现退款原因
   * @param {string} data.refund_account 仅针对老资金流商户使。
   * - REFUND_SOURCE_UNSETTLED_FUNDS---未结算资金退款（默认使用未结算资金退款）
   * - REFUND_SOURCE_RECHARGE_FUNDS---可用余额退款
   * @param {string} data.notify_url 异步接收微信支付退款结果通知的回调地址，通知URL必须为外网可访问的url，不允许带参数。如果参数中传了notify_url，则商户平台上配置的回调地址将不会生效。
   */
  refund(data) {
    return this.request('/secapi/pay/refund', {
      notify_url: this.refundUrl,
      ...data
    }, true)
  }

  /**
   * 查询退款
   *
   * 提交退款申请后，通过调用该接口查询退款状态。退款有一定延时，用零钱支付的退款20分钟内到账，银行卡支付的退款3个工作日后重新查询退款状态。
   * 注意：如果单个支付订单部分退款次数超过20次请使用退款单号查询
   *
   * @param {object} data
   * @param {string} data.transaction_id 微信生成的订单号，在支付通知中有返回
   * @param {string} data.out_trade_no 商户系统内部订单号，要求32个字符内，只能是数字、大小写字母_-|*@ ，且在同一个商户号下唯一。
   * @param {string} data.out_refund_no 商户系统内部的退款单号，商户系统内部唯一，只能是数字、大小写字母_-|*@ ，同一退款单号多次请求只退一笔。
   * @param {string} data.refund_id 微信生成的退款单号，在申请退款接口有返回
   * @param {number} data.offset 偏移量，当部分退款次数超过10次时可使用，表示返回的查询结果从这个偏移量开始取记录
   */
  refundQuery(data) {
    return this.request('/pay/refundquery', data)
  }

  /**
   * 下载对账单
   *
   * 商户可以通过该接口下载历史交易清单。比如掉单、系统错误等导致商户侧和微信侧数据不一致，通过对账单核对后可校正支付状态。
   *
   * 注意：
   * 1. 微信侧未成功下单的交易不会出现在对账单中。支付成功后撤销的交易会出现在对账单中，跟原支付单订单号一致；
   * 2. 微信在次日9点启动生成前一天的对账单，建议商户10点后再获取；
   * 3. 对账单中涉及金额的字段单位为“元”。
   * 4. 对账单接口只能下载三个月以内的账单。
   * 5. 对账单是以商户号纬度来生成的，如一个商户号与多个appid有绑定关系，则使用其中任何一个appid都可以请求下载对账单。对账单中的appid取自交易时候提交的appid，与请求下载对账单时使用的appid无关。
   *
   * @param {string} bill_date 下载对账单的日期，格式：20140603
   * @param {string} bill_type 账单类型
   * - ALL（默认值），返回当日所有订单信息（不含充值退款订单）
   * - SUCCESS，返回当日成功支付的订单（不含充值退款订单）
   * - REFUND，返回当日退款订单（不含充值退款订单）
   * - RECHARGE_REFUND，返回当日充值退款订单
   * @param {string} tar_type 压缩账单。非必传参数，固定值：GZIP，返回格式为.gzip的压缩包账单。不传则默认为数据流形式。
   */
  downloadBill(bill_date, bill_type = 'ALL', tar_type) {
    return this.request('/pay/downloadbill', {
      bill_date, bill_type, tar_type
    })
  }

  /**
   * 下载资金账单
   *
   * 商户可以通过该接口下载自2017年6月1日起 的历史资金流水账单。
   *
   * 说明：
   * 1. 资金账单中的数据反映的是商户微信账户资金变动情况；
   * 2. 当日账单在次日上午9点开始生成，建议商户在上午10点以后获取；
   * 3. 资金账单中涉及金额的字段单位为“元”。
   *
   * @param {string} bill_date 下载对账单的日期，格式：20140603
   * @param {string} account_type 资金账户类型
   * - Basic  基本账户
   * - Operation 运营账户
   * - Fees 手续费账户
   * @param {string} tar_type 压缩账单。非必传参数，固定值：GZIP，返回格式为.gzip的压缩包账单。不传则默认为数据流形式。
   */
  downloadFundFlow(bill_date, account_type = 'Basic', tar_type) {
    return this.request('/pay/downloadfundflow', {
      bill_date,
      account_type,
      tar_type,
      sign_type: 'HMAC-SHA256'
    }, true)
  }

  /**
   * 交易保障
   *
   * 商户在调用微信支付提供的相关接口时，会得到微信支付返回的相关信息以及获得整个接口的响应时间。为提高整体的服务水平，协助商户一起提高服务质量，微信支付提供了相关接口调用耗时和返回信息的主动上报接口，微信支付可以根据商户侧上报的数据进一步优化网络部署，完善服务监控，和商户更好的协作为用户提供更好的业务体验。
   *
   * @param {object} data
   * @param {string} data.device_info 微信支付分配的终端设备号，商户自定义
   * @param {string} data.interface_url 报对应的接口的完整URL，类似：https://api.mch.weixin.qq.com/pay/unifiedorder；对于刷卡支付，为更好的和商户共同分析一次业务行为的整体耗时情况，对于两种接入模式，请都在门店侧对一次刷卡支付进行一次单独的整体上报，上报URL指定为：https://api.mch.weixin.qq.com/pay/micropay/total
   * @param {number} data.execute_time 接口耗时情况，单位为毫秒
   * @param {number?} data.execute_time_ 接口耗时情况，单位为毫秒
   * @param {string} data.return_code SUCCESS/FAIL 此字段是通信标识，非交易标识，交易是否成功需要查看trade_state来判断
   * @param {string} data.return_msg 当return_code为FAIL时返回信息为错误原因
   * @param {string} data.result_code 业务结果 SUCCESS/FAIL
   * @param {string} data.err_code 错误代码
   * - ORDERNOTEXIST—订单不存在
   * - SYSTEMERROR—系统错误
   * @param {string} data.err_code_des 结果信息描述
   * @param {string} data.out_trade_no 商户系统内部的订单号,商户可以在上报时提供相关商户订单号方便微信支付更好的提高服务质量。
   * @param {string} data.user_ip 发起接口调用时的机器IP
   * @param {string} data.time 系统时间，格式为yyyyMMddHHmmss，如2009年12月27日9点10分10秒表示为20091227091010
   * @param {string} data.trades 上报数据包
   */
  payitilReport(data) {
    return this.request('/payitil/report', data)
  }

  /**
   * 拉取订单评价数据
   *
   * @param {string} begin_time 按用户评论时间批量拉取的起始时间，格式为yyyyMMddHHmmss
   * @param {string} end_time 按用户评论时间批量拉取的结束时间，格式为yyyyMMddHHmmss
   * @param {number} offset 指定从某条记录的下一条开始返回记录。接口调用成功时，会返回本次查询最后一条数据的offset。商户需要翻页时，应该把本次调用返回的offset 作为下次调用的入参。注意offset是评论数据在微信支付后台保存的索引，未必是连续的
   * @param {number} limit 一次拉取的条数, 最大值是200，默认是200
   */
  getBillComment(begin_time, end_time, offset = 0, limit = 200) {
    return this.request('/billcommentsp/batchquerycomment', {
      begin_time,
      end_time,
      offset,
      limit,
      sign_type: 'HMAC-SHA256'
    }, true)
  }

  /**
   * 提交付款码支付
   *
   * @param {object} data
   * @param {string} data.device_info 自定义参数，可以为终端设备号(门店号或收银设备ID)，PC网页或公众号内支付可以传"WEB"
   * @param {string} data.body 商品简单描述，该字段请按照规范传递
   * @param {string} data.detail 商品详细描述，对于使用单品优惠的商户，改字段必须按照规范上传
   * @param {string} data.attach 附加数据，在查询API和支付通知中原样返回，可作为自定义参数使用。
   * @param {string} data.out_trade_no 商户系统内部订单号，要求32个字符内，只能是数字、大小写字母_-|* 且在同一个商户号下唯一。
   * @param {string} data.fee_type 符合ISO 4217标准的三位字母代码，默认人民币：CNY
   * @param {number} data.total_fee 订单总金额，单位为分
   * @param {string} data.spbill_create_ip 支持IPV4和IPV6两种格式的IP地址。调用微信支付API的机器IP
   * @param {string} data.time_start 订单生成时间，格式为yyyyMMddHHmmss，如2009年12月25日9点10分10秒表示为20091225091010
   * @param {string} data.time_expire 订单失效时间，格式为yyyyMMddHHmmss，如2009年12月27日9点10分10秒表示为20091227091010。订单失效时间是针对订单号而言的，由于在请求支付的时候有一个必传参数prepay_id只有两小时的有效期，所以在重入时间超过2小时的时候需要重新请求下单接口获取新的prepay_id。建议：最短失效时间间隔大于1分钟
   * @param {string} data.goods_tag 订单优惠标记，使用代金券或立减优惠功能时需要的参数
   * @param {string} data.limit_pay 上传此参数no_credit--可限制用户不能使用信用卡支付
   * @param {string} data.receipt Y，传入Y时，支付成功消息和支付详情页将出现开票入口。需要在微信支付商户平台或微信公众平台开通电子发票功能，传此字段才可生效
   * @param {string} data.auth_code 扫码支付授权码，设备读取用户微信中的条码或者二维码信息（注：用户付款码条形码规则：18位纯数字，以10、11、12、13、14、15开头）
   * @param {object} data.scene_info 该字段常用于线下活动时的场景信息上报，支持上报实际门店信息，商户也可以按需求自己上报相关信息。该字段为JSON对象数据，对象格式为{"store_info":{"id": "门店ID","name": "名称","area_code": "编码","address": "地址" }}
   * @param {string} data.scene_info.id 门店编号，由商户自定义
   * @param {string} data.scene_info.name 门店名称 ，由商户自定义
   * @param {string} data.scene_info.area_code 门店所在地行政区划码
   * @param {string} data.scene_info.address 门店详细地址 ，由商户自定义
   */
  micropay(data) {
    return this.request('/pay/micropay', data)
  }

  /**
   * 撤销订单
   *
   * 支付交易返回失败或支付系统超时，调用该接口撤销交易。如果此订单用户支付失败，微信支付系统会将此订单关闭；如果用户支付成功，微信支付系统会将此订单资金退还给用户。
   *
   * 注意：7天以内的交易单可调用撤销，其他正常支付的单如需实现相同功能请调用申请退款API。提交支付交易后调用【查询订单API】，没有明确的支付结果再调用【撤销订单API】。
   *
   * 调用支付接口后**请勿立即调用**撤销订单API，建议支付后至少15s后再调用撤销订单接口。
   *
   * @param {object} data
   * @param {string} data.transaction_id 微信的订单号，建议优先使用
   * @param {string} data.out_trade_no 商户系统内部订单号，要求32个字符内，只能是数字、大小写字母_-|*@ ，且在同一个商户号下唯一。
   */
  reverse(data) {
    return this.request('/secapi/pay/reverse', data, true)
  }

  /**
   * 授权码查询openid
   *
   * 通过授权码查询公众号Openid，调用查询后，该授权码只能由此商户号发起扣款，直至授权码更新。
   *
   * @param {string} auth_code 扫码支付授权码，设备读取用户微信中的条码或者二维码信息
   */
  getOpenIdByAuthCode(auth_code) {
    return this.request('/tools/authcodetoopenid', {
      auth_code
    })
  }

  /**
   * 获取扫码支付的 URL
   *
   * @param {string} product_id 商户定义的商品id 或者订单号
   */
  getNativeUrl(product_id) {
    const data = {
      appid: this.appId,
      mch_id: this.mchId,
      time_stamp: this._timestamp(),
      nonce_str: this._nonce(),
      product_id
    }

    data.sign = this._sign(data)

    return 'weixin://wxpay/bizpayurl?' + this._params(data)
  }

  /**
   * 转换短链接
   *
   * 该接口主要用于Native支付模式一中的二维码链接转成短链接(weixin://wxpay/s/XXXXXX)，减小二维码数据量，提升扫描速度和精确度。
   *
   * @param {string} long_url
   */
  getShortUrl(long_url) {
    return this.request('/tools/shorturl', {
      long_url
    })
  }

  /**
   * 发放代金券
   *
   * 用于商户主动调用接口给用户发放代金券的场景，已做防小号处理，给小号发放代金券将返回错误码。
   * 注意：通过接口发放的代金券不会进入微信卡包
   *
   * @param {object} data
   * @param {string} data.coupon_stock_id 代金券批次id
   * @param {number} data.openid_count openid记录数（目前支持num=1）
   * @param {string} data.partner_trade_no 商户此次发放凭据号（格式：商户id+日期+流水号），商户侧需保持唯一性
   * @param {string} data.openid Openid信息，用户在appid下的唯一标识
   * @param {string} data.op_user_id 操作员帐号, 默认为商户号。可在商户平台配置操作员对应的api权限
   * @param {string} data.device_info 微信支付分配的终端设备号
   * @param {string} data.version 协议版本 默认1.0
   * @param {string} data.type 协议类型 XML【目前仅支持默认XML】
   */
  sendCoupon(data) {
    return this.request('/mmpaymkttransfers/send_coupon', {
      openid_count: 1,
      ...data
    }, true)
  }

  /**
   * 查询代金券批次
   *
   * @param {object} data
   * @param {string} data.coupon_stock_id 代金券批次id
   * @param {string} data.op_user_id 操作员帐号, 默认为商户号。可在商户平台配置操作员对应的api权限
   * @param {string} data.device_info 微信支付分配的终端设备号
   * @param {string} data.version 协议版本 默认1.0
   * @param {string} data.type 协议类型 XML【目前仅支持默认XML】
   */
  queryCouponStock(data) {
    data.sign_type = 'MD5' // 该接口的签名只支持 MD5 方式
    return this.request('/mmpaymkttransfers/query_coupon_stock', data)
  }

  /**
   * 查询代金券信息
   *
   * @param {object} data
   * @param {string} data.coupon_id 代金券id
   * @param {string} data.openid Openid信息，用户在appid下的openid。
   * @param {string} data.stock_id 代金劵对应的批次号
   * @param {string} data.op_user_id 操作员帐号, 默认为商户号。可在商户平台配置操作员对应的api权限
   * @param {string} data.device_info 微信支付分配的终端设备号
   * @param {string} data.version 协议版本 默认1.0
   * @param {string} data.type 协议类型 XML【目前仅支持默认XML】
   */
  queryCouponsInfo(data) {
    return this.request('/mmpaymkttransfers/querycouponsinfo', data)
  }

  /**
   * 发放普通红包
   *
   * {@link https://pay.weixin.qq.com/wiki/doc/api/tools/cash_coupon.php?chapter=13_4&index=3}
   *
   * @param {object} data
   * @param {string} data.mch_billno 商户订单号（每个订单号必须唯一。取值范围：0~9，a~z，A~Z）。接口根据商户订单号支持重入，如出现超时可再调用。
   * @param {string} data.wxappid 微信分配的公众账号ID（企业号corpid即为此appId）。在微信开放平台（open.weixin.qq.com）申请的移动应用appid无法使用该接口。
   * @param {string} data.send_name 红包发送者名称。注意：敏感词会被转义成字符*
   * @param {string} data.re_openid 接受红包的用户openid。openid为用户在wxappid下的唯一标识
   * @param {number} data.total_amount 付款金额，单位分
   * @param {number} data.total_num 红包发放总人数。total_num=1
   * @param {string} data.wishing 红包祝福语。注意：敏感词会被转义成字符*
   * @param {string} data.client_ip 调用接口的机器Ip地址
   * @param {string} data.act_name 活动名称。注意：敏感词会被转义成字符*
   * @param {string} data.remark 备注信息
   * @param {string} data.scene_id 场景id，发放红包使用场景，红包金额大于200或者小于1元时必传
   * - PRODUCT_1:商品促销
   * - PRODUCT_2:抽奖
   * - PRODUCT_3:虚拟物品兑奖
   * - PRODUCT_4:企业内部福利
   * - PRODUCT_5:渠道分润
   * - PRODUCT_6:保险回馈
   * - PRODUCT_7:彩票派奖
   * - PRODUCT_8:税务刮奖
   * @param {string} data.risk_info 活动信息
   * - posttime:用户操作的时间戳
   * - mobile:业务系统账号的手机号，国家代码-手机号。不需要+号
   * - deviceid :mac 地址或者设备唯一标识
   * - clientversion :用户操作的客户端版本
   * 把值为非空的信息用key=value进行拼接，再进行urlencode
   * urlencode(posttime=xx& mobile =xx&deviceid=xx)
   *
   */
  sendRedpack(data) {
    return this.request('/mmpaymkttransfers/sendredpack', data, true)
  }

  /**
   * 发放裂变红包
   *
   * {@link https://pay.weixin.qq.com/wiki/doc/api/tools/cash_coupon.php?chapter=13_5&index=4}
   *
   * @param {object} data
   * @param {string} data.mch_billno 商户订单号（每个订单号必须唯一。取值范围：0~9，a~z，A~Z）。接口根据商户订单号支持重入，如出现超时可再调用。
   * @param {string} data.wxappid 微信分配的公众账号ID（企业号corpid即为此appId）。在微信开放平台（open.weixin.qq.com）申请的移动应用appid无法使用该接口。
   * @param {string} data.send_name 红包发送者名称。注意：敏感词会被转义成字符*
   * @param {string} data.re_openid 接受红包的用户openid。openid为用户在wxappid下的唯一标识
   * @param {number} data.total_amount 付款金额，单位分
   * @param {number} data.total_num 红包发放总人数。total_num=1
   * @param {string} data.amt_type 红包金额设置方式.。ALL_RAND—全部随机,商户指定总金额和红包发放总人数，由微信支付随机计算出各红包金额
   * @param {string} data.wishing 红包祝福语。注意：敏感词会被转义成字符*
   * @param {string} data.client_ip 调用接口的机器Ip地址
   * @param {string} data.act_name 活动名称。注意：敏感词会被转义成字符*
   * @param {string} data.remark 备注信息
   * @param {string} data.scene_id 场景id，发放红包使用场景，红包金额大于200或者小于1元时必传
   * - PRODUCT_1:商品促销
   * - PRODUCT_2:抽奖
   * - PRODUCT_3:虚拟物品兑奖
   * - PRODUCT_4:企业内部福利
   * - PRODUCT_5:渠道分润
   * - PRODUCT_6:保险回馈
   * - PRODUCT_7:彩票派奖
   * - PRODUCT_8:税务刮奖
   * @param {string} data.risk_info 活动信息
   * - posttime:用户操作的时间戳
   * - mobile:业务系统账号的手机号，国家代码-手机号。不需要+号
   * - deviceid :mac 地址或者设备唯一标识
   * - clientversion :用户操作的客户端版本
   * 把值为非空的信息用key=value进行拼接，再进行urlencode
   * urlencode(posttime=xx& mobile =xx&deviceid=xx)
   *
   */
  sendGroupRedpack(data) {
    data.amt_type = 'ALL_RAND'
    return this.request('/mmpaymkttransfers/sendgroupredpack', data, true)
  }

  /**
   * 查询红包记录
   *
   * 用于商户对已发放的红包进行查询红包的具体信息，可支持普通红包和裂变包。
   *
   * @param {string} mch_billno 商户发放红包的商户订单号
   */
  queryRedpack(mch_billno) {
    data.bill_type = 'MCHT'
    return this.request('/mmpaymkttransfers/gethbinfo', {
      mch_billno,
      bill_type: 'MCHT'
    }, true)
  }

  /**
   * 企业付款
   *
   * @param {object} data
   * @param {string} data.mch_appid 申请商户号的appid或商户号绑定的appid
   * @param {string} data.mchid 微信支付分配的商户号
   * @param {string} data.device_info 微信支付分配的终端设备号
   * @param {string} data.partner_trade_no 商户订单号，需保持唯一性
(只能是字母或者数字，不能包含有其他字符)
   * @param {string} data.openid 商户appid下，某用户的openid
   * @param {string} data.check_name 校验用户姓名选项
   * - NO_CHECK：不校验真实姓名
   * - FORCE_CHECK：强校验真实姓名
   * @param {string} data.re_user_name 收款用户真实姓名。如果check_name设置为FORCE_CHECK，则必填用户真实姓名
   * @param {number} data.amount 企业付款金额，单位为分
   * @param {string} data.desc 企业付款备注，必填。注意：备注中的敏感词会被转成字符*
   * @param {string} data.spbill_create_ip Ip地址。该IP同在商户平台设置的IP白名单中的IP没有关联，该IP可传用户端或者服务端的IP。
   *
   * 注意参数名称
   *
   */
  transfers(data) {
    data.mch_appid = this.appId
    data.mchid = this.mchId
    return this.request('/mmpaymkttransfers/promotion/transfers', data, {
      noMchId: true,
      noAppId: true,
      cert: true
    })
  }

  /**
   * 查询企业付款
   *
   * @param {string} partner_trade_no 商户调用企业付款API时使用的商户订单号
   */
  getTransferInfo(partner_trade_no) {
    return this.request('/mmpaymkttransfers/gettransferinfo', {
      partner_trade_no
    }, true)
  }

  /**
   * 企业付款到银行卡
   *
   * 企业付款业务是基于微信支付商户平台的资金管理能力，为了协助商户方便地实现企业向银行卡付款，针对部分有开发能力的商户，提供通过API完成企业付款到银行卡的功能。
   *
   * @param {object} data
   * @param {string} data.partner_trade_no 商户订单号，需保持唯一（只允许数字[0~9]或字母[A~Z]和[a~z]，最短8位，最长32位）
   * @param {string} data.enc_bank_no 收款方银行卡号（采用标准RSA算法，公钥由微信侧提供）
   * @param {string} data.enc_true_name 收款方用户名（采用标准RSA算法，公钥由微信侧提供）
   * @param {number} data.bank_code 银行卡所在开户行编号
   * @param {number} data.amount 付款金额：RMB分（支付总额，不含手续费）
。注：大于0的整数
   * @param {string} data.desc 企业付款到银行卡付款说明,即订单备注（UTF8编码，允许100个字符以内）
   */
  async payBank(data) {
    const pub_key = await this.getPublicKey()
    const param = {
      ...data,
      enc_bank_no: this._rsa(pub_key, data.enc_bank_no),
      enc_true_name: this._rsa(pub_key, data.enc_true_name)
    }

    return this.request('/mmpaysptrans/pay_bank', param, {
      cert: true,
      noAppId: true
    })
  }

  /**
   * 查询企业付款到银行卡
   *
   * 用于对商户企业付款到银行卡操作进行结果查询，返回付款操作详细结果。
   *
   * @param {string} partner_trade_no
   */
  queryBank(partner_trade_no) {
    return this.request('/mmpaysptrans/query_bank', {
      partner_trade_no
    }, {
      cert: true,
      noAppId: true
    })
  }

  static async sandbox(options) {
    const {sandbox_signkey} = await new API(options).getSandboxSignkey()

    return new API({
      ...options,
      sandbox: true,
      mchKey: sandbox_signkey
    })
  }

}

module.exports = API
