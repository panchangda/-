// pages/market/market.js
const util = require('../../utils/util.js'); //引入util类计算日期
Page({
  data: {
    //search value
    value: '',
    //分页加载
    pageNo: 0,
    pageSize: 10,
    params: {},
    //查询结果
    repos: [],
    resetRepos: true,
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
  onSearch() {
    console.log('@@keyword', this.data.value)
    this.setData({
      resetRepos: true,
      params: {},
    })
    this.getRepos()
  },
  onCancel() {
    console.log('@@cancel keyword', this.data.value)
    this.setData({
      value: '',
      resetRepos: true,
      params: {},
    })
    this.getRepos()
  },
  onChange(e) {
    // console.log(e)
    const {
      checkedItems,
      items,
      checkedValues,
    } = e.detail
    const params = {}
    console.log(checkedItems, items, checkedValues)
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
      resetRepos: true,
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


    const params = this.data.params;
    const pageSize = this.data.pageSize;
    const word = this.data.value;
    let pageNo = this.data.pageNo;
    //reset respos: pageNo should be 0
    if (this.data.resetRepos) {
      pageNo = 0;
      wx.showLoading({
        title: '加载中'
      });
    }else if(!this.data.noMoreRepos){
      this.setData({
        loading: true,
      })
    }
    const data = Object.assign({
      word,
      days: null,
      //  sort:'updated',
      sort: 'stars',
      order: 'desc',
      pageNo,
      pageSize,
    }, params)
    wx.cloud.callFunction({
      name: 'scheduleFilter',
      data,
      success: res => {
        console.log(res)
        wx.hideLoading()
        //reset repos
        if (this.data.resetRepos) {
          pageNo++;
          let repos = res.result.showRes;
          repos.forEach(repo => {
            repo.date = util.formatDate(new Date(repo.date)).replace(/-/g, '/')
          })
          this.setData({
            repos,
            resetRepos: false,
            pageNo,
            loading: false,
            noMoreRepos:false,
          })
        }
        //reachBottomLoad: concat repos
        else {
          console.log('@@REACHBOTTOM')
          if(this.data.noMoreRepos){
            console.log('@dontDoit')
            return
          }
          else if (res.result.showRes.length==0) {
            console.log('@noMoreRepos')
            this.setData({
              loading: false,
              noMoreRepos: true,
            })
          } else {
            let repos = this.data.repos;
            let newRepos = res.result.showRes;
            newRepos.forEach(repo => {
              repo.date = util.formatDate(new Date(repo.date)).replace(/-/g, '/')
            })
            let cartList = repos.concat(newRepos)
            pageNo++;
            this.setData({
              repos: cartList,
              pageNo,
              loading: false,
            })
          }
        }
      },
      fail: err => {
        console.log(err)
      },
    })
  },
  onClick(e) {
    // console.log('@@clicked item id',e.currentTarget.dataset.id)
    wx.navigateTo({
      url: '/pages/schedule/schedule',
      events: {
        acceptChangedData: function (data) {
          console.log(data)
          wx.cloud.callFunction({
            name: 'updateDiscoverStars',
            data: data.id,
          })
        }
      },
      success: function (res) {
        res.eventChannel.emit('acceptFromOpener', {
          id: e.currentTarget.dataset.id,
          from: 'discover',
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
  onReady: function () {},
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {},
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {},
  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {},
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.refresh()
    wx.stopPullDownRefresh()
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {},
  refresh() {
    this.setData({
      resetRepos: true,
    })
    this.getRepos()
  }
})