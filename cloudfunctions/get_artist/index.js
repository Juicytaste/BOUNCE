// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init({
    env: 'lazydog-5gl0c2v7b448-7bh22424848',
    traceUser:true
})
// 云函数入口函数
exports.main = async (event, context) => {
    const db=cloud.database();
    let count = await db.collection("Artist").count()
    count = count.total
    let all = []
    for (let i=0;i<count;i+=100){
        let list = await db.collection("Artist").skip(i).get()
        all = all.concat(list.data)
    }
    return all;
  }