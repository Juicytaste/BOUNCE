// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init({
    env: 'lazydog-5gl0c2v7b448-7bh22424848',
    traceUser:true
})
const db = cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {
  console.log(event)
  try {
    return await db.collection('Shows').doc(event.id).update({
      data: {
        views:db.command.inc(1)
      }
    })
  } catch (err) {
    console.log(err)
  }
}