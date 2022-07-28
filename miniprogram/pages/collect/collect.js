const db = wx.cloud.database()
var app = getApp()
Page({
    data:{
        show_list:[],
        display:"none"
    },
    onLoad(options){
        wx.cloud.callFunction({
            name: 'get_collectlist',
            success: res => {
                console.log(res)
                var showlists = []
                for(var i=0;i<res.result.list.length;i++){
                    showlists.push(res.result.list[i].list[0])
                }
                if(res.result.list.length == 0 ){
                    console.log(1111111)
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