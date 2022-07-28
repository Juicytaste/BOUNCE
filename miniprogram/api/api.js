// 封装常用方法


const db=wx.cloud.database();
const _=db.command; //所有操作符
//collectionName 集合名
//where 查询条件 默认空
//skip 跳过几条 默认0
//limit 限制条数
//orderby的两个参数 
//1、此方法用来查询数据库的数据
const find = function(collectionName,where={},skip=0,limit=20,targetType="_id",sort='decs'){
    return new Promise((resolve,reject)=>{
        db.collection(collectionName).where(where).skip(skip).limit(limit).orderBy(targetType,sort).get().then(res=>{
            resolve(res);//成功后res就是结果
        })//这里的then 和 catch都是get的
        .catch(err=>{
            reject(err);
        })
    })

}


//导出 暴露/出口
module.exports={
    find,
    _ //导出

}
//调用
// find("xiudong").then(res=>{

// })
// .catch(err)

