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
  longitude: 106.301919,
  latitude: 29.603818,
  scale: 12,
  layerStyle: 1,
  showLocation: true,
};
const milSecsInOneDay = 24 * 60 * 60 * 1000;
// const query = wx.createSelectorQuery();
// const MapContext = query.select('#map');
// const MapContext = wx.createMapContext('map');
let listData = [];

Page({
  data: {
    //AllDatesData
    allDatesData: [],
    //schedule settings
    showSetting: true,
    settingComplete: false,
    //calendar
    showCalendar: false,
    minDate: new Date(2021, 4, 7).getTime(),
    maxDate: new Date(2021, 4, 31).getTime(),

    //map data
    mapSetting: mapSetting,
    polyline: [{
      points: [],
    }],
    logAndLats: [],

    //date info
    hasSchedule: false,
    date: "",

    //subPage data
    showSubPage: true,

    activeTag: 0,
    title: '',
    dest: '',
    tmpDay: 0,
    totalDay: '',

    //mainPage data
    showSelect: false,

    //wxp-drag data
    isIphoneX: app.globalData.isIphoneX,
    size: 1,
    listData: [],
    scrollTop: 0,
    pageMetaScrollTop: 0,
    count: 0,
  },

  //天才般的同步处理
  onLoad: function (options) {
    const eventChannel = this.getOpenerEventChannel()
    eventChannel.on('acceptDataFromOpenerPage', function (data) {
      console.log(data)
    })
  },
  onShow: function () {},
  onReady: function () {},
  onNameChange() {
    this.setData({
      nameSet: true,
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
  getDaysBetween(dateString1, dateString2) {
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
  },
  onCalendarConfirm(e) {
    // console.log(e)
    const [start, end] = e.detail;
    let dateS = util.formatDate(new Date(start));
    let dateE = util.formatDate(new Date(end));
    let totalDay = this.getDaysBetween(dateS, dateE);
    let allDatesData = []
    for (let i = 0; i < totalDay; i++)
      allDatesData.push({
        listData: [],
        polyline: [],
        logAndLats: [],
      })
    this.setData({
      showCalendar: false,
      date: dateS + ' - ' + dateE,
      calendarSet: true,
      totalDay,
      allDatesData,
    });
  },

  confirm_setting() {
    //关闭setting后拖拽列表才会加载
    //所以先关闭再初始化拖拽列表
    this.setData({
      showSetting: false,
    })
    this.drag = this.selectComponent('#drag');
    setTimeout(() => {
      this.setData({
        listData: listData,
      });
      this.drag.init();
    }, 300)
  },
  //switch to tmpDay and reload infos
  onTagClick(e) {
    if (this.data.tmpDay != e.detail.index) {
      console.log("@@@from " + this.data.tmpDay + " going to " + e.detail.index)
      let thisDayData = {
        listData: this.data.listData,
        polyline: this.data.polyline,
        logAndlats: this.data.logAndLats,
      }
      setTimeout(() => {
        this.setData({
          [`allDatesData[${this.data.tmpDay}]`]: thisDayData,
          listData: this.data.allDatesData[e.detail.index].listData,
          polyline: this.data.allDatesData[e.detail.index].polyline,
          logAndlats: this.data.allDatesData[e.detail.index].logAndlats,
          tmpDay: e.detail.index,
        });
        this.drag.init();
      }, 300)
    }
    console.log(this.data.allDatesData, this.listData, this.polyline, this.logAndLats)

  },
  load_yesterday: function () {
    this.setData({
      date: yesterDate
    })
    //使用load_today加载
  },
  load_tomorrow: function () {
    this.setData({
      date: tomorrowDate
    })
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
        let logAndLats = this.data.logAndLats;
        logAndLats.push({
          longitude: this.data.suggestion[i].longitude,
          latitude: this.data.suggestion[i].latitude,
        })
        listData.push({
          //drag data
          dragId: `item${this.data.count}`,
          title: this.data.suggestion[i].title,
          description: this.data.suggestion[i].addr,
          // images: "/assets/image/swipe/1.png",
          fixed: false,

          //markers data
          sortKey: this.data.listData.length,
          id: this.data.count++,
          longitude: this.data.suggestion[i].longitude,
          latitude: this.data.suggestion[i].latitude,
          width: 60,
          height: 60,
          iconPath: '../../resources/marker.png', //图标路径
          customCallout: { //自定义气泡
            display: "ALWAYS", //显示方式，可选值BYCLICK
            anchorX: 0, //横向偏移
            anchorY: 20,
          },
        });
        setTimeout(() => {
          this.setData({
            listData,
            // markers,
            polyline: [{
              points: logAndLats,
              color: "#DC143C",
              width: 8,
            }],
            logAndLats,
            showSelect: false,
            chosenLocation: '',
          });
          this.drag.init();
        }, 300)
        break;
      }
    }
    //查找不到id对应suggestion的处理
    // this.setData({
    // })
    console.log("afterAdded", listData)
  },

  route_planning: function (e) {
    var MapContext = wx.createMapContext('#map');
    // for (var i = 0; i < this.data.markers.length; i++) {
    //   if (this.data.markers.id == e.detail) {
    //     longitude = this.data.markers.longitude;
    //     latitude = this.data.markers.latitude;
    //   };
    // }
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
      showSubPage: true,
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
    let listData = e.detail.listData;
    let logAndLats = [];
    //reset sortKey & polyline
    for (let i = 0; i < listData.length; i++) {
      listData[i].sortKey = i;
      logAndLats.push({
        longitude: listData[i].longitude,
        latitude: listData[i].latitude,
      });
    }
    this.setData({
      listData,
      polyline: [{
        points: logAndLats,
        color: "#DC143C",
        width: 8,
      }],
      logAndLats,
    });
    console.log("afterResetKey", listData);
  },
  //**unfinished**
  itemDelete(e) {
    console.log("delete", e)
    let listData = this.data.listData;
    let logAndLats = this.data.logAndLats;
    listData.splice(e.detail.key, 1);
    logAndLats.splice(e.detail.key, 1);
    //reset sortKey
    for (let i = e.detail.key; i < listData.length; i++)
      listData[i].sortKey--;
    setTimeout(() => {
      this.setData({
        listData,
        polyline: [{
          points: logAndLats,
          color: "#DC143C",
          width: 8,
        }],
        logAndLats,
      });
      this.drag.init();
    }, 300)
    console.log("afterDelete", listData)
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
    this.setData({
      pageMetaScrollTop: e.detail.scrollTop
    })
  },

  // 页面滚动
  onDragScroll(e) {
    this.setData({
      scrollTop: e.detail.scrollTop,
    });
  },

})