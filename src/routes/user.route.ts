import { Router } from "express";
import { deleteUserHandle, getAllUserHandle, getUserHandle, loginUserHandle, postUserHandler, updateUserHandle } from "../controllers/user.controller";
import { validateLoginUser, validateRegistUser, validateUpdateUser } from "../middlewares/userHandle";

const router = Router();

router.get("/", getAllUserHandle);
router.get("/:id", getUserHandle)
router.post("/", validateRegistUser, postUserHandler);
router.put("/:id", validateUpdateUser, updateUserHandle);
router.delete("/:id", deleteUserHandle);
router.post("/login", validateLoginUser, loginUserHandle);


export default router;
