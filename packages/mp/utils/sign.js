'use strict'

const crypto = require('crypto')

function genSha1(data) {
  const ret = []

  Object.keys(data).sort().forEach(item => {
    ret.push(`${item.toLowerCase()}=${data[item]}`)
  })

  const raw = ret.join('&')

  return crypto.createHash('sha1').update(raw, 'utf8').digest('hex')
}

module.exports = {
  genSha1
}
