// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const db = cloud.database()
const _ = db.command
const $ = db.command.aggregate

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const params = event
  //days sort order
  console.log(event)
  const days = params.days.split(' ')
  let param = "_.eq("+ days[0] +")" 
  for(let i = 1 ; i < days.length ; i++){
    // param = param +"," + "_.eq("+days[i] +")" 
    param = param +".or(" + "_.eq("+days[i] +"))" 
  }
  console.log(param)
  const res = await db.collection("Discover").where({
       days:(eval(param))
  }).get()

  console.log(res)
  return {
    event,
    openid: wxContext.OPENID,
    appid: wxContext.APPID,
    unionid: wxContext.UNIONID,
  }
}