import { Router } from "express";
import { deleteUserProfileHandle, getUserProfileHandle, upsertUserProfileHandle } from "../controllers/user-profile.controller";
import { validateUpsertUserProfile } from "../middlewares/userProfileHandle";

const router = Router();

// router.get("/")
router.get("/:userId", getUserProfileHandle)
router.post("/:userId", validateUpsertUserProfile, upsertUserProfileHandle);
router.delete("/:id", deleteUserProfileHandle);

export default router;
