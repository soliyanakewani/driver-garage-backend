import { Router } from "express";
import { adminAuthGuard } from "../../../../../core/middleware/auth/admin-auth.middleware";
import { CommunityReportController } from "../controllers/community-report.controller";

const router = Router();
router.use(adminAuthGuard);

router.get("/", CommunityReportController.list);
router.get("/:id", CommunityReportController.getById);
router.patch("/:id/status", CommunityReportController.updateStatus);

export default router;
