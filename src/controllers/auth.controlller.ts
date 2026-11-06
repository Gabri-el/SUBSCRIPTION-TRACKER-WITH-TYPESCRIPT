import { Response,Request,NextFunction } from "express";
import z, { success } from "zod";
import {userLoginSchema,userSignUpSchema} from "../schema_validator/user.schema";
import { prisma } from "../config/prisma.database";
import bcrypt from "bcrypt"; 
import { error } from "node:console";
import { JW_PAYLOAD } from "../interface/payload.interface";
import  jwt  from "jsonwebtoken";
import { omit } from "zod/mini";


const signUp = async(req:Request,res:Response,)=>{
    try{
    
        //validating  req.body        
        const validateBody = userSignUpSchema.safeParse(req.body);

        if(!validateBody.success){
            const errorMessage = validateBody.error.issues.map((err)=>err.message);
            return res.status(409).json({success:false,message:errorMessage[0]})
        }

        const {email,password,name} = req.body;
        
        //checking for existing user
        const existingUser = await prisma.user.findUnique({where:{email:email}});

        if(existingUser){
            return res.status(409).json({success:false,message:"user already exist"});
        }

        //new user
        const salt = await bcrypt.genSalt(10);

        const hashedPassword = await bcrypt.hash(password,salt);

        const user = await prisma.user.create({
            data:{
                name:name,
                email:email,
                password:hashedPassword
            },
            omit:{
                password:true
            }
        });

        res.status(201).json({success:true,message:"user created successfully",data:user});




    }catch(error){
        const errorMessage = error as Error;
        console.log("sign up", errorMessage.message);

        res.status(500).json({success:false,message:errorMessage.message})
    }

}

const signIn = async( req:Request,res:Response)=>{
    try{
        //validating req.body
        const validateBody = userLoginSchema.safeParse(req.body);

        if(!validateBody.success){
            const errorMessage = validateBody.error.issues.map((er)=>er.message);
            return res.status(409).json({success:false, message:errorMessage[0]})
        }
        const {email,password} = req.body

        //checking user
        const existingUser = await prisma.user.findUnique({where:{email:email}});

        if(!existingUser){
            return res.status(409).json({success:false, message:"user does no exist"});
        }

        //comparing password
        const comparePassword = await bcrypt.compare(password,existingUser.password);

        if(!comparePassword){
            return res.status(404).json({success:false,message:"invalid password"});
        }

        //jwt access
        const payload : JW_PAYLOAD ={id:existingUser.id, email:existingUser.email};
        const tokenAccess = await jwt.sign(payload,`${process.env.JWT_SECRET_KEY }`,{expiresIn:"30m"});

        //sending access
        const { password: _, ...userWithoutPassword } = existingUser
        res.status(200).json({success:true,message:'login successfully',token:tokenAccess,data:userWithoutPassword})

    }catch(error ){
        const errorMessage = error as Error;
        console.error("sign in error",errorMessage.message);

        res.status(500).json({success:false,message:errorMessage.message})

    }
}

const signOut = async(res:Response, req:Request)=>{
    try{

    }catch(error){

    }
}

export {signIn, signOut,signUp};