// app.js
App({
  onLaunch() {
    if(!wx.cloud){
      console.error('请使用2.2.3以上的基础库')

    }else{
      wx.cloud.init({
        env:'cloud1',
        traceUser:true,
      })
    }
  }
})
