'use strict'

import mongoose from 'mongoose'
import deliveryData from '../initData/delivery.js'
import chalk from 'chalk'

// 保存Schema构造函数
const Schema = mongoose.Schema

// 创建Schema
const deliverySchema = new Schema({
  id: Number,
  color: String,
  isSolid: Boolean,
  text: String
})
// 给deliverySchema定义索引
deliverySchema.index({ id: 1 })

// 创建model
const Delivery = mongoose.model('Delivery', deliverySchema)

// 如果数据库中deliveries集合为空，就将初始化数据写入deliveries集合中
Delivery.findOne((err, data) => {
  if (err) return console.log(chalk.red('deliveries集合读取错误：' + err))
  if (!data) {
    Delivery.create(deliveryData)
  }
})
export default Delivery
