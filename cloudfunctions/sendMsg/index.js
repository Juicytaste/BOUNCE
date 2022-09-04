const cloud = require('wx-server-sdk')
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV,
})
exports.main = async (event, context) => {
  try {
    const result = await cloud.openapi.subscribeMessage.send({
        "touser":event.openid,
        "lang": 'zh_CN',
        "data": {
          "thing4": {
            "value":event.thing4
          },
          "thing6": {
            "value": event.thing6
          },
          "date5": {
            "value": event.date5
          },
          "character_string17": {
            "value": '30min'
          }
        },
        "templateId": '83H7PDyYAz3c3cp2B98wzcCWj6DPJkWcHuPGl1g6MU0',
        "miniprogramState": 'developer'
      });
    // return result.errCode
  } catch (err) {
    return err
  }
}
