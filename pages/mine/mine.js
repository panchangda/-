// pages/mine/mine.js

import Dialog from '../../miniprogram_npm/@vant/weapp/dialog/dialog';
var util = require('../../utils/util.js'); //引入util类计算日期
const app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    pastList: [{
      id: '0',
      date: '2021-5-7 - 2021-5-11',
      name: '重庆之旅',
      picList: ['http://tmp/MoxMpST2ge2E173da2ab0a5db71582b51ad2a3beeec4.png', 'http://tmp/MoxMpST2ge2E173da2ab0a5db71582b51ad2a3beeec4.png', 'http://tmp/MoxMpST2ge2E173da2ab0a5db71582b51ad2a3beeec4.png', 'http://tmp/MoxMpST2ge2E173da2ab0a5db71582b51ad2a3beeec4.png', 'http://tmp/MoxMpST2ge2E173da2ab0a5db71582b51ad2a3beeec4.png', 'http://tmp/MoxMpST2ge2E173da2ab0a5db71582b51ad2a3beeec4.png', ],
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
        name: "上传到发现",
      },
      {
        name: "分享行程",
      },
    ],
    
    //tmpTag( 0:past 1:now 2:future )
    tmpTag: 0,
    show: false,
    pageNo: 0,
    pageSize: 5,
    loading: false,
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.setData({
      loading: true
    })
    let pageNo = this.data.pageNo + 1;
    let date = util.formatDate(new Date());
    console.log("???")
    wx.cloud.callFunction({
      name: "schedulesByOpenID",
      data: {
        date: date,
        tmpTag: this.data.tmpTag,
        pageNo: this.data.pageNo,
        pageSize: this.data.pageSize,
      },
      success: res => {
        console.log(res.result)
        if (this.data.tmpTag == 0) {
          let pastList = this.data.pastList;
          let catList = pastList.concat(res.result);
          this.setData({
            pastList: catList,
            pageNo,
            loading: false,
          })
        } else {
          let futureList = this.data.futureList;
          let catList = futureList.concat(res.result);
          this.setData({
            futureList: catList,
            pageNo,
            loading: false,
          })
        }
      },
      failse: err => {
        console.log(err)
      }
    })
    console.log('@@onReachBottom triggered', pageNo)
  },
  onSelect(e) {
    console.log(e.detail)
// <<<<<<< dev-jyj
//     const date = util.formatDate(new Date());
//     if (e.detail.name == "行程详情") {
//     let res = wx.cloud.callFunction({
//       name: 'schedulesByOpenID',
//       data: {
//         date: date,
//       },
//     })
//     } else if (e.detail.name == "删除行程") {

//     }else if(e.detail.name=="分享行程"){

//     }
// =======
    const chosenName = this.data.chosenName;
    const chosenId = this.data.chosenId;
    const chosenDate = this.data.chosenDate;
    const startDate = chosenDate.split(' - ', 1)[0];
    if (e.detail.name == "行程详情") {
      //将开始日期放到globalData中 
      //在mymap页面取值设置页面date
      app.globalData.date = startDate;
      wx.switchTab({
        url: '../myMap/myMap'
      })
    } else if (e.detail.name == "删除行程") {
      Dialog.confirm({
          title: '确认要删除该行程吗',
          message: chosenName + ' ' + chosenDate,
        })
        .then(() => {
          // on confirm
        })
        .catch(() => {
          // on cancel
        });
    } else if (e.detail.name == "上传到发现") {

    } 
  },
  onClick(e) {
    console.log(e)
    this.setData({
      show: true,
      chosenId: e.currentTarget.dataset.id,
      chosenDate: e.currentTarget.dataset.date,
      chosenName: e.currentTarget.dataset.name,
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
  onTagChange() {
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
  onShareAppMessage: function (options) {
    console.log(options)
    if (options.from=='button') {
      let url = encodeURIComponent('/pages/schedule/schedule?id='+options.target.dataset.id)
      var promise = new Promise(resolve => {
        setTimeout(() => {
          resolve({
            title: '**你收到了一份崭新的行程单**'+ options.target.dataset.name,
            path: `/pages/myMap/myMap?url=${url}`,
            imageUrl:options.target.dataset.pic
          })
        }, 200)
      })
    }
    return {
      title: '**从今天开始出发**新一代旅行出行规划软件',
      path: '/pages/myMap/myMap',
      promise
    }
  },
})