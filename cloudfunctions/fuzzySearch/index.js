// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init({
    env: 'lazydog-5gl0c2v7b448-7bh22424848',
    traceUser:true
})
const db= cloud.database();
const _ = db.command
// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  let keyWords = event._keyword
  try {
    //这里的keyWords是前端小程序访问的参数_keyword
    return await db.collection('Shows').limit(50)
      .where(
        db.command.or([{
            title: db.RegExp({
              regexp: keyWords,
              options: 'i', //大小写不区分
            }),
          },
          {
            artist: db.RegExp({
              regexp: keyWords,
              options: 'i',//大小写不区分
            }),
          }
        ])
      ).get()
  } catch (e) {
    console.log(e)
  }
  return {
    event,
    openid: wxContext.OPENID,
    appid: wxContext.APPID,
    unionid: wxContext.UNIONID,
  }
}