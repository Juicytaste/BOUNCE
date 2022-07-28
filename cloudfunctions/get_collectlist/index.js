// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init({
    env: 'lazydog-5gl0c2v7b448-7bh22424848',
    traceUser:true
})
const db=cloud.database();
// 云函数入口函数
exports.main = async (event, context) => {
    return new Promise(function (resolve, reject) {
		db.collection('User_collect').aggregate()
            .lookup({
                from: 'Shows',
                localField: 'collectid',
                foreignField: '_id',
                as: 'list',
            })
			.match({
				_openid: event.userInfo.openId
			})
			.end()
			.then(res => {
				console.log(res);
				resolve(res);
			})
			.catch(err => console.error(err))
	})
}