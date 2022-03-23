import express from 'express'
import DBConnection from './mongodb/DBConnection.js'
import Activity from './models/activityModel.js'
import Category from './models/categoryModel.js'
import chalk from 'chalk'

const row = Category.find({
  id: 207
}, function (err, data) {
  if (err) return console.log(chalk.red(err))
  console.log(data)
})
const app = express()

app.get('/', function (req, res) {
  res.send('hello, express, developed by aliao')
})

app.listen(3000, function () {
  console.log('row----------------', row)
  console.log('server is running on localhost:3000, develop by aliao')
})
