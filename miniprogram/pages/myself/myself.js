var app = getApp()
Page({
    data: {
      avatarUrl:'',
      nickName:'',
    },
    onLoad(options){
        this.setData({
            avatarUrl:app.globalData.userInfo.avatarUrl,
            nickName:app.globalData.userInfo.nickName
        })
    },
    gotoCollect(e){
        wx.navigateTo({
          url: '/pages/collect/collect',
        })
    }
})