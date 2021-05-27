// pages/edit/edit.js
import regeneratorRuntime from '../../libs/runtime'; //在es6转es5的同时 使用async/await新特性
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    picList: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // console.log(options)
    const eventChannel = this.getOpenerEventChannel()
    eventChannel.once('acceptOriginalData', (data) => {
      console.log(data)
      this.setData({
        title: data.title,
        description: data.description,
        picList:data.picList,
      })
    })
  },
  //组件删除出现问题 拿回调参数重写delete
  delete(e) {
    // console.log(e)
    let picList = this.data.picList;
    if (picList[e.detail.index].url == e.detail.file.url) {
      picList.splice(e.detail.index, 1);
      this.setData({
        picList,
      })
    }
    else{
      console.log("@@@组件删除方法重新生效了")
    }
  },
  afterRead(e) {
    var that = this;
    wx.showLoading({
      title: '上传中',
    })
    this.uploadPics(e.detail.file).then(picList=>{
      console.log(picList)
      that.setData({
        picList,
      })
      wx.hideLoading({})
    })
  },
  async uploadPics(file){
    const picList = this.data.picList
    for (let i = 0; i < file.length; i++) {
        const Ext = GetFileExt(file[i].url);
        console.log("?")
        let res = await wx.cloud.uploadFile({
          cloudPath:'image/' + Math.round(Math.random()*1000000) + Ext,
          filePath:file[i].url,
        })
        picList.push({
          url: res.fileID,
          deletable: true,
        })
    }
    return picList;
  },
  //emit data to openerPage
  onUnload: function () {
    app.globalData.from ='edit';
    const eventChannel = this.getOpenerEventChannel();
    eventChannel.emit('acceptChangedData', {
      description: this.data.description,
      picList:this.data.picList,
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

//提取文件tmp名
function GetFileExt(filepath) {
  if (filepath != "") {
    console.log(filepath)
      var pos = filepath.replace(/.+\//, "");
      return pos;
  }
}