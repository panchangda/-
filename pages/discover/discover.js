// pages/market/market.js
Page({
  data: {
    //search value
    value:'',
    //分页加载
    pageNo:0,
    pageSize:10,
    //查询结果
    repos:[],
    //筛选列表
    items: [{
        type: 'filter',
        label: '筛选',
        value: 'filter',
        children: [{
          type: 'checkbox',
          label: '天数',
          value: 'days',
          children: [{
              label: '1',
              value: '1',
            },
            {
              label: '2',
              value: '2',
            },
            {
              label: '3',
              value: '3',
            },
            {
              label: '4',
              value: '4',
            },
            {
              label: '5',
              value: '5',
            },
            {
              label: '6',
              value: '6',
            },
            {
              label: '7',
              value: '7',
            },
            {
              label: '8',
              value: '8',
            },
            {
              label: '9',
              value: '9',
            },
            {
              label: '10',
              value: '10',
            },
            {
              label: '11',
              value: '11',
            },
            {
              label: '12',
              value: '12',
            },
            {
              label: '13',
              value: '13',
            },
            {
              label: '14',
              value: '14',
            },
          ],
        }, ],
        groups: ['001', '002'],
      },
      {
        type: 'text',
        label: '收藏数',
        value: 'stars',
        checked: 'true',
        groups: ['001'],
      },
      {
        type: 'radio',
        label: '上传时间',
        value: 'updated',
        children: [{
            label: '最近上传',
            value: 'desc',
          },
          {
            label: '最早上传',
            value: 'asc',
          },
        ],
        groups: ['002'],
      },
    ]
  },
  onSearch(){
    console.log('@@keyword',this.data.value)
  },
  onChange(e) {
    // console.log(e)
    const {
      checkedItems,
      items,
      checkedValues
    } = e.detail
    const params = {}
    // console.log(checkedItems, items, checkedValues)
    checkedItems.forEach((n) => {
      if (n.checked) {
        if (n.value === 'updated') {
          const selected = n.children.filter((n) => n.checked).map((n) => n.value).join(' ')
          params.sort = n.value
          params.order = selected
        } else if (n.value === 'stars') {
          params.sort = n.value
          params.order = n.sort === 1 ? 'asc' : 'desc'
        } else if (n.value === 'filter') {
          n.children.filter((n) => n.selected).forEach((n) => {
            if (n.value === 'days') {
              const selected = n.children.filter((n) => n.checked).map((n) => n.value).join(' ')
              params.days = selected
            } 
          })
        }
      }
    })
    console.log('params', params)
    this.setData({
      params,
      resetRepos:true,
    })
    this.getRepos()
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
      url: '../schedule/schedule',
      events: {
        acceptChangedData: function (data) {
          console.log(data)
          wx.cloud.callFunction({
            name:'updateDiscoverStars',
            data:data.id,
          })
        }
      },
      success: function (res) {
        res.eventChannel.emit('acceptDiscoverPageData', {
          id:e.currentTarget.dataset.id,
        })
      },
    })
  },
    /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.getRepos()
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getRepos()
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
  onUnload: function () {},
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {},
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {},
})