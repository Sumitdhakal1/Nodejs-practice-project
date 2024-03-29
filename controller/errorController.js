const AppError = require("../utils/appError")

const handelCastErrorDB = err =>{
    const message =`Invalid ${err.path}: ${err.value}.`
    return new AppError(message, 400)
}

const handleDuplicateFieldsDB = err =>{
    const message =`Duplicate Field value.please choose another value`;
    return new AppError(message, 400)
}

const handelJWTError = () => new AppError('Invalid Token.Please login again')

const handelExpiredError = () => new AppError('Your Token has expired.please login again', 401)

const handelValidationErrorDB = err =>{
    const error = Object.values(err.errors).map(el=> el.message)
  const message=`Invalid input data. ${errors.join('.')}`
  return new AppError(message, 400)
}
const sendErrorDev = (err, res) => {
   
    res.status(err.statusCode).json({
        status: err.status,
        error: err,
        message: err.message,
        stack: err.stack
    });
}


const sendErrorProd = (err, res) => {
    // Operational, trusted error: send message to client
    if (err.isOperational) {
      res.status(err.statusCode).json({
        status: err.status,
        message: err.message
      });
  
      // Programming or other unknown error: don't leak error details
    } else {
      // 1) Log error
      console.error('ERROR 💥', err);
  
      // 2) Send generic message
      res.status(500).json({
        status: 'error',
        message: 'Something went very wrong!'
      });
    }
  };

module.exports = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error'

    if (process.env.NODE_ENV === 'development') {
        res.status(err.statusCode).json({
            status: err.status,
            error: err,
            message: err.message,
            stack: err.stack
        });
       
    } else if (process.env.NODE_ENV === 'production') {
        let error = {...err};
        if(error.name === 'CastError') error = handelCastErrorDB(error)
        if (error.code === 11000) error = handleDuplicateFieldsDB(error);
        if(error.name === 'ValidationError') error = handelValidationErrorDB(error);
        if(error.name === 'JsonWebTokenError') error = handelJWTError(error);
        if(error.name === 'TokenExpiredError') error = handelExpiredError(error);
        sendErrorProd(error, res)

    }

}