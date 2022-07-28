let iscollect = false
let artistid
var app = getApp()
const db = wx.cloud.database()
Page({
    data: {
        show_list:[],
        display:"none",
        artistid:'',
        name:'',
        link:'',
        content:'',
        style:'',
        color:false,
        navState: 0,//导航状态
    },
      //监听滑块
      bindchange(e) {
        // console.log(e.detail.current)
        let index = e.detail.current;
        this.setData({
          navState:index
        })
      },
      //点击导航
      navSwitch: function(e) {
        // console.log(e.currentTarget.dataset.index)
        let index = e.currentTarget.dataset.index;
        this.setData({
          navState:index
        })
      },    
      goDetail(e){
            wx.navigateTo({
            url: '/pages/detail/detail?id=' + e.currentTarget.dataset.id,
            })
        },
    onLoad(options){
        artistid = options.id
        wx.cloud.database().collection('User_artist').where({
            _openid:app.globalData.userInfo.userId,
            collectid:artistid
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
        wx.cloud.database().collection('Artist').doc(artistid).get({
            success:res=>{
                this.setData({
                    name:res.data.artist,
                    link:res.data.link,
                    content:res.data.content,
                    style:res.data.style,
                    content:res.data.content
                })
                wx.cloud.callFunction({
                    name:'fuzzySearch',
                    data:{
                        keyword:res.data.artist
                    }
                    }).then(result=>{
                        console.log(result)
                        if(result.result.data.length == 0){
                            this.setData({
                                display:"block"
                            })
                        }
                        else{
                            var showlist = []
                            for(var i=0;i<result.result.data.length;i++){
                                showlist.push(result.result.data[i])
                            }
                            this.setData({
                                show_list:showlist
                            })
                        }
                })
            },
          })
    },
    change:function(){
        wx.cloud.database().collection('User_artist').where({
          _openid:app.globalData.userInfo.userId,
          collectid:artistid
        }).get({
          success:res=>{
            const _ = db.command
            console.log("res",res)
            if(res.data[0] == undefined){
              console.log("找不到",app.globalData.userInfo.userId)
              wx.cloud.database().collection('User_artist').add({
                data:{
                  userid:app.globalData.userInfo.userId,
                  collectid:artistid
                }
              })
              iscollect = true
              this.setData({
                color:iscollect
              })
            }else{
              console.log("找到",res)
              wx.cloud.database().collection('User_artist').where({
                _openid:app.globalData.userInfo.userId,
                collectid:artistid
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
})
  