// pages/edit/edit.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    picList:[{
      url: 'https://img.yzcdn.cn/vant/leaf.jpg',
    },{
      url: 'http://iph.href.lu/60x60?text=default',
    },]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // console.log(options)
    const eventChannel = this.getOpenerEventChannel()

    eventChannel.once('acceptOriginalData',(data)=>{
      console.log(data)
      this.setData({
        title:data.title,
        description:data.description,
        picList:data.picList,
      })
    })  

    eventChannel.emit('acceptChangedData',{
      title:'SHIT!',
      description:'STILL SHIT!',
      picList:[{}],
    })

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})