import pinyin from "wl-pinyin"
var QQMapWX = require('../../utils/qqmap-wx-jssdk');
Page({
    data:{
        hotartist:[],
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
    clickletter(Event){
        console.log(Event)
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
  
  