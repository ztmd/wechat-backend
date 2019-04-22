'use strict'

const Base = require('./base')

class Security extends Base {
  /**
   * 校验一张图片是否含有违法违规内容
   *
   * 应用场景举例：
   *  - 图片智能鉴黄：涉及拍照的工具类应用(如美拍，识图类应用)用户拍照上传检测；电商类商品上架图片检测；媒体类用户文章里的图片检测等；
   *  - 敏感人脸识别：用户头像；媒体类用户文章里的图片检测；社交类用户上传的图片检测等。 频率限制：单个 appId 调用上限为 2000 次/分钟，200,000 次/天*（图片大小限制：1M）
   *
   * @param {FormData} media 要检测的图片文件，格式支持PNG、JPEG、JPG、GIF，图片尺寸不超过 750px x 1334px
   *
   */
  imgSecCheck(media) {
    return this.request({
      url: '/wxa/img_sec_check',
      data: media
    })
  }

  /**
   * 检查一段文本是否含有违法违规内容
   *
   * 应用场景举例：
   *  - 用户个人资料违规文字检测；
   *  - 媒体新闻类用户发表文章，评论内容检测；
   *  - 游戏类用户编辑上传的素材(如答题类小游戏用户上传的问题及答案)检测等。 频率限制：单个 appId 调用上限为 4000 次/分钟，2,000,000 次/天*
   *
   * @param {String} content 要检测的文本内容，长度不超过 500KB
   *
   */
  msgSecCheck(content) {
    return this.request({
      url: '/wxa/msg_sec_check',
      data: content
    })
  }

}

module.exports = Security
