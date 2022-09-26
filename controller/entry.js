'use strict'

import chalk from 'chalk'
import EntryModel from '../models/entryModel'

class Entry {
  constructor () {}

  async getEntry (req, res, next) {
    try {
      const entries = await EntryModel.find({}, '-_id')
      res.send(entries)
    } catch (error) {
      console.log(chalk.red(error))
      res.send({
        status: 0,
        type: 'ERROE_GET_ENTRY_DATA',
        message: '获取entry数据失败'
      })
    }
  }
}
export default new Entry()
