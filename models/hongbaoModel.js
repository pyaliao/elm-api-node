import mongoose from 'mongoose'
import hongbaoData from '../initData/hongbao.js'
import chalk from 'chalk'

// 保存Schema构造函数
const Schema = mongoose.Schema

// 创建Schema
const hongbaoSchema = new Schema({
  id: Number,
  sn: String,
  userId: Number,
  amount: Number,
  sumCondition: Number,
  name: String,
  phone: String,
  beginDate: String,
  endDate: String,
  descriptionMap: {
    phone: String,
    onlinePaidOnly: String,
    validityDelta: String,
    validityPeriods: String,
    sumCondition: String
  },
  limitMap: {},
  status: Number,
  presentStatus: Number,
  shareStatus: Number,
  schema: String
})

// 创建model
const Hongbao = mongoose.model('Hongbao', hongbaoSchema)

// 如果hongbaos集合中没有数据，则将初始化数据写入hongbaos集合
Hongbao.findOne((err, data) => {
  if (err) return console.log(chalk.red('集合hongbaos读取错误：' + err))
  if (!data) {
    Hongbao.create(hongbaoData)
  }
})
export default Hongbao