'use strict'

const crypto = require('crypto')

// https://developers.weixin.qq.com/minigame/dev/tutorial/open-ability/midas-signature.html

/**
 * 米大师支付签名之 sig签名
 * @param {object} data 参与米大师签名的请求参数
 * @param {string} uri 请求的 URI
 * @param {string} secret 米大师密钥
 */
function genMidasSigSign(data, uri, secret) {
  const ret = []

  Object.keys(data).sort().forEach(item => {
    ret.push(`${item}=${data[item]}`)
  })

  ret.push(`org_loc=${uri}`)
  ret.push('method=POST')
  ret.push(`secret=${secret}`)

  const raw = ret.join('&')

  return crypto.createHmac('sha256', secret).update(raw).digest('hex')
}

/**
 * 米大师支付签名之 mp_sig签名
 * @param {object} data 参与签名的请求参数（不包含 access_token，会进行自动拼接）
 * @param {string} uri 请求的 URI
 * @param {string} access_token 小程序接口调用凭证
 * @param {string} session_key 当前会话密钥
 */
function genMidasMpSigSign(data, uri, access_token, session_key) {
  const ret = []
  const mpSigData = {
    ...data,
    access_token
  }

  Object.keys(mpSigData).sort().forEach(item => {
    ret.push(`${item}=${mpSigData[item]}`)
  })

  ret.push(`org_loc=${uri}`)
  ret.push('method=POST')
  ret.push(`session_key=${session_key}`)

  const raw = ret.join('&')

  return crypto.createHmac('sha256', session_key).update(raw).digest('hex')
}

module.exports = {
  genMidasSigSign,
  genMidasMpSigSign
}
