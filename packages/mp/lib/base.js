'use strict'

const fs = require('fs')
const path = require('path')

const axios = require('axios')
const request = require('request')

const FormData = require('form-data')

const {
  obj2Params
} = require('../utils/helper')

const ACCESS_TOKEN_FILE = path.join(__dirname, '_access_token_mp.json')
const JS_TICKET_FILE = path.join(__dirname, '_js_ticket_mp.json')
const AUTH_TOKEN_FILE = path.join(__dirname, '_auth_token_mp.json')

/**
 * 基础类
 * @constructor
 */
class Base {
  /**
   * 创建
   * @param {object} options
   * @param {string} options.appId 公众号的 appId
   * @param {string} options.appSecret 公众号的 appSecret
   * @param {string} options.baseURL 请求的基地址
   * @param {string} options.timeout 请求的超时时间，默认为 40 秒
   * @param {string} options.printLog 是否输出请求日志，供内部开发调试使用
   *
   * 请求基地址默认为 `https://api.weixin.qq.com`，会指向就近路口
   * 通常情况下不需要修改该参数
   * 在该服务器不稳定的时候，可以切换到 `https://api2.weixin.qq.com` 备用服务器
   */
  constructor({
    appId,
    appSecret,
    baseURL = 'https://api.weixin.qq.com',
    timeout = 40000,
    printLog = false
  }) {
    this.appId = appId
    this.appSecret = appSecret
    this.baseURL = baseURL

    this.__axios = axios
    this.__request = request
    this.axios = axios.create({
      baseURL,
      timeout
    })

    this.printLog = printLog

    this.tokenObj = {}
    this.ticketObj = {}
    this.authTokenObj = {}

    this.init()
  }

  init() {

    // 从缓存文件中加载 token 和 session 信息，模拟中继服务器
    // 可以修改为采用 redis 或者 mongodb 等方式
    if (fs.existsSync(ACCESS_TOKEN_FILE)) {
      this.tokenObj = require(ACCESS_TOKEN_FILE)
    }

    if (fs.existsSync(JS_TICKET_FILE)) {
      this.ticketObj = require(JS_TICKET_FILE)
    }

    if (fs.existsSync(AUTH_TOKEN_FILE)) {
      this.authTokenObj = require(AUTH_TOKEN_FILE)
    }
  }

  log(...args) {
    if (this.printLog)
      console.log(args)
  }

  /**
   * 将参数列表转为对象形式
   *
   * @param {array} args 参数原始对象，即 arguments
   * @param {array} names 参数名称对应的数组
   * @param {array} defaults 参数值为 undefined 时的补正值
   *
   * 注意：
   *  - 参数的值支持覆盖
   *  - 在遇到对象之后直接退出
   *
   * 示例：
   *   > _args([1, 2, {xor: true}], ['offset', 'count'])
   *   < {offset: 1, count: 2, xor: true}
   */
  _args(args, names, defaults) {
    const options = {}
    for (let i = 0; i < args.length; i++) {
      if (typeof args[i] === 'object') {
        Object.assign(options, args[i])
        break;
      } else {
        options[names[i]] = args[i] === undefined ? defaults[i] : args[i]
      }
    }
    return options
  }

  /**
   * 发送请求
   * 不带 access_token，内部使用
   */
  _request(...args) {
    let options

    if (typeof args[0] === 'string') {
      options = {...args[1]}
      options.url = args[0]
    } else {
      options = args[0]
    }

    return new Promise((resolve, reject) => {
      this.axios(options).then(response => {
        const res = {...response.data}

        if (+res.errcode) {
          reject(res)
        } else {
          resolve(res)
        }
        this.log('then', response)
      }).catch(error => {
        reject(error)
        this.log('catch', error)
      })
    })
  }

  /**
   * 上传文件统一入口
   *
   * 已由 _upload 重新实现，本方法弃用
   *
   * 由于 axios 对文件上传的支持效果不是很理想，故采用 request 库进行文件上传的操作
   *
   * @param {object} data
   * @param {string} data.url 请求的地址
   * @param {object} data.params 请求的 params 参数
   * @param {FormData} data.data 要进行上传的文件表单对象
   *
   * 其他 axios 参数将进行忽略
   *
   */
  __upload({url, params = {}, data}) {
    let uploadUrl = url
    return new Promise((resolve, reject) => {
      this.getAccessToken().then(({access_token}) => {
        params.access_token = access_token
        const query = obj2Params(params)
        if (uploadUrl.indexOf('?') !== -1) {
          uploadUrl += `&${query}`
        } else {
          uploadUrl += `?${query}`
        }
        this.__request.post({
          baseUrl: this.baseURL,
          url: uploadUrl,
          formData: data
        }, (err, httpResponse, body) => {
          if (err) {
            return reject(err)
          }
          resolve(JSON.parse(body))
        })
      }).catch(error => {
        reject(error)
      })
    })
  }

