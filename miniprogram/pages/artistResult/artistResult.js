// miniprogram-bounce/pages/artistResult/artistResult.js
Page({
    data: {
        artistResult:[]
    },
    onLoad: function(options) {
        let artistResult = JSON.parse(decodeURIComponent(options.data));
        console.log("artist"+artistResult);
        let that = this
        that.setData({
          artistResult: artistResult
        })
      },
      goDetail(e){
        wx.navigateTo({
          url: '/pages/artistdetail/artistdetail?id=' + e.currentTarget.dataset.id,
        })
    },  
})