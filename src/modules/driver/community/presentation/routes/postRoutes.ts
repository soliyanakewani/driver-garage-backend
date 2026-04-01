import { Router } from "express";
import { PostController } from "../controllers/PostController";

const router = Router();

router.get("/", PostController.getPosts);
router.post("/", PostController.createPost);
router.put("/:id", PostController.editPost);
router.delete("/:id", PostController.deletePost);

export default router;