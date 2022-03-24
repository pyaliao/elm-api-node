import chalk from 'chalk'
import mongoose from 'mongoose'
import remarkData from '../initData/remark.js'

const Schema = mongoose.Schema

const remarkSchema = new Schema({
  remarks: Array
})

const Remark = mongoose.model('Remark', remarkSchema)

Remark.findOne((err, data) => {
  if (err) return  console.log(chalk.red('查询remarks集合出错：' + err))
  if (!data) {
    Remark.create(remarkData)
  }
})
export default Remark