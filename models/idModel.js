import chalk from 'chalk'
import mongoose from 'mongoose'

const Schema = mongoose.Schema

const idsSchema = new Schema({
  restaurantId: Number,
  foodId: Number,
  orderId: Number,
  userId: Number,
  addressId: Number,
  cartId: Number,
  imgId: Number,
  categoryId: Number,
  itemId: Number,
  skuId: Number,
  adminId: Number,
  statisId: Number
})

const Ids = mongoose('Ids', idsSchema)

Ids.findOne((err, data) => {
  if (err) console.Console(chalk.red('id查询出错' + err))
  if (!data) {
    // 创建一个model的实例
    const newIds = new Ids({
      restaurantId: 0,
      foodId: 0,
      orderId: 0,
      userId: 0,
      addressId: 0,
      cartId: 0,
      imgId: 0,
      categoryId: 0,
      itemId: 0,
      skuId: 0,
      adminId: 0,
      statisId: 0
    })
    newIds.save(err => {
      if (err) return console.log('保存ids初始化数据出错' + err)
      console.log(chalk.green('ids初始化数据保存成功'))
    })
  }
})

export default Ids
