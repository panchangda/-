const app = getApp()
let plugin = requirePlugin('routePlan');
import regeneratorRuntime from '../../libs/runtime'; //在es6转es5的同时 使用async/await新特性
var util = require('../../utils/util.js'); //引入util类计算日期
var QQMapWX = require('../../libs/qqmap-wx-jssdk.js'); // 引入SDK核心类 实例化
var qqmapsdk = new QQMapWX({
  key: 'ND6BZ-NKOCX-ZS34B-ZKTED-HTCLJ-ZDBOB'
});
//地图基本设置
var mapSetting = {
  subkey: 'ND6BZ-NKOCX-ZS34B-ZKTED-HTCLJ-ZDBOB',
  // longitude: 106.301919,
  // latitude: 29.603818,
  // scale: 12,
  layerStyle: 1,
  showLocation: true,
};
const milSecsInOneDay = 24 * 60 * 60 * 1000;
// const MapContext = wx.createMapContext('#map');

Page({
  data: {
    //main data
    name: '',
    listData: [],
    polyline: [],
    logAndLats: [],
    scheduleID: '',
    count: 0,

    //map data
    mapSetting: mapSetting,

    //date info
    hasSchedule: false,
    date: "",

    //mainPage data
    showSelect: false,

    //subPage data
    showSubPage: true,

    //calendar
    showCalendar: false,
    minDate: new Date(2021, 4, 7).getTime(),
    maxDate: new Date(2021, 4, 31).getTime(),

    //wxp-drag data
    isIphoneX: app.globalData.isIphoneX,
    size: 1,
    listData: [],
    scrollTop: 0,
    pageMetaScrollTop: 0,
  },

  //天才般的同步处理
  onLoad: function (options) {
    if(options.url){
      let url=decodeURIComponent(options.url);
      wx.redirectTo({
        url
      })
    }
  },
  onShow: function () {
    if (!app.globalData.date) {
      var date = util.formatDate(new Date());
      if (date) {
        this.setData({
          date: date,
          todayDate: new Date(date).getTime(),
        })
      } else {
        console.log('@@@Error:CAN NOT GET DATE')
      }
    } else {
      var date = app.globalData.date
      this.setData({
        date,
        todayDate: new Date(date).getTime(),
      })
      app.globalData.date = '';
    }
    this.drag = this.selectComponent('#drag');
    // this.load_today(date);
    this.load(date);
  },
  onReady: function () {},

  async load(date) {
    wx.showLoading({
      title: '加载中',
    })
    // let res = await wx.cloud.callFunction({
    //   name: 'findTodaySchedule',
    //   data: {
    //     date: this.data.date,
    //   },
    // })
    let res = await wx.cloud.callFunction({
      name: 'findTodaySchedule',
      data: {
        dateString: JSON.stringify(date),
        //+" 00:00:00.000"
      },
    })
    if (res.result && res.result.list.length) {
      const targetDay = getDaysBetween(res.result.list[0].beginDate, date)
      this.setData({
        hasSchedule: true,
        name: res.result.list[0].name,
        listData: res.result.list[0].allDatesData[targetDay - 1].listData,
        polyline: res.result.list[0].allDatesData[targetDay - 1].polyline,
        logAndLats: res.result.list[0].allDatesData[targetDay - 1].logAndLats,
        count: res.result.list[0].allDatesData[targetDay - 1].count,
      })
    } else {
      this.setData({
        hasSchedule: false
      })
    }
    this.drag.init()
    wx.hideLoading()

    //refresh include-points
    this.FUCKYOUWXSHITAPI()
  },

  //对页面数据进行操作后的更新
  async update() {
    console.log(this.data.date)
    wx.cloud.callFunction({
      name: 'updateTodaySchedule',
      data: {
        dateString: (this.data.date),
        listData: this.data.listData,
        polyline: this.data.polyline,
        logAndLats: this.data.logAndLats,
        count: this.data.count,
      }
    })
    console.log("update")
  },
  FUCKYOUWXSHITAPI() {
    let MapContext = wx.createMapContext("map");
    MapContext.includePoints({
      points: this.data.logAndLats,
      padding: [80, 80, 80, 80, ],
    })
  },

  // async load_today(date) {
  //   wx.showLoading({
  //     title: '加载中',
  //   })
  //   let res = await wx.cloud.callFunction({
  //     name: 'findTodaySchedule',
  //     data: {
  //       dateString: JSON.stringify(date),
  //       //+" 00:00:00.000"
  //     },
  //   })
  //   console.log(res)

  //   if (res.result && res.result.list.length) {
  //     let markerPoints = [];
  //     let lonAndlat = [];
  //     let listData = [];
  //     //第i天有几个点全部标识出来
  //     const targetDay = getDaysBetween(res.result.list[0].beginDate,date)
  //     for (var i = 0; i < res.result.list[0].allDatesData[targetDay-1].count; i++) {
  //       let longtitude = res.result.list[0].allDatesData[targetDay-1].logAndLats[0].longitude
  //       let latitude = res.result.list[0].allDatesData[targetDay-1].logAndLats[0].latitude
  //       let addrDescrip = await this.getAddrDescrip(longtitude, latitude)
  //       markerPoints.push({
  //         id: i,
  //         longitude: longtitude,
  //         latitude: latitude,
  //         width: 60,
  //         height: 60,
  //         iconPath: '../../resources/marker.png', //图标路径
  //         customCallout: { //自定义气泡
  //           display: "ALWAYS", //显示方式，可选值BYCLICK
  //           anchorX: 0, //横向偏移
  //           anchorY: 20,
  //         },
  //       })
  //       lonAndlat.push({
  //         longitude: longtitude,
  //         latitude: latitude,
  //       })
  //       //listData对象的draId必须为唯一 所以采用count++自加
  //       listData.push({
  //         dragId: `item${this.data.count++}`,
  //         title: addrDescrip.result.address,
  //         description: '',
  //         // images: "/assets/image/swipe/1.png",
  //         fixed: false,
  //       })
  //     }
  //     this.setData({
  //       hasSchedule: true,
  //       title: res.result.list[0].name,
  //       //dest: res.result.list[0].dest,
  //       //tmpDay: res.result.list[0].dayNmb,
  //       dest: "???",
  //       tmpDay: targetDay,
  //       markers: markerPoints,
  //       polyline: [{
  //         points: lonAndlat,
  //         color: "#DC143C",
  //         width: 8,
  //       }],
  //       includePoints: lonAndlat,
  //       listData: listData,
  //     })
  //     console.log(this.data)
  //     //先更新listData后再init()
  //     this.drag.init()
  //   } else {
  //     this.setData({
  //       hasSchedule: false
  //     })
  //   }
  //   wx.hideLoading()
  // },
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
    this.load(this.data.date)
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
    this.load(yesterDate)
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
    this.load(tomorrowDate)
  },

  //触发关键词输入提示事件
  get_suggestion: function (e) {
    var _this = this;
    if (e.detail == '') {
      this.setData({
        suggestion: [],
        chosenLocation: '',
        showSelect: false
      })
      return;
    }
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
    console.log(this.data.listData)
    var id = e.currentTarget.id;
    for (var i = 0; i < this.data.suggestion.length; i++) {
      if (i == id) {
        //加入到listData数组
        let listData = this.data.listData;
        let logAndLats = this.data.logAndLats;
        logAndLats.push({
          latitude: this.data.suggestion[i].latitude,
          longitude: this.data.suggestion[i].longitude,
        })
        listData.push({
          //drag data
          dragId: `item${this.data.count}`,
          title: this.data.suggestion[i].title,
          description: this.data.suggestion[i].addr,
          picList: [],
          fixed: false,

          //markers data
          sortKey: this.data.listData.length,
          id: this.data.count++,
          longitude: this.data.suggestion[i].longitude,
          latitude: this.data.suggestion[i].latitude,
          width: 60,
          height: 60,
          iconPath: '../../resources/marker.png', //图标路径
          callout: {
            content: (this.data.listData.length + 1).toString(),
            fontSize: 18,
            color: '#ff9966',
            textAlign: 'center',
            borderRadius: 50,
            bgColor: '#ffff99',
            padding: 2,
            display: "ALWAYS", //显示方式，可选值BYCLICK
            anchorX: 0, //横向偏移
            anchorY: 37,
          },
        });
        if (logAndLats.length > 1) {
          this.setData({
            polyline: [{
              points: logAndLats,
              color: '#ff4d4d',
              width: 8,
              arrowLine: true,
            }],
            logAndLats,
            showSelect: false,
            chosenLocation: '',
          });
        } else {
          this.setData({
            listData,
            // markers,
            logAndLats,
            showSelect: false,
            chosenLocation: '',
          });
        }
        this.drag.init();
        break;
      }
    }
    // 查找不到id对应suggestion的处理
    // console.log("@@@Error:CAN NOT FIND THE SUGGESTION)
    console.log("afterAdded", this.data.listData, this.data.logAndLats)
  },
  show_onMap(e){
    this.add_location(e)
    this.setData({
      showSubPage:true,
    })
  },
  //wxp-drag func
  sortEnd(e) {
    console.log("sortEnd", e.detail.listData)
    let listData = e.detail.listData;
    let logAndLats = [];
    //reset sortKey & polyline
    for (let i = 0; i < listData.length; i++) {
      listData[i].sortKey = i;
      listData[i].callout.content = (i+1).toString();
      logAndLats.push({
        longitude: listData[i].longitude,
        latitude: listData[i].latitude,
      });
    }
    this.setData({
      listData,
      polyline: [{
        points: logAndLats,
        color: '#ff4d4d',
        width: 8,
        arrowLine: true,
      }],
      logAndLats,
    });
    console.log("afterResetKey", listData);
    this.update();
  },
  itemDelete(e) {
    console.log("delete", e)
    let listData = this.data.listData;
    let logAndLats = this.data.logAndLats;
    listData.splice(e.detail.key, 1);
    logAndLats.splice(e.detail.key, 1);
    //reset sortKey
    for (let i = e.detail.key; i < listData.length; i++){
      listData[i].sortKey--;
      listData[i].callout.content=(i+1).toString();
    }
      
    setTimeout(() => {
      if (logAndLats.length > 1) {
        this.setData({
          listData,
          polyline: [{
            points: logAndLats,
            color: '#ff4d4d',
            width: 8,
            arrowLine: true,
          }],
          logAndLats,
        });
      } else {
        this.setData({
          listData,
          logAndLats,
        });
      }
      this.drag.init();
    }, 300)
    console.log("afterDelete", listData)
  },

  //myMap页面中events回调时需要更新数据库
  itemClick(e) {
    console.log(e)
    let _this = this;
    wx.navigateTo({
      url: '../edit/edit',
      events: {
        acceptChangedData: function (data) {
          console.log(data)
          _this.setData({
            [`listData[${e.detail.key}].picList`]: data.picList,
            [`listData[${e.detail.key}].description`]: data.description,
          })
          _this.drag.init()
        }
      },
      success: function (res) {
        res.eventChannel.emit('acceptOriginalData', {
          title: e.detail.data.title,
          description: e.detail.data.description,
          picList: e.detail.data.picList,
        })
      },
    })
    console.log(e);
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
    // console.log('@@@View')
    // console.log(e.detail.scrollTop)
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
  add_schedule: function () {
    var currendate = this.data.date
    wx.redirectTo({
      url: '../schedule/schedule',
    })
  },

  //fucking shit api！！！
  route_planning: function (e) {
    console.log(e)
    let key = 'ND6BZ-NKOCX-ZS34B-ZKTED-HTCLJ-ZDBOB'; //使用在腾讯位置服务申请的key
    let referer = '从今天开始出发'; //调用插件的app的名称
    let endPoint = JSON.stringify({ //终点
      'name': '北京西站',
      'latitude': 39.894806,
      'longitude': 116.321592
    });
    // let themeColor = '#7FFFD4';
    wx.navigateTo({
      url: 'plugin://routePlan/index?key=' + key + '&referer=' + referer + '&endPoint=' + endPoint 
    });
  },
})

//PCD函数
function getDaysBetween(dateString1, dateString2) {
  var startDate = Date.parse(dateString1);
  var endDate = Date.parse(dateString2);
  if (startDate > endDate) {
    return 0;
  }
  if (startDate == endDate) {
    return 1;
  }
  var days = (endDate - startDate) / (1 * 24 * 60 * 60 * 1000) + 1;
  return days;
}