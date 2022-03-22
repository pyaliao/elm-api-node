import express from 'express'
import db from './mongodb/DBConnection.js'

const admin = db.model('activities')
const row = admin.find({ name: '准时达' })

const app = express()

app.get('/', function (req, res) {
  res.send('hello, express, developed by aliao')
})

app.listen(3000, function () {
  console.log(row)
  console.log('server is running on localhost:3000, develop by aliao')
})
