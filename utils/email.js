const nodemailer = require('nodemailer')
// const { options } = require('../routes/userRoute')

const sendEmail = async options =>{
 //1) create a transporter
 const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth:{
        user:process.env.EMAIL_USERNAME,
        pass:process.env.EMAIL_PASSWORD
    }
   //Activate in gmail'less secure app' option 
 })
 //2) define email option
 const mailOptions ={
    from: 'sumit dhakal <hello@sumit.io>',
    to:options.email,
    subject:options.subject,
    text:options.message,
 }
 //3) actually send the mail 
 await transporter.sendMail(mailOptions)
}

module.exports = sendEmail