import express from "express";
import { loginAdvocate, registerAdvocate, logoutAdvocate, onboardingAdvocate } from "../controllers/authAdvocate.controller.js";
import { protectRoute } from "../middlewares/auth.middleware.js";
import { uploadFiles } from "../middlewares/upload.middleware.js";

const router = express.Router();

router.post('/login/advocate', loginAdvocate);
router.post('/signup/advocate', registerAdvocate);
router.post('/logout/advocate', logoutAdvocate);
router.put('/onboarding/advocate', protectRoute, uploadFiles, onboardingAdvocate);

export default router;