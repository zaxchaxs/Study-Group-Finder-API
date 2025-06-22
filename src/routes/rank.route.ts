import { Router } from "express";
import { deleteRankCategoryHandle, deleteRankHandle, getAllRankCategoryHandle, getAllRankHandle, getDetailRankCategoryHandle, getDetailRankHandle, getUserRankHandle, postRankCategoryHandle, postRankHandle, updateRankCategoryHandle, updateRankHandle } from "../controllers/rank.controller";
import { validateCreateRankCategory, validateCreateUserRank, validateUpdateUserRank } from "../middlewares/rankHandle";
import { getDetailRankCategory, updateRankCategory } from "../services/rank.service";

const router = Router();

router.get("/", getAllRankHandle)
router.get("/user/:id", getUserRankHandle)

// detail
router.get("/:id", getDetailRankHandle)

router.post("/", validateCreateUserRank, postRankHandle)
router.put("/:id", validateUpdateUserRank, updateRankHandle)
router.delete("/:id", deleteRankHandle);


// Rank Category;
router.get("/category/all", getAllRankCategoryHandle)
router.get("/category/:id", getDetailRankCategoryHandle)
router.post("/category", validateCreateRankCategory, postRankCategoryHandle)
router.put("/category/:id", validateCreateRankCategory, updateRankCategoryHandle)
router.delete("/category/:id", deleteRankCategoryHandle)

export default router