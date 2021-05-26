// 云函数入口文件
const cloud = require('wx-server-sdk')
var util = require('../../utils/util.js'); //引入util类计算日期

cloud.init({
  env:'cloud1-6g5yb47ucf4576d8'
})

const db = cloud.database()
const _ = db.command
const $ = db.command.aggregate

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  //只需传入日程id
  const scheduleID = event.scheduleID
  //console.log(scheduleID)
  const re = await db.collection('Individual').doc(scheduleID).get()
  console.log(re)
  console.log(getDaysBetween(re.data.beginDate,re.data.endDate))
  return await db.collection('Discover').add({
    data: {
      name: re.data.name,
      discription:"",
      allDatesData: re.data.allDatesData,
      days: getDaysBetween(re.data.beginDate,re.data.endDate),
      date: eval(util.formatDate(new Date())),
      stars: 0,
    }
  }).then(()=>{
    return true
  }).catch(err=>{
    console.log(err)
    return false
  })
}

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