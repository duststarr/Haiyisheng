const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()
const wxContext = cloud.getWXContext()
const _ = db.command

/**
 * 登陆
 * 
 * 
 * @param action 动作 可空 值:['marketing'//推广,'recruit'//招募工人]
 * @param fromWho 来源人的openid 跟随action 
 */
exports.main = async (event, context) => {
  var userDetail = {}
  const action = event.action;
  const fromWho = event.fromWho;
  const user = db.collection('user');

  // 数据库中是否有此用户
  const res = await user.where({
    _openid: wxContext.OPENID
  }).get();

  
  if (0 == res.data.length) { // 新人首次打开,在数据库中插入
    userDetail = {
      _openid: wxContext.OPENID,
      timeBeUser: new Date(),
      referrer: 'marketing' == action ? fromWho : null, // 推荐人的openid
      isAdmin: false,
      isWorker: false,
      isClient: false
    }
    await user.add({
      data:userDetail
    })
  }else { // 已存用户
    userDetail = res.data[0]
  }
  // 如果有推荐人,且当前用户不是客户,更新推荐人
  if ('marketing' == action && !userDetail.isClient) { 
    await user.where({
      _openid: wxContext.OPENID
    }).update({
      data: {
        referer: fromWho
      }
    })
  } 
  return {
    userDetail,
    openid: wxContext.OPENID,
  }
}

