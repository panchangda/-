// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env:'cloud1-4gt3oyi2fb51c017'
})

const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const scheduleID = event.scheduleID

  const res = await db.collection('Discover').doc(scheduleID).get()

  return res.data
}