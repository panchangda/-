// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env:'cloud1-4gt3oyi2fb51c017'
})

const db = cloud.database()
const _ = db.command
const $ = db.command.aggregate

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  //只需传入日程id
  const scheduleID = event.scheduleID
  const res = await db.collection('Individual').doc(scheduleID).get()

  let picUrl
  res.data.allDatesData.forEach(((value)=>{
    value.listData.forEach((value)=>{
      if(value.picList != []){
        value.picList.forEach((value)=>{
          picUrl = value.url
          return false
        })
      }
    })
  }))

  console.log(picUrl)
  return await db.collection('Discover').add({
    data: {
      name: res.data.name,
      description:event.description,
      allDatesData: res.data.allDatesData,
      days: getDaysBetween(res.data.beginDate,res.data.endDate),
      date: new Date(),
      stars: 0,
      pic:picUrl
    }
  }).then(()=>{
    return true
  }).catch(err=>{
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