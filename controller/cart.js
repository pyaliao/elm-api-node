'use strict'

import BaseComponent from '../common/baseComponent'
import PaymentModel from '../models/paymentModel'
import ShopModel from '../models/shopModel'
import CartModel from '../models/cartModel'
import formidable from 'formidable'

class Cart extends from BaseComponent {
  constructor () {
    super()
    this.extra = [{
      description: '',
      name: '餐盒',
      price: 0,
      quantity: 1,
      type: 0
    }]
    this.checkout = this.checkout.bind(this)
  }

  async checkout (req, res, next) {
    const UID = req.session.UID
    const form = formidable({})
    form.parse(req, async (err, fields, files) => {
      const { comeFrom, geoHash, entities = [], restaurantId } = fields
      try {
        if (!Array.isArray(entities) || !entities.length) {
          throw new Error('entities参数错误')
        } else if (!Array.isArray(entities[0]) || !entities[0].length) {
          throw new Error('entities参数错误')
        } else if (!restaurantId) {
          throw new Error('restaurantId参数错误')
        }
      } catch (error) {
        console.log(chalk.red(error))
        res.send({
          status: 0,
          type: 'ERROR_PARAMS',
          message: error.message
        })
        return
      }
    })
  }
}