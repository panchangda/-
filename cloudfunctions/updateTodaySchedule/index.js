// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env:'cloud1-6g5yb47ucf4576d8'
})

const db = cloud.database()
const _ = db.command
const $ = db.command.aggregate

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()

  //得到对应的日期
  const date = event.dateString

  //对应的schedule
  let result = await db.collection('Individual').aggregate()
  .match({
    _openid: _.eq(wxContext.OPENID),
    beginDate:_.lte(date),
    endDate:_.gte(date),
   })
   .end()
   const scheduleID = result.list[0]._id;
   let schedule = await db.collection('Individual').doc(scheduleID).get()
   //schedule.data.allDatesData[]

   const upDateData = schedule.data.allDatesData
   console.log(upDateData)
   {
    upDateData[getDaysBetween(date,schedule.data.beginDate)-1].listData=event.listData
    upDateData[getDaysBetween(date,schedule.data.beginDate)-1].polyline=event.polyline
    upDateData[getDaysBetween(date,schedule.data.beginDate)-1].logAndLats=event.logAndLats
    upDateData[getDaysBetween(date,schedule.data.beginDate)-1].count=event.count
   }
   console.log(upDateData)
   
   const re = await db.collection('Individual').doc(scheduleID).update({
     data:{
      allDatesData:upDateData,
     }
   })
   return re
  // return {
  //   event,
  //   openid: wxContext.OPENID,
  //   appid: wxContext.APPID,
  //   unionid: wxContext.UNIONID,
  // }
}

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