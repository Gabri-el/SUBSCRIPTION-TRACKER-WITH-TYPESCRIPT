import {Request, Response, NextFunction} from "express";

import { prisma } from "../config/prisma.database";
import createSubscriptionSchema from "../schema_validator/subscription.schema";


const showAllSubscription = async (req:Request ,res:Response,  next :NextFunction)=>{
    try{
        const page = Math.max (parseInt(req.query.page as string),1) || 1;
        const limit = Math.min(Math.max (parseInt(req.query.limit as string),1),100) || 2;
        const skip = (page - 1) * limit;
        const [allSubscription,totalCount] = await Promise.all([
            prisma.subscription.findMany({
                skip: skip,
                take: limit,
                orderBy:{id:"asc"}
            }),
            prisma.subscription.count()
        ]);

        if(!allSubscription){
            return res.status(201).json({success:false, message:"no subscription found"});
        }

        res.status(200).json({success:true, message:"all subscription", data:allSubscription, totalCount: totalCount, currentPage: page, totalPages: Math.ceil(totalCount / limit)});

    }catch(error){
        const errorMessage = error as Error;
        console.log("show all subscription error", errorMessage.message);
        res.status(500).json({success:false, message:errorMessage.message})
    }

}
const subscriptionById = async ( req:Request,res: Response, next: NextFunction) =>{

    try{
        if(req.user.id !== req.params.id){
            return res.status(403).json({success:false, message:"Unauthorized user"})
        }

        const userSubscription = await prisma.subscription.findUnique({where:{id:req.params.id }});

        if(!userSubscription){
            return res.status(200).json({success:true, message:"found no subscription"});
        }

        res.status(200).json({success:true, message:"subscriptions", data:userSubscription});

    }catch(error){
            const errorMessage = error as Error;
        console.log("show all subscription by id error", errorMessage.message);
        res.status(500).json({success:false, message:errorMessage.message})
    }
    
}
const deleteSubscription = async (res:Response, req:Request, next:NextFunction)=>{

}
const createSubscription = async ( req:Request,res:Response, next:NextFunction)=>{
    try{

        const validateBody = createSubscriptionSchema.safeParse(req.body);

        if(!validateBody.success){
            const errorMessage = validateBody.error.issues.map((er)=>er.message);
            return res.status(404).json({success:false, message:errorMessage[0]});
        }

        const createSub = await prisma.subscription.create({
            data:{
                ...req.body,
                userId: req.user.id       
            }
        })

        res.status(200).json({success:false,message:"subscription created", data:createSub});

    }catch(error){
                 const errorMessage = error as Error;
        console.log("create subscription  error", errorMessage.message);
        res.status(500).json({success:false, message:errorMessage.message})

    }
    
}

export{showAllSubscription,subscriptionById,createSubscription};