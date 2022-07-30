// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
    env: cloud.DYNAMIC_CURRENT_ENV,
    traceUser:true
  });
const db=cloud.database();

// 云函数入口函数
exports.main = async (event, context) => {
    let keyWords = event._keyword
    return db.collection('Shows').where(
        db.command.or([{
            artist: db.RegExp({
              regexp: keyWords,
              options: 'i',//大小写不区分
            }),
          }])
      ).get()
}