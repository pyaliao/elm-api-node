'use strict'

import BaseComponent from "./baseComponent"

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
        try {
          ip = req.ip
        } catch (error) {
          
        }
      }
    })
  }
}