'use strict'

import chalk from 'chalk'
import { add } from 'winston'
import BaseComponent from './baseComponent'

// 腾讯WebServiceAPI 定位服务调配组件

class LocationComponent extends BaseComponent {
  constructor () {
    super()
    this.tencentKey1 = 'W4ZBZ-P4ZKD-QUG4H-PQPWR-U5KB2-X5BCV'
    this.tencentKey2 = 'OM5BZ-WVI3J-TPEF2-FFENM-SGHK7-C2BLZ'
  }

  // 通过IP获取用户位置(城市级别)及经纬度
  async getLocationByIp (req) {
    return new Promise(async (resolve, reject) => {
      let ip
      // 默认定位IP（西安市）
      const defaultIp = '219.145.20.171'
      if (process.env.NODE_ENV === 'development') {
        ip = defaultIp
      } else {
        ip = req.ip
        if (ip) {
          if (ip === '::1') {
            ip = '127.0.0.1'
          } else {
            // 如果正则表达式有g标志，则返回与完整正则表达式匹配的所有结果，但不会返回捕获组:
            // [ '127.0.0.1' ] 一个或者多个匹配值组成的数组，没有匹配值则返回null
            // 如果正则表达式没有g标志，则仅返回第一个完整匹配值及其相关信息的捕获组（Array）：
            // [ '127.0.0.1', index: 7, input: '::ffff:127.0.0.1', groups: undefined ]，没有匹配值则返回null
            // 信息1：正则匹配的字符串，此例中是ip
            // groups: 一个命名捕获组对象，其键是捕获组名称，值是捕获组，如果未定义命名捕获组，则为 undefined。有关详细信息，请参阅组和范围。
            // index: 匹配的结果的开始位置
            // input: 搜索的字符串。
            // 默认的捕获组的值：只要捕获组存在（无论是默认还是命名捕获组），就会有默认捕获组的值存在
            ip = ip.match(/\d{1, 3}\.\d{1, 3}\.\d{1, 3}\.\d{1, 3}/g)[0]
          }
        } else {
          ip = defaultIp
        }
      }
      try {
        let url = `https://apis.map.qq.com/ws/location/v1/ip?ip=${ip}&key=${this.tencentKey1}`
        let result = await this.fetch(url)
        if (result.status !== 0) {
          url = `https://apis.map.qq.com/ws/location/v1/ip?ip=${ip}&key=${this.tencentKey2}`
          result = await this.fetch(url)
        }
        if (result.status === 0) {
          const cityInfo = {
            lat: result.result.location.lat,
            lng: result.result.location.lng,
            cityName: result.result.ad_info.city
          }
          cityInfo.city = cityInfo.cityName.replace(new RegExp('\\u' + '市'.charCodeAt(0).toString(16), 'g'), '')
          resolve(cityInfo)
        } else {
          console.log('定位失败', result)
          reject('定位失败')
        }
      } catch (error) {
        console.log(chalk.red('定位失败', error))
        reject('定位失败')
      }
    })
  }

  // 搜索地址
  async searchLocation (keyword, cityName, type = 'search') {
    try {
      const url = `https://apis.map.qq.com/ws/place/v1/search?key=${this.tencentKey1}&keyword=${encodeURI(keyword)}&boundary=region(${cityName}, 0)`
      const location = await this.fetch(url)
      if (location.status === 0) {
        return location
      } else {
        throw new Error('搜索位置信息失败')
      }
    } catch (error) {
      console.log(chalk.red('搜索位置信息失败', error))
      throw new Error('搜索位置信息失败')
    }
  }

  // 计算距离
  async getDistance (from, to) {
    try {
      const url = `https://apis.map.qq.com/ws/distance/v1/matrix?key=${this.tencentKey1}&from=${from}&to=${to}`
      const distance = await this.fetch(url)
      if (distance.status === 0) {
        const resultArr = []
        distance.result.rows.forEach(item => {
          item.elements.forEach(col => {
            console.log(col)
            const time = parseInt(col.duration) + 1200
            // 分钟向上取整
            let duration = Math.ceil(time % 3600 / 60) + '分钟'
            // 小时向下取整
            const hours = Math.floor(time / 3600)
            if (hours) {
              duration = hours + '小时' + duration
            }
            resultArr.push({
              distance: item.elements.distance,
              duration
            })
          })
        })
        return resultArr
      } else {
        throw new Error('调用腾讯地图测距失败')
      }
    } catch (error) {
      console.log(chalk.red('调用腾讯地图测距失败', error))
      throw new Error('调用腾讯地图测距失败')
    }
  }

  // 通过经纬度获取用户精确位置
  // 使用腾讯地图逆地址解析api获取精确地址信息(即由经纬度获取用户详细地址)
  async getExactLocationByGeo (lat, lng) {
    try {
      let url = `https://apis.map.qq.com/ws/geocoder/v1/?key=${this.tencentKey1}&location=${lat},${lng}`
      let address = await this.fetch(url)
      console.log(url, address)
      if (address.status !== 0) {
        url = `https://apis.map.qq.com/ws/geocoder/v1/?key=${this.tencentKey2}&location=${lat},${lng}`
        address = await this.fetch(url)
      }
      if (address.status === 0) {
        return address
      } else {
        throw new Error('通过经纬度获取用户精确位置失败')
      }
    } catch (error) {
      console.log(chalk.red('通过经纬度获取用户精确位置失败', error))
      throw new Error('通过经纬度获取具体位置失败')
    }
  }

  // 通过Ip获得用户精确位置
  async getExactLocationByIp (req) {
    try {
      // 先通过Ip获取经纬度
      let address = await this.getLocationByIp(req)
      // 再调用getExactLocationByGeo通过经纬度获取用户精确位置
      address = await this.getExactLocationByGeo(address.lat, address.lng)
      return address
    } catch (error) {
      console.log(chalk.red('通过Ip获取用户精确位置失败', error))
      throw new Error(error)
    }
  }
}

export default LocationComponent
