'use strict'

const Base = require('./base')

class Analysis extends Base {
  /**
   * 获取用户访问小程序日留存
   * @param {String} begin_date 开始日期。格式为 yyyymmdd
   * @param {String} end_date 结束日期，限定查询1天数据，允许设置的最大值为昨日。格式为 yyyymmdd
   */
  getDailyRetain({begin_date, end_date}) {
    return this.request({
      url: '/datacube/getweanalysisappiddailyretaininfo',
      data: {
        begin_date, end_date
      }
    })
  }

  /**
   * 获取用户访问小程序月留存
   * @param {String} begin_date 开始日期，为自然月第一天。格式为 yyyymmdd
   * @param {String} end_date 结束日期，为自然月最后一天，限定查询一个月数据。格式为 yyyymmdd
   */
  getMonthlyRetain({begin_date, end_date}) {
    return this.request({
      url: '/datacube/getweanalysisappidmonthlyretaininfo',
      data: {
        begin_date, end_date
      }
    })
  }

  /**
   * 获取用户访问小程序周留存
   * @param {String} begin_date 开始日期，为周一日期。格式为 yyyymmdd
   * @param {String} end_date 结束日期，为周日日期，限定查询一周数据。格式为 yyyymmdd
   */
  getWeeklyRetain({begin_date, end_date}) {
    return this.request({
      url: '/datacube/getweanalysisappidweeklyretaininfo',
      data: {
        begin_date, end_date
      }
    })
  }

  /**
   * 获取用户访问小程序数据日趋势
   * @param {String} begin_date 开始日期。格式为 yyyymmdd
   * @param {String} end_date 结束日期，限定查询1天数据，允许设置的最大值为昨日。格式为 yyyymmdd
   */
  getDailyVisitTrend() {
    return this.request({
      url: '/datacube/getweanalysisappiddailyvisittrend',
      data: {
        begin_date, end_date
      }
    })
  }

  /**
   * 获取用户访问小程序数据月趋势
   * @param {String} begin_date 开始日期，为自然月第一天。格式为 yyyymmdd
   * @param {String} end_date 结束日期，为自然月最后一天，限定查询一个月数据。格式为 yyyymmdd
   */
  getMonthlyRetain({begin_date, end_date}) {
    return this.request({
      url: '/datacube/getweanalysisappidmonthlyvisittrend',
      data: {
        begin_date, end_date
      }
    })
  }

  /**
   * 获取用户访问小程序数据周趋势
   * @param {String} begin_date 开始日期，为周一日期。格式为 yyyymmdd
   * @param {String} end_date 结束日期，为周日日期，限定查询一周数据。格式为 yyyymmdd
   */
  getWeeklyVisitTrend({begin_date, end_date}) {
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
   * @param {String} begin_date 开始日期。格式为 yyyymmdd
   * @param {String} end_date 结束日期，开始日期与结束日期相差的天数限定为0/6/29，分别表示查询最近1/7/30天数据，允许设置的最大值为昨日。格式为 yyyymmdd
   */
  getUserPortrait({begin_date, end_date}) {
    return this.request({
      url: '/datacube/getweanalysisappiduserportrait',
      data: {
        begin_date, end_date
      }
    })
  }

  /**
   * 获取用户小程序访问分布数据
   * @param {String} begin_date 开始日期。格式为 yyyymmdd
   * @param {String} end_date 结束日期，限定查询1天数据，允许设置的最大值为昨日。格式为 yyyymmdd
   */
  getVisitDistribution({begin_date, end_date}) {
    return this.request({
      url: '/datacube/getweanalysisappidvisitdistribution',
      data: {
        begin_date, end_date
      }
    })
  }

  /**
   * 访问页面
   * @param {String} begin_date 开始日期。格式为 yyyymmdd
   * @param {String} end_date 结束日期，限定查询1天数据，允许设置的最大值为昨日。格式为 yyyymmdd
   */
  getVisitPage({begin_date, end_date}) {
    return this.request({
      url: '/datacube/getweanalysisappidvisitpage',
      data: {
        begin_date, end_date
      }
    })
  }

  /**
   * 获取用户访问小程序数据概况
   * @param {String} begin_date 开始日期。格式为 yyyymmdd
   * @param {String} end_date 结束日期，限定查询1天数据，允许设置的最大值为昨日。格式为 yyyymmdd
   */
  getDailySummary({begin_date, end_date}) {
    return this.request({
      url: '/datacube/getweanalysisappiddailysummarytrend',
      data: {
        begin_date, end_date
      }
    })
  }
}

module.exports = Analysis
