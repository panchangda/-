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
      picList: ['http://tmp/MoxMpST2ge2E173da2ab0a5db71582b51ad2a3beeec4.png','http://tmp/MoxMpST2ge2E173da2ab0a5db71582b51ad2a3beeec4.png','http://tmp/MoxMpST2ge2E173da2ab0a5db71582b51ad2a3beeec4.png','http://tmp/MoxMpST2ge2E173da2ab0a5db71582b51ad2a3beeec4.png','http://tmp/MoxMpST2ge2E173da2ab0a5db71582b51ad2a3beeec4.png','http://tmp/MoxMpST2ge2E173da2ab0a5db71582b51ad2a3beeec4.png',],
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

    //tmpTag( 0:past 1:future )
    tmpTag:0,
    show: false,
    pageNo: 0,
    pageSize: 5,
    loading: true,
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    let pageNo = this.data.pageNo + 1;
    wx.cloud.callFunction({
      name:"getPersonalSchedule",
      data:{
        tmpTag:this.data.tmpTag,
        pageNo:this.data.pageNo,
        pageSize:this.data.pageSize,
      },
      success:res=>{
        console.log(res.result)
        if(!this.data.tmpTag){
          let pastList = this.data.pastList;
          let catList = pastList.concat(res.result);
          this.setData({
            pastList:catList,
            pageNo,
          })
        }else{
          let futureList = this.data.futureList;
          let catList = futureList.concat(res.result);
          this.setData({
            futureList:catList,
            pageNo,
          })
        }
      }
    })
    console.log('@@onReachBottom triggered', pageNo)
  },
  onSelect(e) {
    console.log(e.detail)
    if(e.detail.name=="行程详情"){

    }else if(e.detail.name=="删除行程"){

    }else if(e.detail.name=="分享行程"){

    }
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
  onTagChange(){
    this.selectComponent('#tabs').resize();
    console.log('@@resized')
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
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})