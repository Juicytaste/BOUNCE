const db = wx.cloud.database()
var QQMapWX = require('../../utils/qqmap-wx-jssdk');
Page({
    data:{
        tabbar: ["演出", "音乐人"],
        show_list:[],
        show_nums:0,
        image_list:[],
        wonderfulshow_list:[],
        city: '北京', //默认北京市
        cityPickerValue: [0, 0],
        cityPickerIsShow: false,
    },
    onLoad(options){
        db.collection('Shows').where({
            city:this.data.city,
        }).get()
        .then(res => {
            console.log(res.data)
            this.setData({
                show_list:res.data
            })
        })
        wx.cloud.database().collection('images').get()
        .then(res=>{//成功
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
        console.log(e)
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
        this.setData({
          city: e.detail.valueName[1],
          cityPickerValue: e.detail.valueCode,
          cityPickerIsShow: false,
        });
        this.onLoad();
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
        wx.getLocation({
          type: 'wgs84',
          success: function (res) {
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
                console.log(addressRes)  
              },
              fail: function (error) {
                console.error(error);
              },
            })
          }
        })
      }
})
