// pages/mine/mine.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pastList: [{
      id: '0',
      date: '2021-5-7 - 2021-5-11',
      name: '重庆之旅',
      picList: [],
    }, {
      id: '1',
      date: '2021-5-7 - 2021-5-11',
      name: '重庆之旅',
      picList: [],
    }, {
      id: '2',
      date: '2021-5-7 - 2021-5-11',
      name: '重庆之旅',
      picList: [],
    }, ],
    futureList: [{
      id: '10',
      date: '2021-6-8 - 2021-6-11',
      name: '上海之旅',
      picList: [],
    }, {
      id: '11',
      date: '2021-6-8 - 2021-6-11',
      name: '上海之旅',
      picList: [],
    }, {
      id: '12',
      date: '2021-6-8 - 2021-6-11',
      name: '上海之旅',
      picList: [],
    }, {
      id: '13',
      date: '2021-6-8 - 2021-6-11',
      name: '上海之旅',
      picList: [],
    }, ],
    actions: [{
        name: "行程详情",
      },
      {
        name: "删除行程",
      },
      {
        name: "分享行程",
      }
    ],
    show: false,
    pageNo: 0,
    pageSize: 5,
    loading: true,
  },
  onClick(e) {
    console.log(e)
    this.setData({
      show: true,
    })
  },
  onClose() {
    this.setData({
      show: false,
    })
  },
  onCancel() {
    this.setData({
      show: false,
    })
  },
  onSelect(e) {
    console.log(e.detail)
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
    let pageNo = this.data.pageNo + 1;
    let content = this.data.content;
    for (let i = 0; i < this.data.pageSize; i++)
      content.push("2021/5/7 - 2021/5/8 重庆之旅");
    this.setData({
      content,
      pageNo,
    })
    console.log('@@onReachBottom triggered', pageNo)
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})