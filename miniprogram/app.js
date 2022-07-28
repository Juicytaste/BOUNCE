//app.js
//注册自定义钩子
import CustomHook from 'spa-custom-hooks';
//globalData提出来声明
let globalData = {
  userInfo: {
    userId: '',
    avatarUrl:'',
    nickName:''
  }
}
CustomHook.install({
  'User':{
    name:'User',
    watchKey: 'userInfo.userId',
    onUpdate(val){
      //获取到userinfo里的userId则触发此钩子
      return !!val;
    }
  }
}, globalData || 'globalData')
// 正常走初始化逻辑
App({
  globalData,
  onLaunch() {
      if (!wx.cloud) {
        console.error('请使用 2.2.3 或以上的基础库以使用云能力');
      } else {
        wx.cloud.init({
            env: 'lazydog-5gl0c2v7b448-7bh22424848',
            traceUser:true
        });
      }
      wx.cloud.callFunction({
        name: 'get_openId',
        success: res => {
          setTimeout(()=>{
            //获取用户openid
            console.log(res.result.openid)
            this.globalData.userInfo.userId = res.result.openid
        },1000)
      }
    })
   }
})

