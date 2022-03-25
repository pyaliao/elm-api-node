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
    Object.entries(allCities).forEach(item => {
      if (item[0] === firstWord) {
        item[1].forEach(city => {
          if (city.pinyin === name) {
            resolve(city)
          }
        })
      }
    })
  } catch (error) {
    
  }
}
