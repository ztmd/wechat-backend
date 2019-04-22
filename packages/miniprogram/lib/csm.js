'use strict'

const Base = require('./base')

class CustomerServiceMessage extends Base {
  /**
   * 获取客服消息内的临时素材。
   * 即下载临时的多媒体文件。目前小程序仅支持下载图片文件。
   * @param {String} media_id 媒体文件 ID
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
   * @param {Object} data
   */
  send(data) {
    return this.request({
      url: '/cgi-bin/message/custom/send',
      data
    })
  }

  /**
   * 下发客服当前输入状态给用户
   * @param {String} touser 用户的 OpenID
   * @param {String} command 命令（Typing|CancelTyping）
   */
  setTyping({touser, command}) {
    return this.request({
      url: '/cgi-bin/message/custom/typing',
      data: {
        touser, command
      }
    })
  }

  /**
   * 把媒体文件上传到微信服务器。
   * 目前仅支持图片。用于发送客服消息或被动回复用户消息。
   * @param {String} type 文件类型
   * @param {FormData} media form-data 中媒体文件标识，有filename、filelength、content-type等信息
   */
  uploadTempMedia(type, media) {
    return this.request({
      url: '/cgi-bin/media/upload',
      params: {
        type
      },
      data: media
    })
  }

}

module.exports = CustomerServiceMessage
