// miniprogram-bounce/pages/dongtai/dongtai.js
const api = require("../../api/api");
let artistnum = 0;
Page({
    data: {
        display:'none',
        artistSearch:[],
        content:"",
        follow:[],
        followartist:[],
        followlength:0,
        followitem:[{
            artist:'',
            profilepic:'',
            _id:'',
            moments:[{
                imgUrl:'',
                title:'',
                place:'',
                time:'',
                _id:'',
            }]
        }]
    },
    onPullDownRefresh:function(){
        this.onRefresh();
        this.onLoad()
    },
    onRefresh:function(){
        //导航条加载动画
        wx.showNavigationBarLoading();
        setTimeout(function () {
        wx.hideNavigationBarLoading();
        //停止下拉刷新
        wx.stopPullDownRefresh();
        }, 2000);
    },
    onLoad: function (options) {
        artistnum = 0;
        this.setData({
            artistSearch:[],
            content:"",
            follow:[],
            followartist:[],
            followlength:0,
            followitem:[{
                artist:'',
                profilepic:'',
                _id:'',
                moments:[{
                    imgUrl:'',
                    title:'',
                    place:'',
                    time:'',
                    _id:'',
                }]
            }]
        })
        this.getArtist();
    },
    search(){
		let artist =this.data.content;
		//调用云函数
		wx.cloud.callFunction({
                name:'SearchArtist',
                data:{
                    _keyword:artist,
                    dbName:'Artist'
                }
            }).then(res=>{
                console.log(res)
                if(res.result.data.length>0){
                    this.setData({
                        artistSearch:res.result.data
                    })
                    let str = JSON.stringify(this.data.artistSearch);
                    wx.navigateTo({
                    url: '/pages/artistResult/artistResult?data='+encodeURIComponent(str),
                    })
                }
                else{
                    wx.showToast({
                        title: '抱歉，没有找到相关音乐人哦~',
                        icon:"none"
                    })
                }
        })
	},
	//获取文本框的文本值 
	getinput(event){
		this.setData({
			content:event.detail.value
		})
    },
    getArtist(){
        var that = this;//把this对象复制到临时变量that，解决作用域不够的问题
		api.find("User_artist",{_openid:getApp().globalData.userInfo.userId}).then(res=>{
            console.log(res)
            if(res.data) {
                this.setData({
                    followlength:res.data.length
                })
                var tmp = []
                for(var i=0;i<that.data.followlength;i++) {
                    tmp.push(res.data[i].collectid)
                }
                this.setData({
                    follow:tmp
                })
            }
            if(that.data.followlength > 0){
                this.setData({
                    display:'block'
                })
                for(var i=0;i<that.data.followlength;i++){
                    api.find("Artist",{_id:that.data.follow[i]}).then(res=>{
                        let temp = res.data
                        console.log(temp)
                        this.setData({
                            followartist:that.data.followartist.concat(temp[0])
                        })         
                        // 找到关注艺人的演出信息
                        wx.cloud.callFunction({
                            name:'fuzzySearch',
                            data:{
                                _keyword:temp[0].artist,
                            }
                        }).then(res=>{
                            if(res.result.data.length > 0){
                                console.log(res)
                                let dlength = res.result.data.length
                                let d = res.result.data
                                this.setData({
                                    ['followitem['+ artistnum +'].artist']:temp[0].artist,
                                    ['followitem['+ artistnum +'].profilepic']:temp[0].link,
                                    ['followitem['+ artistnum +']._id']:temp[0]._id,
                                })
                                for(var j=0;j<dlength;j++) {
                                    that.setData({
                                        ['followitem['+ artistnum +'].moments[' + j +'].imgUrl']:d[j].imgUrl,
                                        ['followitem['+ artistnum +'].moments[' + j +'].title']:d[j].title,
                                        ['followitem['+ artistnum +'].moments[' + j +'].place']:d[j].place,
                                        ['followitem['+ artistnum +'].moments[' + j +'].time']:d[j].time,
                                        ['followitem['+ artistnum +'].moments[' + j +']._id']:d[j]._id,
                                    })
                                }
                                artistnum++;
                            }
                        })
                    })
                }
                console.log(that.data.followitem)
                // console.log(map)
            }
            else{
                wx.showModal({
                    title: 'BOUNCE',
                    content: '你还没有关注的音乐人哦，关注音乐人随时获取最新演出动态吧',
                    confirmText: '去关注',
                    cancelText:'下次吧',
                    success (res) {
                        if (res.confirm) {
                            wx.navigateTo({
                                url: '/pages/artist/artist'
                              })
                        } else if (res.cancel) {
                        }
                    }
                })
            }
        })
    },
    goArtist(e){
        wx.navigateTo({
          url: '/pages/artistdetail/artistdetail?id=' + e.currentTarget.dataset.id,
        })
    },
    goShow(e){
        wx.cloud.callFunction({
            name:'addviews',
            data:{
                id:e.currentTarget.dataset.id
            },
            success: res => {
                console.log("view云函数",res)
            },
            fail: err =>{
                console.log("err",err)
            }
        })
        wx.navigateTo({
          url: '/pages/detail/detail?id=' + e.currentTarget.dataset.id,
        })
    },
})