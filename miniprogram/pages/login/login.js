const app = getApp()
let userId
Page({
    data: {
        userInfo: null,
        display:''
    },
    onLoadUser(options){
      userId = app.globalData.userInfo.userId
      wx.cloud.database().collection('UserProfile').where({
        _openid: userId
      }).get({
        success: res => {
          console.log(res)
          app.globalData.userInfo.avatarUrl = res.data[0].avatarUrl
          app.globalData.userInfo.nickName = res.data[0].nickName
          app.globalData.userInfo.once = res.data[0].once
          app.globalData.userInfo.city = res.data[0].city
          if(res.data[0]){
            wx.switchTab({
              url: '/pages/homepage/homepage',
            })
            wx.showToast({
              title: '登录成功',
              icon: 'tick'
            })
          }
        }
      })
    },
    btnlogin() {
        wx.getUserProfile({
            desc: '获取用户信息',
            success: res => {
              console.log(userId)
              wx.cloud.database().collection('UserProfile').where({
                _openid: userId
              }).get().then(result=>{
                console.log(result)
                if(result.data[0]){
                    console.log('有了')
                    wx.switchTab({
                        url: '/pages/homepage/homepage',
                      })
                }
                else{
                    console.log(1)
                    wx.cloud.database().collection('UserProfile').add({
                        data: {
                          avatarUrl: res.userInfo.avatarUrl,
                          nickName: res.userInfo.nickName,
                          once:true,
                          city:'广州'
                        },}).then(result=>{
                            console.log(result)
                            app.globalData.userInfo.avatarUrl = res.userInfo.avatarUrl
                            app.globalData.userInfo.nickName = res.userInfo.nickName
                            wx.showToast({
                              title: '登录成功',
                              icon: 'none',
                              duration:500
                            })
                            wx.switchTab({
                              url: '/pages/myself/myself'
                            })
                        })
                }
              })
            }
        })
      },
})