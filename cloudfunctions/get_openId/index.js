// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init({
    env: 'lazydog-5gl0c2v7b448-7bh22424848',
    traceUser:true
})
exports.main = async (event, context) => {
    const wxContext = cloud.getWXContext()
    return {
      event,
      openid: wxContext.OPENID,
      appid: wxContext.APPID,
      unionid: wxContext.UNIONID,
    }
}  