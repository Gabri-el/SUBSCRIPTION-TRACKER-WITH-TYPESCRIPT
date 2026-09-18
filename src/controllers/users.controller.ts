import {Request,Response,NextFunction} from "express";
import { prisma } from "../config/prisma.database";
import { date, success } from "zod";

const getAllUsers = async (req:Request ,res:Response,  next:NextFunction)=>{
    try{

        const users = await prisma.user.findMany({omit:{password:true ,}});
        if(!users){
            return res.status(404).json({success:false,message:"no users"});
        }

        res.status(200).json({success:true,message:"all users", data:users})


    }catch(error){
        const errorMessage = error as Error;
        console.log("all users", errorMessage.message);

    }
}

const getUserById= async (req:Request,res:Response,  next :NextFunction)=>{
    try{
        const {id} = req.params;
        
        const user = await prisma.user.findUnique({where:{id:id as string},omit:{password:true}});

        if(!user){
            return res.status(404).json({success:false,message:"unauthorize request"});
        }

        res.status(201).json({success:true, message:"user found",data:user});

    }catch(error){
        const errorMessage = error as Error;
        console.log("get user by id error", errorMessage.message);
        res.status(500).json({success:false , message:"Internal server error"});

    }
}

const deleteUserById = async (res:Response, req:Request, next: NextFunction)=>{

}

const editUserById = async (res:Response,req:Request, next:NextFunction)=>{
    
}

export {getAllUsers,getUserById};