import chalk from 'chalk'
import mongoose from 'mongoose'
import activityData from '../initData/activity.js'

const Schema = mongoose.Schema

// 创建schema
const activitySchema = new Schema({
  id: Number,
  name: String,
  description: String,
  iconColor: String,
  iconName: String,
  rankingWeight: Number
})
// 创建model
const Activity = mongoose.model('Activity', activitySchema)

// 如果数据库中activities集合为空，则将初始化数据写入activities集合中
Activity.findOne((err, data) => {
  // 正常情况下err为null
  if (err) return console.log(chalk.red('activities集合读取错误：' + err))
  // 如果没有数据（collection为空），data值为null
  if (!data) {
    Activity.create(activityData, (err, small) => {
      if (err) return console.log(chalk.red(err))
      console.log(small)
    })
  }
})
export default Activity
