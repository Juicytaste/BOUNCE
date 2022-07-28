Page({
    data: {
        searchShow:[]
    },
    onLoad: function(options) {
        let searchShow = JSON.parse(decodeURIComponent(options.data));
        let that = this
        console.log("searchShow",searchShow)
        that.setData({
          searchShow: searchShow
        })
      },    
    toDetail(e){
        wx.navigateTo({
            url: '/pages/detail/detail?id=' + e.currentTarget.dataset.id,
          })
      },
})