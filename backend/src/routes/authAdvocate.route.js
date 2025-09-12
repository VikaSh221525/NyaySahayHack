import express from "express";
import { loginAdvocate, registerAdvocate, logoutAdvocate, onboardingAdvocate } from "../controllers/authAdvocate.controller.js";
import { protectRoute } from "../middlewares/auth.middleware.js";
import { uploadFiles } from "../middlewares/upload.middleware.js";

const router = express.Router();

router.post('/login/advocate', loginAdvocate);
router.post('/signup/advocate', registerAdvocate);
router.post('/logout/advocate', logoutAdvocate);
router.put('/onboarding/advocate', protectRoute, uploadFiles, onboardingAdvocate);

router.get('/me/advocate', protectRoute, (req, res) => {
    // Only allow advocates to access this endpoint
    if (req.user.role !== 'advocate') {
        return res.status(403).json({ message: 'Access denied. Advocate role required.' });
    }
    res.status(200).json({ 
        user: req.user,
        authenticated: true,
        role: 'advocate'
    });
})

export default router;