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

  const pageNo = event.pageNo
  const pageSize = event.pageSize
  //const res

  //获取历史行程
  if(event.tmpTag == 0){
    res = await db.collection('Individual').aggregate()
    .match({
      _openid: _.eq(userOpenId),
      endDate:_.lte(event.date),
    }).sort({
        beginDate: -1
    }).skip(pageNo*pageSize).limit(pageSize)
    .end()
  }else if(event.tmpTag == 1){
    //获取未来行程
    res = await db.collection('Individual').aggregate()
    .match({
      _openid: _.eq(userOpenId),
      endDate:_.gte(event.date),
    }).sort({
        beginDate: 1
    }).skip(pageNo*pageSize).limit(pageSize)
    .end()
  }
  console.log(res)

    let catList = [];
    for(let i = 0 ; i < res.list.length ; i++){
      const singleItem = {
        id:res.list[i]._id,
        date:res.list[i].date,
        name:res.list[i].name,
        picList:[],
      }
      res.list[i].allDatesData.forEach(((value)=>{
        value.listData.forEach((value)=>{
          console.log(value)
          if(value.picList != undefined){
              console.log("?>?????????????:",value)
            value.picList.forEach((value)=>{
              singleItem.picList.push(value.url)
            })
          }
        })
      }))

      catList.push(singleItem)
      
    }

  return catList

}