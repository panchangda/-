// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const db = cloud.database()
const _ = db.command
const $ = db.command.aggregate

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const scheduleID = event.scheduleID
  
  //_.inc操作可并发写
  return await db.collection("Discover").doc(scheduleID).update({
    data:{
      stars:_.inc(1)
    }
  }).then(()=>{
    return true
  }).catch(()=>{
    return false
  })

}