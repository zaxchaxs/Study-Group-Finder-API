import { Router } from "express";
import { deleteGroupChatHandle, postGroupChatHandle, postGroupchatMessageHandle, updateGroupChatHandle } from "../controllers/groupchat.controller";
import { validateCreateGroupchat, validateCreateGroupchatMessage, validateUpdateGroupChat } from "../middlewares/groupchatHandle";

const router = Router();

router.post("/", validateCreateGroupchat, postGroupChatHandle);
router.put("/:id", validateUpdateGroupChat, updateGroupChatHandle);
router.delete("/:id", deleteGroupChatHandle);

// message
router.post("/message", validateCreateGroupchatMessage, postGroupchatMessageHandle)

export default router;
