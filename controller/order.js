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
        }
      } catch (error) {
        console.log(chalk.red(error.message, error))
        res.send({
          status: 0,
          type: 'ERROR_PARAMS',
          message: error.message
        })
        return
      }
      let cartDetail, orderId
      try {
        // 查询carts表中id为cartId的cart详细信息
        cartDetail = await CartModel.findOne({ id: cartId })
        // 获取orderId
        orderId = await this.getId('orderId')
      } catch (error) {
        console.log(chalk.red('数据查询失败', error))
        res.send({
          status: 0,
          type: 'ERROR_QUERY_DATA',
          message: '获取订单失败'
        })
        return
      }
      // 获取配送费
      const deliverFee = cartDetail.cart.deliverCount
      const orderData = {
        basket: {
          group: entities,
          packaging: {
            name: cartDetail.cart.extra[0].name,
            price: cartDetail.cart.extra[0].price,
            quantity: cartDetail.cart.extra[0].quantity
          },
          deliverFee
        },
        restaurantId: cartDetail.cart.restaurantId,
        restaurantImgUrl: cartDetail.cart.restaurantInfo.img,
        restaurantName: cartDetail.cart.restaurantInfo.name,
        formattedCreationTime: dtime().format('YYYY-MM-DD HH:mm'),
        orderTime: new Date().getTime(),
        timePass: 900,
        statusBar: {
          color: 'f60',
          imageType: '',
          subTitle: '15分钟内支付'
        },
        totalAmount: cartDetail.cart.total,
        totalQuantity: entities[0].length,
        uniqueId: orderId,
        id: orderId,
        userId,
        addressId
      }
      try {
        // 将订单数据存储到数据库
        await OrderModels.create(orderData)
        res.send({
          status: 0,
          success: '下单成功，请及时付款',
          needValidation: false
        })
      } catch (error) {
        console.log(chalk.red('订单数据保存失败'))
        res.send({
          status: 0,
          type: 'ERROR_SAVE_ORDER',
          message: '订单保存失败'
        })
      }
    })
  }
}
