import {Request, Response, NextFunction} from "express";

import { prisma } from "../config/prisma.database";
import createSubscriptionSchema from "../schema_validator/subscription.schema";


const showAllSubscription = async (req:Request ,res:Response,  next :NextFunction)=>{
    try{
        const allSubscription = await prisma.subscription.findMany();

        if(!allSubscription){
            return res.status(201).json({success:false, message:"no subscription found"});
        }

        res.status(200).json({success:true, message:"all subscription", data:allSubscription});

    }catch(error){
        const errorMessage = error as Error;
        console.log("show all subscription error", errorMessage.message);
        res.status(500).json({success:false, message:"Internal Serve Error"})
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
        res.status(500).json({success:false, message:"Internal Serve Error"})
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
        res.status(500).json({success:false, message:"Internal Serve Error"})

    }
    
}

export{showAllSubscription,subscriptionById,createSubscription};