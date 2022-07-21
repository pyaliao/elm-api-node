// config-lite 会来读取的配置文件是node模块的
'use strict'
module.exports = {
  port: 3000,
  mongodbUrl: 'mongodb://127.0.0.1:27017/elm',
  session: {
    name: 'SID',
    secret: 'SID',
    cookie: {
      httpOnly: true,
      secure: false,
      maxAge: 365 * 24 * 60 * 60 * 1000
    }
  }
}
