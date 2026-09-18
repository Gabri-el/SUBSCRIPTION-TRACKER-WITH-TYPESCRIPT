import express ,{Request,Response} from "express";
import {config} from "dotenv";
import authRoutes from "./routes/auth.routes";
import userRoutes from "./routes/users.routes";
import subscriptionRouter from "./routes/subscription.routes";
import arcjetMiddleware from "./middlewares/arject.middleware";
import dns from "dns";
dns.setServers(["1.1.1.1","8.8.8.8"]);
config();
const app = express();

app.use(express.json());
const PORT = `${process.env.PORT}`;

app.use(arcjetMiddleware);
app.use('/api/v1/auth',authRoutes);
app.use("/api/v1/users",userRoutes);
app.use("/api/v1/subscriptions",subscriptionRouter);

app.get('/',(req:Request,res:Response)=>{
   res.send("Welcome to the subscription website");
})

app.listen(PORT,()=>{
   console.log(`Server is running on http://localhost:${PORT}/`)
})