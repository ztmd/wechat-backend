'use strict'

const Base = require('./base')

class UpdateableMessage extends Base {
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
   */
  setUpdatableMsg(data) {
    return this.request({
      url: '/cgi-bin/message/wxopen/updatablemsg/send',
      data
    })
  }
}

module.exports = UpdateableMessage
