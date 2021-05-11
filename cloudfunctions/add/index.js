// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env:'cloud1-6g5yb47ucf4576d8'
})

// 云函数入口函数
exports.main = async (event, context) => {
  return {
    sum: event.a + event.b
  }
}