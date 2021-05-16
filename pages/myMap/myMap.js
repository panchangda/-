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
// const MapContext = query.select('map');
// const MapContext = wx.createMapContext('map');
let listData = [{
    dragId: "item0",
    title: "这个绝望的世界没有存在的价值，所剩的只有痛楚",
    description: "思念、愿望什么的都是一场空，被这种虚幻的东西绊住脚，什么都做不到啊实打实大苏打撒旦顶顶顶顶顶顶顶顶顶顶啊什么的哈桑哈桑表达世界杯大家哈是比较哈师大不回家爱丁堡哈桑大家哈说不定就哈时代背景哈桑哈师大不急哈时代背景啊实打实撒谎比大家哈收到",
    images: "/assets/image/swipe/1.png",
    fixed: false
  },
  {
    dragId: "item1",
    title: "我早已闭上了双眼，我的目的，只有在黑暗中才能实现",
    description: "有太多的羁绊只会让自己迷惘，强烈的想法和珍惜的思念，只会让自己变弱",
    images: "/assets/image/swipe/2.png",
    fixed: false
  },
  {
    dragId: "item2",
    title: "感受痛苦吧，体验痛苦吧，接受痛苦吧，了解痛苦吧。不知道痛苦的人是不会知道什么是和平",
    description: "但我已经在无限存在的痛苦之中，有了超越凡人的成长。从凡人化为神",
    images: "/assets/image/swipe/3.png",
    fixed: false
  },
  {
    dragId: "item3",
    title: "我决定了 从今天起 我要选择一条不会让自己后悔的路 我要创造出属于自己的忍道 ",
    description: "我才不要在这种时候放弃,即使当不成中忍,我也会通过其他的途径成为火影的,这就是我的忍道",
    images: "/assets/image/swipe/4.png",
    fixed: false
  },
  {
    dragId: "item4",
    title: "为什么你会这么弱？就是因为你对我的仇恨...还不够深...",
    description: "你没有杀的价值...愚蠢的弟弟啊...想要杀死我的话...仇恨吧！憎恨吧！然后丑陋地活下去吧！逃吧 逃吧...然后苟且偷生下去吧！",
    images: "/assets/image/swipe/5.png",
    fixed: false
  },
  {
    dragId: "item5",
    title: "对于忍者而言怎样活着无所谓，怎样死去才是最重要的...",
    description: "所谓的忍者就是忍人所不能忍，忍受不了饿肚子，而沦落为盗贼的人，根本不能称之为忍者",
    images: "/assets/image/swipe/6.png",
    fixed: false
  },
  {
    dragId: "item6",
    title: "在这世上，有光的地方就必定有黑暗，所谓的胜者，也就是相对败者而言",
    description: "若以一己之思念要维持和平，必会招致战争，为了守护爱，变回孕育出恨。此间因果，是无法斩断的。现实就是如此",
    images: "/assets/image/swipe/7.png",
    fixed: false
  },
  {
    dragId: "item7",
    title: "世界上...只有没有实力的人,才整天希望别人赞赏...",
    description: "很不巧的是我只有一个人，你说的那些家伙们已经一个都没有了，已经??全部被杀死了",
    images: "/assets/image/swipe/8.png",
    fixed: false
  },
  {
    dragId: "item8",
    title: "千代婆婆，父亲大人和母亲大人回来了吗？？？",
    description: "明明剩下的只有痛苦了，既然你这么想活命，我就方你一条生路好了。不过，你中的毒不出三日就会要了你的命",
    images: "/assets/image/swipe/9.png",
    fixed: false
  },
  {
    dragId: "item9",
    title: "艺术就是爆炸！！~~ 嗯 ~~ 芸术は爆発します！",
    description: "我的艺术就是爆炸那一瞬，和蝎那种让人吃惊的人偶喜剧从根本上就是不同的！",
    images: "/assets/image/swipe/10.png",
    fixed: false
  }
];

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
    showCalendar: false,
    showSubPage: true,

    //wxp-drag data
    isIphoneX: app.globalData.isIphoneX,
    size: 1,
    listData: listData,
    scrollTop: 0,
    pageMetaScrollTop: 0
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

    this.load_today(date)

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
      let polyLinesPoints = [];
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
          address: addrDescrip.result.address
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
        hasSchedule: true,
        title: res.result.list[0].title,
        dest: res.result.list[0].dest,
        tmpDay: res.result.list[0].dayNmb,
        markers: markerPoints,
        polyline: [{
          points: polyLinesPoints,
          color: "#DC143C",
          width: 8,
        }],
      })

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
        this.setData({
          chosenLocation: this.data.suggestion[i].title
        });
      }
    }
    //加入到目的地数组
    this.setData({
      showSelect: false,
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
    wx.navigateTo({
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
    this.drag = this.selectComponent('#drag');
    // 模仿异步加载数据
    setTimeout(() => {
      this.setData({
        listData: listData,
        showSubPage: true
      });
      this.drag.init();
    }, 100)
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