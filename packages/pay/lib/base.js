'use strict'

const fs = require('fs')
const path = require('path')

const request = require('request')
const xml2js = require('xml2js')

const PUBLIC_KEY_FILE = path.join(__dirname, '_public_rsa.key')

const {
  genNouce,
  getTimestamp,
  obj2Params,
  MD5,
  SHA256,
  RSA
} = require('../utils/helper')

/**
 * 基础类
 * @constructor
 */
class Base {
  /**
   * 创建
   *
   * @param {object} options
   *
   * @param {string} options.appId 公众号标识
   * @param {string} options.mchId 商户号
   * @param {string} options.mchKey 商户密钥
   *
   * @param {string} options.signType 签名类型，目前支持 HMAC-SHA256 和 MD5，默认为 MD5
   * @param {string} options.pfx 商户证书
   * @param {string} options.pfxPath 商户证书路径
   * @param {string} options.publicKey RAS 公钥
   *
   * @param {string} options.notifyUrl 微信支付结果通知的回调地址
   * @param {string} options.refundUrl 退款结果通知的回调地址
   *
   * @param {string} options.sandbox 是否开启沙箱模式
   *
   * @param {string} options.baseUrl 请求的基地址
   * @param {string} options.timeout 请求的超时时间，默认为 40 秒
   *
   * @param {string} options.debug 供内部开发调试使用
   *
   */
  constructor({
    appId,
    mchId,
    mchKey,

    signType = 'MD5',
    pfx,
    pfxPath,
    publicKey,

    notifyUrl,
    refundUrl,

    sandbox = false,

    baseUrl = 'https://api.mch.weixin.qq.com',
    timeout = 40000,
    debug = false,
  } = {}) {
    this.appId = appId
    this.mchId = mchId
    this.mchKey = mchKey
    this.signType = signType
    this.pfx = pfx
    this.notifyUrl = notifyUrl
    this.refundUrl = refundUrl

    this.sandbox = sandbox

    this.baseUrl = baseUrl
    this.timeout = timeout

    this.debug = debug

    this.__request = request

    if (publicKey) {
      this.publicKey = publicKey
    } else if (fs.existsSync(PUBLIC_KEY_FILE)) {
      this.publicKey = fs.readFileSync(PUBLIC_KEY_FILE).toString()
    }

    if (
      !this.pfx
      && pfxPath
      && fs.existsSync(pfxPath)
    ) {
      this.pfx = fs.readFileSync(pfxPath)
    }
  }

  log(...args) {
    if (this.debug)
      console.log.apply(null, args)
  }

  /**
   * 生成一个随机字符串
   */
  _nonce(len, type = 7) {
    return genNouce(len, type)
  }

  /**
   * 获取 Unix 时间戳
   */
  _timestamp() {
    return getTimestamp()
  }

  _params(data) {
    return obj2Params(data)
  }

  /**
   * RSA 加密
   */
  _rsa(key, buffer) {
    return RSA(key, buffer + '')
  }

  /**
   * 签名算法
   *
   * @param {object} data 参与签名计算的对象
   * @param {string} data.sign_type 签名类型，支持 HMAC-SHA256 和 MD5。
   * @param {string} signType 显式指定签名类型，支持 HMAC-SHA256 和 MD5。优先级高于 data.sign_type
   */
  _sign(data, signType) {
    const type = signType || data.sign_type || 'MD5'
    if (type !== 'MD5' && type !== 'HMAC-SHA256') {
      throw new Error('Invalid signType')
    }
    const temp = []
    Object.keys(data).sort().forEach(key => {
      if (
        key !== 'sign'
        && data[key] !== undefined
        && data[key] !== ''
      ) {
        temp.push(`${key}=${data[key]}`)
      }
    })
    temp.push(`key=${this.mchKey}`)

    const raw = temp.join('&')

    return type === 'MD5' ?
      MD5(raw) :
      SHA256(this.mchKey, raw)
  }

  /**
   * 生成一个标准的 XML 字符串
   *
   * @param {object} data
   */
  _buildXML(data = {}) {
    return new xml2js.Builder({
      xmldec: false,
      rootName: 'xml',
      allowSurrogateChars: true,
      cdata: true
    }).buildObject(data)
  }

  /**
   * 解析 XML
   *
   * @param {string} xml XML 字符串
   *
   * @return {Promise}
   */
  _parseXML(xml) {
    return new Promise((resolve, reject) => {
      xml2js.parseString(xml, {
        trim: true,
        explicitArray: false,
        explicitRoot: false
      }, (err, result) => {
        if (err) {
          reject(err)
        } else {
          resolve(result || {})
        }
      })
    })
  }

