import {Request,Response,NextFunction} from "express";
import jwt from "jsonwebtoken";
import { JW_PAYLOAD } from "../interface/payload.interface";
import { prisma } from "../config/prisma.database";

const authorize = async(req:Request,res:Response,next:NextFunction)=>{
    try{
        let token;

        if(req.headers.authorization && req.headers.authorization.startsWith("Bearer")){
            token = req.headers.authorization.split(' ')[1];
        }
        console.log("token found",token);

        if(!token){
            return res.status(401).json({success:false, message:" token not found"});
        }

        const decoded = await jwt.verify(token,`${process.env.JWT_SECRET_KEY}`) as JW_PAYLOAD;
        console.log("decoded token",decoded);

        const user = await prisma.user.findUnique({where:{id:decoded.id }});

        if(!user){
            res.status(401).json({success:false, message:"unauthorize user identity"});
        }

        req.user = user!;
        next()

    }catch(error){
        const errorMessage = error as Error;
        console.error("Jwt authentication error",errorMessage.message);

        res.status(401).json({success:false, message:errorMessage.message});
    }

}

export default authorize;