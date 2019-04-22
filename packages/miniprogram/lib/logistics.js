'use strict'

const Base = require('./base')

/**
 * 物流助手
 */
class Logistics extends Base {
  /**
   * 获取面单联系人信息
   * @param {String} token 必填，商户侧下单事件中推送的 Token 字段
   * @param {String} waybill_id 必填，运单 ID
   */
  getPaidUnionId(token, waybill_id) {
    return this.request({
      url: '/cgi-bin/express/delivery/contact/get',
      data: {
        token, waybill_id
      }
    })
  }

  /**
   * 预览面单模板
   * 用于调试面单模板使用。
   *
   * @param {string} data.waybill_id 运单 ID
   * @param {string} data.waybill_template 面单 HTML 模板内容（需经 Base64 编码）
   * @param {string} data.waybill_data 面单数据。详情参考下单事件返回值中的 WaybillData
   * @param {Object} data.custom 商户下单数据，格式是商户侧下单 API 中的请求体
   */
  previewTemplate(data) {
    return this.request({
      url: '/cgi-bin/express/delivery/template/preview',
      data
    })
  }

}

module.exports = Logistics
