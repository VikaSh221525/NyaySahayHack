import express from "express";
import { loginClient, registerClient, logoutClient, onboardingClient } from "../controllers/authClient.controller.js";
import { protectRoute } from "../middlewares/auth.middleware.js";
import { uploadFiles } from "../middlewares/upload.middleware.js";

const router = express.Router();

router.post('/login/client', loginClient);
router.post('/signup/client', registerClient);
router.post('/logout/client', logoutClient);
router.put('/onboarding/client', protectRoute, uploadFiles, onboardingClient);

export default router;