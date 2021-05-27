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
  //处理days
  if(params.days != null){
    const days = params.days.split(' ')
    let param = "_.eq("+ days[0] +")" 
    for(let i = 1 ; i < days.length ; i++){
      param = param +".or(" + "_.eq("+days[i] +"))" 
    }
    console.log(param)
    res = res.match({
        days:(eval(param))
    })
  }

  if(params.sort == "stars"){
    console.log(res)
    res = await res.sort({
        stars: -1
    }).skip(pageNo*pageSize).limit(pageSize).end()
  }else{
    if(params.order == "desc"){
      res = await res.sort({
        date: -1
      }).skip(pageNo*pageSize).limit(pageSize).end()
    }else{
      res = await res.sort({
        date: 1
      }).skip(pageNo*pageSize).limit(pageSize).end()
    }
  }
  let showRes = [];
  
  res.list.forEach((value)=>{
    //console.log(value)
    showRes.push({
      id:value._id,
      name:value.name,
      description:value.discription,
      days:value.days,
      stars:value.stars,
      date:value.date,
    })
  })
  console.log(showRes)

  console.log(res)
  return {
    event,
    openid: wxContext.OPENID,
    appid: wxContext.APPID,
    unionid: wxContext.UNIONID,
  }
}