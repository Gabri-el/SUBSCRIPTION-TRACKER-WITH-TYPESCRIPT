import { NextFunction, Response,Request } from "express";
import { success } from "zod";
import aj from "../config/arcjet.config";
import { defaultMaxListeners } from "node:events";

const arcjetMiddleware = async(req:Request,res:Response,next:NextFunction)=>{

    try{
           const decision = await aj.protect(req, { requested: 1 });

    if(decision.isDenied()) {
      if(decision.reason.isRateLimit()) return res.status(429).json({ error: 'Rate limit exceeded' });
      if(decision.reason.isBot()) return res.status(403).json({ error: 'Bot detected' });

      return res.status(403).json({ error: 'Access denied' });
    }

    next();

    }catch(error){
        const errorMessage = error as Error;
        console.error("Arject error",errorMessage);
        res.status(500).json({success:false,message:"Internal Server Error"})
    }

}
export default arcjetMiddleware;