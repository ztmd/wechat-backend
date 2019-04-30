'use strict'

const assert = require('assert')

const {
  WXBizMsgCrypt
} = require('../utils/helper')

describe('WXBizMsgCrypt - C#', () => {
  const sToken = 'QDG6eK'
  const sAppID = 'wx5823bf96d3bd56c7'
  const sEncodingAESKey = 'jWmYm7qr5nMoAUwZRjGtBxmz3KA1tkAj3ykkR6q2B2C'
  const sReqMsgSig = '477715d11cdb4164915debcba66cb864d751f3e6'
  const sReqTimeStamp = '1409659813'
  const sReqNonce = '1372623149'
  const sReqData = '<xml><ToUserName><![CDATA[wx5823bf96d3bd56c7]]></ToUserName><Encrypt><![CDATA[RypEvHKD8QQKFhvQ6QleEB4J58tiPdvo+rtK1I9qca6aM/wvqnLSV5zEPeusUiX5L5X/0lWfrf0QADHHhGd3QczcdCUpj911L3vg3W/sYYvuJTs3TUUkSUXxaccAS0qhxchrRYt66wiSpGLYL42aM6A8dTT+6k4aSknmPj48kzJs8qLjvd4Xgpue06DOdnLxAUHzM6+kDZ+HMZfJYuR+LtwGc2hgf5gsijff0ekUNXZiqATP7PF5mZxZ3Izoun1s4zG4LUMnvw2r+KqCKIw+3IQH03v+BCA9nMELNqbSf6tiWSrXJB3LAVGUcallcrw8V2t9EL4EhzJWrQUax5wLVMNS0+rUPA3k22Ncx4XXZS9o0MBH27Bo6BpNelZpS+/uh9KsNlY6bHCmJU9p8g7m3fVKn28H3KDYA5Pl/T8Z1ptDAVe0lXdQ2YoyyH2uyPIGHBZZIs2pDBS8R07+qN+E7Q==]]></Encrypt></xml>'
  const sEncrypt = 'RypEvHKD8QQKFhvQ6QleEB4J58tiPdvo+rtK1I9qca6aM/wvqnLSV5zEPeusUiX5L5X/0lWfrf0QADHHhGd3QczcdCUpj911L3vg3W/sYYvuJTs3TUUkSUXxaccAS0qhxchrRYt66wiSpGLYL42aM6A8dTT+6k4aSknmPj48kzJs8qLjvd4Xgpue06DOdnLxAUHzM6+kDZ+HMZfJYuR+LtwGc2hgf5gsijff0ekUNXZiqATP7PF5mZxZ3Izoun1s4zG4LUMnvw2r+KqCKIw+3IQH03v+BCA9nMELNqbSf6tiWSrXJB3LAVGUcallcrw8V2t9EL4EhzJWrQUax5wLVMNS0+rUPA3k22Ncx4XXZS9o0MBH27Bo6BpNelZpS+/uh9KsNlY6bHCmJU9p8g7m3fVKn28H3KDYA5Pl/T8Z1ptDAVe0lXdQ2YoyyH2uyPIGHBZZIs2pDBS8R07+qN+E7Q=='
  const sResult = `<xml><ToUserName><![CDATA[wx5823bf96d3bd56c7]]></ToUserName>
<FromUserName><![CDATA[mycreate]]></FromUserName>
<CreateTime>1409659813</CreateTime>
<MsgType><![CDATA[text]]></MsgType>
<Content><![CDATA[hello]]></Content>
<MsgId>4561255354251345929</MsgId>
<AgentID>218</AgentID>
</xml>`
  const sTestMsg = '<root>test</root>'

  const instance = new WXBizMsgCrypt(sToken, sEncodingAESKey, sAppID)

  it('decryptMsg', done => {
    assert.equal(instance.decryptMsg(sReqMsgSig, sReqTimeStamp, sReqNonce, sReqData), sResult)
    done()
  })

  it('encryptMsg', done => {
    const encrypted = instance._encrypt(sTestMsg)
    assert.equal(instance._decrypt(encrypted), sTestMsg)
    done()
  })

  it('extractEncrypt', done => {
    assert.equal(instance.extractEncrypt(sReqData), sEncrypt)
    done()
  })

  it('getSignature', done => {
    assert.equal(instance.getSignature(sReqTimeStamp, sReqNonce, sEncrypt), sReqMsgSig)
    done()
  })
})

