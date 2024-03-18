const jwt = require('jsonwebtoken')
const User = require('../models/userModel')
const catchAsync = require('../utils/catchAsync')
const appError = require('../utils/appError');
const AppError = require('../utils/appError');

const signToken = id =>{
    return jwt.sign(
        {id:id}, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRES_IN
        });
}

exports.signup=catchAsync(async(req, res ,next)=>{
    const{name, email, password, passwordConfirm}= req.body
    const newUser =await User.create({
         name:name,
         email:email,
         password:password,
         passwordConfirm:passwordConfirm
    })

    const token = signToken(newUser._id)

    res.status(201).json({
        status:'success',
        token,
        data:{
            user:newUser
        }
    });
});

exports.login = catchAsync(async(req, res, next)=>{
    const {email, password} = req.body
    //1) check if email and password exits
       if(!email || !password){   //login finish garna lai return use gareko
        return  next(new appError('please provide email and password!', 400))
       }
    //2) check if user exits & password is correct
       const user =await User.findOne({email}).select('+password')
       if(!user || !(await user.correctPassword(password, user.password))){
        return next(new AppError('incorrect email or password', 401))
       }
    //3) if everything ok sent token to client 
    const token =signToken(user._id)
    res.status(200).json({
        status:'success',
        token
    })
})
