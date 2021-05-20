// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env:'cloud1-6g5yb47ucf4576d8'
})

const db = cloud.database()
const _ = db.command
const $ = db.command.aggregate

//将范围分隔为开始与结束日期
function SpiltDate(dateRange,targetDate){
  //result[0]代表起始日期
  //result[1]代表结束日期
  return dateRange.split(" - ",2)
}


// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const userOpenId = wxContext.OPENID
  const date = event.date
  const dataOfdates = event.allDatesData
  // const milSecsInOneDay = 24 * 60 * 60 * 1000
  // db.collection('Individual').find({
  //   _openid: (thisOpenId)
  // })
  const dateRange = SpiltDate(date)
  console.log(dateRange[0])
    let result1 = await db.collection('Individual').aggregate()
    .match({
      _openid: _.eq(wxContext.OPENID),
      beginDate:_.lte(dateRange[0]),
      endDate:_.gte(dateRange[0]),
    }).end()
    let result2 = await db.collection('Individual').aggregate()
    .match({
      _openid: _.eq(wxContext.OPENID),
      beginDate:_.lte(dateRange[1]),
      endDate:_.gte(dateRange[1]),
    }).end()

    if (result1.list.length != 0 || result2.list.length != 0 ){
      return false;
    }

  return await db.collection('Individual').add({
    data:{
      _openid:userOpenId,
      name:event.name,
      date:date,
      allDatesData:dataOfdates,
      beginDate:dateRange[0],
      endDate:dateRange[1]
    }
  }).then(res=>{
    console.log(res)
    return true;
  }).catch(err=>{
    console.log(err)
    return false;
  })
  //return true;
}