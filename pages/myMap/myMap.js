const app = getApp()
//在es6转es5的同时 使用async/await新特性
import regeneratorRuntime from '../../libs/runtime';
//引入util类计算日期
var util = require('../../utils/util.js');
// 引入SDK核心类
var QQMapWX = require('../../libs/qqmap-wx-jssdk.js');
// 实例化API核心类
var qqmapsdk = new QQMapWX({
  key: 'ND6BZ-NKOCX-ZS34B-ZKTED-HTCLJ-ZDBOB' // 必填
});
var mapSetting = {
  subkey: 'ND6BZ-NKOCX-ZS34B-ZKTED-HTCLJ-ZDBOB',
  // longitude: 106.301919,
  // latitude: 29.603818,
  scale: 12,
  layerStyle: 1,
  showLocation: true,
};
const milSecsInOneDay = 24 * 60 * 60 * 1000;
// const query = wx.createSelectorQuery();
// const MapContext = query.select('map');
// const MapContext = wx.createMapContext('map');

Page({
  data: {
    //map data
    mapSetting: mapSetting,
    markers: [],
    polyline: [],
    title: '',
    dest: '',
    tmpDay: 0,

    //date info
    hasSchedule: false,
    date: "",

    //mainPage data
    showSelect: false,
    // minCalendarDate:'2021-5-7',
    // defaultCalendarDate:util.formatDate()

    //subPage data
    showSubPage: true,
    //calendar
    showCalendar: false,
    minDate: new Date(2021, 4, 7).getTime(),
    maxDate: new Date(2021, 4, 31).getTime(),
    //wxp-drag data
    count:0,
    isIphoneX: app.globalData.isIphoneX,
    size: 1,
    listData: [],
    scrollTop: 0,
    pageMetaScrollTop: 0,

  },

  //天才般的同步处理
  onLoad: function () {
    var date = util.formatDate(new Date());
    if (date) {
      this.setData({
        date: date
      })
    } else {
      console.log('CANNOT GET DATE!!!!!!')
    }
    this.drag = this.selectComponent('#drag');
    this.load_today(date);
    


  },
  onShow: function () {},
  onReady: function () {},
  async load_today(date) {
    wx.showLoading({
      title: '加载中',
    })
    let res = await wx.cloud.callFunction({
      name: 'findTodaySchedule',
      data: {
        dateString: JSON.stringify(date)
        //+" 00:00:00.000"
      },
    })
    // console.log(res)
    if (res.result && res.result.list.length) {
      let markerPoints = [];
      let lonAndlat = [];
      let listData =[];
      for (var i = 0; i < res.result.list[0].locs.coordinates.length; i++) {
        let addrDescrip = await this.getAddrDescrip(res.result.list[0].locs.coordinates[i][0], res.result.list[0].locs.coordinates[i][1])
        markerPoints.push({
          id: i,
          longitude: res.result.list[0].locs.coordinates[i][0],
          latitude: res.result.list[0].locs.coordinates[i][1],
          width: 60,
          height: 60,
          iconPath: '../../resources/marker.png', //图标路径
          customCallout: { //自定义气泡
            display: "ALWAYS", //显示方式，可选值BYCLICK
            anchorX: 0, //横向偏移
            anchorY: 20,
          },
        })
        lonAndlat.push({
          longitude: res.result.list[0].locs.coordinates[i][0],
          latitude: res.result.list[0].locs.coordinates[i][1],
        })
        //listData对象的draId必须为唯一 所以采用count++自加
        listData.push({
          dragId: `item${this.data.count++}`,
          title: addrDescrip.result.address,
          description: '',
          // images: "/assets/image/swipe/1.png",
          fixed: false,
        })
      }
      this.setData({
        hasSchedule: true,
        title: res.result.list[0].title,
        dest: res.result.list[0].dest,
        tmpDay: res.result.list[0].dayNmb,
        markers: markerPoints,
        polyline: [{
          points: lonAndlat,
          color: "#DC143C",
          width: 8,
        }],
        includePoints:lonAndlat,
        listData:listData,
      })
      console.log(this.data.listData)
      //先更新listData后再init()
      this.drag.init()


    } else {
      this.setData({
        hasSchedule: false
      })
    }
    
    wx.hideLoading()
  },
  getAddrDescrip: function (longitude, latitude) {
    return new Promise((resolve, reject) => {
      qqmapsdk.reverseGeocoder({
        location: {
          longitude: longitude,
          latitude: latitude,
        },
        success: res => {
          console.log('@@@resolved', res)
          resolve(res)
        },
        fail: err => {
          console.log('@@@rejected', err)
          reject(err)
        }
      })
    })
  },
  onCalendarDisplay() {
    this.setData({
      showCalendar: true
    });
  },
  onCalendarClose() {
    this.setData({
      showCalendar: false
    });
  },
  onCalendarConfirm(e) {
    this.setData({
      showCalendar: false,
      date: util.formatDate(e.detail)
    });
    this.load_today(this.data.date)
  },
  load_yesterday: function () {
    //获取前一天日期并更改date
    //Date.parse():静态方法 转换为毫秒数 
    //dataobj.setTime():动态方法 用毫秒设定Date
    let secs = Date.parse(this.data.date) - milSecsInOneDay;
    let d = new Date();
    d.setTime(secs);
    let yesterDate = util.formatDate(d)
    // var yesterDate = util.formatDate(new Date(this.data.date))
    // console.log(yesterDate)
    this.setData({
      date: yesterDate
    })
    //使用load_today加载
    this.load_today(yesterDate)
  },
  load_tomorrow: function () {
    //获取后一天日期并更改date
    let secs = Date.parse(this.data.date) + milSecsInOneDay;
    let d = new Date();
    d.setTime(secs);
    let tomorrowDate = util.formatDate(d)
    this.setData({
      date: tomorrowDate
    })
    //使用load_today加载
    this.load_today(tomorrowDate)
  },

  //触发关键词输入提示事件
  get_suggestion: function (e) {
    var _this = this;
    //调用关键词提示接口
    qqmapsdk.getSuggestion({
      //获取输入框值并设置keyword参数
      keyword: e.detail, //用户输入的关键词，可设置固定值,如keyword:'KFC'
      //region:'北京', //设置城市名，限制关键词所示的地域范围，非必填参数
      success: function (res) { //搜索成功后的回调
        console.log(res);
        var sug = [];
        for (var i = 0; i < res.data.length; i++) {
          sug.push({ // 获取返回结果，放到sug数组中
            title: res.data[i].title,
            id: res.data[i].id,
            addr: res.data[i].address,
            city: res.data[i].city,
            district: res.data[i].district,
            latitude: res.data[i].location.lat,
            longitude: res.data[i].location.lng
          });
        }
        _this.setData({ //设置suggestion属性，将关键词搜索结果以列表形式展示
          suggestion: sug,
          showSelect: true,
        });
      },
      fail: function (error) {
        console.error(error);
      },
      complete: function (res) {
        console.log(res);
      }
    });
  },
  clear_search() {
    this.setData({
      suggestion: [],
      chosenLocation: '',
      showSelect: false
    })
  },
  add_location(e) {
    var id = e.currentTarget.id;
    for (var i = 0; i < this.data.suggestion.length; i++) {
      if (i == id) {
        //加入到listData数组
        let listData = this.data.listData;
        listData.push({
          dragId: `${this.data.count++}`,
          title: this.data.suggestion[i].title,
          description: this.data.suggestion[i].addr,
          // images: "/assets/image/swipe/1.png",
          fixed: false,
        });
        setTimeout(() => {
          this.setData({
            listData
          });
          this.drag.init();
        }, 300)
        break;
      }
    }
    this.setData({
      showSelect:false,
      chosenLocation:'',
    })
  },  
  add_schedule: function () {
    var currendate = this.data.date
    console.log(currendate)
    wx.navigateTo({
      url: '../schedule/schedule',
      success: function (res) {
        res.eventChannel.emit('acceptDataFromOpenerPage', {
          data: currendate,
          type: 'new',
        })
      },
    })
  },
  edit_schedule:function(){
    var currendate = this.data.date
    wx.redirectTo({
      url: '../schedule/schedule',
      success: function (res) {
        res.eventChannel.emit('acceptDataFromOpenerPage', {
          data: currendate,
          type: 'edit',
        })
      },
    })
  },
  route_planning: function (e) {
    var MapContext = wx.createMapContext('map');

    for (var i = 0; i < this.data.markers.length; i++) {
      if (this.data.markers.id == e.detail) {
        longitude = this.data.markers.longitude;
        latitude = this.data.markers.latitude;
      };
    }
    // console.log(MapContext);
    // console.log(e.detail)
    MapContext.openMapApp({
      longitude: 100,
      latitude: 80,
      destination: 'HELL',
    })
  },

  //subPage func

  show_subpage() {
    this.setData({
      showSubPage: true
    })
  },

  exit_subpage() {
    this.setData({
      showSubPage: false
    })
  },

  //wxp-drag func
  sortEnd(e) {
    console.log("sortEnd", e.detail.listData)
    this.setData({
      listData: e.detail.listData
    });
  },
  change(e) {
    console.log("change", e.detail.listData)
  },

  sizeChange(e) {
    wx.pageScrollTo({
      scrollTop: 0
    })
    this.setData({
      size: e.detail.value
    });
    this.drag.columnChange();
  },
  itemDelete(e){
    console.log("delete",e)
    let listData = this.data.listData
    listData.splice(e.detail.key,1)
    setTimeout(() => {
      this.setData({
        listData
      });
      this.drag.init();
    }, 300)
  },

  itemClick(e) {
    wx.navigateTo({
      url: '../edit/edit',
      events: {
        acceptChangedData: function (data) {
          console.log(data) //这是从B页面向A页面传输的数据
        }
      },
      success: function (res) {
        res.eventChannel.emit('acceptOriginalData', {
          title: e.detail.data.title,
          description: e.detail.data.description,
          picList: [{}],
        })
      },
    })
    console.log(e);
  },
  toggleFixed(e) {
    let key = e.currentTarget.dataset.key;
    let {
      listData
    } = this.data;

    listData[key].fixed = !listData[key].fixed

    this.setData({
      listData: listData
    });
  },

  scroll(e) {
    console.log('@@@View')
    console.log(e.detail.scrollTop)

    this.setData({
      pageMetaScrollTop: e.detail.scrollTop
    })

  },

  // 页面滚动
  onDragScroll(e) {
    console.log('@@@Drag')
    console.log(e.detail.scrollTop)
    this.setData({
      scrollTop: e.detail.scrollTop,
    });
  }
})