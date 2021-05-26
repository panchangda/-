const cloud = require('wx-server-sdk')
cloud.init({
  env:'cloud1-6g5yb47ucf4576d8'
})
const db = cloud.database()
const _ = db.command
const $ = db.command.aggregate
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const thisOpenId = wxContext.OPENID
  const date = JSON.parse(event.dateString)
  const milSecsInOneDay = 24 * 60 * 60 * 1000
  console.log(date)
  try {
    return await db.collection('Individual').aggregate()
    .match({
      _openid: _.eq(wxContext.OPENID),
      beginDate:_.lte(date),
      endDate:_.gte(date),
     })
    .get()
  } catch(e) {
    console.error(e)
  }
}