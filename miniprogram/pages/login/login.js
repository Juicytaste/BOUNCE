const app = getApp()
Page({
    data: {
        userInfo: null
    },
    onLoadUser(options){
      const userId = app.globalData.userInfo.userId
      wx.cloud.database().collection('UserProfile').where({
        _openid: userId
      }).get({
        success: res => {console.log(res)
          app.globalData.userInfo.avatarUrl = res.data[0].avatarUrl
          app.globalData.userInfo.nickName = res.data[0].nickName
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
              console.log(res)
              wx.cloud.database().collection('UserProfile').add({
                data: {
                  avatarUrl: res.userInfo.avatarUrl,
                  nickName: res.userInfo.nickName
                },
                success: result => {
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
                }
              })
            }
        })
      },
})