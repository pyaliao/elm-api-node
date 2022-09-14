'use strict'

import formidable from "formidable"
import dtime from 'time-formater'

import BaseComponent from "../common/baseComponent"
import OrderModels from '../models/orderModel'
import CartModel from '../models/cartModel'
import AddressModel from '../models/addressModel'
import chalk from "chalk"

class Order extends BaseComponent {
  constructor () {
    super()
    this.postOrder = this.postOrder.bind(this)
  }

  async postOrder (req, res, next) {
    const form = new formidable({})
    form.parse(req, async (err, fields, files) => {
      if (err) {
        console.log(chalk.red('formidable解析出错'), err)
        res.send({
          status: 1,
          message: '下单失败'
        })
        return
      }
      const { userId, cartId } = req.params
      const { addressId, comeFrom = 'mobileWeb', deliverTime = '', description, entities, geohash, paymethodId = 1 } = fields
      try {
        if (!Array.isArray(entities) || !entities.length) {
          throw new Error('entities参数错误')
        } else if (!Array.isArray(entities[0]) || !entities[0].length) {
          throw new Error('entities参数错误')
        } else if (!addressId) {
          throw new Error('addressId参数错误')
        } else if (!userId || !Number(userId)) {
          throw new Error('userId参数错误')
        } else if (!cartId || !Number(cartId)) {
          throw new Error('cartId参数错误')
        } else if ()
      } catch (error) {
        
      }
    })
  }
}
