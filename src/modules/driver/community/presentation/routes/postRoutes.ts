import { Router } from "express";
import { PostController } from "../controllers/PostController";
<<<<<<< Updated upstream
=======
import { verifyDriverJWT } from "../../../../../core/middleware/auth/jwt.middleware";
import { upload } from "../../../../../core/middleware/upload";
>>>>>>> Stashed changes

const router = Router();

router.get("/", PostController.getPosts);
<<<<<<< Updated upstream
router.post("/", PostController.createPost);
router.put("/:id", PostController.editPost);
=======
router.get("/bookmarks/me", PostController.getBookmarkedPosts);
router.post("/", upload.array("images", 5), PostController.createPost);
router.put("/:id", upload.array("images", 5), PostController.editPost);
>>>>>>> Stashed changes
router.delete("/:id", PostController.deletePost);

export default router;