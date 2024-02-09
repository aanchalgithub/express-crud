const UserModel = require ('../Models/userModel')
const bcrypt = require('bcryptjs')
const Joi = require('joi')

async function signup(req,res){
    try {
        console.log(req.body)
        // const{username,email,password}=req.body;
        const{email,password}=req.body;
        const schema = Joi.object({
            // username: Joi.string()
            // .min(3)
            // .max(30)
            // .required(),

            email: Joi.string()
            .required().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }),

            password: Joi.string()
            .required().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$'))
        })
        const signupValidate =await schema.validate(req.body)
        if(!signupValidate){
            return res.status(400).json({success:false,message:error})
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
      return res.status(201).json({success:true,message : "Record is created",data})
    } catch (error) {
        res.status(500).json({
            success : false,
            message : "Internal Server error"
        })
    }
}

async function login(req,res){
    try{
        console.log(req.body);
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
        return res.status(200).json({
            success:true,
            message:'Login successfully.'
        })
    }catch(err){
        return res.status(500).json({
            success:false,
            message:err.message
        })
    }
 }
module.exports = {signup,login}