// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env:'cloud1-6g5yb47ucf4576d8'
})

const db = cloud.database()
const _ = db.command

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const userOpenId = wxContext.OPENID
  console.log(event.date)
  //获取历史行程
  let res = await db.collection('Individual').aggregate()
  .match({
    _openid: _.eq(userOpenId),
    endDate:_.lte(event.date),
  }).skip(4).limit(10)
  .sort({
      beginDate: -1
  }).end()

  //获取未来行程
  let res = await db.collection('Individual').aggregate()
  .match({
    _openid: _.eq(userOpenId),
    beginDate:_.lte(event.date),
  }).skip(4).limit(10)
  .sort({
      beginDate: -1
  }).end()

  return res
}