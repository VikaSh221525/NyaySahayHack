import express from "express";
import { loginClient, registerClient, logoutClient, onboardingClient } from "../controllers/authClient.controller.js";
import { protectRoute } from "../middlewares/auth.middleware.js";
import { uploadFiles } from "../middlewares/upload.middleware.js";

const router = express.Router();

router.post('/login/client', loginClient);
router.post('/signup/client', registerClient);
router.post('/logout/client', logoutClient);
router.put('/onboarding/client', protectRoute, uploadFiles, onboardingClient);

router.get('/me/client', protectRoute, (req, res) => {
    // Only allow clients to access this endpoint
    if (req.user.role !== 'client') {
        return res.status(403).json({ message: 'Access denied. Client role required.' });
    }
    res.status(200).json({ 
        user: req.user,
        authenticated: true,
        role: 'client'
    });
})

export default router;