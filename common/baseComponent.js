import fetch from 'node-fetch'
import Ids from '../models/idModel'
import formidable from 'formidable'
import path from 'path'
import fs from 'fs'
import qiniu from 'qiniu'
import gm from 'gm'

export default class BaseComponent {
  constructor () {
    this.idList = [
      'restaurntId',
      'foodId',
      'orderId',
      'userId',
      'addressId',
      'cartId',
      'imgId',
      'categoryId',
      'itemId',
      'skuId',
      'adminId',
      'statisId'
    ]
    this.imgType = [
      'shop',
      'food',
      'avatar',
      'default'
    ]
    const ACCESS_KEY = 'EUqJmlcKHV6v05sFsxIiEC5Arxi1G5vW2gGPyG9c'
    const SECRET_KEY = 'HqxmOVRpFNtN_yRDjHBnihVOGqxeAmBvQi-2Naed'
    this.mac = new qiniu.auth.digest.Mac(ACCESS_KEY, SECRET_KEY)
    // 显示将实例方法中的this指向实例
    this.uploadImg = this.uploadImg.bind(this)
    this.qiniu = this.qiniu.bind(this)
  }

  async fetch(url = '', data = {}, type = 'GET', resType = 'JSON') {
    // 将请求方法及响应数据类型转换为大写
    type = type.toUpperCase()
    resType = resType.toUpperCase()
    if (type === 'GET') {
      let dataStr = ''
      // Object.keys() 方法会返回一个由一个给定对象的自身可枚举属性组成的数组
      Object.keys(data).forEach(key => {
        dataStr += key + '=' + data[key] + '&'
      })
      if (dataStr) {
        dataStr = dataStr.substring(0, dataStr.lastIndexOf('&'))
        url = `${url}?${dataStr}`
      }
    }
    const requestConfig = {
      method: type,
      headers: {
        Accept: 'application/json',
        'content-type': 'application/json'
      }
    }
    if (type === 'POST') {
      Object.defineProperty(requestConfig, 'body', {
        value: JSON.stringify(data)
      })
    }
    let responseJson
    try {
      const response = await fetch(url, requestConfig)
      if (resType === 'TEXT') {
        responseJson = await response.text()
      } else {
        responseJson = await response.json()
      }
    } catch (error) {
      console.log('数据请求失败', error)
      throw new Error(error)
    }
    return responseJson
  }

  async getId (type) {
    if (!this.idList.includes(type)) {
      console.log('id类型错误')
      throw new Error('id类型错误')
      return
    }
    try {
      const idData = await Ids.findOne()
      idData[type]++
      // 将数据写入数据库
      await idData.save()
      // 返回当前类型的id值
      return idData[type]
    } catch (error) {
      console.log(`获取${type}失败`)
      throw new Error(error)
    }
  }

  async getPath(req, res) {
    return new Promise((resolve, reject) => {
      const form = formidable({})
      form.uploadDir = './public/img'
      form.parse(req, async (err, fields, files) => {
        // 经过formidable处理后，文件被存储在服务器上某个目录下，并且filepath获取文件完整名，不过文件没有后缀
        // newFilename是文件在服务器上的新名字且不带后缀(即经过formidable处理的)，originalFilename是文件的原始名并带有后缀
        let imgId
        try {
          imgId = await this.getId('imgId')
        } catch (error) {
          console.log('获取图片id失败')
          fs.unlinkSync(files.file.filepath)
          reject('获取图片id失败')
        }
        const hashName = (new Date().getTime() + Math.ceil(Math.random() * 10000)).toString(16) + imgId
        const extName = path.extname(files.file.originalFilename)
        
        if (!['.jpg', '.jpeg', '.png'].includes(extName)) {
          fs.unlinkSync(files.file.filepath)
          res.send({
            status: 0,
            type: 'ERROR_EXTNAME',
            message: '文件格式错误'
          })
          reject('图片上传失败')
        }
        const fullName = hashName + extName
        const repath = './public/img/' + fullName
        try {
          fs.renameSync(files.file.filepath, repath)
          gm(repath)
            .resize(200, 200, '!')
            .write(repath, async (error) => {
              if (error) {
                console.log('图片裁切失败', error)
                reject('图片裁切失败')
                return
              }
              resolve(fullName)
            })
        } catch (error) {
          console.log('保存图片失败', error)
          if (fs.existsSync(repath)) {
            fs.unlinkSync(repath)
          } else {
            fs.unlinkSync(files.file.filepath + extName)
          }
          reject('保存图片失败')
        }
      })
    })
  }

  async uploadImg (req, res, next) {
    const type = req.params.type
    try {
      const imgPath = await this.getPath(req, res)
      res.send({
        status: 1,
        imgPath
      })
    } catch (error) {
      console.log('图片上传失败', error)
      res.send({
        status: 0,
        type: 'ERROR_UPLOAD_IMG',
        message: '上传图片失败'
      })
    }
  }
  // 讲过图片保存到七牛
  async qiniu (req, type = 'default') {
    return new Promise((resolve, reject) => {
      const form = formidable({})
      form.uploadDir = './public/img'
      form.parse(req, async (err, fields, files) => {
        let imgId
        try {
          imgId = await this.getId('imgId')
        } catch (error) {
          fs.unlinkSync(files.file.filepath)
          console.log('获取图片id失败')
          reject('获取图片id失败')
        }
        const hashName = (new Date().getTime() + Math.ceil(Math.random() * 10000)).toString(16) + imgId
        const extName = path.extname(files.file.originalFilename)
        const fullName = hashName + extName
        const repath = './public/img/' + fullName
        try {
          const key = fullName
          // 覆盖上传除了需要简单上传所需要的信息之外，还需要想进行覆盖的文件名称，
          // 这个文件名称同时可是客户端上传代码中指定的文件名，两者必须一致，此处将上传文件名更新为新的文件名
          fs.renameSync(files.file.filepath, repath)
          const token = this.uptoken('node-elm', key)
          const qiniuImg = await this.uploadFile(token.toString(), key, repath)
          fs.unlinkSync(repath)
          resolve(qiniuImg)
        } catch (error) {
          fs.unlinkSync(files.file.filepath)
          console.log('保存至七牛失败')
          reject('保存至七牛失败')
        }
      })
    })
  }

  uptoken(bucket, key) {
    // 生成七牛覆盖上传的凭证
    const putPolicy = new qiniu.rs.PutPolicy({
      scope: bucket + ':' + key
    })
    return putPolicy.uploadToken(this.mac)
  }

  async uploadFile(uploadToken, key, localFile) {
    return new Promise((resolve, reject) => {
      // 存储支持空间创建在不同的机房，在使用 Node.js SDK 中的FormUploader和ResumeUploader上传文件之前，
      // 必须要构建一个上传用的config对象，在该对象中，可以指定空间对应的zone以及其他的一些影响上传的参数。
      const config = new qiniu.conf.Config()
      config.zone = qiniu.zone.Zone_z0
      // 最简单的上传，直接上传本地文件，使用表单方式
      const formUploader = new qiniu.form_up.FormUploader(config)
      const putExtra = new qiniu.form_up.PutExtra()
      formUploader.putFile(uploadToken, key, localFile, putExtra, function (resErr, resBody, resInfo) {
        if (!resErr) {
          if (resInfo.statusCode == 200) {
            resolve(respBody)
          } else {
            console.log(resInfo.statusCode);
            console.log(resBody);
          }
        } else {
          console.log('图片上传至七牛失败', resErr)
          reject(resErr)
        }
      })
    })
  }
}
