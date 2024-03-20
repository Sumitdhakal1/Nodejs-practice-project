const express = require('express')
process.on('uncaughtException', err =>{
    console.log('uncaught exception : shutting down')
    console.log(err.name, err.message);
        process.exit(1);
})
const app = express()
const AppError = require('./utils/appError')
const globalErrorHandler = require('./controller/errorController');
const port = 8000;
const productRouter = require('./routes/productRoutes')
const userRoute = require('./routes/userRoute')
const mongoose = require('mongoose')
const dotenv = require('dotenv');
dotenv.config({path:'./config.env'});

const DB = process.env.DATABASE.replace('<PASSWORD>',
process.env.DATABASE_PASSWORD)

mongoose.connect(DB)
.then(()=>{ console.log("Database is connected Successfully")})


app.use(express.json());
app.use(express.urlencoded({extended:true}))

app.use((req, res, next)=>{
    // console.log(req.headers)
    next()
})

app.use('/api/product', productRouter)
app.use('/api/user', userRoute)



//  app.all('*',(req, res , next)=>{

//     // const err = new Error(`cant find ${req.originalUrl} on this server`)
//     // err.status='fail'
//     // err.statusCode= 404
//     // next(err)
//     next(new AppError(`cant find ${req.originalUrl} on this server`, 404))
//  })
// // app.use((err, req, res, next)=>{
// //     err.statusCode = err.statusCode || 500;
// //     err.status = err.status || 'error'

// //     res.status(err.statusCode).json({
// //         status:err.status,
// //         message:err.message
// //     })
// // })
// /app.use(globalErrorHandler)
app.all('*', (req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
  });
  
  app.use(globalErrorHandler);

const server = app.listen(port, ()=>{
    console.log(`App is running on ${port} `)
})

process.on('unhandledRejection', err =>{
    console.log('unhandled rejection : shutting down')
    console.log(err.name, err.message);
    server.close(()=>{
        process.exit(1);
    });   
});

