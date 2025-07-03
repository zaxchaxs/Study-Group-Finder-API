import { Router } from "express";
import { deleteUserInterestHandle, getAllUserInterestHandle, getUserInterestHandle, postUserInterestHandle, updateUserInterestHandle } from "../controllers/userInterest.controller";

const router = Router();

router.get("/", getAllUserInterestHandle)
router.get("/:userId", getUserInterestHandle)
router.post("/", postUserInterestHandle);
router.put("/:id", updateUserInterestHandle);
router.delete("/:id", deleteUserInterestHandle);

export default router;
