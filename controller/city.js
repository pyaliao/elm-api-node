'use strict'

import CityModel from '../models/cityModel'
import pinyin from 'pinyin'
import LocationComponent from '../common/locationComponent'
import chalk from 'chalk'
import { add } from 'winston'

class City extends LocationComponent {
  constructor () {
    super()
    this.getCityInfo = this.getCityInfo.bind(this)
    this.getExactLocation = this.getExactLocation.bind(this)
    this.getDetailAddress = this.getDetailAddress.bind(this)
  }

  // 调用getLocationByIp获取城市名及经纬度
  // 然后将城市名转为拼音表示
  async getCityName (req) {
    try {
      // 调用getLocationByIp用ip获取城市名及经纬度信息
      const cityInfo = await this.getLocationByIp(req)
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

  // 根据城市的拼音表示获取城市基本信息
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

  // 调用getExactLocationByIp获取用户精确位置
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

  // 调用getExactLocationByGeo获取用户详细地址
  async getDetailAddress (req, res, next) {
    try {
      const geoHash = req.params.geoHash || ''
      if (geoHash.indexOf(',') === -1) {
        res.send({
          status: 0,
          type: 'ERROR_PARAMS',
          message: '参数错误'
        })
        return
      }
      const geoArr = geoHash.split(',')
      // 调用getExactLocationByGeo获取精确地址
      const result = await this.getExactLocationByGeo(geoArr[0], geoArr[1])
      const address = {
        address: result.result.address,
        city: result.result.address_component.city,
        geoHash,
        lat: geoArr[0],
        lng: geoArr[1],
        name: result.result.formatted_addresses.recommend
      }
      res.send(address)
    } catch (error) {
      console.log(chalk.red('getExactLocationByGeo调用失败: ', error))
      res.send({
        status: 0,
        type: 'ERROR_DATA',
        message: '获取数据失败'
      })
    }
  }
}

export default new City()
