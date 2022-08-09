import express from 'express'
import chalk from 'chalk'
import config from 'config'
// 路由配置文件
import router from './routes/index.js'
import db from './mongodb/DBConnection.js'
// cookie-parser：一个cookie解析中间件
import cookieParser from 'cookie-parser'
// express-session：一个express模块，用来生成session的
import session from 'express-session'
// MongoDB session store for Connect and Express written in Typescript
// connect-mongo：是一个使用typescript为connect和express库编写的一个进行session存储的库
import MongoStore from 'connect-mongo'
// 中间件：winston，一个多路传输的日志记录库
import winston from 'winston'
// express-winston：一个中间件，在express应用中提供请求及错误的日志记录给你
import expressWinston from 'express-winston'
// 中间件：防止单页面应用在直接访问某个路径时，找不到页面而返回404
import history from 'connect-history-api-fallback'

import fetch from 'node-fetch'
import address from './controller/address.js'
import BaseComponent from './common/baseComponent.js'
import captcha from './controller/captcha.js'
import LocationComponent from './common/locationComponent.js'
import city from './controller/city'
import CityModel from './models/cityModel.js'
const baseHandler = new BaseComponent()
// 创建express实例
const app = express()

// 对所有类型的http请求，以及所有请求路径进行处理的中间件
app.all('*', (req, res, next) => {
  const { origin, Origin, referer, Referer } = req.headers
  const allowOrigin = origin || Origin || referer || Referer || '*'
  // 设置响应头
  res.header('Access-Control-Allow-Origin', allowOrigin)
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Request-With')
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, OPTIONS, DELETE')
  res.header('Access-Control-Allow-Credentials', true)
  res.header('X-Powered-By', 'express')
  // 如果是预检请求，则直接返回响应，但是不带响应体
  if (req.method === 'OPTIONS') {
    // Sets the response HTTP status code to statusCode
    // and sends the registered status message as the text response body.
    res.sendStatus(200)
  }
  next()
})

// 注册cookie解析中间件
app.use(cookieParser())
// session()：根据给定的参数创建一个session中间件
app.use(session({
  name: config.get('session.name'),
  secret: config.get('session.secret'),
  resave: true,
  saveUninitialized: false,
  cookie: config.get('session.cookie'),
  store: MongoStore.create({
    mongoUrl: config.get('mongodbUrl')
  })
}))

// router(app)

app.get('/', async function (req, res, next) {
  const pinyinName = await city.getCityName(req)
  console.log(chalk.green(pinyinName))
  res.send(pinyinName)
  // const result = await fetch('https://apis.map.qq.com/ws/location/v1/ip?ip=219.145.19.178&key=W4ZBZ-P4ZKD-QUG4H-PQPWR-U5KB2-X5BCV')
  // const data = await result.json()
  // console.log(data)
  // const location = new LocationComponent()
  // const cityInfo = await location.getLocation()
  // const locationData = await location.searchLocation('大雁塔', cityInfo.cityName)
  // const from = locationData.data[0].location.lat + ',' + locationData.data[0].location.lng
  // const to = locationData.data[8].location.lat + ',' + locationData.data[8].location.lng
  // const distance = await location.getDistance(from, to)
  // await location.getDetailAddress(cityInfo.lat, cityInfo.lng)
  // console.log(cityInfo)
  // res.send(distance)
  // res.send('hello, express, developed by aliao')
  // res.send(`
  //   <h2>With <code>"express"</code> npm package</h2>
  //   <form action="/addimg/food" enctype="multipart/form-data" method="post">
  //     <div>Text field title: <input type="text" name="title" /></div>
  //     <div>File: <input type="file" name="file" multiple="multiple" /></div>
  //     <input type="submit" value="Upload" />
  //   </form>
  // `)
})

// app.post('/addimg/:type', baseHandler.qiniu)
// app.post('/users/:userId/addresses', address.addAddress)
app.get('/captcha', captcha.getCaptcha)
app.listen(config.get('port'), function () {
  console.log('server is running on localhost:3000, develop by aliao')
})
