let iscollect = false
let id
let urllist = []
let mddp,xddp,dmdp
var app = getApp()
const db = wx.cloud.database()
Page({
    data:{
        url_list:[],
        imgurl:'',
        name:'',
        time:'',
        city:'',
        color:false,
        display:"none"
    },
    onLoad(options){
        id = options.id
        wx.cloud.database().collection('User_collect').where({
            _openid:app.globalData.userInfo.userId,
            collectid:id
          }).get({
              success:res=>{
                if(res.data[0] == undefined){
                    console.log("未收藏")
                    this.setData({
                        color:false
                      })
                }else{
                    console.log("已收藏")
                    this.setData({
                        color:true
                      })
                }
              }
          })
        urllist = []
        //从首页点进来获取id来得到详情页面信息
        wx.cloud.database().collection('Shows')
        .doc(id)
        .get()
        .then(res=>{
            console.log('详情页',res)
            urllist.push(res.data.mdUrl)
            urllist.push(res.data.xdUrl)
            urllist.push(res.data.dmUrl)
            if(res.data.mdUrl != ''){
                mddp = 'block'
            }else{
                mddp = 'none'
            }
            if(res.data.xdUrl != ''){
                xddp = 'block'
            }else{
                xddp = 'none'
            }
            if(res.data.dmUrl != ''){
                dmdp = 'block'
            }else{
                dmdp = 'none'
            }
            this.setData({
                imgurl:res.data.imgUrl,
                name:res.data.title,
                time:res.data.time,
                city:res.data.place,
                color:res.data.iscollect,
                artist:res.data.artist,
                price:res.data.price,
                mddp:mddp,
                xddp:xddp,
                dmdp:dmdp
            })
        })
        .catch(err=>{
            console.log('失败',err)
        })
    },
    change:function(){
        wx.cloud.database().collection('User_collect').where({
          _openid:app.globalData.userInfo.userId,
          collectid:id
        }).get({
          success:res=>{
            const _ = db.command
            console.log("res",res)
            if(res.data[0] == undefined){
              console.log("找不到",app.globalData.userInfo.userId)
              wx.cloud.database().collection('User_collect').add({
                data:{
                  userid:app.globalData.userInfo.userId,
                  collectid:id
                }
              })
              iscollect = true
              this.setData({
                color:iscollect
              })
            }else{
              console.log("找到",res)
              wx.cloud.database().collection('User_collect').where({
                _openid:app.globalData.userInfo.userId,
                collectid:id
              }).remove({
                success:res=>{
                    console.log("取消收藏成功",res)
                }
              })
              iscollect = false
              this.setData({
                color:iscollect
              })
            }
          }
        })
    },
    GTB:function(){
        this.setData({
            display:"block"
        })
    },
    close:function(){
        this.setData({
            display:"none"
        })
    },
    handleClickmd(){
          wx.setClipboardData({
            data: urllist[0],
            success: function (res) {
              wx.getClipboardData({
                success: function (res) {
                  wx.showToast({
                    title: '请在浏览器打开'
                  })
                }
              })
            }
          })
    },
    handleClickxd(){
        wx.setClipboardData({
            data: urllist[1],
            success: function (res) {
              wx.getClipboardData({
                success: function (res) {
                  wx.showToast({
                    title: '请在浏览器打开'
                  })
                }
              })
            }
          })
    },
    handleClickdm(){
        wx.setClipboardData({
            data: urllist[2],
            success: function (res) {
              wx.getClipboardData({
                success: function (res) {
                  wx.showToast({
                    title: '请在浏览器打开'
                  })
                }
              })
            }
          })
    }
})