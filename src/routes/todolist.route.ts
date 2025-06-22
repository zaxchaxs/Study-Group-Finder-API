import { Router } from "express";
import { deleteTodolistHandle, getAllTodolistHandle, getDetailTodolistHandle, getUserTodolistHandle, postTodolistHandle, updateTodolistHandle } from "../controllers/todolist.controller";
import { validateCreateTodolist } from "../middlewares/todolist.handle";

const router = Router();

router.get("/", getAllTodolistHandle);
router.get("/user/:id", getUserTodolistHandle);
router.get("/:id", getDetailTodolistHandle);
router.post("/", validateCreateTodolist, postTodolistHandle);
router.put("/:id", validateCreateTodolist, updateTodolistHandle);
router.delete("/:id", deleteTodolistHandle);


export default router