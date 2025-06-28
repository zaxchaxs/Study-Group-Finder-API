import { Router } from "express";
import { addUserIntoMemberGroupchatHandle, deleteGroupChatHandle, deleteGroupchatMessageHandle, getAllGroupChatHandle, getAllGroupchatMessageHandle, getDetailGroupChatHandle, getJoinedUserGroupChatHandle, getUserGroupChatHandle, postGroupChatHandle, postGroupchatMessageHandle, updateGroupChatHandle, updateGroupchatMessageHandle } from "../controllers/groupchat.controller";
import { validateAddMemberIntoGroupchat, validateCreateGroupchat, validateCreateGroupchatMessage, validateUpdateGroupChat, validateUpdateGroupchatMessage } from "../middlewares/groupchatHandle";

const router = Router();

router.get("/", getAllGroupChatHandle);
router.get("/user/:id", getJoinedUserGroupChatHandle);
router.get("/user-author/:id", getUserGroupChatHandle);
router.get("/:id", getDetailGroupChatHandle);
router.post("/", validateCreateGroupchat, postGroupChatHandle);
router.post("/member/:id", validateAddMemberIntoGroupchat, addUserIntoMemberGroupchatHandle);
router.put("/:id", validateUpdateGroupChat, updateGroupChatHandle);
router.delete("/:id", deleteGroupChatHandle);

// message
router.get("/message/all", getAllGroupchatMessageHandle);
router.post("/message", validateCreateGroupchatMessage, postGroupchatMessageHandle)
router.put("/message/:id", validateUpdateGroupchatMessage, updateGroupchatMessageHandle)
router.delete("/message/:id", deleteGroupchatMessageHandle)

export default router;
