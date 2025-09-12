import express from "express";
import { protectRoute } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post('/login/client', loginClient);
router.post('/signUp/client', signUpClient);
router.post('/onboarding/client', protectRoute,  onboardingClient);