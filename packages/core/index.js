'use strict'

const WechatBackendMinigame = require('wechat-backend-minigame')
const WechatBackendMiniprogram = require('wechat-backend-miniprogram')
const WechatBackendMp = require('wechat-backend-mp')
const WechatBackendPay = require('wechat-backend-pay')

module.exports = {
  Minigame: WechatBackendMinigame,
  Miniprogram: wechatBackendMiniprogram,
  Mp: wechatBackendMp,
  Pay: wechatBackendPay
}
