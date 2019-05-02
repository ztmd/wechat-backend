'use strict'

const crypto = require('crypto')

/**
 * 返回一个随机整数
 *
 * @param {number} min 区间最小值
 * @param {number} max 区间最大值
 *
 * 目标结果不包含最大值，即返回值是一个左开右闭区间取值。
 */
function random(min, max) {
  return min + Math.floor(Math.random() * (max - min))
}

/**
 * 生成一个随机字符串
 *
 * @param {number} len 目标字符串的长度
 * @param {number} type 类型，这里采用二进制判断规则
 *
 * 当传入的 type 的数字转为二进制之后，如果：
 *  - 最末位为 1，则表示随机源包含数字
 *  - 倒数第二位为 1，则表示随机源包含小写字母
 *  - 倒数第三位为 1，则表示随机源包含大写字母
 *  - 如果都不满足，则使用十六进制小写字符串 `013456789abcdef`
 *
 * 默认为 6，二进制为 `110`，表示目标字符串会从大小写字母中进行生成
 */
function genNouce(len = 16, type = 6) {
  const LCASE = 'abcdefghijklmnopqrstuvwxyz'
  const UCASE = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  const NUM = '0123456789'
  const ret = []
  const range = type.toString(2)
  let str = ''
  if (range[range.length - 1] === '1') {
    str += NUM;
  }
  if (range[range.length - 2] === '1') {
    str += LCASE;
  }
  if (range[range.length - 3] === '1') {
    str += UCASE;
  }
  if (!str) {
    str = '013456789abcdef'
  }

  while (ret.length < len) {
    ret.push(str[random(0, str.length)])
  }

  return ret.join('')
}

/**
 * 返回当前 Unix 时间戳（取秒数）
 */
function getTimestamp() {
  return Math.floor(Date.now() / 1000)
}

/**
 * 将对象转成 URL 字符串
 *
 * @param {*} data
 */
function obj2Params(data) {
  const ret = []

  Object.keys(data).forEach(key => {
    ret.push(`${encodeURIComponent(key)}=${encodeURIComponent(data[key])}`)
  })

  return ret.join('&')
}

function MD5(str) {
  return crypto.createHash('md5').update(str, 'utf8').digest('hex').toUpperCase()
}

function SHA256(key, str) {
  return crypto.createHmac('sha256', key).update(str, 'utf8').digest('hex').toUpperCase()
}

function RSA(key, buffer) {
  return crypto.publicEncrypt(key, Buffer.from(buffer)).toString('base64')
}

module.exports = {
  random,
  genNouce,
  getTimestamp,
  obj2Params,
  MD5,
  SHA256,
  RSA
}
