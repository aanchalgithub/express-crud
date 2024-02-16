const UserModel = require('../Models/userModel');
const OtpModel = require('../Models/OtpModel');
const bcrypt = require('bcryptjs');
const Joi = require('joi');
const nodemailer = require('nodemailer');
const generateRandomOtp = require('../utils/generateRandomOtp')
const sendOTP = require("../utils/sendOTP")



async function signup(req,res){

    try {
        console.log(req.body)
        
        const{email,password}=req.body;
        const schema = Joi.object({
           

            email: Joi.string()
            .required().email({ minDomainSegments: 2 }),

            password: Joi.string()
            .required()
            .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$'))
        })
        const {error} =await schema.validate(req.body)
        if(error){
            return res.status(400).json({success:false,message:error.message})
        }
        const user=await UserModel.findOne({$or:[{email}]})
        if(user){
          if(user.email==email){
            return res.status(400).json({
                success:false,
                message:'This email is already registered.'
            })
          }
        }
        const hashedPassword=await bcrypt.hash(password,10)
        var data = new UserModel({email,password:hashedPassword})

        await data.save()

const otp = Math.floor(100000 + Math.random() * 900000);


await OtpModel.create({
  userId: data._id,
  otp,
  isExpired: Date.now() + 90000 
});


const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com', 
  port: 587, 
  secure: false, 
  auth: {
    user: 'vaanchal05@gmail.com', 
    pass: 'wxhe szef alcb tghv' 
  }
});

const mailOptions = {
  from: 'vaanchal05@gmail.com', 
  to:email,
  subject: 'Your Email Verification OTP',
  html: `<strong>Your OTP for email verification is ${otp}</strong>`
};

const info = await transporter.sendMail(mailOptions);

console.log('Email sent: %s', info.messageId);


    
      return res.status(201).json({success:true,message : "Record is created",data})
    } catch (error) {
        console.log(error)
        res.status(500).json({
            success : false,
            message : "Internal Server error"
        })
    }
}



async function login(req,res){
    try{
       
        const{email,password}=req.body;

        const loginSchema = Joi.object({

            email: Joi.string()
            .required().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }),

            password: Joi.string()
            .required().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$'))
        })

        const loginValidator =await loginSchema.validate(req.body)
        if(!loginValidator){
            return res.status(400).json({success:false,message:error})
        }
        const error =await loginSchema.validate(req.body)
        if(!email){
            return res.status(400).json({
                success:false,
                message:'Email not provided.'
            })
        }else if(!password){
            return res.status(400).json({
                success:false,
                message:"Password is required."
            })
        }
        const user=await UserModel.findOne({email})
        
      console.log(email);
        if(!user){
            return res.status(400).json({
                success:false,
                message:'Invalid email.'
            })
        }
        const compare=await bcrypt.compare(password,user.password)
        if(!compare){
            return res.status(400).json({
                success:false,
                message:'Invalid credentials.'
            })
        }
       
   
  
      if (!user.isVerify) {
        return res.status(400).json({
          success: false,
          message: 'Please verify your email first.'
        });
      }
        
       
        return res.status(200).json({
            success:true,
            message:'Login successfully.',
            user
        })
    }catch(err){
        return res.status(500).json({
            success:false,
            message:err.message
        })
    }
 }

async function verify_otp(req,res){ 
        try {
        const{email} = req.body
        
        const emailSchema = Joi.object({
            email: Joi.string()
            .required().email({ minDomainSegments: 2}),
            otp : Joi.string()
            .required().pattern(/\d{6}/)
        })

        const {error} =  await emailSchema.validate(req.body)
        if(error){
            return res.status(400).json({
                success : false,
                message : error
            })
        }
        
        const user = await UserModel.findOne({email})
       
    if(!user){
        return res.status(400).json({
            success : false,
            message : "Invalid Credentials"
        })
    }
    
  const otp=await OtpModel.findOne({userId:user._id})
  console.log(otp,new Date())
      if (!otp) {
        return res.status(400).json({
          success: false,
          message: 'Otp not found or OTP has expired.'
        });
      }
  if(otp.otp!==req.body.otp){
    return res.status(400).json({
        success:false,
        message:'Invalid otp provided.'
    })
  }
      const deletedOtp = await OtpModel.deleteOne({
        _id: otp._id, 
      });
      console.log('OTP verified and deleted:', deletedOtp._id);
      const Verification = await UserModel.findOneAndUpdate({email : user.email},{$set : {isVerify : true}},{new : true})
     return res.status(200).json({
        success: true,
        message: 'OTP verified successfully. You can now login.',
        user : Verification
      });
  
    
 }catch(error){
    res.status(500).json({
        success : false,
        message : "Internal Server Error"
    })
}
 }
async function resend_otp(req, res) {
  try {
    const { email } = req.body;

    
    const emailSchema = Joi.object({
      email: Joi.string().required(),
    });

    const { error } = await emailSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: error,
      });
    }

    const user = await UserModel.findOne({ email });
    console.log(user);
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid email",
      });
    }

    
    const existingOtp = await OtpModel.findOne({
      userId: user._id,
      isExpired: { $gte: Date.now() },
    });

    if (existingOtp && !existingOtp.isVerified) {
      
      await sendOTP(user.email, existingOtp.otp);
      return res.status(200).json({
        success: true,
        message: "OTP resent successfully.",
      });
    }

   
    const newOtp = generateRandomOtp();

   
    const otp = new OtpModel({
      userId: user._id,
      otp: newOtp,
      // isExpired : false ,
      isVerified: false,
    });
    console.log(otp);
    await otp.save();

 
    await sendOTP(email, newOtp);
    console.log(newOtp);

    res.status(200).json({
      success: true,
      message: "OTP sent successfully.",
    });
  } catch (error) {
    console.error("Error resending OTP:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
}

   
    
module.exports = {signup,login,verify_otp,resend_otp}