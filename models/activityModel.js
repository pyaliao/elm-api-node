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

// 如果Activity为空，则将初始化数据添加到activity集合
Activity.findOne((err, data) => {
  // err也为null
  // 如果没有数据（collection为空），data值为null
  if (!data) {
    activityData.forEach((item) => {
      Activity.create(item, (err, small) => {
        if (err) return console.log(chalk.red(err))
        console.log(small)
      })
    })
  }
})
export default Activity
