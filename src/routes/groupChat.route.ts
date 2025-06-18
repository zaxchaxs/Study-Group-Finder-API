import { Router } from "express";
import { deleteGroupChatHandle, getAllGroupChatHandle, getDetailGroupChatHandle, getUserGroupChatHandle, postGroupChatHandle, postGroupchatMessageHandle, updateGroupChatHandle } from "../controllers/groupchat.controller";
import { validateCreateGroupchat, validateCreateGroupchatMessage, validateUpdateGroupChat } from "../middlewares/groupchatHandle";

const router = Router();

router.get("/", getAllGroupChatHandle);
router.get("/user/:id", getUserGroupChatHandle);
router.get("/:id", getDetailGroupChatHandle);
router.post("/", validateCreateGroupchat, postGroupChatHandle);
router.put("/:id", validateUpdateGroupChat, updateGroupChatHandle);
router.delete("/:id", deleteGroupChatHandle);

// message
router.post("/message", validateCreateGroupchatMessage, postGroupchatMessageHandle)

export default router;
