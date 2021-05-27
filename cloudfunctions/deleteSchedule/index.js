// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const scheduleID = event.scheduleID

  return await db.collection('Individual').doc(scheduleID)
  .remove().then(res=>{
    console.log(res)
    return true
  }).catch(err=>{
    console.log(err)
    return false
  })

}