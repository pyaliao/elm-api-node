'use strict'

import chalk from 'chalk'
import RatingModel from '../models/ratingModel'

class Rating {
  constructor () {
    this.types = ['rating', 'score', 'tag']
    this.getRatings = this.getRatings.bind(this)
    this.getScores = this.getScores.bind(this)
    this.getTags = this.getTags.bind(this)
  }

  async initData (restaurantId) {
    try {
      const initStaus = await RatingModel.initData()
      if (initStaus) {
        console.log(chalk.green('评论数据初始化成功'))
      } else {
        console.log(chalk.green('评论数据已被成功初始化过'))
      }
    } catch (error) {
      console.log(chalk.red('评论数据初始化失败'))
      throw new Error(error)
    }
  }

  async getRatings (req, res, next) {
    const restaurantId = req.params.restaurantId
    if (!restaurantId || Number(restaurantId)) {
      res.send({
        status: 0,
        type: 'ERROR_PARAMS',
        message: '餐馆id参数错误'
      })
      return
    }
  }
}
