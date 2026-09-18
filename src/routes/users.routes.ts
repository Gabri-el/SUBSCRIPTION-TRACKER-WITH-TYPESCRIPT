import{Router} from "express";
import { getAllUsers, getUserById,  } from "../controllers/users.controller";
import authorize from "../middlewares/authorize.middleware";

const userRoutes = Router();

userRoutes.get("/all-users",getAllUsers);
userRoutes.get("/:id",authorize ,getUserById);
// userRoutes.post("/:id");
// userRoutes.delete("/:id");
// userRoutes.put("/:id");

export default userRoutes;