  /**
   * 文件上传方法
   *
   * @param {object} options 传递给 request 方法的参数
   *
   * 本方法将会对 options.data 进行劫持并转换为表单方式进行提交
   */
  _upload(options) {
    return new Promise((resolve, reject) => {
      const form = new FormData()
      for (let key in options.data) {
        const value = options.data[key]
        if (value && value.hasOwnProperty('value') && value.hasOwnProperty('options')) {
          form.append(key, value.value, value.options)
        } else {
          form.append(key, value)
        }
      }

      const headers = {
        'content-type': 'application/x-www-form-urlencoded'
      }

      Object.assign(headers, form.getHeaders())

      form.getLength((err, length) => {
        if (err) {
          reject(err)
        } else {
          if (!isNaN(length)) {
            headers['content-length'] = length
          }
          options.data = form
          options.headers = headers
          this.request(options).then(res => {
            resolve(res)
          }).catch(error => {
            reject(error)
          })
        }
      })
    })
  }

  /**
   * 发送请求
   * 带有 access_token
   */
  request(...args) {
    let options

    if (typeof args[0] === 'string') {
      options = {...args[1]}
      options.url = args[0]
    } else {
      options = args[0]
    }

    if (!options.method) {
      options.method = 'post'
    }

    return new Promise((resolve, reject) => {
      this.getAccessToken().then(({access_token}) => {
        if (options.params) {
          options.params.access_token = access_token
        } else {
          options.params = {access_token}
        }
        this._request(options).then(res => {
          resolve(res)
        }).catch(error2 => {
          reject(error2)
        })
      }).catch(error => {
        reject(error)
      })
    })
  }

  /**
   * 获取 accessToken
   */
  getAccessToken() {
    // 如果缓存中有有效 token，则直接获取并返回
    if (
      this.tokenObj.access_token
      && Date.now() - this.tokenObj._time <= (this.tokenObj.expire_in || 7200) * 1000 - 5000
    ) {
      return Promise.resolve(this.tokenObj)
    }

    return new Promise((resolve, reject) => {
      this._request({
        url: '/cgi-bin/token',
        params: {
          grant_type: 'client_credential',
          appid: this.appId,
          secret: this.appSecret
        }
      }).then(data => {
        // 获取 access_token 之后更新缓存
        data._time = Date.now()
        this.tokenObj = data
        fs.writeFile(ACCESS_TOKEN_FILE, JSON.stringify(data), () => {})
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  }

  /**
   * 获取 jsapi_ticket
   */
  getJsTicket() {
    // 如果缓存中有有效 ticket，则直接获取并返回
    if (
      this.ticketObj.ticket
      && Date.now() - this.ticketObj._time <= (this.ticketObj.expire_in || 7200) * 1000 - 5000
    ) {
      return Promise.resolve(this.ticketObj)
    }

    return new Promise((resolve, reject) => {
      this.request({
        url: '/cgi-bin/ticket/getticket',
        params: {
          type: 'jsapi'
        }
      }).then(data => {
        // 获取 access_token 之后更新缓存
        data._time = Date.now()
        this.ticketObj = data
        fs.writeFile(JS_TICKET_FILE, JSON.stringify(data), () => {})
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  }

  /**
   * 授权获取 token
   *
   * @param {string} code 授权页面返回的 code
   */
  getAuthToken(code) {

    return new Promise((resolve, reject) => {
      this._request({
        url: '/sns/oauth2/access_token',
        params: {
          appid: this.appId,
          secret: this.appSecret,
          code,
          grant_type: 'authorization_code'
        }
      }).then(data => {
        this.authTokenObj[data.openid] = data
        fs.writeFile(AUTH_TOKEN_FILE, JSON.stringify(this.authTokenObj), () => {})
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  }

  /**
   * 刷新 token
   *
   * @param {string} refresh_token 填写通过access_token获取到的refresh_token参数
   */
  refreshToken(refresh_token) {
    return this._request({
      url: '/sns/oauth2/refresh_token',
      params: {
        appid: this.appId,
        grant_type: 'refresh_token',
        refresh_token
      }
    })
  }

  /**
   * 检验授权凭证（access_token）是否有效
   *
   * @param {string} openid 用户的唯一标识
   * @param {string} access_token 网页授权接口调用凭证,注意：此access_token与基础支持的access_token不同
   */
  checkAuthToken(openid, access_token) {
    return this._request({
      url: '/sns/auth',
      params: {
        access_token,
        openid
      }
    })
  }

  /**
   * 拉取用户信息
   *
   * (需scope为 snsapi_userinfo)
   *
   * @param {string} openid 用户的唯一标识
   * @param {string} access_token 网页授权接口调用凭证,注意：此access_token与基础支持的access_token不同
   * @param {string} lang 返回国家地区语言版本，zh_CN 简体，zh_TW 繁体，en 英语
   */
  getUserInfo(openid, access_token, lang = 'zh_CN') {
    return this._request({
      url: '/sns/userinfo',
      params: {
        openid, access_token, lang
      }
    })
  }

}

module.exports = Base
