import { Router } from "express";
import { deleteGroupChatHandle, deleteGroupchatMessageHandle, getAllGroupChatHandle, getAllGroupchatMessageHandle, getDetailGroupChatHandle, getUserGroupChatHandle, postGroupChatHandle, postGroupchatMessageHandle, updateGroupChatHandle, updateGroupchatMessageHandle } from "../controllers/groupchat.controller";
import { validateCreateGroupchat, validateCreateGroupchatMessage, validateUpdateGroupChat, validateUpdateGroupchatMessage } from "../middlewares/groupchatHandle";

const router = Router();

router.get("/", getAllGroupChatHandle);
router.get("/user/:id", getUserGroupChatHandle);
router.get("/:id", getDetailGroupChatHandle);
router.post("/", validateCreateGroupchat, postGroupChatHandle);
router.put("/:id", validateUpdateGroupChat, updateGroupChatHandle);
router.delete("/:id", deleteGroupChatHandle);

// message
router.get("/message/all", getAllGroupchatMessageHandle);
router.post("/message", validateCreateGroupchatMessage, postGroupchatMessageHandle)
router.put("/message/:id", validateUpdateGroupchatMessage, updateGroupchatMessageHandle)
router.delete("/message/:id", deleteGroupchatMessageHandle)

export default router;
