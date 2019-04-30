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

/**
 * SHA1 加密
 */
function genSha1(data) {
  const ret = []

  Object.keys(data).sort().forEach(item => {
    ret.push(`${item.toLowerCase()}=${data[item]}`)
  })

  const raw = ret.join('&')

  return crypto.createHash('sha1').update(raw, 'utf8').digest('hex')
}

/**
 * 消息加解密
 * @constructor
 */
class WXBizMsgCrypt {
  /**
   * 构造器
   *
   * @param {string} token 公众平台上，开发者设置的token
   * @param {string} encodingAesKey 公众平台上，开发者设置的EncodingAESKey
   * @param {string} appId 公众平台的appId
   */
  constructor(token, encodingAesKey, appId) {
    this.token = token
    this.encodingAesKey = encodingAesKey
    this.appId = appId

    const aesKey = Buffer.from(encodingAesKey + '=', 'base64')
    if (aesKey.length !== 32) {
      throw new Error('Invalid encodingAesKey')
    }

    this.aesKey = aesKey
    this.iv = aesKey.slice(0, 16)
  }

  /**
   * 内容补位
   *
   * buf为待加密的内容，N为其字节数。Buf 需要被填充为K的整数倍。在buf的尾部填充(K-N%K)个字节，每个字节的内容 是(K- N%K)。
   *
   * @param {string|buffer} buf 待补位的内容
   * @return {Buffer}
   */
  _encode(buf) {
    const K = 32

    const originBuf = Buffer.from(buf)

    const N = originBuf.length
    const P = K - (N % K)

    let ret = Buffer.alloc(P)
    ret.fill(P)

    return Buffer.concat([originBuf, ret])
  }

  /**
   * 移除补位内容
   *
   * @param {string|buffer} text 待补位的内容
   * @return {Buffer}
   */
  _decode(text) {
    const K = 32

    const originBuf = Buffer.from(text)
    const N = originBuf.length
    let P = originBuf[N - 1]

    if (P < 1 || P > K) {
      P = 0
    }

    return originBuf.slice(0, N - P)
  }

  /**
   * 加密
   *
   * msg_encrypt = Base64_Encode( AES_Encrypt[ random(16B) + msg_len(4B) + msg + ] )
   *
   * @param {string|buffer} text 待加密的文本
   */
  _encrypt(msg) {
    const msgBuf = Buffer.from(msg)

    // 16 个字节的随机字符串
    const randomString = crypto.pseudoRandomBytes(16)

    // 4 个字节的 msg_len(网络字节序)
    const msgLen = Buffer.alloc(4)
    msgLen.writeUInt32BE(msgBuf.length, 0)

    // 这里传入 appId 便于后面的数据校验
    const bufList = [randomString, msgLen, msgBuf, Buffer.from(this.appId)]
    const buf = Buffer.concat(bufList)

    // 补位
    const encoded = this._encode(buf)

    // AES 采用 CBC 模式，秘钥长度为 32 个字节（256 位），数据采用 PKCS#7 填充
    const cipher = crypto.createCipheriv('aes-256-cbc', this.aesKey, this.iv)
    cipher.setAutoPadding(false)

    const result = Buffer.concat([cipher.update(encoded), cipher.final()])

    // 返回 base64 编码
    return result.toString('base64')
  }

  /**
   * 解密
   *
   * 加密操作的逆向过程
   *
   * @param {string|buffer} text 待解密的文本
   */
  _decrypt(text) {
    const decipher = crypto.createDecipheriv('aes-256-cbc', this.aesKey, this.iv)
    decipher.setAutoPadding(false)

    const decrypted = Buffer.concat([decipher.update(text, 'base64'), decipher.final()])

    const decoded = this._decode(decrypted)
    const content = decoded.slice(16)
    const length = content.slice(0, 4).readUInt32BE(0)
    const id = content.slice(length + 4).toString()
    const result = content.slice(4, length + 4).toString()

    if (this.appId !== id) {
      throw new Error('Invalid appId')
    } else {
      return result
    }
  }

  /**
   * 生成返回的消息体
   *
   * @param {string} encrypt 密文
   * @param {string} signature 签名
   * @param {string} timestamp 时间戳
   * @param {string} nonce 随机字符串
   */
  genReplyXML(encrypt, signature, timestamp, nonce) {
    /* eslint-disable indent */
    return `<xml>
<Encrypt><![CDATA[${encrypt}]]></Encrypt>
<MsgSignature><![CDATA[${signature}]]></MsgSignature>
<TimeStamp>${timestamp}</TimeStamp>
<Nonce><![CDATA[${nonce}]]></Nonce>
</xml>`
    /* eslint-enable indent */
  }

  /**
   * 签名算法
   *
   * @param {string} timestamp 时间戳
   * @param {string} nonce 随机字符串
   * @param {string} encrypt 密文
   *
   * 开发者计算签名，dev_msg_signature=sha1(sort(Token、timestamp、nonce, msg_encrypt))
   */
  getSignature(timestamp, nonce, encrypt) {
    // 拼接 token, timestamp, nonce, encrypt
    const raw = [this.token, timestamp, nonce, encrypt].sort().join('')
    return crypto.createHash('sha1').update(raw, 'utf8').digest('hex')
  }

  /**
   * 消息加密并返回 XML 消息体
   *
   * @param {string} replyMsg 待回复的 XML 消息体
   * @param {string} timestamp 时间戳
   * @param {string} nonce 随机字符串
   */
  encryptMsg(replyMsg, timestamp = getTimestamp(), nonce = genNouce(10)) {
    const encrypted = this._encrypt(replyMsg)

    const sign = this.getSignature(timestamp, nonce, encrypted)

    return this.genReplyXML(encrypted, sign, nonce, timestamp)
  }

  /**
   * 提取微信推送的消息中的密文
   *
   * @param {string} raw 推送的 XML 消息体
   *
   * 提取失败则返回空字符串
   */
  extractEncrypt(raw) {
    const match = raw.match(/<(Encrypt)>(?:<!\[CDATA\[)(.*?)(?:\]\]>)(<\/\1>)/i)
    return match ? match[2] : ''
  }

  /**
   * 解密微信推送过来的消息
   *
   * @param {string} msgSignature 微信推送过来的签名
   * @param {string} timestamp 微信推送过来的时间戳
   * @param {string} nonce 微信推送过来的随机字符串
   * @param {string} postData 微信推送过来的消息
   *
   * 前面三个参数在 URL 链接参数中直接获取，最后一个参数在 body 中。
   */
  decryptMsg(msgSignature, timestamp, nonce, postData) {
    const encrypt = this.extractEncrypt(postData)
    const sign = this.getSignature(timestamp, nonce, encrypt)

    if (msgSignature !== sign) {
      throw new Error('Invalid signature')
    }

    const decrypted = this._decrypt(encrypt)
    return decrypted
  }
}

module.exports = {
  random,
  genNouce,
  getTimestamp,
  obj2Params,
  genSha1,
  WXBizMsgCrypt
}
