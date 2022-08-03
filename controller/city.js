'use strict'

import CityModel from '../models/cityModel'
import pinyin from 'pinyin'
import LocationComponent from '../common/locationComponent'

class City extends LocationComponent {
  constructor () {
    super()
    this.getCity = this.getCity.bind(this)
    this.getExactLocation = this.getExactAddress.bind(this)
    this.getDetailAddress = this.getDetailAddress.bind(this)
  }
  async getCityName (req) {
    try {
      // 调用getLocation用ip获取城市名及经纬度信息
      const cityInfo = await this.getLocation(req)
      // 然后将城市名转换为拼音
      

    } catch (error) {
      
    }
  }
  async getCity (req, res, next) {
    const type = req.query.type
    let cityInfo
    try {
      switch (type) {
        case 'guess':
          // 获取城市名
          // 根据城市名去数据库查询该城市相关信息，并将其保存
          const city = await this.getCityName(req)
          cityInfo = await CityModel.cityGuess(city)
          break
        case 'hot':
          cityInfo = CityModel.cityHot()
          break
        case 'group':
          cityInfo = CityModel.cityGroup()
          break
        default:
          res.send({
            name: 'ERROR_QUERY_TYPE',
            message: '参数错误'
          })
          return
      }
      res.send(cityInfo)
    } catch (error) {
      res.send({
        name: 'ERROR_DATA',
        message: '获取数据失败'
      })
    }
  }
}
