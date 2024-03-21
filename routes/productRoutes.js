const express = require('express');
const productController = require('../controller/productController')
const authController = require('../controller/authController')
const router = express.Router()

router
.route('/')
.get(authController.protect, productController.getAllProducts)
.post(productController.createProduct)

router
.route('/:id')
.get(productController.getProduct)
.delete(authController.protect,
     authController.restrictTo('admin'),
     productController.deleteProduct)


module.exports =router