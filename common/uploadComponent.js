import fetch from 'node-fetch'
import Ids from '../models/idModel'
import formidable from 'formidable'
import path from 'path'
import fs from 'fs'
import qiniu from 'qiniu'
import gm from 'gm'

qiniu.config.ACCESS_KEY = 'EUqJmlcKHV6v05sFsxIiEC5Arxi1G5vW2gGPyG9c'
qiniu.config.SECRET_KEY = 'HqxmOVRpFNtN_yRDjHBnihVOGqxeAmBvQi-2Naed'

export default class BaseComponent {
  constructor () {
    this.idList = [
      'restaurnt_id',
      'food_id',
      'order_id',
      'user_id',
      'address_id',
      'cart_id',
      'img_id',
      'category-id',
      'item-id',
      'sku-id',
      'admin-id',
      'statis-id'
    ]
    this.imgType = [
      'shop',
      'food',
      'avatar',
      'default'
    ]
    // 显示将实例方法中的this指向实例
    this.uploadImg = this.uploadImg.bind(this)
    this.qiniu = this.qiniu.bind(this)
  }

  async fetch (url = '', data = {}, type = 'GET', resType = 'JSON') {
    // 将请求方法及响应数据类型转换为大写
    type = type.toUpperCase()
    resType = resType.toUpperCase()
    if (type === 'GET') {
      let dataStr = ''
      // Object.keys() 方法会返回一个由一个给定对象的自身可枚举属性组成的数组
      Object.keys(data).forEach(key => {
        dataStr += key + '=' + data[key] + '&'
      })
      if (dataStr) {
        dataStr = dataStr.substring(0, dataStr.lastIndexOf('&'))
        url = `${url}?${dataStr}`
      }
    }
    const requestConfig = {
      method: type,
      headers: {
        Accept: 'application/json',
        'content-type': 'application/json'
      }
    }
    if (type === 'POST') {
      Object.defineProperty(requestConfig, 'body', {
        value: JSON.stringify(data)
      })
    }
    let responseJson
    try {
      const response = await fetch(url, requestConfig)
      if (resType === 'TEXT') {
        responseJson = await response.text()
      } else {
        responseJson = await response.json()
      }
    } catch (error) {
      console.log('数据请求失败', error)
      throw new Error(error)
    }
    return responseJson
  }

  async getId (type) {
    if (!this.idList.includes(type)) {
      console.log('id类型错误')
      throw new Error('id类型错误')
      return
    }
    try {
      const idData = await Ids.findOne()
      idData[type]++
      // 将数据写入数据库
      await idData.save()
      // 返回当前类型的id值
      return idData[type]
    } catch (error) {
      
    }
  }
}
