'use strict'

import chalk from 'chalk'

import BaseComponent from '../common/baseComponent'
import RemarkModel from '../models/remarkModel'

class Remark extends BaseComponent {
  constructor () {
    super()
    this.getRemarks = this.getRemarks.bind(this)
  }

  async getRemarks (req, res, next) {
    const cartId = req.params.cartId
    if (!cartId || !Number(cartId)) {
      res.send({
        status: 0,
        type: 'ERROR_PARAMS',
        message: '购物车ID参数错误'
      })
    }
    try {
      const remark = await RemarkModel.find({}, '-_id')
      res.send(remark)
    } catch (error) {
      console.log(chalk.red('获取备注信息失败', error))
      res.send({
        status: 0,
        type: 'ERROR_GET_REMARK',
        message: '获取备注信息失败'
      })
    }
  }
}

export default new Remark()
