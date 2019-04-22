'use strict'

const Base = require('./base')

class PluginManager extends Base {
  /**
   * 向插件开发者发起使用插件的申请
   * @param {String} plugin_appid 插件 appId
   * @param {String} reason 申请使用理由
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
   * @param {Number} 要拉取第几页的数据
   * @param {Number} 每页的记录数
   */
  getPluginDevApplyList(page, num) {
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
   * @param {String} action 修改操作
   *  - dev_agree 同意申请
   *  - dev_refuse 拒绝申请
   *  - dev_delete 删除已拒绝的申请者
   * @param {String} appid
   * @param {String} reason
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
   * @param {String} plugin_appid 插件 appId
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
}

module.exports = PluginManager
