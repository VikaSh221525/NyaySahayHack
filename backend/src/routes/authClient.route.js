import express from "express";
import { protectRoute } from "../middlewares/auth.middleware.js";
import { loginClient, registerClient } from "../controllers/authClient.controller.js";

const router = express.Router();

router.post('/login/client', loginClient);
router.post('/signUp/client', registerClient);
router.post('/onboarding/client', protectRoute,  onboardingClient);

export default router;