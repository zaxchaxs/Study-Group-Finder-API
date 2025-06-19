import { Router } from "express";
import { deletePrivateChatHandle, deletePrivateChatMessageHandle, getAllPrivateChatHandle, getAllPrivateChatMessageHandle, getDetailPrivateChatHandle, getUserPrivateChatHandle, getUserPrivateChatMessageHandle, postPrivateChatHandle, postPrivateChatMessageHandle, updatePrivateChatMessageHandle } from "../controllers/privatechat.controller";
import { validateCreatePrivateChat, validateCreatePrivateChatMessage, validateUpdatePrivateChatMessage } from "../middlewares/privatechatHandle";

const router = Router();

router.get("/", getAllPrivateChatHandle);
router.get("/:id", getUserPrivateChatHandle);
router.get("/detail/:id", getDetailPrivateChatHandle);
router.post("/", validateCreatePrivateChat, postPrivateChatHandle);
router.delete("/:id", deletePrivateChatHandle);

// message
router.get("/message/all", getAllPrivateChatMessageHandle);
router.get("/message/chat/:id", getUserPrivateChatMessageHandle);
router.post("/message", validateCreatePrivateChatMessage, postPrivateChatMessageHandle)
router.put("/message/:id", validateUpdatePrivateChatMessage, updatePrivateChatMessageHandle)
router.delete("/message/:id", deletePrivateChatMessageHandle)

export default router;
