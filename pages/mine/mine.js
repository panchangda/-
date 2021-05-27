// pages/mine/mine.js

import Dialog from '../../miniprogram_npm/@vant/weapp/dialog/dialog';
var util = require('../../utils/util.js'); //引入util类计算日期
const app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    pastList: [],
    futureList:[],
    actions: [{
      name:"编辑行程单",
      },{
        name: "在日程中查看",
      },
      {
        name: "删除行程",
      },
      {
        name: "上传到发现",
      },
    ],
    
    //tmpTag( 0:past 1:now 2:future )
    tmpTag: 0,
    show: false,
    pastPageNo: 0,
    futurePageNo:0,
    pageSize: 5,
    loading: false,
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    const date = util.formatDate(new Date());
    const tmpTag = this.data.tmpTag;
    const noMorePast = this.data.noMorePast;
    const noMoreFuture = this.data.noMoreFuture;
    const pageSize = this.data.pageSize;
    //pastList
    if(tmpTag==0){
      if(noMorePast)
        return;
      let pageNo = this.data.pastPageNo;
      if(pageNo==0)
          wx.showLoading({
            title:'加载中',
          });
      else{
        this.setData({
          loading:true
        })
      }
      console.log(date,tmpTag,pageNo,pageSize)
      wx.cloud.callFunction({
        name: "schedulesByOpenID",
        data: {
          date: date,
          tmpTag: tmpTag,
          pageNo: pageNo,
          pageSize: pageSize,
        },
        success:res=>{
          console.log('@@PAST SUCCESS',res)
          if(res.result.length==0){
            this.setData({
              loading: false,
              noMorePast:true,
            })
          }else{
            let pastList = this.data.pastList;
            let cartList = pastList.concat(res.result);
            this.setData({
              pastList: cartList,
              pastPageNo:pageNo+1,
              loading: false,
            })
          }
          wx.hideLoading();
          console.log('@@onReachBottom triggered pastList load to', pageNo)
        },
        fail:err=>{
          console.log('@@ERR',err)
        }
      })
    }else if(tmpTag==1){
      if(noMoreFuture)
        return;
      let pageNo = this.data.futurePageNo;
      if(pageNo==0)
          wx.showLoading();
      else{
        this.setData({
          loading:true
        })
      }
      console.log(date,tmpTag,pageNo,pageSize)
      wx.cloud.callFunction({
        name: "schedulesByOpenID",
        data: {
          date: date,
          tmpTag: tmpTag,
          pageNo: pageNo,
          pageSize: pageSize,
        },
        success:res=>{
          console.log('@@FUTURE SUCCESS',res)
          if(res.result.length==0){
            this.setData({
              loading: false,
              noMoreFuture:true,
            })
          }else{
            let pastList = this.data.futureList;
            let cartList = pastList.concat(res.result);
            this.setData({
              futureList: cartList,
              futurePageNo:pageNo+1,
              loading: false,
            })
          }
          wx.hideLoading();
          console.log('@@onReachBottom triggered futureList load to', pageNo)
        },
        fail:err=>{
          console.log('@@ERR',err)
        }
      })
    }

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
    if(e.detail.name == '编辑行程单'){
      wx.navigateTo({
        url: '/pages/schedule/schedule',
        success: function (res) {
          res.eventChannel.emit('acceptFromOpener', {
            id:chosenId,
            from:'mine',
          })
        },
      })
    } else if (e.detail.name == "在日程中查看") {
      //将开始日期放到globalData中 
      //在mymap页面取值设置页面date
      app.globalData.date = startDate;
      app.globalData.from = 'mine';
      wx.switchTab({
        url: '/pages/myMap/myMap'
      })
    } else if (e.detail.name == "删除行程") {
      Dialog.confirm({
          title: '确认要删除该行程吗',
          message: chosenName + ' ' + chosenDate,
        })
        .then(() => {
          // on confirm
          console.log(chosenId)
          wx.cloud.callFunction({
            name:'deleteSchedule',
            data:{
              scheduleID:chosenId,
            },
            success:res=>{
              console.log(res);
              this.onLoad({reload:true});
            },
            fail:err=>{
              console.log(err)
            }
          })
        })
        .catch(() => {
          // on cancel
          console.log('@@删除取消')
        });
    } else if (e.detail.name == "上传到发现") {
      //显示填写行程的对话框 对话框的确认按钮调用upLoadToDiscover上传
      this.setData({
        showUploadDialog:true,
      })
    } 
  },
  descriptionInput(){

  },
  upLoadToDiscover(){
    console.log(this.data.chosenId,this.data.discoverDescription)
    wx.cloud.callFunction({
      name:'uploadToDiscover',
      data:{
        scheduleID:this.data.chosenId,
        description:this.data.discoverDescription,
      },
      success:res=>{  
        console.log(res)
      },
      fail:err=>{
        console.log(err)
      }
    })
    this.setData({
      discoverDescription:'',
    })
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
    let tmpTag = this.data.tmpTag
    if(tmpTag==0)
      tmpTag=1;
    else tmpTag = 0;
    this.setData({
      tmpTag,
    })
    console.log('@@tmpTag switch to',this.data.tmpTag)
    this.selectComponent('#tabs').resize();
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if(options.reload){
      if(this.data.tmpTag==0){
        this.setData({
          tmpTag:0,
          pastList:[],
          pastPageNo:0,
        })
        this.onReachBottom()
      }
      else{
        this.setData({
          tmpTag:1,
          futureList:[],
          futurePageNo:0,
        })
        this.onReachBottom()
      }
    }else{
      this.onReachBottom()
      this.setData({
        tmpTag:1
      })
      this.onReachBottom()
    }
    
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