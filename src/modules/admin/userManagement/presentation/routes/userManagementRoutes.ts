import { Router } from "express";
import { UserManagementController } from "../controllers/UserManagementController";

const router = Router();

router.get("/users/stats", UserManagementController.getStats);
router.get("/users", UserManagementController.listUsers);
router.patch("/users/:id/block", UserManagementController.blockUser);
router.patch("/users/:id/warn", UserManagementController.warnUser);
router.patch("/users/:id/activate", UserManagementController.activateUser);
router.delete("/users/:id", UserManagementController.deleteUser);

export default router;
