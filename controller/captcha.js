'use strict'

import Captchapng from 'captchapng'

class Captcha {
  constructor () {
    this.getCaptcha = this.getCaptcha.bind(this)
  }

  async getCaptcha (req, res, next) {
    const cap = parseInt(Math.random() * 9000 + 1000)
    const p = new Captchapng(80, 30, cap)
    p.color(0, 0, 0, 0) // 数字颜色
    p.color(80, 80, 80, 255) // 整体背景色
    // 获取图片的base64字符串编码
    const imgbase64 = p.getBase64()
    // 将base64字符串转换为buffer，此buffer可以直接返回给前台,也可以写入文件存储
    // const img = Buffer.from(imgbase64, 'base64')
    // res.writeHead(200, { 'Content-Type': 'image/png' })
    // res.end('data:image/png;base64,' + imgbase64)
    res.cookie('cap', cap, { maxAge: 300000, httpOnly: true })
    res.send({
      status: 1,
      code: 'data:image/png;base64,' + imgbase64
    })
  }
}

export default new Captcha()
