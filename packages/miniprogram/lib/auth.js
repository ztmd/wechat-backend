'use strict'

const Base = require('./base')

class Auth extends Base {
  /**
   * 用户支付完成后，获取该用户的 UnionId
   * @param {String} openid 用户的 openId
   * @param {Object} data 附加数据
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

}

module.exports = Auth
