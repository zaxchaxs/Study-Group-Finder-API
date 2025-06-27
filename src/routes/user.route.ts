import { Router } from "express";
import { changeUserPasswordHandle, deleteUserFriendRequestHandle, deleteUserHandle, getAllUserHandle, getUserByUsnHandle, getUserFriendsHandle, getUserHandle, loginUserHandle, postUserHandler, requestFriendHandle, updateFriendRequestStatusHandle, updateUserHandle, verifyUserTokenHandle } from "../controllers/user.controller";
import { validateLoginUser, validateRegistUser, validateRequestFriend, validateUpdateStatusFriendRequest, validateUpdateUser, verifyTokenMiddleware, verifyUserChangePassword } from "../middlewares/userHandle";

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

// friend
router.get("/friends/:indentifier", getUserFriendsHandle);
router.post("/friends", validateRequestFriend, requestFriendHandle);
router.post("/friends/status", validateUpdateStatusFriendRequest, updateFriendRequestStatusHandle);
router.delete("/friends/:indentifier", deleteUserFriendRequestHandle);


export default router;
