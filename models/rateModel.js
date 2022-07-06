import mongoose from 'mongoose'
import { ratingList, scores, tags} from '../initData/rate.js'
import chalk from 'chalk'

// 保存Schema构造函数
const Schema = mongoose.Schema

// 创建Schema
const ItemRatingSchema = new Schema({
  foodId: Number,
  foodName: String,
  imageHash: { type: String, default: '' },
  isValid: { type: Number, default: 1 }
})
const RatingSchema = new Schema({
  avatar: { type: String, default: '' },
  highlights: Array,
  itemRatings: [ItemRatingSchema],
  ratedAt: String,
  ratingStar: Number,
  ratingText: String,
  tags: Array,
  timeSpentDesc: String,
  username: { type: String, default: '匿名用户' }
})
const ScoresSchema = new Schema({
  compareRating: { type: Number, default: 0 },
  deliverTime: { type: Number, default: 0 },
  foodScore: { type: Number, default: 0 },
  orderRating_amount: { type: Number, default: 0 },
  overallScore: { type: Number, default: 0 },
  serviceScore: { type: Number, default: 0 }
})
const TagItemSchema = new Schema({
  count: { type: Number, default: 0 },
  name: String,
  unsatisfied: { type: Boolean, default: false }
})
const rateSchema = new Schema({
  restaurantId: Number,
  ratingList: [RatingSchema],
  scores: ScoresSchema,
  tags: [TagItemSchema]
})

// 给rateSchema定义索引
rateSchema.index({ restaurantId: 1 })

// 定义model静态方法
// 1. 数据初始化
rateSchema.statics.initData = async function (restaurantId) {
  try {
    // 此处使用对象简写语法，key名与变量名一致时，可以只写一个名字，不用写键值对
    // promise如果fulfilled，则await返回resolve函数传递的值
    // 如果rejected或者抛出错误，则返回传递的错误信息
    // 在异步函数中Promise的reject抛出的错误会被try-catch捕获
    const data = await this.findOne({ restaurantId })
    // 如果集合中没有数据，则初始化数据并写入集合
    if (!data) {
      const newRating = {
        restaurantId,
        ratingList,
        scores,
        tags
      }
      await this.create(newRating)
      return true
    } else {
      return false
    }
  } catch (error) {
    console.log(chalk.red('评论数据初始化失败'))
    // 如果初始化出现错误，将错误继续向上层代码抛出
    throw new Error(error)
  }
}
// 2.数据查询
rateSchema.statics.getData = async function (restaurantId, type) {
  try {
    // findOne第一个参数可选，不填则mongoose默认发送一个空的findOne指令给Mongodb
    // Mongodb将会返回一个随机的document
    // 第二个参数可选，表示想要返回的字段，
    const data = await this.findOne({ restaurantId }, '_id')
    if (!data) {
      throw new Error('未找到当前餐馆的评论数据')
    } else {
      return data[type]
    }
  } catch (error) {
    console.log('评论数据初始化失败')
    // 如果初始化出现错误，将错误继续向上层代码抛出
    throw new Error(error)
  }
}
// 创建model
const Rating = mongoose.model('Rating', rateSchema)

export default Rating
