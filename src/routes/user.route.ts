import { Router } from "express";
import { createUserHandler } from "../controllers/user.controller";
import { createUserSchema } from "../schemas/user.schema";
import validate from "../middlewares/validate";

const router = Router();

// router.post("/", validate(createUserSchema), createUserHandler);
router.post("/", createUserHandler);
export default router;
