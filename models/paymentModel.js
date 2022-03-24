import mongoose from 'mongoose'
import paymentData from '../initData/payment.js'
import chalk from 'chalk'

// 保存Schema构造器函数
const Schema = mongoose.Schema

// 创建Schema实例
const paymentSchema = new Schema({
  description: String,
  disabledReason: String,
  id: Number,
  isOnlinePayment: Boolean,
  name: String,
  promotion: Array,
  selectState: Number
})

// 创建model实例
const Payment = mongoose.model('Payment', paymentSchema)

// 如果payments集合中没有数据，则将初始化数据写入payments集合
Payment.findOne((err, data) => {
  if (err) return console.log(chalk.red('集合payments读取错误：' + err))
  if (!data) {
    Payment.create(paymentData)
  }
})
export default Payment
