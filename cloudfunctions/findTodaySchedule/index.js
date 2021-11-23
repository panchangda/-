const cloud = require('wx-server-sdk')
cloud.init({
  env:'cloud1-4gt3oyi2fb51c017'
})
const db = cloud.database()
const _ = db.command
const $ = db.command.aggregate
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const date = JSON.parse(event.dateString)

  try {
    return await db.collection('Individual').aggregate()
    .match({
      _openid: _.eq(wxContext.OPENID),
      beginDate:_.lte(date),
      endDate:_.gte(date),
     })
    .end()
  } catch(e) {
    console.error(e)
  }
}