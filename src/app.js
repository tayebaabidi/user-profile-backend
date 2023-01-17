const express = require('express')
require('./db/mongoose')
const userRouter = require('./routers/user')
const bodyParser = require('body-parser')

const app = express()
const cors = require('cors');
const corsOptions ={
    origin:'http://localhost:3000', 
    credentials:true,            //access-control-allow-credentials:true
    optionSuccessStatus:200
}
app.use(cors(corsOptions));
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(userRouter)

module.exports = app