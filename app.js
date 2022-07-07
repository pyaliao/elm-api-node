import express from 'express'
import chalk from 'chalk'
// 路由配置文件
import router from './routes/index.js'
import db from './mongodb/DBConnection.js'
// cookie-parser：一个cookie解析中间件
import cookieParser from 'cookie-parser'
// express-session：一个express模块，用来生成session的
import session from 'express-session'
// MongoDB session store for Connect and Express written in Typescript
// connect-mongo：是一个使用typescript为connect和express库编写的一个进行session存储的库
import connectMongo from 'connect-mongo'
// 中间件：winston，一个多路传输的日志记录库
import winston from 'winston'
// express-winston：一个中间件，在express应用中提供请求及错误的日志记录给你
import expressWinston from 'express-winston'
// 中间件：防止单页面应用在直接访问某个路径时，找不到页面而返回404
import history from 'connect-history-api-fallback'

// 创建express实例
const app = express()

// 对所有类型的http请求，以及所有请求路径进行处理的中间件
app.all('*', (req, res, next) => {
  console.log(req.headers)
  const { origin, Origin, referer, Referer } = req.headers
  const allowOrigin = origin || Origin || referer || Referer || '*'
  // 设置响应头
  res.header('Access-Control-Allow-Origin', allowOrigin)
  




  next()
})

app.get('/', function (req, res) {
  // console.log(req)
  res.send('hello, express, developed by aliao')
})

app.listen(3000, function () {
  console.log('server is running on localhost:3000, develop by aliao')
})
