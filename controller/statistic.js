'use strict'

import StatisticModel from '../models/statisticModel'
import UserInfoModel from '../models/userInfoModel'
import OrderModel from '../models/orderModel'
import AdminModel from '../models/adminModel'
import dtime from 'time-formater'
import chalk from 'chalk'

class Statistic {
  constructor () {
  }

  async getApiCallsCount (req, res, next) {
    const date = req.params.date
    if (!date) {
      console.log(chalk.red('date参数错误'))
      res.send({
        status: 0,
        type: 'ERROR_PARAMS_DATE',
        message: 'params参数date错误'
      })
      return
    }
    try {
      const count = await StatisticModel.find({ date }).count()
      res.send({
        status: 1,
        count
      })
    } catch (error) {
      console.log(chalk.red(`获取${date}当天API请求次数错误`, error))
      res.send({
        status: 0,
        type: 'ERROR_GET_ONEDAY_API_CALLS_COUNT',
        message: `获取${date}当天API请求次数错误`
      })
    }
  }

  async getAllApiCallsCount (req, res, next) {
    try {
      const count = await StatisticModel.count()
      res.send({
        status: 1,
        count
      })
    } catch (error) {
      console.log(chalk.red('获取所有API调用次数失败', error))
      res.send({
        status: 0,
        type: 'ERROR_GET_ALL_API_CALLS_COUNT',
        message: '获取所有API调用次数失败'
      })
    }
  }

  async getUserRegisterCountOneDay (req, res, next) {
    const date = req.params.date
    if (!date) {
      console.log(chalk.red('date参数错误'))
      res.send({
        status: 0,
        type: 'ERROR_PARAMS_DATE',
        message: 'params参数date错误'
      })
      return
    }
    try {
      const count = await UserInfoModel.find({ registerTime :  }).count()
    } catch (error) {
      
    }
  }
}
