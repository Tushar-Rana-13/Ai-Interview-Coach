
import express from "express";

import { createInterviewController , getUserInterviewsController , getInterviewByIdController , startInterviewController , completeInterviewController} from "../controllers/interview.controller.js";
import authMiddleware from "../middleware/auth.middleware.js";

const router = express.Router();

// Create a new interview session
router.post("/", authMiddleware, createInterviewController);

router.get("/", authMiddleware, getUserInterviewsController);

router.get("/:id", authMiddleware, getInterviewByIdController);
router.patch("/:id/start", authMiddleware, startInterviewController);
router.patch(
  "/:id/complete",
  authMiddleware,
  completeInterviewController
);

export default router;
