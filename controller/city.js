'use strict'

import CityModel from '../models/cityModel'
import pinyin from 'pinyin'
import LocationComponent from '../common/locationComponent'
import chalk from 'chalk'

class City extends LocationComponent {
  constructor () {
    super()
    this.getCityInfo = this.getCityInfo.bind(this)
    this.getExactLocation = this.getExactLocation.bind(this)
    this.getDetailAddress = this.getDetailAddress.bind(this)
  }

  async getCityName (req) {
    try {
      // 调用getLocation用ip获取城市名及经纬度信息
      const cityInfo = await this.getLocation(req)
      // 然后将城市名转换为拼音
      let cityNamePinyin = ''
      pinyin(cityInfo.cityName, {
        style: 'normal'
      }).forEach(item => {
        cityNamePinyin += item[0]
      })
      return cityNamePinyin
    } catch (error) {
      return 'xianshi'
    }
  }

  async getCityInfo (req, res, next) {
    const type = req.query.type
    let cityInfo
    try {
      switch (type) {
        case 'guess': {
          // 获取城市名拼音
          // 根据城市名拼音去数据库查询该城市相关信息，并将其保存
          const city = await this.getCityName(req)
          // 根据城市名拼音去数据库查询城市相关信息
          cityInfo = await CityModel.cityGuess(city)
          break
        }
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

  async getExactLocation (req, res, next) {
    try {
      // 调用getLocation，通过客户端IP获取用户精确位置
      const location = await this.getExactLocationByIp(req)
      res.send(location)
    } catch (error) {
      console.log(chalk.red('获取精确位置失败', error))
      res.send({
        name: 'ERROR_DATA',
        message: '获取精确位置失败'
      })
    }
  }

  async getDetailAddress (req, res, next) {

  }
}

export default new City()
