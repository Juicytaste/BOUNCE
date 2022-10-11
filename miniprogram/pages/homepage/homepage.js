const app = getApp()
const db = wx.cloud.database()
let onetime = true
let onetime2 = true
var QQMapWX = require('../../utils/qqmap-wx-jssdk');
Page({
    data:{
        tabbar: ["演出", "音乐人"],
        show_list:[],
        show_nums:0,
        image_list:[],
        wonderfulshow_list:[],
        city:getApp().globalData.userInfo.city,
        cityPickerValue: [0, 0],
        cityPickerIsShow: false,
        once:true
    },
    notification_likes(){
        wx.showModal({
            title: '欢迎来到BOUNCE！',
            content: '关注你喜爱的音乐人后，可以及时获得该音乐人的演出及开票通知推送，不错过喜欢的演出！',
            confirmText: '前往关注',
            cancelText:'不想关注',
            success (res) {
                if (res.confirm) {
                    console.log('用户点击')
                    wx.cloud.database().collection('UserProfile').where({
                        _openid:getApp().globalData.userInfo.userId
                    }).update({
                        data:{
                            once:false
                        }
                    })
                    wx.navigateTo({
                        url: '/pages/artist/artist'
                    })
                } else if (res.cancel) {
                    console.log('用户点击取消')
                }
            }
        })   
    },
    notification_city(){
        var that = this
        wx.showModal({
            title: 'BOUNCE',
            content: '点击下方按钮\r挑选您喜欢的城市',
            confirmText: '当前城市',
            cancelText:'其他城市',
            success (res) {
                if (res.confirm) {
                    that.getCity();
                } else if (res.cancel) {
                    that.showCityPicker();
                }
            }
        })
    },
    onShow:function(){
        wx.cloud.database().collection('UserProfile').where({
            _openid: getApp().globalData.userInfo.userId
          }).get({
            success: res => {
                if(res.data[0].once) {
                    this.setData({
                        once:res.data[0].once
                    })
                    this.notification_city();
                    this.notification_likes();
                }
            }
        })
        if(onetime2){
            console.log(1)
            db.collection('Shows').where({
                city:getApp().globalData.userInfo.city
            }).get()
            .then(res => {
                this.setData({
                    show_list:res.data
                })
            })
            onetime2 = false
        }
    },
    onLoad(options){
        if(onetime){
            const userId = app.globalData.userInfo.userId
            wx.cloud.database().collection('UserProfile').where({
              _openid: userId
            }).get({
              success: res => {console.log('用户存在',res)
              if(res.data[0]){
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
              else{
                wx.navigateTo({
                    url: '/pages/login/login'
                  })
              }
              },
              fail : res => {
                  console.log('获取失败',res)
              }
            })
            onetime = false
        }
        db.collection('Shows').where({
            city:this.data.city
        }).get()
        .then(res => {
            if(res.data[0]) {
                this.setData({
                    show_list:res.data
                })
            }
        })
        wx.cloud.database().collection('images').get()
        .then(res=>{//成功
            console.log("imagessss",res)
            this.setData({
                image_list:res.data
            })
        })
        .catch(err=>{//失败
            console.log('images获取失败',err)
        })
        wx.cloud.database().collection('Shows').limit(5).orderBy('views','desc').get()
        .then(res=>{//成功
            for(var i=0;i<5;i++){
                res.data[i].title = res.data[i].title.slice(0,18) + '...'
            }
            this.setData({
                wonderfulshow_list:res.data
            })
        })
    },
    goDetail(e){
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
    gotoArtist(e){
        wx.navigateTo({
            url: '/pages/artist/artist?city=' + this.data.city
          })
    },
    gosearch(e){
        wx.navigateTo({
            url: '/pages/searchp/searchp'
          })
    },
    gotocalendar(e){
        wx.navigateTo({
          url: '/pages/calendar/calendar?flag=' + '1'
        })
    },
    onReachBottom: function () {
        wx.showLoading({
          title: '加载更多',
          duration: 800
        })
        let x = this.data.show_nums + 20
        let old_data = this.data.show_list
        db.collection('Shows').skip(x).where({
            city:this.data.city,
        }) // 限制返回数量为 20 条
          .get()
          .then(res => {
          // 利用concat函数连接新数据与旧数据
          // 并更新emial_nums  
            this.setData({
              show_list: old_data.concat(res.data),
              show_nums: x
            })
          })
          .catch(err => {
          })
      },
    /**
     * 城市选择确认
     */
    cityPickerOnSureClick: function (e) {
        var that = this
        this.setData({
          city: e.detail.valueName[1],
          cityPickerValue: e.detail.valueCode,
          cityPickerIsShow: false,
        });
        this.onLoad();
        wx.cloud.database().collection('UserProfile').where({
            _openid:getApp().globalData.userInfo.userId
        }).update({
            data:{
                city:that.data.city,
                once:false
            }
        })
      },
      /**
       * 城市选择取消
       */
    cityPickerOnCancelClick: function (event) {
        this.setData({
            cityPickerIsShow: false,
        });
    },
    showCityPicker() {
        this.setData({
            cityPickerIsShow: true,
        });
    },
    getCity: function(e) {
        wx.showLoading({
            title: '正在定位中',
            duration:1500
          })
        var that=this;
        var qqmapsdk; 
        qqmapsdk = new QQMapWX({
          key: '6ALBZ-TXKWU-F4FVR-2QRFY-ADW4V-O7FM6'
        });
        wx.getFuzzyLocation({
          type: 'wgs84',
          success: function (res) {
            console.log(res)
            //2、根据坐标获取当前位置名称，显示在顶部:腾讯地图逆地址解析
            qqmapsdk.reverseGeocoder({
              location: {
                latitude: res.latitude,
                longitude: res.longitude
              },
              success: function (addressRes) {
                let cs =String(addressRes.result.address_component.city);
                that.setData({
                  city:cs.replace('市',''),
                  region: [addressRes.result.address_component.province,addressRes.result.address_component.city]
                })
                that.onLoad()
                wx.cloud.database().collection('UserProfile').where({
                    _openid:getApp().globalData.userInfo.userId
                }).update({
                    data:{
                        city:that.data.city,
                        once:false
                    }
                }) 
              },
              fail: function (error) {
                console.error(error);
              },
            })
          },
          fail: function (error) {
            console.error(error);
          },
        })
      },
      onShareAppMessage: function( options ){
          return {
              title:'所有你想要的live资讯|live爱好者都在用BOUNCE',
              imageUrl:'https://6c61-lazydog-5gl0c2v7b448-7bh22424848-1308402135.tcb.qcloud.la/b42f3069ce65a4abcaa960578b00e9a.jpg',
              
          }
      },
      onShareTimeline:function(options){
      }
})
