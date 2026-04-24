import { Router } from "express";
import { PostController } from "../controllers/PostController";
import { verifyDriverJWT } from "../../../../../core/middleware/auth/jwt.middleware";
import { upload } from "../../../../../core/middleware/upload";

const router = Router();
router.use(verifyDriverJWT);

router.get("/", PostController.getPosts);
router.get("/bookmarks/me", PostController.getBookmarkedPosts);
router.post("/", upload.array("images", 5), PostController.createPost);
router.put("/:id", upload.array("images", 5), PostController.editPost);
router.delete("/:id", PostController.deletePost);
router.post("/:id/likes/toggle", PostController.toggleLike);
router.post("/:id/bookmarks/toggle", PostController.toggleBookmark);
router.post("/:id/report", PostController.reportPost);
router.get("/:id/comments", PostController.getComments);
router.post("/:id/comments", PostController.createComment);
router.delete("/:id/comments/:commentId", PostController.deleteComment);

export default router;