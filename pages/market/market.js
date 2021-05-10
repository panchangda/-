// pages/market/market.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    index:0,
    timeRange:['1','2','3','4','5','6','7'],
    recmdList:[{
      id:0,
      desName:'Shanghai',
      days:3,
      recmdTimes:2000
    },{
      id:1,
      desName:'Beijing',
      days:4,
      recmdTimes:1998
    },
  ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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

  },
  bind_pickerchange:function(e){
    this.setData({
      index: e.detail.value
    })
  },
  show_schedule:function(e){
    // console.log(e)
    wx.navigateTo({
      url: '../showSchedule/showSchedule',
      success:function(res){
        res.eventChannel.emit('acceptDataFromOpenerPage',{data:e.currentTarget.dataset.index})
      },
    })
  }
})