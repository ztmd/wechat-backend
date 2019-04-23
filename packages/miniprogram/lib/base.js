'use strict'

const fs = require('fs')

const axios = require('axios')

// 从缓存文件中加载 token，模拟中继服务器
// 可以修改为采用 redis 或者 mongodb 等方式
const CACHE_FILE = './cache.json'
let tokenObj = {}
if (fs.existsSync(CACHE_FILE)) {
  tokenObj = require(CACHE_FILE)
}

class Base {
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

    this.axios = axios.create({
      baseURL,
      timeout
    })

    this.printLog = printLog
  }

  log(...args) {
    if (this.printLog)
      console.log(args)
  }

  /**
   * 发送请求
   * 带有 access_token
   * @param {*} options
   */
  request(options) {

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
        this.axios(options).then(response => {
          const res = {...response.data}

          if (+res.errcode) {
            reject(res)
          } else {
            resolve(res)
          }
          this.log('then', response)
        }).catch(error2 => {
          reject(error2)
          this.log('catch2', error2)
        })
      }).catch(error => {
        reject(error)
      })

    })
  }

  /**
   * 发送请求
   * 不带 access_token，内部使用
   * @param {*} options
   */
  _request(options) {
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
   * 获取 accessToken
   */
  getAccessToken() {
    // 如果缓存中有有效 token，则直接获取并返回
    if (
      tokenObj.access_token
      && Date.now() - tokenObj._time <= (tokenObj.expire_in || 7200) * 1000 - 5000
    ) {
      return Promise.resolve(tokenObj)
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
        data._time = Date.now();
        tokenObj = data;
        fs.writeFileSync(CACHE_FILE, JSON.stringify(data))
        resolve(data);
      }).catch(error => {
        reject(error)
      })
    })
  }

  /**
   * 登录凭证校验
   * @param {String} code 登录时获取的 code
   */
  code2Session(code) {
    return this._request({
      url: `/sns/jscode2session`,
      params: {
        appid: this.appId,
        secret: this.appSecret,
        js_code: code,
        grant_type: 'authorization_code'
      }
    })
  }
}

module.exports = Base;
