import mongoose from 'mongoose'
import explainData from '../initData/explain.js'
import chalk from 'chalk'

// 保存Schema构造器函数
const Schema = mongoose.Schema

// 创建Schema
const explainSchema = new Schema({
  data: Schema.Types.Mixed
})

// 创建model
const Explain = mongoose.model('Explain', explainSchema)

// 如果explains集合不存在或者没有数据，则将初始化数据写入explains集合
Explain.findOne((err, data) => {
  if (err) return console.log(chalk.red('读取集合explains错误：' + err))
  // console.log(chalk.green('data---', data))
  if (!data) {
    Explain.create({ data: explainData })
  }
})
export default Explain
