// pages/market/market.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    index:0,
    timeRange:['1','2','3','4','5','6','7','8','9','10','11','12','13','14'],
    recmdList:[{
      id:0,
      title:'大世界之旅',
      dest:'Shanghai',
      days:3,
      addedTimes:2000
    },{
      id:1,
      title:'首都之行',
      dest:'Beijing',
      days:4,
      addedTimes:1998
    },{
      id:2,
      title:'大千杭城无奇不有',
      desName:'Hangzhou',
      days:4,
      addedTimes:1500
    },
  ]
  },
  bind_pickerchange:function(e){
    this.setData({
      index: e.detail.value
    })
  },
  getRepos() {
    // let test = {
    //   id:'12345678',
    //   pic:'http://tmp/MoxMpST2ge2E173da2ab0a5db71582b51ad2a3beeec4.png',
    //   name:'大世界之旅',
    //   description:'Follow Jeremy, Richard, and James, as they embark on an adventure across the globe. Driving new and exciting automobiles from manufactures all over the world.',
    //   days:11,
    //   date:'2020-10-1',
    //   stars:2000,
    // };
    // let repos =[]
    // for(let i=0;i<5;i++)
    //   repos.push(test)
    // this.setData({
    //   repos,
    // })

    //wx.showLoading();
    const params = this.data.params;
    const pageSize = this.data.pageSize;
    let pageNo = this.data.pageNo;
    //reset respos: pageNo should be 0
    if(this.data.resetRepos)  pageNo = 0;
    const data = Object.assign({
      days:123,
      //  sort:'updated',
      sort:'stars',
      order: 'desc',
      pageNo,
      pageSize,
    },params)
    wx.cloud.callFunction({
      name:'scheduleFilter',
      data,
      success:res=>{
        console.log(res)
        wx.hideLoading()
        //reset repos
        if(this.data.resetRepos){
          pageNo++;
          this.setData({
            repos:res.result.xxx,
            resetRepos:false,
            pageNo,
          })
        }
        //reachBottomLoad: concat repos
        else{
          let repos = this.data.repos;
          repos.concat(res.result.xxx)
          pageNo++;
          this.setData({
            repos,
            pageNo,
          })
          }
      },
      fail:err=>{
        console.log(err)
      }, 
    })
  },
  onClick(e){
    // console.log('@@clicked item id',e.currentTarget.dataset.id)
    wx.navigateTo({
      url: '../showSchedule/showSchedule',
      success:function(res){
        res.eventChannel.emit('acceptDataFromOpenerPage',{data:e.currentTarget.dataset.index})
      },
    })
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
})