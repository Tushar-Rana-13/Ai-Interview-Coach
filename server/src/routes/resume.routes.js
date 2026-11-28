
import express from "express";

import { uploadResumeController } from "../controllers/resume.controller.js";
import { uploadResume } from "../middleware/upload.middleware.js";
import authMiddleware from "../middleware/auth.middleware.js";

const router = express.Router();

router.post(
  "/upload",
  authMiddleware,
  uploadResume,
  uploadResumeController
);

export default router;
