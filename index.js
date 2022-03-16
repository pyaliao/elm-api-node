const express = require('express')
const app = express()

app.get('/', function (req, res) {
  res.send('hello, express, developed by aliao')
})

app.listen(3000, function () {
  console.log('server is running on localhost:3000, develop by aliao')
})
