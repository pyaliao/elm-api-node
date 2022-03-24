import express from 'express'
import DBConnection from './mongodb/DBConnection.js'
import Activity from './models/activityModel.js'
import Category from './models/categoryModel.js'
import Delivery from './models/deliveryModel.js'
import Entry from './models/entryModel.js'
import Explian from './models/explainModel.js'
import Hongbao from './models/hongbaoModel.js'
import Payment from './models/paymentModel.js'
import Rate from './models/rateModel.js'
import Remark from './models/remarkModel.js'
import chalk from 'chalk'

const app = express()

app.get('/', function (req, res) {
  res.send('hello, express, developed by aliao')
})

app.listen(3000, function () {
  console.log('server is running on localhost:3000, develop by aliao')
})