describe('WXBizMsgCrypt - Java', () => {
  const token = 'pamtest'
  const appId = 'wxb11529c136998cb6'
  const encodingAesKey = 'abcdefghijklmnopqrstuvwxyz0123456789ABCDEFG'

  const replyMsg = '我是中文abcd123'
  const afterAesEncrypt = 'jn1L23DB+6ELqJ+6bruv21Y6MD7KeIfP82D6gU39rmkgczbWwt5+3bnyg5K55bgVtVzd832WzZGMhkP72vVOfg=='

  const replyMsg2 = '<xml><ToUserName><![CDATA[oia2Tj我是中文jewbmiOUlr6X-1crbLOvLw]]></ToUserName><FromUserName><![CDATA[gh_7f083739789a]]></FromUserName><CreateTime>1407743423</CreateTime><MsgType><![CDATA[video]]></MsgType><Video><MediaId><![CDATA[eYJ1MbwPRJtOvIEabaxHs7TX2D-HV71s79GUxqdUkjm6Gs2Ed1KF3ulAOA9H1xG0]]></MediaId><Title><![CDATA[testCallBackReplyVideo]]></Title><Description><![CDATA[testCallBackReplyVideo]]></Description></Video></xml>'
  const afterAesEncrypt2 = 'jn1L23DB+6ELqJ+6bruv23M2GmYfkv0xBh2h+XTBOKVKcgDFHle6gqcZ1cZrk3e1qjPQ1F4RsLWzQRG9udbKWesxlkupqcEcW7ZQweImX9+wLMa0GaUzpkycA8+IamDBxn5loLgZpnS7fVAbExOkK5DYHBmv5tptA9tklE/fTIILHR8HLXa5nQvFb3tYPKAlHF3rtTeayNf0QuM+UW/wM9enGIDIJHF7CLHiDNAYxr+r+OrJCmPQyTy8cVWlu9iSvOHPT/77bZqJucQHQ04sq7KZI27OcqpQNSto2OdHCoTccjggX5Z9Mma0nMJBU+jLKJ38YB1fBIz+vBzsYjrTmFQ44YfeEuZ+xRTQwr92vhA9OxchWVINGC50qE/6lmkwWTwGX9wtQpsJKhP+oS7rvTY8+VdzETdfakjkwQ5/Xka042OlUb1/slTwo4RscuQ+RdxSGvDahxAJ6+EAjLt9d8igHngxIbf6YyqqROxuxqIeIch3CssH/LqRs+iAcILvApYZckqmA7FNERspKA5f8GoJ9sv8xmGvZ9Yrf57cExWtnX8aCMMaBropU/1k+hKP5LVdzbWCG0hGwx/dQudYR/eXp3P0XxjlFiy+9DMlaFExWUZQDajPkdPrEeOwofJb'

  const instance = new WXBizMsgCrypt(token, encodingAesKey, appId)

  it('decryptMsg1', done => {
    assert.equal(instance._decrypt(afterAesEncrypt), replyMsg)
    done()
  })

  it('decryptMsg2', done => {
    assert.equal(instance._decrypt(afterAesEncrypt2), replyMsg2)
    done()
  })

  it('encryptMsg1', done => {
    const encrypted = instance._encrypt(replyMsg)
    assert.equal(instance._decrypt(encrypted), replyMsg)
    done()
  })

  it('encryptMsg2', done => {
    const encrypted = instance._encrypt(replyMsg2)
    assert.equal(instance._decrypt(encrypted), replyMsg2)
    done()
  })
})
