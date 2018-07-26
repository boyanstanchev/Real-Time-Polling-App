const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')
const cors = require('cors')

require('./config/db')

const app = express()

const poll = require('./route/poll')

app.use(express.static(path.join(__dirname, 'public')))

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))

app.use(cors())

app.use('/poll', poll)

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
  console.log('Server started on port: ' + PORT)
})