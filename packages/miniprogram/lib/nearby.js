'use strict'

const Base = require('./base')

class NearbyPoi extends Base {
  /**
   * 添加地点
   * @param {String} data.related_name 经营资质主体，必填
   * @param {String} data.related_credential 经营资质证件号，必填
   * @param {String} data.related_address 经营资质地址，必填
   * @param {String} data.related_proof_material 相关证明材料照片临时素材 mediaid。经营资质主体与小程序同主体时不填;经营资质主体与小程序非同主体时必填。可通过 customerServiceMessage.uploadTempMedia 接口上传照片临时素材。
   */
  add(data) {
    return this.request({
      url: '/wxa/addnearbypoi',
      data
    })
  }

  /**
   * 删除地点
   * @param {String} poi_id 附近地点 ID
   */
  delete(poi_id) {
    return this.request({
      url: '/wxa/delnearbypoi',
      data: {
        poi_id
      }
    })
  }

  /**
   * 查看地点列表
   * @param {number} page 起始页id（从1开始计数）
   * @param {number} page_rows 每页展示个数（最多1000个）
   */
  getList(page, page_rows) {
    return this.request({
      url: '/wxa/getnearbypoilist',
      params: {
        page, page_rows
      }
    })
  }

  /**
   * 展示/取消展示附近小程序
   * @param {string} poi_id 附近地点 ID
   * @param {number} status 是否展示
   *  - 0 不展示
   *  - 1 展示
   */
  setShowStatus(poi_id, status) {
    return this.request({
      url: '/wxa/setnearbypoishowstatus',
      data: {
        poi_id, status
      }
    })
  }

}

module.exports = NearbyPoi
