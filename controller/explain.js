'use strict'

import chalk from 'chalk'
import ExplainModel from '../models/explainModel'

class Explain {
  constructor () {}

  async getExplain (req, res, next) {
    try {
      const explain = await ExplainModel.findOne()
      res.send(explain.data)
    } catch (error) {
      console.log(chalk.red(error))
      res.send({
        status: 0,
        type: 'ERROR_GET_SERVICE_DATA',
        message: '获取服务中心数据失败'
      })
    }
  }
}
export default new Explain()
