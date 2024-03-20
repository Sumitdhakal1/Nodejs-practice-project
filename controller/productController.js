const Product = require('../models/productModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync')

exports.getAllProducts = catchAsync(async (req, res, next) => {
    const products = await Product.find(req.query);
    res.status(200).json({
        status: 'success',
        results: products.length,
        data: {
            products
        }
    });
});


exports.createProduct = catchAsync(async (req, res, next) => {
    const newProduct = await Product.create(req.body) 
    console.log(newProduct)
    res.status(200).json({
        status: 'success',
        data: {
            Product: newProduct
        }
    });
});



exports.getProduct = catchAsync(async (req, res, next) => {
    const product = await Product.findById(req.params.id)

    if(!product){
      return next(new AppError(' Product Not Found',404))
    }
    res.status(200).json({
        status: 'success',
        data: {
            product
        }
    })

})

exports.deleteProduct = catchAsync(async(req, res, next)=>{
  const product =  await Product.findByIdAndDelete(req.params.id)
  res.status(200).json({
    status:'success',
    data:null
  });
})


