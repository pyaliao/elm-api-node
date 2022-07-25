'use strict'

import BaseComponent from "../common/baseComponent"
import AddressModel from '../models/addressModel'
import formidable from "formidable"

class Address extends BaseComponent {
  constructor () {
    super()
    this.addAddress = this.addAddress.bind(this)
  }

  async getAddress (req, res, next) {
    const userId = req.params.user_id
    if (!userId || !Number(userId)) {
      res.send({
        type: 'ERROR_USER_ID',
        message: 'user_id参数'
      })
      return
    }
    try {
      const addressList = await AddressModel.find({ userId }, '-_id')
      res.send(addressList)
    } catch (error) {
      console.log('获取收货地址失败', error)
      res.send({
        type: 'ERROR_GET_ADDRESS',
        message: '获取收货地址列表失败'
      })
    }
  }

  async addAddress (req, res, next) {
    const form = new formidable({})
    form.parse(req, async (err, fields, files) => {
      const userId = req.params.userId
      const { address, address}
    })
  }
}
