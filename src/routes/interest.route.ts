import { Router } from "express";
import { deleteInterestHandle, getallInterestHandle, getInterestHandle, postInterestHandle, updateInterestHandle } from "../controllers/interest.controller";

const router = Router();

router.get("/", getallInterestHandle);
router.get("/:id", getInterestHandle);
router.post("/", postInterestHandle);
router.put("/:id", updateInterestHandle);
router.delete("/:id", deleteInterestHandle)

export default router;
