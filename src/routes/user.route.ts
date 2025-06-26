import { Router } from "express";
import { changeUserPasswordHandle, deleteUserHandle, getAllUserHandle, getUserByUsnHandle, getUserHandle, loginUserHandle, postUserHandler, updateUserHandle, verifyUserTokenHandle } from "../controllers/user.controller";
import { validateLoginUser, validateRegistUser, validateUpdateUser, verifyTokenMiddleware, verifyUserChangePassword } from "../middlewares/userHandle";

const router = Router();

router.get("/", getAllUserHandle);
router.get("/:id", getUserHandle)
router.get("/usn/:username", getUserByUsnHandle)
router.post("/", validateRegistUser, postUserHandler);
router.put("/:id", validateUpdateUser, updateUserHandle);
router.delete("/:id", deleteUserHandle);
router.post("/login", validateLoginUser, loginUserHandle);
router.post("/verify-token", verifyTokenMiddleware, verifyUserTokenHandle)
router.post("/change-password/:id", verifyUserChangePassword, changeUserPasswordHandle)


export default router;
