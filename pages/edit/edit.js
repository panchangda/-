// pages/edit/edit.js
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
    // console.log(e)
    const picList = this.data.picList
    for (let i = 0; i < e.detail.file.length; i++) {
        const Ext = GetFileExt(e.detail.file[i].url);
        wx.cloud.uploadFile({
          cloudPath:'image/' + Math.round(Math.random()*1000000) + Ext,
          filePath:e.detail.file[i].url,
          success(res){
            console.log(res)
            picList.push({
              url: res.fileID,
              deletable: true,
            })
          }
        })
    }
    this.setData({
      picList,
    })
  },
  //emit data to openerPage
  onUnload: function () {
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