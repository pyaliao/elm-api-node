'use strict'

// 第三方模块
import formidable from 'formidable'
import dtime from 'time-formater'
import chalk from 'chalk'

// 自定义模块
import BaseComponent from '../common/baseComponent'
import OrderModel from '../models/orderModel'
import CartModel from '../models/cartModel'
import AddressModel from '../models/addressModel'

class Order extends BaseComponent {
  constructor () {
    super()
    this.postOrder = this.postOrder.bind(this)
  }

  // 提交订单
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
        await OrderModel.create(orderData)
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

  // 获取当前用户的所有订单
  async getOrderList (req, res, next) {
    const userId = req.params.userId
    const { limit = 0, offset = 0 } = req.query
    try {
      if (!userId || !Number(userId)) {
        throw new Error('userId参数错误')
      } else if (!Number(limit)) {
        throw new Error('limit参数错误')
      } else if (!Number(offset)) {
        throw new Error('offset参数错误')
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
    try {
      let orders = await OrderModel.find({ userId }).sort({ id: -1 }).limit(Number(limit)).skip(Number(offset))
      const now = new Date().getTime()
      // map返回一个新数组，但是不会改变原数组，新数组每个元素是回调函数返回值
      orders = orders.map(item => {
        // 判断订单是否超时
        if (now - item.orderTime < 900000) {
          item.statusBar.title = '等待支付'
        } else {
          item.statusBar.title = '支付超时'
        }
        // 从下单到现在过去的时间
        item.timePass = Math.ceil((now - item.orderTime) / 1000)
        // 将新的信息保存到数据库
        item.save()
        return item
      })
      res.send(orders)
    } catch (error) {
      console.log(chalk.red('获取订单列表失败'), error)
      res.send({
        status: 0,
        type: 'ERROR_GET_ORDER_LIST',
        message: '获取订单列表失败'
      })
    }
  }

  // 获取某个订单的详细信息
  async getOneOrderInfo (req, res, next) {
    const { userId, orderId } = req.params
    try {
      if (!userId || !Number(userId)) {
        throw new Error('userId参数错误')
      } else if (!orderId || !Number(orderId)) {
        throw new Error('orderId参数错误')
      }
    } catch (error) {
      console.log(chalk.red(error.message))
      res.send({
        status: 0,
        type: 'GET_ERROR_PARAMS',
        message: error.message
      })
    }
    try {
      // findOne返回第一个找到的document
      // 此处按_id自动倒序排序并返回第一个找到的document
      const order = await OrderModel.findOne({ id: orderId }, '-_id')
      const addressInfo = await AddressModel.findOne({ id: order.addressId })
      const orderDetail = {
        ...order,
        address: addressInfo.address,
        consignee: addressInfo.name,
        deliverTime: '尽快送达',
        paymethod: '在线支付',
        phone: addressInfo.phone
      }
      res.send(orderDetail)
    } catch (error) {
      console.log(chalk.red('获取订单信息失败', error))
      res.send({
        status: 0,
        type: 'ERROR_GET_ORDER_INFO',
        message: '获取订单信息失败'
      })
    }
  }

  // 获取某个餐馆的所有订单或者所有餐馆的所有订单
  async getAllOrders (req, res, next) {
    const { restaurantId, limit = 20, offset = 0 } = req.query
    try {
      let filter = {}
      if (restaurantId && Number(restaurantId)) {
        filter = { restaurantId }
      }
      // 如果restaurantId存在，就查询restaurantId对应餐馆的所有订单
      // 如果restaurantId不存在，就查询所有的订单
      let allOrders = await OrderModel.find(filter)
      const now = new Date().getTime()
      allOrders = allOrders.map(item => {
        if (now - item.orderTime < 900000) {
          item.statusBar.title = '等待支付'
        } else {
          item.statusBar.title = '支付超时'
        }
        item.timePass = Math.ceil((now - item.orderTime) / 1000)
        item.save()
        return item
      })
      res.send(allOrders)
    } catch (error) {
      console.log(chalk.red('获取所有订单数据失败', error))
      res.send({
        status: 0,
        type: 'GET_ORDER_DATA_ERROR',
        message: '获取所有订单数据失败'
      })
    }
  }

  // 获取某个餐馆的订单数量或者所有的餐馆的订单数量
  async getOrdersCount (req, res, next) {
    const restaurantId = req.restaurantId
    try {
      let filter = {}
      if (restaurantId && Number(restaurantId)) {
        filter = { restaurantId }
      }
      const count = OrderModel.find(filter).count()
      res.send({
        status: 1,
        count
      })
    } catch (error) {
      console.log(chalk.red('获取订单数量失败', error))
      res.send({
        status: 0,
        type: 'ERROR_GET_ORDER_COUNT',
        message: '获取订单数量失败'
      })
    }
  }
}

export default new Order()
