const mongoose = require('mongoose')



const porductSchema =new mongoose.Schema({


    name:{
        type:String,
         required:[true,'A product must have a name'],
         unique:true,
        trim:true
    },
    price:{
        type: Number,
         required:['A product must have a price']
    },
    rating:{
        type:Number,
        default:0
    },
    brand:{
        type: String,
         required:['A product must have a brand name']
    },
    images:[String],
    reviews:{
        type:String,

    },color:{
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now(),
        select: false
      },
      startDates:{
        type: Date,
        default: Date.now(),
        select: false
      },
      secretTour: {
        type: Boolean,
        default: false
      }


})

const Product = mongoose.model('Product', porductSchema);

module.exports= Product;


