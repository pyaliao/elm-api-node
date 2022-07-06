import chalk from 'chalk'
import mongoose from 'mongoose'
import cityData from '../initData/cities'

const Schema = mongoose.Schema

const citySchema = new Schema({
  id: 1,
  name: String,
  abbr: String,
  areaCode: String,
  sort: Number,
  latitude: Number,
  longitude: Number,
  isMap: Boolean,
  pinyin: String
})

citySchema.statics.cityGuess = async function (name) {
  // 获取城市名拼音首字母并转为大写
  const firstWord = name.substr(0, 1).toUpperCase()
  try {
    const allCities = await this.findOne()
    // Object.entries遍历对象的可迭代实例属性，不遍历原型属性
    Object.entries(allCities).forEach(item => {
      if (item[0] === firstWord) {
        item[1].forEach(city => {
          if (city.pinyin === name) {
            return city
          }
        })
      }
    })
  } catch (error) {
    console.log(chalk.red('城市数据查找失败', error))
    throw new Error(error)
  }
}

citySchema.statics.cityHot = async function () {
  try {
    const cities = await this.findOne()
    return cities.hotCities
  } catch (error) {
    console.log(chalk.red('热门城市数据查找失败', error))
    throw new Error(error)
  }
}

citySchema.statics.cityGroup = async function () {
  try {
    const cities = this.findOne()
    delete cities._id
    delete cities.hotCities
    return cities
  } catch (error) {
    console.log(chalk.red('所有城市数据查找失败', error))
    throw new Error(error)
  }
}

citySchema.statics.getCityById = async function (id) {
  try {
    const cities = await this.findOne()
    Object.entries(cities).forEach(item => {
      if (item[0] !== '_id' && item[0] !== 'hotCities') {
        item.forEach(city => {
          if (id === city.id) {
            return city
          }
        })
      }
    })
  } catch (error) {
    console.log(chalk.red('根据id查找城市失败', error))
    throw new Error(error)
  }
}
// 创建model
const City = mongoose.model('City', citySchema)

City.findOne((err, data) => {
  if (err) console.log(chalk.red('数据查询出错：' + err))
  if (!data) {
    City.create(cityData)
  }
})

export default City
