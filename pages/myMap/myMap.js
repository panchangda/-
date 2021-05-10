// 引入SDK核心类
var QQMapWX = require('../../libs/qqmap-wx-jssdk.js');
// 实例化API核心类
var qqmapsdk = new QQMapWX({
  key: 'ND6BZ-NKOCX-ZS34B-ZKTED-HTCLJ-ZDBOB' // 必填
});
var mapSetting = {
  subkey: 'ND6BZ-NKOCX-ZS34B-ZKTED-HTCLJ-ZDBOB',
  longitude: 116.313972,
  latitude: 39.980014,
  scale: 12,
  layerStyle: 1,
  showLocation: true,
};
// const query = wx.createSelectorQuery();
// const MapContext = query.select('map');
// const MapContext = wx.createMapContext('map');
var util = require('../../utils/util.js');
Page({
  data: {
    mapSetting: mapSetting,
    markers: [],
    polyline: [],
    key: 'ND6BZ-NKOCX-ZS34B-ZKTED-HTCLJ-ZDBOB',
    hasSchedule: true,
    showSelect: false,
    date: "5月7号",
    showSubPage: false,
    destinations: [{
        title: '湖滨银泰'
      },
      {
        title: '西湖'
      },
      {
        title: 'ZJU'
      }
    ]
  },
  onLoad: function () {
    var date = util.formatDate(new Date());
    if (date) {
      this.setData({
        date: date
      })
    } else {
      console.log('CANNOT GET DATE!!!!!!')
    }

    console.log(date);
    if (this.data.hasSchedule) {
      this.search_nearby()
    } else {
      console.log('shit!!!!!!!!!!!!!!!!!!!')
    }
  },
  onShow:function(){

  },
  onReady: function () {
  },
  bindDateChange: function (e) {
    this.setData({
      date: e.detail.value,
    });
    this.load_today();
    if (this.data.hasSchedule) {
      this.setData({
        hasSchedule: false,
      })
    } else {
      this.setData({
        hasSchedule: true,
      })
    }
  },
  load_today: function () {
    //读取数据库中今日Date的数据
    //设置hasSchedule
    //如果有记录
    //设置markers、polyline等
  },
  load_yesterday: function () {
    //获取前一天日期并更改date
    this.setData({})
    //使用load_today加载
    this.load_today()
  },
  load_tomorrow: function () {
    //获取后一天日期并更改date
    this.setData({})
    //使用load_today加载
    this.load_today()
  },
  show_subpage: function () {
    this.setData({
      showSubPage: true
    })
  },
  exit_subpage: function () {
    this.setData({
      showSubPage: false
    })
  },
  // 事件触发，调用接口
  search_nearby: function () {
    var _this = this;
    // 调用接口
    qqmapsdk.search({
      keyword: 'kfc', //搜索关键词
      location: '39.980014,116.313972', //设置周边搜索中心点
      success: function (res) { //搜索成功后的回调
        var mks = []
        var resPoints = []
        for (var i = 0; i < res.data.length; i++) {
          resPoints.push({
            latitude: res.data[i].location.lat,
            longitude: res.data[i].location.lng
          })
        }

        for (var i = 0; i < res.data.length; i++) {
          mks.push({ // 获取返回结果，放到mks数组中
            // title: res.data[i].title,
            id: res.data[i].id,
            latitude: res.data[i].location.lat,
            longitude: res.data[i].location.lng,
            iconPath: '../../resources/my_marker.png', //图标路径
            width: 20,
            height: 20,
            callout: {
              color: '#ffffff',
              content: 'destination description',
              fontSize: 16,
              padding: 10,
              borderRadius: 10,
              bgColor: '#FF0000',
              textAlign: 'center',
              display: "BYCLICK"
            },
          })
        }
        _this.setData({ //设置markers属性，将搜索结果显示在地图中
          markers: mks,
          polyline: [{
            points: resPoints,
            color: "#DC143C",
            width: 8,
          }],
        })
      },
      fail: function (res) {
        console.log(res);
      },
      complete: function (res) {
        //  console.log(res);
      }
    });
  },
  backfill: function (e) {
    var id = e.currentTarget.id;
    for (var i = 0; i < this.data.suggestion.length; i++) {
      if (i == id) {
        this.setData({
          backfill: this.data.suggestion[i].title
        });
      }
    }
  },

  //触发关键词输入提示事件
  getsuggest: function (e) {
    var _this = this;
    //调用关键词提示接口
    qqmapsdk.getSuggestion({
      //获取输入框值并设置keyword参数
      keyword: e.detail.value, //用户输入的关键词，可设置固定值,如keyword:'KFC'
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
  add_location: function () {
    this.setData({
      suggestion: [],
      backfill: '',
      showSelect: false,
    })
  },
  add_schedule: function () {
    var currendate = this.data.date
    console.log(currendate)
    wx.navigateTo({
      url: '../addSchedule/addSchedule',
      success: function (res) {
        res.eventChannel.emit('acceptDataFromOpenerPage', {
          data: currendate
        })
      },
    })
  },
  route_planning: function (e) {
    var MapContext = wx.createMapContext('map');
    var longitude = 100;
    var latitude = 100;

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
      latitude: 100,
      destination: 'HELL',
    })
  }
})