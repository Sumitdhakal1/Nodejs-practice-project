const {promisify} = require('util')
const jwt = require('jsonwebtoken')
const User = require('../models/userModel')
const catchAsync = require('../utils/catchAsync')
const AppError = require('../utils/appError');
const sendEmail = require('../utils/email');


const signToken = id =>{
    return jwt.sign(
        {id:id}, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRES_IN
        });
}

exports.signup=catchAsync(async(req, res ,next)=>{
    const{name, email, password, passwordConfirm, role}= req.body
    const newUser =await User.create({
         name:name,
         role:role,
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
        return  next(new AppError('please provide email and password!', 400))
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

exports.protect = catchAsync(async(req, res, next)=>{
  //1) getting token and check of it's there
  let token;
     if(req.headers.authorization && req.headers.authorization.startsWith('Sumit')
     )
    {
     token = req.headers.authorization.split(' ')[1];
     }
    //  console.log(token)

     if(!token){
        return next(
            new AppError('you are not logged in.', 401)
            );
     }
  //2) verification token
  const decoded =  await promisify(jwt.verify)(token, process.env.JWT_SECRET)
//   console.log(decoded)
  //3) check if user still exits
     const currentUser = await  User.findById(decoded.id)
     if(!currentUser){
        return next(new AppError('the user does not exits', 401))
     }
  //4) check if user changed password after the JWT was issued
    if(currentUser.changePasswordAfter(decoded.iat)){
        return next(
            new AppError('user change the password.please log in again.', 401)
        );
    }
    //grant access to protected route
    req.user= currentUser;
    next();
});

exports.restrictTo = (...roles) =>{
    return(req, res, next)=>{
        if(!roles.includes(req.user.role)){
            return next(new AppError('you do not have permission to perform this action', 403))
        }
    }
    next();
}

// exports.forgotPassword=catchAsync(async(req, res, next)=>{
//   // 1) get user based on posted email
//   const user = await User.findOne({email : req.body.email})
//   if(!user){
//     return next(new AppError('there is no user with this email address', 404))
//   }
//   //2) generated the random reset token
//   const resetToken = user.createPasswordResetToken()
//   await user.save({ validateBeforeSave: false })

//   //3) send email to user
//     const resetURL = `${req.protocol}://${req.get('host')}/api/user/resetPassword/${resetToken}`;
//     const message =`forgot a password? submit a path request with your new password and passwordConfirm to :${resetURL}.\n if you didn't forgot your password, please ignore this email!`;
//     try{
//         await sendEmail({
//             email:user.email,
//             subject:'your password reset token (valid for only 10 minutes)',
//             message
//         });
//         res.status(200).json({
//             status:'success',
//             message:'token sent to email'
//         })
//     }catch(err){
//      user.passwordResetToken= undefined;
//      user.passwordResetExpires= undefined;
//      await user.save({ validateBeforeSave: false });
//      return next(new AppError('there was error sending the mail .try again later',500))
//     }

// });

exports.forgotPassword = catchAsync(async (req, res, next) => {
    // 1) Get user based on POSTed email
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return next(new AppError('There is no user with email address.', 404));
    }
  
    // 2) Generate the random reset token
    const resetToken = user.createPasswordResetToken();
    await user.save({ validateBeforeSave: false });
  
    // 3) Send it to user's email
    const resetURL = `${req.protocol}://${req.get(
      'host'
    )}/api/v1/users/resetPassword/${resetToken}`;
  
    const message = `Forgot your password? Submit a PATCH request with your new password and passwordConfirm to: ${resetURL}.\nIf you didn't forget your password, please ignore this email!`;
  
    try {
      await sendEmail({
        email: user.email,
        subject: 'Your password reset token (valid for 10 min)',
        message
      });
  
      res.status(200).json({
        status: 'success',
        message: 'Token sent to email!'
      });
    } catch (err) {
      user.passwordResetToken = undefined;
      user.passwordResetExpires = undefined;
      await user.save({ validateBeforeSave: false });
  
      return next(
        new AppError('There was an error sending the email. Try again later!'),
        500
      );
    }
  });

exports.resetPassword=(req, res, next)=>{

}