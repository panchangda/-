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
  const date = new Date(JSON.parse(event.dateString))
  const milSecsInOneDay = 24 * 60 * 60 * 1000
  // const utcDate = date.toUTCString();
  // const log = cloud.logger()
  // log.info({
  //   date:date,
  //   // utcDate:utcDate,
  // })
  try {
    return await db.collection('Individual')
    .aggregate()
    .match({
      _openid: _.eq(thisOpenId),
      //value:_.lte(x) where value<=x
      startDate:_.lte(date),
      //gte: >=
      endDate:_.gte(date),
    })
    .project({
      title:1,
      dest:1,
      //计算是第x天 floor向下取整 subtract两日期相减返回毫秒数
      dayNmb:$.floor($.divide([$.abs($.subtract(['$startDate',date])),milSecsInOneDay])),
      locs:$.arrayElemAt(['$locations',$.floor($.divide([$.abs($.subtract(['$startDate',date])),milSecsInOneDay]))]),
    })
    .end()
  } catch(e) {
    console.error(e)
  }
}