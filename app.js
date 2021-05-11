// app.js
App({
  onLaunch() {
    if(!wx.cloud){
      console.error('请使用2.2.3以上的基础库')

    }else{
      wx.cloud.init({
        env:'cloud1-6g5yb47ucf4576d8',
        traceUser:true,
      })
      // this.get_openid()
    }
    this.globalData={}
  },
  get_openid:function(){
    wx.cloud.callFunction({
      name : 'login',
      data: {},
      success: res=>{
        console.log('openid: '+res.result.openid)
        this.globalData.openid=res.result.openid
        this.globalData.unionid=res.result.unionid
        this.globalData.appid=res.result.addip
      },
      fail:err=>{
        console.log('CAN\'t GET OPENID')
      }
    })
  },
  test_cloudFuncAdd:function(){
    wx.cloud.callFunction({
      name : 'add',
      data: {a:1,b:2},
      success: res=>{
        console.log(res.result)
      },
      fail: err=>{
        console.log(err)
      }
    })
  },
})
