'use strict'

const Base = require('./base')

class templateMessage extends Base {
  /**
   * 组合模板并添加至帐号下的个人模板库
   * @param {String} 模板标题id，可通过接口获取，也可登录小程序后台查看获取
   * @param {Array.<number>} 开发者自行组合好的模板关键词列表，关键词顺序可以自由搭配（例如[3,5,4]或[4,5,3]），最多支持10个关键词组合
   */
  addTemplate({id, keyword_id_list}) {
    return this.request({
      url: '/cgi-bin/wxopen/template/add',
      data: {id, keyword_id_list}
    })
  }

  /**
   * 删除帐号下的某个模板
   * @param {String} template_id 要删除的模板id
   */
  deleteTemplate(template_id) {
    return this.request({
      url: '/cgi-bin/wxopen/template/del',
      data: {template_id}
    })
  }

  /**
   * 获取帐号下已存在的模板列表
   * @param {Number} offset 用于分页，表示从offset开始。从 0 开始计数。
   * @param {Number} count 用于分页，表示拉取count条记录。最大为 20。
   */
  getTemplateList({offset, count}) {
    return this.request({
      url: '/cgi-bin/wxopen/template/list',
      data: {offset, count}
    })
  }

  /**
   * 获取模板库某个模板标题下关键词库
   * @param {String} id 模板标题id，可通过接口获取，也可登录小程序后台查看获取
   */
  getTemplateLibraryById(id) {
    return this.request({
      url: '/cgi-bin/wxopen/template/library/get',
      data: {id}
    })
  }

  /**
   * 获取小程序模板库标题列表
   * @param {Number} offset 用于分页，表示从offset开始。从 0 开始计数。
   * @param {Number} count 用于分页，表示拉取count条记录。最大为 20。
   */
  getTemplateLibraryList({offset, count}) {
    return this.request({
      url: '/cgi-bin/wxopen/template/library/list',
      data: {offset, count}
    })
  }

  /**
   * 发送模板消息
   * @param {Object} data
   *
   * @alias send
   */
  sendTemplageMessage(data) {
    return this.request({
      url: '/cgi-bin/message/wxopen/template/send',
      data
    })
  }
  send(data) {
    return this.sendTemplageMessage(data)
  }

  /**
   * 下发小程序和公众号统一的服务消息
   * @param {Object} data
   *
   * @note uniformMessage.send
   */
  sendUniformMessage(data) {
    return this.request({
      url: '/cgi-bin/message/wxopen/template/uniform_send',
      data
    })
  }

}

module.exports = templateMessage
