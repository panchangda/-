// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env:'cloud1-6g5yb47ucf4576d8'
})

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const db = cloud.database()
  const _ = db.command
  const $ = db.command.aggregate
  const date = event.date

  console.log(date)
    let result = await db.collection('Individual').aggregate()
    .match({
      _openid: _.eq(wxContext.OPENID),
      beginDate:_.lte(date),
      endDate:_.gte(date),
     }).get()
     console.log(result)
  if(result.list.length()==0) return ''
  else return result.list[0]._id
}