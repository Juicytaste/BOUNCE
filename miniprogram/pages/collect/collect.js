const db = wx.cloud.database()
var app = getApp()
const userId = app.globalData.userInfo.userId
Page({
    data:{
        show_list:[],
        display:"none"
    },
    // GetPermission(){
    //     wx.requestSubscribeMessage({
    //       tmplIds: ['83H7PDyYAz3c3cp2B98wzcCWj6DPJkWcHuPGl1g6MU0'],
    //       success: res => {
    //         console.log(res);
    //       }
    //     })
    // },
    send(thing4,date5,thing6,character_string17) {
        const userId = app.globalData.userInfo.userId
        wx.cloud.callFunction({
          name: "sendMsg",
          data: {
            openid:userId,
            thing4:thing4,
            thing6:thing6,
            date5:date5,
            character_string17:character_string17
          }
        }).then(res => {
          console.log("推送消息成功", res)
        }).catch(res => {
          console.log("推送消息失败", res)
        })
      }, 
    onLoad(options){ 
        wx.cloud.callFunction({
            name: 'get_collectlist',
            success: res => {
                // console.log( res.result.list[0].list[0].time.replace(new RegExp("\\.","g"),"-"))
                // this.send(
                //     res.result.list[0].list[0].title.substr(0,20),
                //     res.result.list[0].list[0].time.replace(new RegExp("\\.","g"),"-").substr(0,10),
                //     res.result.list[0].list[0].place,
                //     '30min',
                //     )
                var showlists = []
                for(var i=0;i<res.result.list.length;i++){
                    showlists.push(res.result.list[i].list[0])
                }
                if(res.result.list.length == 0 ){
                    this.setData({
                        display:"block"
                    })
                }
                else{
                    this.setData({
                        show_list:showlists
                    })
                }
          },
          fail: console.error
        })
    },
    goDetail(e){
        wx.navigateTo({
          url: '/pages/detail/detail?id=' + e.currentTarget.dataset.id,
        })
    },
})