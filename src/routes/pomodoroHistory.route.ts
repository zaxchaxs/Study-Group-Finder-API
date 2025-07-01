import { Router } from "express";
import {
  getAllPomodoroHistoryHandle,
  getUserPomodoroHistoryHandle,
  getDetailPomodoroHistoryHandle,
  postPomodoroHistoryHandle,
  updatePomodoroHistoryHandle,
  deletePomodoroHistoryHandle,
} from "../controllers/pomodoroHistory.controller";
import { validateCreatePomodoro } from "../middlewares/pomodoroHistoryHandle";

const router = Router();

router.get("/", getAllPomodoroHistoryHandle);
router.get("/user/:id", getUserPomodoroHistoryHandle);
router.get("/:id", getDetailPomodoroHistoryHandle);
router.post("/", validateCreatePomodoro, postPomodoroHistoryHandle);
router.put("/:id", validateCreatePomodoro,updatePomodoroHistoryHandle);
router.delete("/:id", deletePomodoroHistoryHandle);

export default router;
