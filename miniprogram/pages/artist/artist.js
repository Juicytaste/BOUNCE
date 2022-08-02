import pinyin from "wl-pinyin"
var QQMapWX = require('../../utils/qqmap-wx-jssdk');
Page({
    data:{
        hotartist:[],
        cityPickerValue: [0, 0],
        cityPickerIsShow: false,
        city: '', 
        indexList:[],
        artistId:[],
        artistList:{},
        AlphabetList : ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"]
    },
    onLoad(options){
        wx.showToast({
            title: '加载中...',
            icon: 'loading',
            duration: 2500//持续的时间
        })
        console.log(options.city)
        this.setData({
            city:options.city
        })
        wx.cloud.callFunction({
            name: 'get_artist',
            success: res => {
                console.log(res)
                let artist_list = res.result
                let artisttempList = []
                for(let i=0;i<res.result.length;i++){
                    let temp = {}
                    temp._id = artist_list[i]._id
                    temp.link = artist_list[i].link
                    temp.artist = artist_list[i].artist
                    artisttempList.push(temp)
                    if(i == 7){
                        this.setData({
                            hotartist:artisttempList
                        })
                    }
                }
                let firstName = {};
                let index_list = [];
                console.log(artisttempList)
                for(var i=0;i<this.data.AlphabetList.length;i++){
                    firstName[this.data.AlphabetList[i]] = []
                    for(var j = 0;j<artisttempList.length;j++){
                        let first = pinyin.getFirstLetter(artisttempList[j].artist).substring(0, 1);
                        if (first == this.data.AlphabetList[i]) {
                            firstName[this.data.AlphabetList[i]].push(artisttempList[j])
                        }
                    }
                    if(firstName[this.data.AlphabetList[i]] != 'undefined'){
                        index_list.push(this.data.AlphabetList[i])
                    }
                }
                console.log(firstName)
                this.setData({
                    indexList:index_list,
                    artistList:firstName,
                })
            }
            })
    },
    clickletter(Event){
        console.log(Event)
    },
    gosearch(e){
        wx.navigateTo({
            url: '/pages/searchp/searchp'
          })
    },
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
      },
      gotohomepage(e){
        wx.switchTab({
            url: '/pages/homepage/homepage'
          })
    },
    goDetail(e){
        wx.navigateTo({
          url: '/pages/artistdetail/artistdetail?id=' + e.currentTarget.dataset.id,
        })
    },
  });
  
  