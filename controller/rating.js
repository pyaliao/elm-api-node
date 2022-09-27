'use strict'

import chalk from 'chalk'
import RatingModel from '../models/ratingModel'

class Rating {
  constructor () {
    this.types = ['ratingList', 'scores', 'tags']
    this.getRatings = this.getRatings.bind(this)
    this.getScores = this.getScores.bind(this)
    this.getTags = this.getTags.bind(this)
  }

  async initData (restaurantId) {
    try {
      const initStaus = await RatingModel.initData(restaurantId)
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
    if (!restaurantId || !Number(restaurantId)) {
      res.send({
        status: 0,
        type: 'ERROR_PARAMS',
        message: '餐馆id参数错误'
      })
      return
    }
    try {
      const ratings = await RatingModel.getData(restaurantId, this.types[0])
      res.send(ratings)
    } catch (error) {
      console.log(chalk.red('获取当前餐馆评论列表失败', error))
      res.send({
        status: 0,
        type: 'ERROR_GET_RATINGS',
        message: '未找到当前餐馆的评论数据'
      })
    }
  }

  async getScores (req, res, next) {
    const restaurantId = req.params.restaurantId
    if (!restaurantId || !Number(restaurantId)) {
      res.send({
        status: 0,
        type: 'ERROR_PARAMS',
        message: '餐馆ID参数错误'
      })
      return
    }
    try {
      const scores = await RatingModel.getData(restaurantId, this.type[1])
      res.send(scores)
    } catch (error) {
      console.log(chalk.red('获取当前餐馆评分数据失败', error))
      res.send({
        status: 0,
        type: 'ERROR_GET_SCORES',
        message: '未找到当前餐馆评分数据'
      })
    }
  }

  async getTags (req, res, next) {
    const restaurantId = req.params.restaurantId
    if (!restaurantId || !Number(restaurantId)) {
      res.send({
        status: 0,
        type: 'ERROR_PARAMS',
        message: '餐馆ID参数错误'
      })
      return
    }
    try {
      const tags = await RatingModel.getData(restaurantId, this.types[2])
      res.send(tags)
    } catch (error) {
      console.log(chalk.red('获取当前餐馆标签数据失败', error))
      res.send({
        status: 0,
        type: 'ERROR_GET_TAGS',
        message: '未找到当前餐馆标签数据'
      })
    }
  }
}

export default new Rating()
