import mongoose from 'mongoose'
import entryData from '../initData/entry.js'
import chalk from 'chalk'

// 保存Schema构造函数
const Schema = mongoose.Schema

// 创建Schema实例
const entrySchema = new Schema({
  id: Number,
  isInServing: Boolean,
  description: String,
  title: String,
  link: String,
  imageUrl: String,
  iconUrl: String,
  titleColor: String
})

// 创建model实例
const Entry = mongoose.model('Entry', entrySchema)

// 如果entries集合为空，则将初始化数据写入entries集合
Entry.findOne((err, data) => {
  if (err) return console.log(chalk.red('entries集合读取错误：' + err))
  // 如果没有数据（collection为空），data值为null
  if (!data) {
    Entry.create(entryData)
  }
})
export default Entry
