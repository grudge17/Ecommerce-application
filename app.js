const express=require('express')
const mongoose = require('mongoose');
require('dotenv').config()
const morgan=require('morgan')
const bodyParser=require('body-parser')
const cookieParser=require('cookie-parser')
const uuidv1=require('uuidv1')
const expressValidator=require('express-validator')

//import routes
const userRoutes=require('./routes/user')

//app
const app=express()

//DB
mongoose.connect(
    process.env.MONGO_URI,
    {useNewUrlParser: true,
    useCreateIndex:true
    })
  .then(() => console.log('DB Connected'))
   
  mongoose.connection.on('error', err => {
    console.log(`DB connection error: ${err.message}`)
  });

//middlewares
app.use(morgan('dev')) 
app.use(bodyParser.json()) 
app.use(cookieParser())
app.use(expressValidator())

//  routes middleware
app.use("/api",userRoutes)

const port=process.env.PORT || 8000
app.listen(port,()=>{
    console.log(`Server is running on ${port}`)
})