  /**
   * 请求调用的核心方法
   *
   * @param {object} params
   * @param {string} params.baseUrl 请求的基地址
   * @param {number} params.timeout 请求超时时间
   * @param {string} params.url 请求的路径
   * @param {string|buffer} params.pfx 定制证书
   * @param {string} params.signType 签名类型，支持 HMAC-SHA256 和 MD5。
   * @param {object} params.data 加密之前的数据对象
   * @param {boolean} params.noParse 对返回的结果不进行解析
   * @param {boolean} params.noCheck 对返回的结果不进行检查
   * @param {boolean} params.noAppId 自动计算签名时 appId 不参与计算
   * @param {boolean} params.noMchId 自动计算签名时 mchId 不参与计算
   * @param {boolean} params.keepSignType 部分接口不需要显式传递 sign_type 字段，在其为默认签名类型（MD5），默认进行移除。开启此参数可以进行保留
   *
   * @param {boolean} options.cert 显式指定接口需要证书
   */
  _request(params) {
    const options = {
      baseUrl: params.baseUrl || this.baseUrl,
      timeout: params.timeout || this.timeout,
      method: 'POST',
      url: params.url
    }

    if (params.sandbox || (params.sandbox !== false && this.sandbox)) {
      options.url = '/sandboxnew' + options.url
    }

    if (params.cert || params.pfx) {
      options.agentOptions = {
        pfx: params.pfx || this.pfx,
        passphrase: this.mchId
      }
    }

    const data = params.data || {}
    // 通用参数在这里进行指定
    data.nonce_str = data.nonce_str || this._nonce()
    if (!params.noMchId) {
      data.mch_id = data.mch_id || this.mchId
    }
    if (!params.noAppId) {
      data.appid = data.appid || this.appId
    }
    data.sign_type = data.sign_type || this.signType

    // 沙箱环境~~居然~~不需要指定签名
    if (this.sandbox || (data.sign_type === 'MD5' && !params.keepSignType)) {
      delete data.sign_type
    }

    data.sign = this._sign(data)

    options.body = this._buildXML(data)

    return new Promise((resolve, reject) => {
      this.__request(options, (err, httpResponse, body) => {
        if (err) {
          this.log('request err', options, err, body)
          return reject(err)
        }
        if (params.noParse) {
          this.log('request success, noParse', options, body)
          resolve(body)
        } else {
          this._parseXML(body).then(result => {
            if (
              params.noCheck // 下载对账单、下载资金账单等接口可以跳过 return_code 的检查
              || result.return_code === 'SUCCESS'
            ) {
              this.log('request success, then', options, result)
              resolve(result)
            } else {
              this.log('request success, catch', options, result)
              reject(result)
            }
          }).catch(error => {
            this.log('request success, but parse fail', options, error, body)
            reject(error)
          })
        }
      })
    })
  }

  /**
   * 获取 RSA 公钥
   *
   * @alias getPublicKey
   *
   * @param {string} sign_type 加密方式，仅支持 MD5 和 HMAC-SHA256
   *
   * {@link https://pay.weixin.qq.com/wiki/doc/api/tools/mch_pay.php?chapter=24_7}
   */
  getPublicKey(sign_type = 'MD5') {
    if (this.publicKey) {
      return Promise.resolve(this.publicKey)
    }
    return new Promise((resolve, reject) => {
      this._request({
        baseUrl: 'https://fraud.mch.weixin.qq.com',
        url: '/risk/getpublickey',
        data: {
          sign_type
        },
        noAppId: true,
        cert: true
      }).then(({pub_key}) => {
        fs.writeFileSync(PUBLIC_KEY_FILE, pub_key)
        resolve(pub_key)
      }).catch(error => {
        reject(error)
      })
    })
  }

  /**
   * 请求调用入口
   *
   * 主要针对参数的传递方式进行统一的处理
   *
   * @param {string} url 请求的路径
   * @param {object} data 加密之前的数据对象
   * @param {object} extra 其他参数
   * @param {boolean} extra 为 true 时开启表示需要使用证书
   */
  request(url, data, extra) {
    let params
    if (typeof url === 'object') {
      params = url
      if (data === true) {
        params.cert = true
      }
    } else {
      params = {
        url,
        data
      }
      if (extra === true) {
        params.cert = true
      } else if (typeof extra === 'object') {
        Object.assign(params, extra)
      }
    }
    return this._request(params)
  }

  /**
   * 获取微信支付仿真测试系统密钥
   *
   * @alias getSandboxSignkey
   */
  getSignkey() {
    return this.getSandboxSignkey()
  }
  getSandboxSignkey() {
    return this._request({
      url: '/sandboxnew/pay/getsignkey',
      sandbox: false,
      noAppId: true
    })
  }

}

module.exports = Base
