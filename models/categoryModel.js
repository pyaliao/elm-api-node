'use strict'

import chalk from 'chalk'
import mongoose from 'mongoose'
import categoryData from '../initData/category.js'

const Schema = mongoose.Schema

// 创建Schema
const categorySchema = new Schema({
  id: Number,
  idList: Array,
  count: Number,
  imgUrl: String,
  level: Number,
  name: String,
  subCategoryList: [{
    id: Number,
    count: Number,
    imgUrl: String,
    level: Number,
    name: String
  }]
})
// 给Schema添加方法，加在 schema methods 属性的函数会编译到 Model 的 prototype，
// 因此此方法最终会成为model实例的方法
categorySchema.methods.addCategory = async function (type) {
  const categoryName = type.split('/')
  try {
    const allCate = await this.findOne()
    const subCate = await this.findOne({ name: categoryName[0] })
    allCate.count++
    subCate.count++
    subCate.subCategoryList.forEach(item => {
      if (item.name === categoryName[1]) {
        item.count++
      }
    })
    await allCate.save()
    await subCate.save()
    console.log('category保存成功')
  } catch (err) {
    console.log('category保存失败')
    throw new Error(err)
  }
}

// 创建model
const Category = mongoose.model('Category', categorySchema)

// 如过数据库中categories集合为空，则将初始化数据写入categories集合
Category.findOne((err, data) => {
  if (err) return console.log(chalk.red('categories集合读取错误：' + err))
  if (!data) {
    Category.create(categoryData)
  }
})
export default Category
