let Y,M,D,YMid,YMDid,YM
let temp_list = []
let show_list = []
var timestamp = Date.parse(new Date());
var date = new Date(timestamp);
var minDate,maxDate
Y = date.getFullYear();
M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
D = ''
YM = Y + '-' + M

let RG = "广州"
let cyear,cmonth
let tof
const db = wx.cloud.database()
Page({
    data: {
        show_list:[],
        show_nums:0,
        checked: false,
        date:YM,
        region: ["广州市"],
        color:"#3399ff",
        minDate: new Date(2022,4, 1).getTime(),
        maxDate: new Date(2022,4, 31).getTime(),
    },
        //处理时间格式
    onLoad(options) {
      console.log(options)
      if(options != undefined && options.flag == "1"){
        Y = date.getFullYear()
        M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1)
        D = ''
        RG = "广州"
      }
        YMDid = Y + M + D
        if(D != ''){
          this.setData({
            checked:false
          })
        }
        db.collection('Shows').where({
            city:RG,
            date_id:db.RegExp({
                regexp:YMDid + '.*',
                options:'i',
            })
        }).get()
        .then(res => {
            console.log(res.data)
            this.setData({
                show_list:res.data
            })
        })
    },
    bindDateChange: function(e) {
        var str = e.detail.value.split('-')
        var d = new Date(str[0], str[1], 0);
        cyear = str[0]
        cmonth = str[1]
        Y = cyear
        M = cmonth
        D = ''
        console.log(cyear,cmonth)
        this.setData({
            date: e.detail.value,
            minDate: new Date(cyear, cmonth-1, 1).getTime(),
            maxDate: new Date(cyear, cmonth-1, d).getTime(),
        })
        this.onLoad()
      },
      bindRegionChange(e){
          RG = e.detail.value[1][0] + e.detail.value[1][1]
          this.setData({
              region:e.detail.value[1]
          })
          this.onLoad()
      },
      selectedday(e){
          var getday = e.detail.getDate()
          D = (getday < 10 ? '0' + getday : getday);
          this.onLoad()
      },
      goDetail(e){
        wx.navigateTo({
          url: '/pages/detail/detail?id=' + e.currentTarget.dataset.id,
        })
    },
      onChange({ detail }) {
        tof = detail
        if(tof == true){
          D = ''
          this.onLoad()
        }
        // 需要手动对 checked 状态进行更新
        this.setData({ checked: detail });
      }
  });