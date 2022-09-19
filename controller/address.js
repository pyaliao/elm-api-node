'use strict'

import formidable from 'formidable'
import chalk from 'chalk'

import BaseComponent from '../common/baseComponent'
import AddressModel from '../models/addressModel'

// 继承BaseComponent类
class Address extends BaseComponent {
  constructor () {
    super()
    this.addAddress = this.addAddress.bind(this)
  }

  async getAddress (req, res, next) {
    const userId = req.params.user_id
    if (!userId || !Number(userId)) {
      res.send({
        type: 'ERROR_USER_ID',
        message: 'user_id参数'
      })
      return
    }
    try {
      const addressList = await AddressModel.find({ userId }, '-_id')
      res.send(addressList)
    } catch (error) {
      console.log('获取收货地址失败', error)
      res.send({
        type: 'ERROR_GET_ADDRESS',
        message: '获取收货地址列表失败'
      })
    }
  }

  async addAddress (req, res, next) {
    const form = formidable({})
    form.parse(req, async (err, fields, files) => {
      if (err) {
        next(err)
        return
      }
      const userId = req.params.userId
      // 解构赋值并有默认值
      const { address, addressDetail, geoHash, name, phone, phoneBack, poiType = 0, gender, tag, tagType } = fields
      try {
        // Number转化规则：
        // 1. undefined -> NaN
        // 2. 非纯数字字符串(除了去掉首位空格后为纯数字字符串的) -> NaN
        // 3. 数字 -> 数字
        // 4. true -> 1  false -> 0
        // 5. null -> 0
        // 6. '-Infinity' -> -Infinity    'Infinity' -> Infinity
        // 7. Date实例 -> 时间戳（自1970以来的毫秒数）
        // !NaN -> true
        if (!userId || !Number(userId)) {
          throw new Error('用户ID参数错误')
        } else if (!address) {
          throw new Error('地址信息错误')
        } else if (!addressDetail) {
          throw new Error('详细地址信息错误')
        } else if (!geoHash) {
          throw new Error('geohash参数错误')
        } else if (!name) {
          throw new Error('收货人姓名错误')
        } else if (!phone) {
          throw new Error('收货人手机号错误')
        } else if (!gender) {
          throw new Error('性别错误')
        } else if (!tag) {
          throw new Error('标签错误')
        } else if (!tagType) {
          throw new Error('标签类型错误')
        }
      } catch (error) {
        console.log(chalk.red(error.message))
        res.send({
          status: 0,
          type: 'GET_WRONG_PARAM',
          message: error.message
        })
        return
      }
      try {
        const addreeId = await this.getId('addressId')
        const newAddress = {
          id: addreeId,
          address,
          phone,
          phoneBack,
          name,
          geoHash,
          addressDetail,
          gender,
          tag,
          tagType,
          userId
        }
        await AddressModel.create(newAddress)
        res.send({
          status: 1,
          message: '添加地址成功'
        })
      } catch (error) {
        console.log(chalk.red('添加地址失败', error))
        res.send({
          status: 0,
          type: 'ERROR_ADD_ADDRESS',
          message: '添加地址失败'
        })
      }
    })
  }

  async deleteAddress (req, res, next) {
    const { userId, addressId } = req.params
    if (!userId || !Number(userId) || !addressId || !Number(addressId)) {
      res.send({
        type: 'ERROR_PARAMS',
        message: '参数错误'
      })
      return
    }
    try {
      // 查找并删除此条addressID对应的address记录
      await AddressModel.findOneAndRemove({ id: addressId })
      res.send({
        status: 1,
        message: '删除地址成功'
      })
    } catch (error) {
      console.log(chalk.red('删除地址失败', error))
      res.send({
        status: 0,
        type: 'ERROR_DELETE_ADDRESS',
        message: '删除地址失败'
      })
    }
  }

  async getAddressById (req, res, next) {
    const addressId = req.params.addressId
    if (!addressId || !Number(addressId)) {
      res.send({
        type: 'ERROR_PARAMS',
        message: '参数错误'
      })
      return
    }
    try {
      const address = await AddressModel.findOne({ id: addressId })
      res.send(address)
    } catch (error) {
      console.log(chalk.red('获取地址信息失败', error))
      res.send({
        type: 'ERROR_GET_ADDRESS',
        message: '获取地址信息失败'
      })
    }
  }
}

export default new Address()
