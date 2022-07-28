const api= require("../../api/api");
const db=wx.cloud.database();

Page({
	data: {
		searchHistory: [],
		hotData: [],
		content:"",
		showinfo:[] //装着查询到的数据
	},
	/**
	 * 搜索事件
	 * @param {Object} e 
	 */
	search(e){
		this.setData({
			searchHistory: [...this.data.searchHistory,e.detail.value]
		})
	},
	/**
	 * 取消搜索事件
	 */
	cancelSearch(){
		wx.navigateBack({
			delta: 1,
		})
	},
	/**
	 * 清空历史记录
	 */
	clearHistory(){
		this.setData({
			searchHistory: []
		})
	},
	onShow(){
		this.getHotData();
	},
	getHotData(){
		api.find("Shows",{},0,6).then(res=>{
			this.setData({
				hotData:res.data
			})
			console.log(res.data)
		})
	},
	toDetail(e){
        wx.navigateTo({
            url: '/pages/detail/detail?id=' + e.currentTarget.dataset.id,
          })
	  },
	search(e){
        let title =this.data.content;
        console.log("title:",title)
		//调用云函数
		wx.cloud.callFunction({
			name:'fuzzySearch',
			data:{
				_keyword:title
			}
		}).then(res=>{
            console.log("res",res)
            if(res.result != null){
                this.setData({
                    showinfo:res.result.data
                })
                let str = JSON.stringify(this.data.showinfo);
                wx.navigateTo({
                    url: '/pages/searchResult/searchResult?data='+ encodeURIComponent(str),
                })	
            }
            else{
                wx.showToast({
                    title: '没有找到',
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
	}
})