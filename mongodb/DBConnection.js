'use strict'

import mongoose from 'mongoose'
import chalk from 'chalk'

// 创建连接
mongoose.connect('mongodb://127.0.0.1:27017/elm')
const db = mongoose.connection

// 监听连接失败
db.on('error', function (err) {
  // 打印失败信息
  console.error.bind(console, 'Error in MongoDB conection: ' + err)
  // 销毁连接
  mongoose.disconnect()
})
// 监听连接成功
db.once('open', function () {
  console.log(chalk.green('数据库连接成功'))
})
// 监听连接关闭
db.on('close', function (res) {
  console.log(chalk.red('数据库断开，数据库重新连接中...'))
  mongoose.connect('mongodb://127.0.0.1:27017/elm')
})
export default db
