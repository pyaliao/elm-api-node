'use strict'

import BaseComponent from './baseComponent'

// 腾讯WebServiceAPI 定位服务调配组件

class LocationComponent extends BaseComponent {
  constructor () {
    super()
    this.tencentKey1 = 'W4ZBZ-P4ZKD-QUG4H-PQPWR-U5KB2-X5BCV'
    this.tencentKey2 = 'OM5BZ-WVI3J-TPEF2-FFENM-SGHK7-C2BLZ'
  }

  async getPosition (req) {
    return new Promise((resolve, reject) => {
      let ip
      // 默认定位IP（西安市）
      const defaultIp = '219.145.19.178'
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
        console.log(result)
        if (result.json().status != 0) {
          url = `https://apis.map.qq.com/ws/location/v1/ip?ip=${ip}&key=${this.tencentKey2}`
          result = await this.fetch(url)
        }
        result = result.json()
        if (result.status === 0) {
          const cityInfo = {
            lat: result.result.location.lat,
            lng: result.result.location.lng,
            city: result.result.ad_info.city
          }
          cityInfo.city = cityInfo.city.replace(new RegExp('\\u' + '市'.charCodeAt(0).toString(16), 'g'), '')
          resolve(cityInfo)
        } else {
          console.log('定位失败', result)
          reject('定位失败')
        }
      } catch (error) {
        reject(error)
      }
    })
  }
}
