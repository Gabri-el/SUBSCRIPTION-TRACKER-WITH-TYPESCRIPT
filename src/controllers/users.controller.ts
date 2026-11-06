import {Request,Response,NextFunction} from "express";
import { prisma } from "../config/prisma.database";
import { date, success } from "zod";

const getAllUsers = async (req:Request ,res:Response,  next:NextFunction)=>{
    try{
        const page = Math.max (parseInt(req.query.page as string),1) || 1;
        const limit = Math.min(Math.max (parseInt(req.query.limit as string),1),100) || 2;
        const skip = (page - 1) * limit;

        const [users,totalCount] = await Promise.all([
            prisma.user.findMany({
                omit: { password: true },
                skip: skip,
                take: limit,
                orderBy:{id:"asc"}
            }),
            prisma.user.count()
        ]);

        // if(!users){
        //     return res.status(404).json({success:false,message:"no users"});
        // }

        res.status(200).json({
            success:true,
            message:users.length === 0 ? "no users found" : "all users",
            data:users, 
            totalCount: totalCount, 
            currentPage: page, 
            totalPages: Math.ceil(totalCount / limit)});


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
            return res.status(404).json({success:false,message:"user not found"});
        }

        res.status(200).json({success:true, message:"user found",data:user});

    }catch(error){
        const errorMessage = error as Error;
        console.log("get user by id error", errorMessage.message);
        res.status(500).json({success:false , message:errorMessage.message});

    }
}

const deleteUserById = async (res:Response, req:Request, next: NextFunction)=>{

}

const editUserById = async (res:Response,req:Request, next:NextFunction)=>{
    
}

export {getAllUsers,getUserById};