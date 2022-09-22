import chalk from 'chalk'
import mongoose from 'mongoose'
import cityData from '../initData/cities'

const Schema = mongoose.Schema

const citySchema = new Schema({
  data: {}
})

citySchema.statics.cityGuess = async function (name) {
  return new Promise(async (resolve, reject) => {
    // 获取城市名拼音首字母并转为大写
    const firstLetter = name.substr(0, 1).toUpperCase()
    try {
      const allCities = await this.findOne()
      // Object.entries遍历对象的可迭代实例属性，不遍历原型属性
      Object.entries(allCities).forEach(item => {
        if (item[0] === firstLetter) {
          item[1].forEach(city => {
            if (city.pinyin === name) {
              resolve(city)
            }
          })
        }
      })
    } catch (error) {
      console.log(chalk.red('城市数据查找失败', error))
      reject(error)
    }
  })
}

citySchema.statics.cityHot = async function () {
  return new Promise(async (resolve, reject) => {
    try {
      const cities = await this.findOne()
      resolve(cities.hotCities)
    } catch (error) {
      console.log(chalk.red('热门城市数据查找失败', error))
      reject(error)
    }
  })
}

citySchema.statics.cityGroup = async function () {
  return new Promise(async (resolve, reject) => {
    try {
      const cities = await this.findOne()
      delete cities._id
      delete cities.hotCities
      resolve(cities)
    } catch (error) {
      console.log(chalk.red('所有城市数据查找失败', error))
      reject(error)
    }
  })
}

citySchema.statics.getCityById = async function (id) {
  return new Promise(async (resolve, reject) => {
    try {
      const cities = await this.findOne()
      Object.entries(cities.data).forEach(item => {
        if (item[0] !== '_id' && item[0] !== 'hotCities') {
          item[1].forEach(city => {
            // 此处记得转换，id传入的是字符串类型，数据库查询得到的city.id是数值类型
            if (Number(id) === city.id) {
              console.log(chalk.yellow(city))
              resolve(city)
            }
          })
        }
      })
    } catch (error) {
      console.log(chalk.red('根据id查找城市失败', error))
      reject(error)
    }
  })
}
// 创建model
const Cities = mongoose.model('cities', citySchema)

Cities.findOne((err, data) => {
  if (err) console.log(chalk.red('数据查询出错：' + err))
  // console.log(chalk.green(data._id, data.__v))
  if (!data) {
    Cities.create({ data: cityData })
  }
})

export default Cities
