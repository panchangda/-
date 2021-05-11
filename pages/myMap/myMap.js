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

    //subPage data
    showSelect: false,
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

    this.load_today()

  },
  onShow: function () {},
  onReady: function () {},
  bindPickerDateChange: function (e) {
    this.setData({
      date: e.detail.value,
    });
    this.load_today();
  },
  load_today: function () {
    //读取数据库中今日Date的数据
    //设置hasSchedule
    //如果有记录
    //设置markers、polyline等
    wx.cloud.callFunction({
      name: 'findTodaySchedule',
      data: {
        dateString: JSON.stringify(this.data.date)
        //+" 00:00:00.000"
      },
      success: res => {
        console.log(res)
        if (res.result.list.length) {
          var markerPoints = [];
          var polyLinesPoints = [];
          for (var i = 0; i < res.result.list[0].locs.coordinates.length; i++) {
            markerPoints.push({
              id:i,
              longitude: res.result.list[0].locs.coordinates[i][0],
              latitude: res.result.list[0].locs.coordinates[i][1],
              width: 40,
              height: 40,
              iconPath: '../../resources/my_marker.png', //图标路径
              callout: {
                color: '#ffffff',
                content: 'description',
                fontSize: 16,
                padding: 10,
                borderRadius: 10,
                bgColor: '#FF0000',
                textAlign: 'center',
                display: "BYCLICK"
              },
            })
            polyLinesPoints.push({
              longitude: res.result.list[0].locs.coordinates[i][0],
              latitude: res.result.list[0].locs.coordinates[i][1],
              iconPath: '../../resources/my_marker.png', //图标路径
              width: 20,
              height: 20,
              
            })
          }
          this.setData({
            hasSchedule:true,
            title:res.result.list[0].title,   
            dest:res.result.list[0].dest,
            tmpDay:res.result.list[0].dayNmb,
            markers:markerPoints,
            polyline:[{
              points: polyLinesPoints,
              color: "#DC143C",
              width: 8,
            }],

          })
        } else {
          this.setData({
            hasSchedule: false,
          })
        }
      },
      fail: err => {
        console.log('ERROR!!!!!CANNOT GET RESULT OF findTodaySchedule')
        console.log(err)
      }
    })
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
      date:yesterDate
    })
    //使用load_today加载
    this.load_today()
  },
  load_tomorrow: function () {
    //获取后一天日期并更改date
    let secs = Date.parse(this.data.date) + milSecsInOneDay;
    let d = new Date();
    d.setTime(secs);
    let tomorrowDate = util.formatDate(d)
    this.setData({
      date:tomorrowDate
    })
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